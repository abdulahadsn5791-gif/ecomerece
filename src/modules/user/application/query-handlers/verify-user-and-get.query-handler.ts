import { Id } from "../../../../core/domain/value-objects/id.vo";
import { UserReadModel } from "../../domain/read-models/user.read-model";
import { VerifyUserAndGetQuery } from "../queries/verify-user-and-get.query";
import { UserInternalService } from "../user.internal.service";

export class VerifyUserAndGetHandler {
    readonly type = 'VerifyUserAndGetQuery';
    constructor(private readonly internalService: UserInternalService) { }

    async handle(query: VerifyUserAndGetQuery): Promise<{ validIds: Id[], invalidIds: Id[], usersReadModel: UserReadModel[] }> {
        return await this.internalService.verifyUserAndGet(query.payload.ids);
    }
}
