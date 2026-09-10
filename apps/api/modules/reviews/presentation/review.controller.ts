import { Context } from "hono";
import { BaseController } from "../../../core/controller/base.controller";
import { ReviewApplicationService } from "../application/review.app.service";
import { createMyReviewDtoSchema } from "../../../../../packages/shared/request-dtos/review/create-my-review.dto";

export class ReveiwController extends BaseController<ReviewApplicationService> {



    create = async (c: Context) => {
        const data = await this.body(c, createMyReviewDtoSchema);
        const actor = c.get('user');
        return this.ok(c, await this.service.createReview(data, actor));
    };
    query = async (c: Context) => { };
}