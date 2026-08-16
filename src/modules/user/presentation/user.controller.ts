import type { Context } from 'hono';
import { BaseController } from '../../../core/controller/base.controller';
import { clerkUserIdSchema } from '../../../shared/validation/clerkSchema';
import type { UserAppService } from '../application/user.app.service';
import { UserRoleDtoSchema } from './dto/assign-role.dto';
import { BanUserDTOSchema } from './dto/ban-user.dto';
import { BlockUserDTOSchema } from './dto/block-user.dto';
import { DeleteMeDTOSchema, DeleteUserDTOSchema } from './dto/delete-user.dto';
import { ExtendBanDTOSchema } from './dto/extend-ban.dto';
import { ObjUserIdDTOSchema } from './dto/user-id.dto';

export class UserController extends BaseController<UserAppService> {
    getUserById = async (c: Context) => {
        const clerkId = this.param(c, 'id', clerkUserIdSchema);
        return this.ok(c, await this.service.getUserById(clerkId));
    };
    signIn = async (c: Context) => {
        const clerkId = this.param(c, 'id', clerkUserIdSchema);
        return this.ok(c, await this.service.signIn(clerkId));
    };
    assignRole = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, UserRoleDtoSchema);
        return this.ok(c, await this.service.assignRole(data, actor));
    };
    logIn = async (c: Context) => {
        const actor = c.get('user');
        return this.ok(c, await this.service.login(actor));
    };
    getMe = async (c: Context) => {
        const actor = c.get('user');
        return this.ok(c, await this.service.getMe(actor));
    };
    blockUser = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, BlockUserDTOSchema);
        return this.ok(c, await this.service.blockUser(data, actor));
    };
    blockLift = async (c: Context) => {
        const actor = c.get('user');

        const data = await this.body(c, ObjUserIdDTOSchema);

        return this.ok(c, await this.service.blockLift(data.userId, actor));
    };
    banUser = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, BanUserDTOSchema);
        return this.ok(c, await this.service.banUser(data, actor));
    };

    banLift = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, ObjUserIdDTOSchema);
        return this.ok(c, await this.service.banLift(data.userId, actor));
    };
    extendBan = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, ExtendBanDTOSchema);
        return this.ok(c, await this.service.extendBan(data, actor));
    };
    shortBan = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, ExtendBanDTOSchema);
        return this.ok(c, await this.service.shortenBan(data, actor));
    };
    softDelete = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, DeleteUserDTOSchema);
        return this.ok(c, await this.service.softDeleteUser(data, actor));
    };
    recover = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, ObjUserIdDTOSchema);
        return this.ok(c, await this.service.recoverUser(data.userId, actor));
    };
    softDeleteMe = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, DeleteMeDTOSchema);
        return this.ok(c, await this.service.softDeleteMe(data, actor));
    };
}
