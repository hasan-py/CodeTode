import { Logger } from "@packages/logger";
import {
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { AppDataSource } from "../../config/dataSource";

export class BaseService<T extends { id: number }> {
  constructor(protected repository: Repository<T>) {}

  async getAll(): Promise<T[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      Logger.error(`Error getting all entities: ${error}`);
      return [];
    }
  }

  async getById(id: number): Promise<T | null> {
    if (!id) return null;

    try {
      const whereCondition = { id } as FindOptionsWhere<T>;

      return await this.repository.findOneBy(whereCondition);
    } catch (error) {
      Logger.error(`Error finding entity by ID: ${error}`);
      return null;
    }
  }

  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data);
      const result = await this.repository.save(entity);
      return this.normalizeResult(result);
    } catch (error) {
      Logger.error(`Error creating entity: ${error}`);
      return this.handleDatabaseError(error, "create");
    }
  }

  async createWithDuplicateCheck(
    data: DeepPartial<T>,
    uniqueChecks: Array<{ property: keyof T; errorMessage: string }>
  ): Promise<T> {
    try {
      return await this.create(data);
    } catch (error) {
      return this.handleDatabaseError(error, "create", uniqueChecks);
    }
  }

  async update(id: number, data: DeepPartial<T>): Promise<T | null> {
    try {
      const entity = await this.getById(id);
      if (!entity) return null;

      const updatedEntity = this.repository.merge(entity, data);
      const result = await this.repository.save(updatedEntity);
      return this.normalizeResult(result);
    } catch (error) {
      Logger.error(`Error updating entity: ${error}`);
      return this.handleDatabaseError(error, "update");
    }
  }

  async updateWithDuplicateCheck(
    id: number,
    data: DeepPartial<T>,
    uniqueChecks: Array<{ property: keyof T; errorMessage: string }>
  ): Promise<T | null> {
    try {
      return await this.update(id, data);
    } catch (error) {
      return this.handleDatabaseError(error, "update", uniqueChecks);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const entity = await this.getById(id);
      if (!entity) return false;

      await this.repository.remove(entity);
      return true;
    } catch (error) {
      Logger.error(`Error deleting entity: ${error}`);
      return false;
    }
  }

  protected async runInTransaction<R>(
    operation: (transactionalEntityManager: EntityManager) => Promise<R>
  ): Promise<R> {
    return AppDataSource.transaction(operation);
  }

  private normalizeResult(result: T | T[]): T {
    return Array.isArray(result) ? (result[0] as T) : (result as T);
  }

  private handleDatabaseError(
    error: { code: string; name: string; message: string; detail: string },
    operation: string,
    uniqueChecks?: Array<{ property: keyof T; errorMessage: string }>
  ): never {
    let field = "";
    let genericErrorMessage = "";

    // Step 1: Identify the constraint violation and extract field name
    if (error.code === "23505") {
      // PostgreSQL
      const match = error.detail?.match(/Key \((.+?)\)=/);
      field = match ? match[1] : "field";
      genericErrorMessage = `A record with this ${field} already exists`;
    } else if (
      error.name === "QueryFailedError" &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      // SQLite
      const match = error.message.match(/UNIQUE constraint failed: \w+\.(\w+)/);
      field = match ? match[1] : "field";
      genericErrorMessage = `A record with this ${field} already exists`;
    } else if (error.name === "EntityNotUniqueError") {
      // TypeORM
      genericErrorMessage = `A record with duplicate unique values already exists`;
    } else if (
      error.message &&
      error.message.startsWith("A record with this")
    ) {
      // This is a forwarded error from another method
      const fieldMatch = error.message.match(
        /A record with this (.+?) already exists/
      );
      field = fieldMatch ? fieldMatch[1] : "";
      genericErrorMessage = error.message;
    } else {
      // Generic database error
      throw new Error(`Failed to ${operation} entity: ${error.message}`);
    }

    // Step 2: If we have uniqueChecks, map to custom error message
    if (uniqueChecks && field) {
      for (const check of uniqueChecks) {
        const fieldName = String(check.property);
        if (field === fieldName || genericErrorMessage.includes(fieldName)) {
          throw new Error(check.errorMessage);
        }
      }
    }

    // Step 3: If no custom message was found, throw the generic one
    throw new Error(
      genericErrorMessage || `Failed to ${operation} entity: ${error.message}`
    );
  }
}
