import type { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Reason } from '../../../../core/domain/value-objects/reason.vo';
import { BadRequestError } from '../../../../errors/app-error';

export class VerificationInfoVO {
    private constructor(
        readonly isVerified: boolean,
        readonly verifiedAt: EffectiveDate | null,
        readonly rejectedReason: Reason | null,
    ) {}

    static verified(verifiedAt: EffectiveDate): VerificationInfoVO {
        return new VerificationInfoVO(true, verifiedAt, null);
    }

    static rejected(reason: Reason): VerificationInfoVO {
        return new VerificationInfoVO(false, null, reason);
    }

    static pending(): VerificationInfoVO {
        return new VerificationInfoVO(false, null, null);
    }

    verify(verifiedAt: EffectiveDate): VerificationInfoVO {
        if (this.isVerified) {
            throw new BadRequestError('User is already verified.');
        }

        return new VerificationInfoVO(true, verifiedAt, null);
    }

    reject(reason: Reason): VerificationInfoVO {
        if (!this.isVerified) {
            throw new BadRequestError('Verified was already non verified');
        }

        return new VerificationInfoVO(false, null, reason);
    }

    reset(): VerificationInfoVO {
        return VerificationInfoVO.pending();
    }
    static none() {
        return new VerificationInfoVO(false, null, null);
    }

    static rehydrate(
        isVerified: boolean,
        verifiedAt: EffectiveDate | null,
        rejectedReason: Reason | null,
    ): VerificationInfoVO {
        return new VerificationInfoVO(isVerified, verifiedAt, rejectedReason);
    }

    get isPending(): boolean {
        return !this.isVerified && this.verifiedAt === null && this.rejectedReason === null;
    }

    get isRejected(): boolean {
        return !this.isVerified && this.rejectedReason !== null;
    }
}
