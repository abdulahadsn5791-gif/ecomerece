import { queryBus } from '../../core/domain/infrastructure/in-memory-query-bus';

import { ProductApplicationService } from './application/product.app.service';
import { ProductInternelService } from './application/product.internel.service';
import { EnsureActiveProductGetByIdQuery } from './application/queries/ensure-active-product-get-by-id.query';
import { EnsureActiveProductGetByIdHandler } from './application/query-handlers/ensure-active-product-get-by-id.query-handler';
import { ProductRepository } from './infrastructure/product.repository';
import { ProductController } from './presentation/product.controller';

export function createProductModule() {
    const repo = new ProductRepository();
    const productInternalService = new ProductInternelService(repo);
    const productApplicationService = new ProductApplicationService(queryBus, repo);

    queryBus.register(
        EnsureActiveProductGetByIdQuery,
        new EnsureActiveProductGetByIdHandler(productInternalService),
    );

    const productController = new ProductController(productApplicationService);

    return { productController, productInternalService };
}
