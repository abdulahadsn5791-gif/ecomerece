import type { Context } from 'hono';
import { idSchema } from '../../../../shared/dtos/id-schema';
import { BaseController } from '../../../core/controller/base.controller';
import type { ProductApplicationService } from '../application/product.app.service';
import { blockLiftProductDto, blockProductDto } from './dto/block-product.dto';
import { CreateMyProductDtoSchema } from './dto/create-product.dto';
import { recoverProductDto, softDeleteMyProductDto } from './dto/delete-product.dto';
import { productAppereanceDto } from './dto/product-appereance.dto';
import { disclaimerItemsDto, toggleDiscalimerDto } from './dto/product-discalimer.dto';
import { deafultImageDto, imagesDto } from './dto/product-image.dto';
import { ingredientsDto, toggleIngredientsDto } from './dto/product-ingredients.dto';
import { updateProductMetaDto } from './dto/product-meta.dto';

export class ProductController extends BaseController<ProductApplicationService> {
    getProductById = async (c: Context) => {
        const id = this.param(c, 'id', idSchema);
        return this.ok(c, await this.service.getProductById(id));
    };

    createMyProudct = async (c: Context) => {
        const data = await this.body(c, CreateMyProductDtoSchema);
        const actor = c.get('user');
        return this.ok(c, await this.service.createMyProduct(data, actor));
    };

    softDeleteMyProduct = async (c: Context) => {
        const data = await this.body(c, softDeleteMyProductDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.softDeleteMyProduct(data, actor));
    };

    recoverMyProduct = async (c: Context) => {
        const data = await this.body(c, recoverProductDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.recoverMyProduct(data, actor));
    };

    blockProduct = async (c: Context) => {
        const data = await this.body(c, blockProductDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.blockProduct(data, actor));
    };

    unBlockProduct = async (c: Context) => {
        const data = await this.body(c, blockLiftProductDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.unBlockProduct(data, actor));
    };

    makeMyProductPublic = async (c: Context) => {
        const data = await this.body(c, productAppereanceDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.makeMyProductPublic(data, actor));
    };
    makeMyProductPrivate = async (c: Context) => {
        const data = await this.body(c, productAppereanceDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.makeMyProductPrivate(data, actor));
    };

    updateMyProductMeta = async (c: Context) => {
        const data = await this.body(c, updateProductMetaDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.updateMyProductMeta(data, actor));
    };

    toggleMyProductDisclaimer = async (c: Context) => {
        const data = await this.body(c, toggleDiscalimerDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.toggleMyProductDisclaimer(data, actor));
    };

    addMyProductDisclaimers = async (c: Context) => {
        const data = await this.body(c, disclaimerItemsDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.addMyProductDisclaimers(data, actor));
    };

    removeMyProductDisclaimers = async (c: Context) => {
        const data = await this.body(c, disclaimerItemsDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.removeMyProductDisclaimers(data, actor));
    };

    addMyProductImages = async (c: Context) => {
        const data = await this.body(c, imagesDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.addMyProductImages(data, actor));
    };

    removeMyProductImages = async (c: Context) => {
        const data = await this.body(c, imagesDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.removeMyProductImages(data, actor));
    };

    setMyProductDefaultImage = async (c: Context) => {
        const data = await this.body(c, deafultImageDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.setMyProductDefaultImage(data, actor));
    };

    toggleMyProductIngredients = async (c: Context) => {
        const data = await this.body(c, toggleIngredientsDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.toggleMyProductIngredients(data, actor));
    };

    addMyProductIngredients = async (c: Context) => {
        const data = await this.body(c, ingredientsDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.addMyProductIngredients(data, actor));
    };
    removeMyProductIngredients = async (c: Context) => {
        const data = await this.body(c, ingredientsDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.removeMyProductIngredients(data, actor));
    };
}
