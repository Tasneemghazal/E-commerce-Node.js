import { Router } from "express";
import * as Order from "./order.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPoints } from "./order.role.js";
const orderRouter = Router();
orderRouter.post('/create',auth(endPoints.create),Order.create);
orderRouter.get('/all',auth(endPoints.all),Order.getOrders);
orderRouter.get('/myOrders',auth(endPoints.getOrders),Order.getMyOrders);
orderRouter.patch('/changeStatus/:orderId',auth(endPoints.changeStatus),Order.changeStatus);

export default orderRouter;