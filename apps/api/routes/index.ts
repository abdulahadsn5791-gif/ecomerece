import { Hono } from 'hono';
import { AddressRoutes } from '../modules/address/presentation/address.route';
import { inventoryRoutes } from '../modules/inventory/presentation/inventory.routes';
import { OrderRoutes } from '../modules/order/presentation/order.routes';
import { productRoutes } from '../modules/product/presentation/product.routes';
import { productVariantRoutes } from '../modules/product-variant/presentation/product-varaint.routes';
import usersRoutes from '../modules/user/presentation/user.routes';
import vendorRoutes from '../modules/vendor/presentation/vendor.routes';
import { orderItemsRoutes } from '../modules/order-items/presentation/order-items.routes';
import { CategoryRoutes } from '../modules/category/presentation/category.routes';


const routes = new Hono();

routes.route('/product', productRoutes);
routes.route('/product-variant', productVariantRoutes);
routes.route('/product-inventory', inventoryRoutes);
routes.route('/order', OrderRoutes);
routes.route('/order-items', orderItemsRoutes);
routes.route('/category', CategoryRoutes);
routes.route('/address', AddressRoutes);
routes.route('/users', usersRoutes);
routes.route('/vendor', vendorRoutes);

export default routes;
