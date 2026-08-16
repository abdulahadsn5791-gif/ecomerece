import { IQuery } from "../../../../core/domain/query/query-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { ProductReadModel } from "../../domain/read-models/product.read-model";

export class EnsureActiveProductGetByIdQuery implements IQuery<{ product: ProductReadModel | null; active: boolean }> {
    readonly __result?: { product: ProductReadModel | null; active: boolean };
    readonly type = 'EnsureActiveProductGetByIdQuery';
    public readonly payload: { productId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ productId: Id }];
        this.payload = payload;
    }
}
