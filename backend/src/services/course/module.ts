import {
  ECourseStatus,
  ICommonFilters,
  IPaginatedResult,
  TUpdatePositionArray,
} from "@packages/definitions";
import { Module } from "../../entity/course/module";
import { ModuleRepository } from "../../repository";
import { BaseService } from "../common/base";

export class ModuleService extends BaseService<Module> {
  constructor() {
    super(ModuleRepository);
  }

  async listModules(
    options: ICommonFilters & { courseId?: number } = {}
  ): Promise<IPaginatedResult & { modules: Module[] }> {
    const { page = 1, limit = 10, status, courseId } = options;
    const offset = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder("module")
      .leftJoinAndSelect("module.course", "course")
      .loadRelationCountAndMap("module.chapterCount", "module.chapters");

    if (status) {
      queryBuilder.andWhere("module.status = :status", { status });
    }

    if (courseId) {
      queryBuilder.andWhere("module.courseId = :courseId", { courseId });
    }

    const [modules, total] = await queryBuilder
      .orderBy("module.position", "ASC")
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      modules,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createModule(moduleData: Partial<Module>): Promise<Module> {
    const highestPositionModule = await this.repository
      .createQueryBuilder("module")
      .where("module.courseId = :courseId", { courseId: moduleData.courseId })
      .orderBy("module.position", "DESC")
      .getOne();

    const highestPosition = highestPositionModule?.position ?? 0;
    moduleData.position = highestPosition + 1;

    return this.create(moduleData);
  }

  async updateModule(
    id: number,
    moduleData: Partial<Module>
  ): Promise<Module | null> {
    // Remove undefined values to make it flexible
    const cleanedData = Object.fromEntries(
      Object.entries(moduleData).filter(([_, value]) => value !== undefined)
    );

    return this.update(id, cleanedData);
  }

  async archiveModule(id: number): Promise<Module | null> {
    return this.updateModule(id, { status: ECourseStatus.ARCHIVED });
  }

  async updateModulePositions(
    positions: TUpdatePositionArray,
    courseId: number
  ): Promise<void> {
    const values = positions
      .map(({ id, position }) => `(${id}, ${position})`)
      .join(", ");

    await this.repository.query(`
    UPDATE module   
    SET position = temp.new_position 
    FROM (VALUES ${values}) AS temp(module_id, new_position) 
    WHERE module.id = temp.module_id AND module."courseId" = ${courseId}
  `);
  }
}

export const moduleService = new ModuleService();
