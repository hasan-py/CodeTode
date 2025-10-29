import {
  ILemonSqueezyProduct,
  ILemonSqueezyResponse,
} from "@packages/definitions";
import { Logger } from "@packages/logger";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Cacheable } from "../../decorators/cacheDecorator";

export class LemonSqueezyProductService {
  private apiKey: string;
  private baseUrl: string = "https://api.lemonsqueezy.com/v1";
  private headers: Record<string, string>;

  constructor() {
    this.apiKey = process.env.LS || "";
    if (!this.apiKey) {
      Logger.warning(
        "LemonSqueezy API key is not set. Please check your environment variables."
      );
    }

    // Set default headers for all requests
    this.headers = {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  @Cacheable({
    key: "products:ls",
    ttl: "oneWeek",
  })
  async getAllProduct(): Promise<ILemonSqueezyProduct[]> {
    try {
      const response = await this.makeRequest<
        ILemonSqueezyResponse<ILemonSqueezyProduct[]>
      >("get", "products");
      return (response.data as ILemonSqueezyProduct[])?.map((item) => ({
        ...item,
        attributes: {
          ...item.attributes,
          price: item?.attributes?.price / 100,
        },
      }));
    } catch (error) {
      Logger.error("Error fetching products from Lemon Squeezy:", error);
      return [];
    }
  }

  private async makeRequest<T>(
    method: "get" | "post" | "put" | "delete",
    endpoint: string,
    params?: Record<string, any>,
    data?: any
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;

      const config: AxiosRequestConfig = {
        method,
        url,
        headers: this.headers,
        params,
      };

      if (data && (method === "post" || method === "put")) {
        config.data = data;
      }

      const response = (await axios(config)) as AxiosResponse<T>;
      return response.data;
    } catch (error: any) {
      Logger.error(
        `Error in Lemon Squeezy API call to ${endpoint}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export const lemonSqueezyProductService = new LemonSqueezyProductService();
