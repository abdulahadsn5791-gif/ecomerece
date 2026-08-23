import type { Context } from 'hono';
import { BaseController } from '../../../core/controller/base.controller';
import type { VendorAppService } from '../application/vendor.app.service';
import { CreateVendorDtoSchema } from './dto/create-vendorDto';
import { DeleteMyVendorDtoSchema, DeleteVendorDtoSchema } from './dto/delete-vendor.dto';
import { RecoverVendorDtoSchema } from './dto/recover-vendor.dto';
import { RejectVendorDtoSchema } from './dto/reject-vendor.dto';
import { VendorParamDtoSchema } from './dto/vendor-param.Dto';
import { VerifyVendorDtoSchema } from './dto/verify-vendor.dto';

export class VendorController extends BaseController<VendorAppService> {
    getVendorById = async (c: Context) => {
        const vendorId = this.param(c, 'id', VendorParamDtoSchema);
        return this.ok(c, await this.service.getVendorById(vendorId));
    };

    createMyVendor = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, CreateVendorDtoSchema);
        return this.ok(c, await this.service.createMyVendor(data, actor));
    };

    deleteMyVendor = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, DeleteMyVendorDtoSchema);
        return this.ok(c, await this.service.deleteMyVendor(data, actor));
    };

    softDeleteVendor = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, DeleteVendorDtoSchema);
        return this.ok(c, await this.service.softDeleteVendor(data, actor));
    };

    recoverVendor = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, RecoverVendorDtoSchema);
        return this.ok(c, await this.service.recoverVendor(data, actor));
    };

    verifyVendor = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, VerifyVendorDtoSchema);
        return this.ok(c, await this.service.verifyVendor(data, actor));
    };

    rejectVendorVerification = async (c: Context) => {
        const actor = c.get('user');
        const data = await this.body(c, RejectVendorDtoSchema);
        return this.ok(c, await this.service.rejectVendorVerification(data, actor));
    };
}
