import { Hono } from "hono";
import { createAddressModule } from "../address.module";
import { authMiddleware } from "../../../middleware/auth";
import { adminMiddleware } from "../../../middleware/admin";

export const AddressRoutes = new Hono()

const { addressController } = createAddressModule();

AddressRoutes.get("/my", authMiddleware, addressController.getMyAddresses);
AddressRoutes.post("/my", authMiddleware, addressController.createMyAddress);
AddressRoutes.delete("/my/:id", authMiddleware, addressController.deleteMyAddress);
AddressRoutes.patch("/my/:id/default", authMiddleware, adminMiddleware, addressController.setMyAddressAsDefault);
AddressRoutes.patch("/my/:id/recover", authMiddleware, adminMiddleware, addressController.recoverAddress);

