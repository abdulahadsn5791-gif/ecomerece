import { Id } from "../../../../core/domain/value-objects/id.vo";
import { ProductReadModel } from "../../domain/read-models/product.read-model";
import { ProductInternelService } from "../product.internel.service";
import { VerifyProductAndGetQuery } from "../queries/verify-product-and-get.query";



export class VerifyProductAndGetHandler {
    readonly type = 'VerifyProductAndGetQuery';
    constructor(private readonly internalService: ProductInternelService) { }
    async handle(
        query: VerifyProductAndGetQuery,
    ): Promise<{
        validIds: Id[],
        notFoundIds: Id[],
        deletedIds: Id[],
        blockedIds: Id[],
        productReadModel: ProductReadModel[]
    }> {
        return await this.internalService.verifyProductAndGet(query.payload.ids);
    }
}
