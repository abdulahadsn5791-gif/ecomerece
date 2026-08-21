import { InMemoryEventBus } from '../../core/domain/infrastructure/in-memory-event-bus';
import { queryBus } from '../../core/domain/infrastructure/in-memory-query-bus';
import { EnsureActiveVendorQuery } from './application/queries/ensure-active-vendor.query';
import { EnsureActiveVendorGetByIdQuery } from './application/queries/ensure-active-vendor-get-by-id.query';
import { GetVendorByUserIdQuery } from './application/queries/get-vendor-by-user-id.query';
import { VerifyVendorAndGetQuery } from './application/queries/verify-vendor-and-get.query';
import { EnsureActiveVendorHandler } from './application/query-handlers/ensure-active-vendor.query-handler';
import { EnsureActiveVendorGetByIdHandler } from './application/query-handlers/ensure-active-vendor-get-by-id.query-handler';
import { GetVendorByUserIdHandler } from './application/query-handlers/get-vendor-by-user-id.query-handler';
import { VerifyVendorAndGetHandler } from './application/query-handlers/verify-vendor-and-get.query-handler';
import { VendorAppService } from './application/vendor.app.service';
import { VendorInternalService } from './application/vendor.internal.service';
import { VendorRepository } from './infrastructure/vendor.repository';
import { VendorController } from './presentation/vendor.controller';

export function CreateVendorModule() {
    const repo = new VendorRepository();
    const eventBus = new InMemoryEventBus();
    const internalService = new VendorInternalService(repo, queryBus);

    queryBus.register(
        EnsureActiveVendorGetByIdQuery,
        new EnsureActiveVendorGetByIdHandler(internalService),
    );
    queryBus.register(VerifyVendorAndGetQuery, new VerifyVendorAndGetHandler(internalService));

    queryBus.register(EnsureActiveVendorQuery, new EnsureActiveVendorHandler(internalService));
    queryBus.register(GetVendorByUserIdQuery, new GetVendorByUserIdHandler(internalService));
    const appService = new VendorAppService(repo, eventBus, internalService);
    const vendorController = new VendorController(appService);

    return { vendorController, appService, queries: {}, internalService };
}
