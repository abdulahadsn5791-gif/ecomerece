import { StringVO } from "../../../../core/domain/value-objects/string-vo";
import { BadRequestError } from "../../../../errors/app-error";

export const StatusEnum = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    RETURNED: "returned",
    REFUNDED: "refunded",
    CANCELLED: "cancelled",
} as const;

export type StatusType = typeof StatusEnum[keyof typeof StatusEnum];

export class StatusVo extends StringVO {

    private constructor(value: StatusType) {
        super(value.trim());

        if (!Object.values(StatusEnum).includes(this.value as StatusType)) {
            throw new BadRequestError(`Invalid order status: "${this.value}"`);
        }
    }

    static pending(): StatusVo {
        return new StatusVo(StatusEnum.PENDING);
    }

    static confirmed(): StatusVo {
        return new StatusVo(StatusEnum.CONFIRMED);
    }

    static completed(): StatusVo {
        return new StatusVo(StatusEnum.COMPLETED);
    }

    static returned(): StatusVo {
        return new StatusVo(StatusEnum.RETURNED);
    }

    static refunded(): StatusVo {
        return new StatusVo(StatusEnum.REFUNDED);
    }

    static cancelled(): StatusVo {
        return new StatusVo(StatusEnum.CANCELLED);
    }

    confirm(): StatusVo {
        if (this.value !== StatusEnum.PENDING) {
            throw new BadRequestError(`Cannot confirm a status that is not pending (current: ${this.value})`);
        }
        return StatusVo.confirmed();
    }

    complete(): StatusVo {
        if (this.value !== StatusEnum.CONFIRMED) {
            throw new BadRequestError(`Cannot complete a status that is not confirmed (current: ${this.value})`);
        }
        return StatusVo.completed();
    }

    cancel(): StatusVo {
        if (this.value === StatusEnum.COMPLETED || this.value === StatusEnum.REFUNDED) {
            throw new BadRequestError(`Cannot cancel a ${this.value} order`);
        }
        return StatusVo.cancelled();
    }


    isPending(): boolean {
        return this.value === StatusEnum.PENDING;
    }

    isConfirmed(): boolean {
        return this.value === StatusEnum.CONFIRMED;
    }

    isCompleted(): boolean {
        return this.value === StatusEnum.COMPLETED;
    }



    toString(): string {
        return this.value;
    }
}