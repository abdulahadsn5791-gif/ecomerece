import { Id } from "../../../../core/domain/value-objects/id.vo";
import { ProductVariantReadModel } from "../../domain/read-models/product-variant.read-model";
import { productVariantInternalService } from "../product-varaint.internal.service";
import { VerifyVariantsAndGetQuery } from "../queries/verify-variants-and-get.query";

export class VerifyVariantsAndGetHandler {
    readonly type = 'VerifyVariantsAndGetQuery';
    constructor(private readonly internalService: productVariantInternalService) { }
    async handle(
        query: VerifyVariantsAndGetQuery,
    ): Promise<{
        validIds: Id[],
        notFoundIds: Id[],
        deletedIds: Id[],
        nonActiveIds: Id[],
        variantReadModel: ProductVariantReadModel[]
    }> {
        return await this.internalService.verifyVariantsAndGet(query.payload.ids);
    }
}