import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { UserRoleVO } from '@ecomerece/domain';

export type UserMessagesType = { message: string };
export const UserMessages = {
    ban(id: Id, actor: Id, days: number): UserMessagesType {
        return {
            message: `User with Id:${id.value} got banned for days:${days} by ${actor.value}`,
        };
    },
    delete(id: Id, actor: Id): UserMessagesType {
        return { message: `User with Id:${id.value} has been delete by ${actor.value}` };
    },
    recover(id: Id, actor: Id): UserMessagesType {
        return { message: `User with Id:${id.value} got recovered by ${actor.value}` };
    },
    banLift(id: Id, actor: Id): UserMessagesType {
        return { message: `User with Id:${id.value} got ban-lifted by ${actor.value}` };
    },
    blockLift(id: Id, actor: Id): UserMessagesType {
        return { message: `User with Id:${id.value} got block-lifted by ${actor.value}` };
    },
    block(id: Id, actor: Id): UserMessagesType {
        return { message: `User with Id:${id.value} got blocked by ${actor.value}` };
    },
    signIn(id: Id): UserMessagesType {
        return { message: `User got signed-in  with Id:${id.value} ` };
    },
    initailized(id: Id): UserMessagesType {
        return { message: `User has been initailized with Id:${id.value}` };
    },
    logIn(id: Id): UserMessagesType {
        return { message: `User got logged-in with Id:${id.value}` };
    },
    extendBan(id: Id, actor: Id, days: number): UserMessagesType {
        return {
            message: `User with Id:${id.value} got banned extended for days:${days} by ${actor.value}`,
        };
    },
    shortBan(id: Id, actor: Id, days: number): UserMessagesType {
        return {
            message: `User with Id:${id.value} got banned shorten for days:${days} by ${actor.value}`,
        };
    },
    assignRole(id: Id, role: UserRoleVO, actor: Id): UserMessagesType {
        return {
            message: `User with Id:${id.value} has been assigned a role:${role.value} by ${actor.value}`,
        };
    },
};
