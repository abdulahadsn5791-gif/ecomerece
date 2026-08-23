import { AggregateRoot } from '../../../core/domain/aggregate-root';
import type { DateVO } from '../../../core/domain/value-objects/date.vo';
import { EffectiveDate } from '../../../core/domain/value-objects/effective-date.vo';
import type { EmailVO } from '../../../core/domain/value-objects/email.vo';
import { ExpirationDate } from '../../../core/domain/value-objects/expiration-date.vo';
import type { Id } from '../../../core/domain/value-objects/id.vo';
import { Quantity } from '../../../core/domain/value-objects/quantity.vo';
import type { Reason } from '../../../core/domain/value-objects/reason.vo';
import type { UrlVO } from '../../../core/domain/value-objects/url.vo';
import { BadRequestError } from '../../../errors/app-error';
import { UserBanLiftedEvent } from './events/user-ban-lifted.event';
import { UserBannedEvent } from './events/user-banned.event';
import { UserUnBlockLiftedEvent } from './events/user-block-lifted.event';
import { UserBlockedEvent } from './events/user-blocked.event';
import { UserDeleteLiftedEvent } from './events/user-delete-lifted.event';
import { UserDeletedEvent } from './events/user-deleted.event';
import { UserLoggedInEvent } from './events/user-logged-in.event';
import { UserRoleAssignedEvent } from './events/user-role-assigned.event';
import { UserSignedInEvent } from './events/user-signed-in.event';

import { BanInfoVO } from './value-objects/ban-info.vo';
import { BlockInfoVO } from './value-objects/block-info.vo';
import { DeleteInfoVO } from './value-objects/delete-Info.vo';
import type { NameInfoVO } from './value-objects/name-info.vo';
import { RoleInfoVO, type UserRoleVO } from './value-objects/role-info.vo';

type CreateUserProps = {
    id: Id;
    name: NameInfoVO;
    email: EmailVO;
    image: UrlVO;
};

export class UserAggregate extends AggregateRoot {
    private constructor(
        private readonly _id: Id,
        private _name: NameInfoVO,
        private _email: EmailVO,
        private _image: UrlVO,
        private _role: RoleInfoVO,
        private _block: BlockInfoVO,
        private _ban: BanInfoVO,
        private _delete: DeleteInfoVO,
        private _lastLogin: DateVO | null,
        private _createdAt: DateVO,
        private _version: Quantity,
    ) {
        super();
    }
    get version() {
        return this._version;
    }

    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get image() {
        return this._image;
    }
    get email() {
        return this._email;
    }
    get role() {
        return this._role;
    }

    get ban() {
        return this._ban;
    }

    get block() {
        return this._block;
    }

    get deleted() {
        return this._delete;
    }
    get lastLogin() {
        return this._lastLogin;
    }
    get createdAt() {
        return this._createdAt;
    }

    static create(props: CreateUserProps): UserAggregate {
        return new UserAggregate(
            props.id,
            props.name,
            props.email,
            props.image,
            RoleInfoVO.none(),
            BlockInfoVO.none(),
            BanInfoVO.none(),
            DeleteInfoVO.none(),
            null,
            EffectiveDate.today(),
            new Quantity(0),
        );
    }

    static rehydrate(
        id: Id,
        name: NameInfoVO,
        email: EmailVO,
        image: UrlVO,
        role: RoleInfoVO,
        block: BlockInfoVO,
        ban: BanInfoVO,
        deleted: DeleteInfoVO,
        lastLogin: DateVO | null,
        createdAt: DateVO,
        version: Quantity,
    ): UserAggregate {
        return new UserAggregate(
            id,
            name,
            email,
            image,
            role,
            block,
            ban,
            deleted,
            lastLogin,
            createdAt,
            version,
        );
    }
    signIn(id: Id): void {
        this.raise(new UserSignedInEvent({ userId: id }));
    }
    assignRole(role: UserRoleVO, actor: Id, reason: Reason): void {
        if (this._role.equals(role)) {
            throw new BadRequestError('User already has this role.');
        }
        this._role = RoleInfoVO.assigned(role, new EffectiveDate(new Date()), actor, reason);
        this.raise(new UserRoleAssignedEvent({ userId: this._id, roleInfo: this._role }));
    }

