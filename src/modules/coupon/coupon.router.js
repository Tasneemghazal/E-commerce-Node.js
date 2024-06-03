import { Router } from "express";
import * as Coupon from "./coupon.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPoints } from "./coupon.role.js";
const couponRouter = Router();
couponRouter.post('/create',auth(endPoints.create),Coupon.create);

export default couponRouter;