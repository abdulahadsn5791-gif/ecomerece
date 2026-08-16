import type { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { ExpirationDate } from '../../../../core/domain/value-objects/expiration-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { Reason } from '../../../../core/domain/value-objects/reason.vo';
import { BadRequestError } from '../../../../errors/app-error';

export class BanInfoVO {
    private constructor(
        readonly performedBy: Id | null,
        readonly from: EffectiveDate | null,
        readonly until: ExpirationDate | null,
        readonly reason: Reason | null,
    ) {}

    static create(performedBy: Id, from: EffectiveDate, until: ExpirationDate, reason: Reason) {
        if (!until.after(from.value)) {
            throw new BadRequestError('Ban end date must be after start date.');
        }

        return new BanInfoVO(performedBy, from, until, reason);
    }
    extend(days: number): BanInfoVO {
        if (!this.isBan) {
            throw new BadRequestError('User is not currently banned.');
        }

        if (!this.performedBy || !this.from || !this.until || !this.until) {
            throw new BadRequestError('Invalid ban information.');
        }

        return new BanInfoVO(this.performedBy, this.from, this.until.addDays(days), this.reason);
    }
    static none() {
        return new BanInfoVO(null, null, null, null);
    }

    shorten(days: number): BanInfoVO {
        if (!this.isBan) {
            throw new BadRequestError('User is not currently banned.');
        }
        if (
            this.until?.subtractDays(days) == null ||
            this.until?.subtractDays(days).remainingDays <= 0
        )
            throw new BadRequestError('Invalid ban subtraction.');
        if (!this.performedBy || !this.from || !this.until || !this.reason) {
            throw new BadRequestError('Invalid ban information.');
        }

        return new BanInfoVO(
            this.performedBy,
            this.from,
            this.until.subtractDays(days),
            this.reason,
        );
    }

    static rehydrate(
        bannedBy: Id | null,
        from: EffectiveDate | null,
        bannedUntil: ExpirationDate | null,
        reason: Reason | null,
    ) {
        return new BanInfoVO(bannedBy, from, bannedUntil, reason);
    }
    get isBan(): boolean {
        if (!this.until) return false;
        return this.until.isFuture;
    }
}