    banUser(actor: Id, days: number, reason: Reason): void {
        if (this._ban.isBan)
            throw new BadRequestError(
                `User already is banned for ${this._ban.until?.remainingDays} days `,
            );
        if (this._id.value === actor.value) throw new BadRequestError('Actor cannot ban himself');
        if (this._role.isAdmin) throw new BadRequestError('Cannot ban admin');
        this._ban = BanInfoVO.create(
            actor,
            EffectiveDate.today(),
            ExpirationDate.fromDays(days),
            reason,
        );
        this.raise(new UserBannedEvent({ userId: this._id, banInfo: this._ban }));
    }

    blockUser(actor: Id, reason: Reason): void {
        if (this._block.isBlocked) throw new BadRequestError('User is already blocked');
        if (this._id.value === actor.value) throw new BadRequestError('Actor cannot block himself');
        if (this._role.isAdmin) throw new BadRequestError('Cannot block admin');
        this._block = BlockInfoVO.create(actor, reason);
        this.raise(new UserBlockedEvent({ userId: this._id, blockInfo: this._block }));
    }

    deleteUser(actor: Id, reason: Reason): void {
        if (this._delete.isDeleted) throw new BadRequestError('User already deleted');
        if (this._role.isAdmin) throw new BadRequestError('Cannot delete admin');
        this._delete = DeleteInfoVO.create(actor, reason);
        this.raise(new UserDeletedEvent({ userId: this._id, deleteInfo: this._delete }));
    }
    loginUser(): void {
        if (this._ban.isBan)
            throw new BadRequestError(`User is ban for ${this._ban.until?.remainingDays} days `);
        if (this._block.isBlocked) throw new BadRequestError('User is banned');
        if (this._delete.isDeleted) throw new BadRequestError('User was removed');
        this._lastLogin = EffectiveDate.today();
        this.raise(new UserLoggedInEvent({ userId: this._id }));
    }

    extendBan(actor: Id, days: number): void {
        if (!this._ban.isBan) throw new BadRequestError('User is not banned.');
        if (this._id.value === actor.value)
            throw new BadRequestError('Actor cannot extend his own ban.');
        if (this._role.isAdmin) throw new BadRequestError('Cannot extend ban for admin.');
        this._ban = this._ban.extend(days);
    }

    shortenBan(actor: Id, days: number): void {
        if (!this._ban.isBan)
            throw new BadRequestError('Cannot short ban period of an active user');
        if (this._id.value === actor.value) throw new BadRequestError('Cannot short ban your self');
        this._ban = this._ban.shorten(days);
    }

    unBanUser(actor: Id): void {
        if (!this._ban.isBan) throw new BadRequestError('Cannot recover an active user');
        if (this._id.value === actor.value) throw new BadRequestError('Cannot recover your self');
        this._ban = BanInfoVO.none();
        this.raise(new UserBanLiftedEvent({ userId: this._id, banInfo: this._ban }));
    }

    unBlockUser(actor: Id): void {
        if (!this._block.isBlocked) throw new BadRequestError('Cannot recover an active user');
        if (this._id.value === actor.value) throw new BadRequestError('Cannot recover your self');
        this._block = BlockInfoVO.none();
        this.raise(new UserUnBlockLiftedEvent({ userId: this._id, blockInfo: this._block }));
    }

    recoverUser(actor: Id): void {
        if (!this._delete.isDeleted) throw new BadRequestError('Cannot recover an active user');
        if (this._id.value === actor.value) throw new BadRequestError('Cannot recover your self');
        this._delete = DeleteInfoVO.none();
        this.raise(new UserDeleteLiftedEvent({ userId: this._id, recoverInfo: this._delete }));
    }
}
