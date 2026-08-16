import { ProductVariantReadModel } from "../../domain/read-models/product-variant.read-model";
import { productVariantInternalService } from "../product-varaint.internal.service";
import { EnsureActiveVariantGetByIdQuery } from "../queries/ensure-active-variant-get-by-id.query";

export class EnsureActiveVariantGetByIdHandler {
    readonly type = 'EnsureActiveVariantGetByIdQuery';
    constructor(private readonly internalService: productVariantInternalService) { }
    async handle(query: EnsureActiveVariantGetByIdQuery): Promise<{ variant: ProductVariantReadModel | null; active: boolean }> {

        return await this.internalService.ensureActiveVariantGetById(query.payload.variantId);
    }
}
