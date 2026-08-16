import { eventBus } from '../../core/domain/infrastructure/in-memory-event-bus';
import { queryBus } from '../../core/domain/infrastructure/in-memory-query-bus';
import { UserSignedInHandler } from './application/event-handlers/user-signed-in.handler';
import { EnsureActiveQuery } from './application/queries/ensure-active.query';
import { EnsureActiveUserGetByIdQuery } from './application/queries/ensure-active-user-get-by-id.query';
import { GetUserByIdQuery } from './application/queries/get-user-by-id.query';
import { EnsureActiveHandler } from './application/query-handlers/ensure-active.handler';
import { EnsureActiveUserGetByIdHandler } from './application/query-handlers/ensure-active-user-get-by-id.handler';
import { GetUserByIdHandler } from './application/query-handlers/get-user-by-id.handler';
import { UserAppService } from './application/user.app.service';
import { UserInternalService } from './application/user.internal.service';
import { UserRepository } from './infrastructure/user.repository';
import { UserController } from './presentation/user.controller';

export function createUserModule() {
    const userRepo = new UserRepository();

    const internalSvc = new UserInternalService(userRepo);
    const appSvc = new UserAppService(userRepo, eventBus);
    const userController = new UserController(appSvc);

    eventBus.register('user.signed-in', new UserSignedInHandler());
    queryBus.register(GetUserByIdQuery, new GetUserByIdHandler(internalSvc));
    queryBus.register(EnsureActiveQuery, new EnsureActiveHandler(internalSvc));
    queryBus.register(
        EnsureActiveUserGetByIdQuery,
        new EnsureActiveUserGetByIdHandler(internalSvc),
    );

    return {
        userController,
        appSvc,
        internalSvc,

        queries: {
            GetUserByIdQuery,
            EnsureActiveQuery,
        },
    };
}
