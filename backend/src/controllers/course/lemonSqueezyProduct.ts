import { Request, Response } from "express";
import { catchErrors } from "../../decorators/catchErrors";
import { lemonSqueezyProductService } from "../../services/course/lemonSqueezyProduct";
import { sendSuccess } from "../../utils/response";

export class LemonSqueezyProductController {
  @catchErrors()
  async getAllProducts(req: Request, res: Response) {
    const products = await lemonSqueezyProductService.getAllProduct();
    sendSuccess(res, products);
  }
}

export const lemonSqueezyProductController =
  new LemonSqueezyProductController();
