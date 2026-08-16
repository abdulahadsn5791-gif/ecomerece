import { Context } from "hono";
import { BaseController } from "../../../core/controller/base.controller";
import { createMyAddressDto } from "./dto/create-address.dto";
import { AddressApplicationService } from "../application/address.app.service";
import { idSchema } from "../../../../shared/dtos/id-schema";

export class AddressController extends BaseController<AddressApplicationService> {

    createMyAddress = async (c: Context) => {
        const data = await this.body(c, createMyAddressDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.createMyAddress(data, actor))
    }
    getMyAddresses = async (c: Context) => {
        const actor = c.get('user');
        return this.ok(c, await this.service.getMyAddresses(actor));
    }
    deleteMyAddress = async (c: Context) => {
        const addressId = this.param(c, 'id', idSchema);
        const actor = c.get('user');
        return this.ok(c, await this.service.deleteMyAddress(addressId, actor));
    }
    recoverAddress = async (c: Context) => {
        const addressId = this.param(c, 'id', idSchema);
        const actor = c.get('user');
        return this.ok(c, await this.service.recoverAddress(addressId, actor));
    }
    setMyAddressAsDefault = async (c: Context) => {
        const addressId = this.param(c, 'id', idSchema);
        const actor = c.get('user');
        return this.ok(c, await this.service.setMyAddressAsDefault(addressId, actor));
    }
}