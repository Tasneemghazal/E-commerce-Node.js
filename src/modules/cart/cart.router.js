import { Router } from "express";
import * as Cart from "./cart.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPoints } from "./cart.role.js";
import { validation } from "../../middlewares/validation.js";
import { createCartSchema } from "./cart.validation.js";

const cartRouter = Router({caseSensitive: true});

cartRouter.post('/create',auth(endPoints.create),validation(createCartSchema),Cart.create);
cartRouter.patch('/delete/:productId',auth(endPoints.delete),Cart.remove);
cartRouter.patch('/clear',auth(endPoints.delete),Cart.clear);
cartRouter.get('/getAll',auth(endPoints.create),Cart.getAll);
cartRouter.patch('/increase/:productId',auth(endPoints.create),Cart.increase);
cartRouter.patch('/decrease/:productId',auth(endPoints.create),Cart.decrease);
export default cartRouter;