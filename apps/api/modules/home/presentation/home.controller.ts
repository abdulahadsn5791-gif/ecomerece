import type { Context } from 'hono';
import { BaseController } from '../../../core/controller/base.controller';

import type { HomeAppService } from '../application/home.app.service';

export class HomeController extends BaseController<HomeAppService> {

    addCategory = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, CreateCategoryDTOSchema);
        return this.ok(c, await this.service.addCategory(data, actor._id));
    };
    removeCategory = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, DeleteCategoryDTOSchema);
        return this.ok(c, await this.service.removeCategory(data, actor._id));
    };

    addSlide = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, CreateSlideDTOSchema);
        return this.ok(c, await this.service.addSlide(data, actor._id));
    };
    removeSlide = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, DeleteSlideDTOSchema);
        return this.ok(c, await this.service.removeSlide(data, actor._id));
    };
    reorderSlides = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, ReorderSlidesDTOSchema);
        return this.ok(c, await this.service.reorderSlides(data, actor._id));
    };

    addPromo = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, CreatePromoDTOSchema);
        return this.ok(c, await this.service.addPromo(data, actor._id));
    };
    removePromo = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, DeletePromoDTOSchema);
        return this.ok(c, await this.service.removePromo(data, actor._id));
    };

    addContainer = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, CreateProductContainerDTOSchema);
        return this.ok(c, await this.service.addProductContainer(data, actor._id));
    };
    updateContainer = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, UpdateProductContainerDTOSchema);
        return this.ok(c, await this.service.updateProductContainer(data, actor._id));
    };
    removeContainer = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, DeleteProductContainerDTOSchema);
        return this.ok(c, await this.service.removeProductContainer(data, actor._id));
    };
    reorderContainers = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, ReorderContainersDTOSchema);
        return this.ok(c, await this.service.reorderContainers(data, actor._id));
    };
}