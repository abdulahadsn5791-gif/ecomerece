import { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { Reason } from '../../../../core/domain/value-objects/reason.vo';

export class BlockInfoVO {
    private constructor(
        readonly performedBy: Id | null,
        readonly blocked: boolean,
        readonly from: EffectiveDate | null,
        readonly reason: Reason | null,
    ) {}

    static create(actor: Id, reason: Reason) {
        return new BlockInfoVO(actor, true, new EffectiveDate(new Date()), reason);
    }

    static none() {
        return new BlockInfoVO(null, false, null, null);
    }

    static rehydrate(
        blockedBy: Id | null,
        blocked: boolean,
        blockedFrom: EffectiveDate | null,
        blockedReason: Reason | null,
    ) {
        return new BlockInfoVO(blockedBy, blocked, blockedFrom, blockedReason);
    }

    get isBlocked(): boolean {
        return this.blocked;
    }
}
