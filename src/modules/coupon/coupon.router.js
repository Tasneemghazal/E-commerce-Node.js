import { Router } from "express";
import * as Coupon from "./coupon.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPoints } from "./coupon.role.js";
import { validation } from "../../middlewares/validation.js";
import { createCouponSchema } from "./coupon.validation.js";
const couponRouter = Router();
couponRouter.post('/create',validation(createCouponSchema),auth(endPoints.create),Coupon.create);

export default couponRouter;