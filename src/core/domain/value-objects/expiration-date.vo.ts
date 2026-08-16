import { BadRequestError } from '../../../errors/app-error';
import { DateVO } from './date.vo';
export class ExpirationDate extends DateVO {
    private constructor(value: Date, validate: boolean = true) {
        super(value);

        if (validate && this.isPast) {
            throw new BadRequestError('Expiration date must be in the future.');
        }
    }

    static rehydrate(date: Date): ExpirationDate {
        return new ExpirationDate(date, false);
    }
    static fromDays(days: number): ExpirationDate {
        if (days <= 0) {
            throw new BadRequestError('Expiration days must be greater than 0.');
        }

        const date = new Date();
        date.setDate(date.getDate() + days);

        return new ExpirationDate(date);
    }

    addDays(days: number): ExpirationDate {
        if (days <= 0) {
            throw new BadRequestError('Days must be greater than 0.');
        }

        const date = new Date(this.value);
        date.setDate(date.getDate() + days);

        return new ExpirationDate(date);
    }

    subtractDays(days: number): ExpirationDate {
        if (days <= 0) {
            throw new BadRequestError('Days must be greater than 0.');
        }

        const date = new Date(this.value);
        date.setDate(date.getDate() - days);

        return new ExpirationDate(date);
    }

    get remainingDays(): number {
        const diffMs = this.value.getTime() - Date.now();

        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }
}
