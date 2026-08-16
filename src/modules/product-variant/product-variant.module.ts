import { queryBus } from "../../core/domain/infrastructure/in-memory-query-bus";
import { productVariantInternalService } from "./application/product-varaint.internal.service";
import { productVariantApplicationService } from "./application/product-variant.app.service";
import { EnsureActiveVariantGetByIdQuery } from "./application/queries/ensure-active-variant-get-by-id.query";
import { EnsureActiveVariantGetByIdHandler } from "./application/query-handlers/ensure-active-variant-get-by-id.query-handler";
import { ProductVariantRepository } from "./infrastructure/product-variant.repository"
import { ProductVariantController } from "./presentation/product-variant.controller";


export function createProductVaraintModule() {


    const repo = new ProductVariantRepository();
    const internalService = new productVariantInternalService(repo, queryBus);
    const applicationService = new productVariantApplicationService(repo, queryBus);
    queryBus.register(EnsureActiveVariantGetByIdQuery, new EnsureActiveVariantGetByIdHandler(internalService));
    const controller = new ProductVariantController(applicationService);
    return { repo, internalService, applicationService, controller };


}