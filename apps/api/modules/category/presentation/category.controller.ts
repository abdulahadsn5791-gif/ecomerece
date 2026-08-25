import { Context } from "hono";
import { BaseController } from "../../../core/controller/base.controller";
import { CategoryAppService } from "../application/category.app.service";
import { createCategoryDto } from "@ecomerece/shared";

export class CategoryController extends BaseController<CategoryAppService> {


    async createCategory(c: Context) {
        const actor = c.get('user');
        const data = await this.body(c, createCategoryDto);
        return this.ok(c, await this.service.createCategory(data, actor))
    }

}