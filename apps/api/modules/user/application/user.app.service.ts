
import { EmailVO } from '@ecomerece/domain/value-objects/email.vo';
import { Id } from '@ecomerece/domain/value-objects/id.vo';
import { PersonName } from '@ecomerece/domain/value-objects/name.vo';
import { Reason } from '@ecomerece/domain/value-objects/reason.vo';
import { UrlVO } from '@ecomerece/domain/value-objects/url.vo';
import { BaseService } from '../../../core/services/base.services';
import { BadRequestError, NotFoundError } from '../../../errors/app-error';
import { clerkClient } from '../../../lib/clerkClient';
import type { BanUserDTO, BlockUserDTO, DeleteMeDTO, DeleteUserDTO, ExtendBanDTO, UserResponseReadModel, UserRoleDto } from '@ecomerece/shared';
import { UserAggregate } from '@ecomerece/domain';
import { NameInfoVO } from '@ecomerece/domain';
import { UserRoleVO } from '@ecomerece/domain';
import { UserMapper } from '../infrastructure/user.mapper';
import type { UserPersistence } from '../infrastructure/user.models';
import type { UserRepository } from '../infrastructure/user.repository';


import { UserMessages, type UserMessagesType } from '../presentation/user.messages';
import { InMemoryEventBus } from '../../../core/infrastructure/buses/in-memory-event-bus';
import { getUserById } from '../../../lib/supabase';


export class UserAppService extends BaseService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly eventBus: InMemoryEventBus,
    ) {
        super();
    }

    async initUser(userId: string) {

        const SupabaseUser = await getUserById(userId);

        if (!SupabaseUser.email) throw new BadRequestError('Invalid user');

        const email = EmailVO.create(SupabaseUser.email);

        const id = Id.create(userId);
        const user = await this.userRepo.FindById(id);

        if (user) {
            user.loginUser();
            await this.userRepo.Save(user);

            return UserMessages.initailized(id);
        }

        const image = new UrlVO(SupabaseUser.user_metadata?.avatar_url || SupabaseUser.user_metadata?.picture);
        console.log(SupabaseUser

        )
        const fullName = SupabaseUser.user_metadata.full_name;
        const nameArray = fullName.trim().split(/\s+/);
        const firstName = nameArray[0] || '';
        const lastName = nameArray.length > 1 ? nameArray[nameArray.length - 1] : '';
        const middleName = nameArray.length > 2 ? nameArray.slice(1, -1).join(' ') : '';
        const name = NameInfoVO.create(
            PersonName.create(firstName ?? ''),
            middleName ? PersonName.create(middleName) : null,
            lastName ? PersonName.create(lastName) : null,
        );
        const User = UserAggregate.create({
            id,
            name,
            email,
            image,
        });
        User.signIn(User.id);
        await this.userRepo.Create(User);
        return UserMessages.initailized(id);

    }

    async getUserById(userId: string): Promise<UserResponseReadModel> {
        const id = Id.create(userId);
        const user = await this.userRepo.FindByIdOrThrow(id);
        return UserMapper.aggregateToResponseReadModel(user);
    }


    async assignRole(data: UserRoleDto, actor: UserPersistence): Promise<UserMessagesType> {
        const actorId = Id.create(actor._id);
        const id = Id.create(data.userId);
        const role = UserRoleVO.create(data.role);
        const reason = Reason.create(data.reason);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.assignRole(role, actorId, reason);
        await this.userRepo.Save(user);

        return UserMessages.assignRole(id, role, actorId);
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

        return UserMessages.delete(id, actorId);
    }

    async softDeleteMe(data: DeleteMeDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const actorId = Id.create(actor._id);
        const user = await this.userRepo.FindByIdOrThrow(actorId);
        const reason = Reason.create(data.reason);
        user.deleteUser(actorId, reason);
        await this.userRepo.Save(user);

        return UserMessages.delete(actorId, actorId);
    }
    async recoverUser(id: string, actor: UserPersistence): Promise<UserMessagesType> {
        const actorId = Id.create(actor._id);
        const userId = Id.create(id);
        const user = await this.userRepo.FindByIdOrThrow(userId);
        user.recoverUser(actorId);
        await this.userRepo.Save(user);

        return UserMessages.recover(userId, actorId);
    }
    async blockUser(data: BlockUserDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(data.userId);
        const actorId = Id.create(actor._id);
        const reason = Reason.create(data.reason);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.blockUser(actorId, reason);
        await this.userRepo.Save(user);

        return UserMessages.block(id, actorId);
    }
    async blockLift(userId: string, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(userId);
        const actorId = Id.create(actor._id);

        const user = await this.userRepo.FindByIdOrThrow(id);

        user.unBlockUser(actorId);

        await this.userRepo.Save(user);


        return UserMessages.blockLift(id, actorId);
    }
    async banUser(data: BanUserDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(data.userId);
        const actorId = Id.create(actor._id);
        const reason = Reason.create(data.reason);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.banUser(actorId, data.forDays, reason);
        await this.userRepo.Save(user);

        return UserMessages.ban(id, actorId, data.forDays);
    }
    async banLift(userId: string, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(userId);
        const actorId = Id.create(actor._id);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.unBanUser(actorId);
        await this.userRepo.Save(user);

        return UserMessages.banLift(id, actorId);
    }
    async extendBan(data: ExtendBanDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(data.userId);
        const actorId = Id.create(actor._id);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.extendBan(actorId, data.forDays);
        await this.userRepo.Save(user);

        return UserMessages.extendBan(id, actorId, data.forDays);
    }
    async shortenBan(data: ExtendBanDTO, actor: UserPersistence): Promise<UserMessagesType> {
        const id = Id.create(data.userId);
        const actorId = Id.create(actor._id);
        const user = await this.userRepo.FindByIdOrThrow(id);
        user.shortenBan(actorId, data.forDays);
        await this.userRepo.Save(user);

        return UserMessages.shortBan(id, actorId, data.forDays);
    }
}
