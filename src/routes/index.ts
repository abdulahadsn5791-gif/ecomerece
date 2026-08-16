import { Hono } from 'hono';
import { AddressRoutes } from '../modules/address/presentation/address.route';
import { inventoryRoutes } from '../modules/inventory/presentation/inventory.routes';
import { productRoutes } from '../modules/product/presentation/product.routes';
import { productVariantRoutes } from '../modules/product-variant/presentation/product-varaint.routes';
import usersRoutes from '../modules/user/presentation/user.routes';
import vendorRoutes from '../modules/vendor/presentation/vendor.routes';

const routes = new Hono();

routes.route('/product', productRoutes);
routes.route('/product-variant', productVariantRoutes);
routes.route('/product-inventory', inventoryRoutes);
routes.route('/address', AddressRoutes);
routes.route('/users', usersRoutes);
routes.route('/vendor', vendorRoutes);

export default routes;
