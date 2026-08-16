import type { InMemoryEventBus } from '../../../core/domain/infrastructure/in-memory-event-bus';
import { EmailVO } from '../../../core/domain/value-objects/email.vo';
import { Id } from '../../../core/domain/value-objects/id.vo';
import { PersonName } from '../../../core/domain/value-objects/name.vo';
import { Reason } from '../../../core/domain/value-objects/reason.vo';
import { UrlVO } from '../../../core/domain/value-objects/url.vo';
import { BaseService } from '../../../core/services/base.services';
import { BadRequestError } from '../../../errors/app-error';
import { clerkClient } from '../../../lib/clerkClient';
import type { UserResponseReadModel } from '../domain/read-models/user-response-read-models';
import { UserAggregate } from '../domain/user.aggregate';
import { NameInfoVO } from '../domain/value-objects/name-info.vo';
import { UserRoleVO } from '../domain/value-objects/role-info.vo';
import { UserMapper } from '../infrastructure/user.mapper';
import type { UserPersistence } from '../infrastructure/user.models';
import type { UserRepository } from '../infrastructure/user.repository';
import type { UserRoleDto } from '../presentation/dto/assign-role.dto';
import type { BanUserDTO } from '../presentation/dto/ban-user.dto';
import type { BlockUserDTO } from '../presentation/dto/block-user.dto';
import type { DeleteMeDTO, DeleteUserDTO } from '../presentation/dto/delete-user.dto';
import type { ExtendBanDTO } from '../presentation/dto/extend-ban.dto';

import { UserMessages, type UserMessagesType } from '../presentation/user.messages';

export class UserAppService extends BaseService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly eventBus: InMemoryEventBus,
    ) {
        super();
    }
    async getUserById(userId: string): Promise<UserResponseReadModel> {
        const id = Id.create(userId);
        const user = await this.userRepo.FindByIdOrThrow(id);
        return UserMapper.aggregateToResponseReadModel(user);
    }

    async signIn(_id: string): Promise<UserMessagesType> {
        const clerkUser = await clerkClient.users.getUser(_id);
        const primaryEmail = clerkUser.emailAddresses.find(
            (e) => e.id === clerkUser.primaryEmailAddressId,
        );
        if (!primaryEmail) throw new BadRequestError('Primary email address not found');

        const image = new UrlVO(clerkUser.imageUrl);
        const name = NameInfoVO.create(
            PersonName.create(clerkUser.firstName ?? ''),
            null,
            clerkUser.lastName ? PersonName.create(clerkUser.lastName) : null,
        );
        const id = Id.create(clerkUser.id);
        const email = new EmailVO(primaryEmail.emailAddress);
        const existingUser = await this.userRepo.FindByEmail(email);
        this.ensureNotExists(existingUser, 'User already exists with this email');

        const user = UserAggregate.create({
            id,
            name,
            email,
            image,
        });
        user.signIn(user.id);
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());

        return UserMessages.signIn(id);
    }
    async assignRole(data: UserRoleDto, actor: UserPersistence): Promise<UserMessagesType> {
        const actorId = Id.create(actor._id);
        const id = Id.create(data.userId);
        const role = UserRoleVO.create(data.role);
        const reason = Reason.create(data.reason);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.assignRole(role, actorId, reason);
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());
        return UserMessages.assignRole(id, role, actorId);
    }

    async login(actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(actor._id);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.loginUser();
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());
        return UserMessages.logIn(id);
    }
    async getMe(actor: UserPersistence): Promise<UserResponseReadModel> {
        const id = Id.create(actor._id);
        const user = await this.userRepo.FindByIdOrThrow(id);
        return UserMapper.aggregateToResponseReadModel(user);
    }
    async softDeleteUser(data: DeleteUserDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const actorId = Id.create(actor._id);
        const id = Id.create(data.userId);
        const user = await this.userRepo.FindByIdOrThrow(id);
        const reason = Reason.create(data.reason);
        user.deleteUser(actorId, reason);
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());
        return UserMessages.delete(id, actorId);
    }

    async softDeleteMe(data: DeleteMeDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const actorId = Id.create(actor._id);
        const user = await this.userRepo.FindByIdOrThrow(actorId);
        const reason = Reason.create(data.reason);
        user.deleteUser(actorId, reason);
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());
        return UserMessages.delete(actorId, actorId);
    }
    async recoverUser(id: string, actor: UserPersistence): Promise<UserMessagesType> {
        const actorId = Id.create(actor._id);
        const userId = Id.create(id);
        const user = await this.userRepo.FindByIdOrThrow(userId);
        user.recoverUser(actorId);
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());
        return UserMessages.recover(userId, actorId);
    }
    async blockUser(data: BlockUserDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(data.userId);
        const actorId = Id.create(actor._id);
        const reason = Reason.create(data.reason);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.blockUser(actorId, reason);
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());
        return UserMessages.block(id, actorId);
    }
    async blockLift(userId: string, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(userId);
        const actorId = Id.create(actor._id);

        const user = await this.userRepo.FindByIdOrThrow(id);

        user.unBlockUser(actorId);

        await this.userRepo.Save(user);

        await this.eventBus.publish(user.pullEvents());
        return UserMessages.blockLift(id, actorId);
    }
    async banUser(data: BanUserDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(data.userId);
        const actorId = Id.create(actor._id);
        const reason = Reason.create(data.reason);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.banUser(actorId, data.forDays, reason);
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());
        return UserMessages.ban(id, actorId, data.forDays);
    }
    async banLift(userId: string, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(userId);
        const actorId = Id.create(actor._id);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.unBanUser(actorId);
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());
        return UserMessages.banLift(id, actorId);
    }
    async extendBan(data: ExtendBanDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(data.userId);
        const actorId = Id.create(actor._id);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.extendBan(actorId, data.forDays);
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());
        return UserMessages.extendBan(id, actorId, data.forDays);
    }
    async shortenBan(data: ExtendBanDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(data.userId);
        const actorId = Id.create(actor._id);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.shortenBan(actorId, data.forDays);
        await this.userRepo.Save(user);
        await this.eventBus.publish(user.pullEvents());
        return UserMessages.shortBan(id, actorId, data.forDays);
    }
}
