import { commandBus } from '../../core/infrastructure/buses/in-memory-command-bus';
import { eventBus } from '../../core/infrastructure/buses/in-memory-event-bus';
import { queryBus } from '../../core/infrastructure/buses/in-memory-query-bus';
import { UpdatePriceHandler } from './application/command-handlers/update-price.command-handler';
import { UpdatePriceCommand } from './application/commands/update-price.command';
import { ProductApplicationService } from './application/product.app.service';
import { ProductInternelService } from './application/product.internel.service';
import { EnsureActiveProductGetByIdQuery } from './application/queries/ensure-active-product-get-by-id.query';
import { VerifyProductAndGetQuery } from './application/queries/verify-product-and-get.query';
import { EnsureActiveProductGetByIdHandler } from './application/query-handlers/ensure-active-product-get-by-id.query-handler';
import { VerifyProductAndGetHandler } from './application/query-handlers/verify-product-and-get.query-handler';
import { ProductRepository } from './infrastructure/product.repository';
import { ProductController } from './presentation/product.controller';

export function createProductModule() {
  const repo = new ProductRepository();
  const productInternalService = new ProductInternelService(repo);
  const productApplicationService = new ProductApplicationService(queryBus, repo, eventBus);

  queryBus.register(
    EnsureActiveProductGetByIdQuery,
    new EnsureActiveProductGetByIdHandler(productInternalService),
  );
  queryBus.register(
    VerifyProductAndGetQuery,
    new VerifyProductAndGetHandler(productInternalService),
  );
  commandBus.register(UpdatePriceCommand.name, new UpdatePriceHandler(productInternalService));
  const productController = new ProductController(productApplicationService);

  return { productController, productInternalService };
}
