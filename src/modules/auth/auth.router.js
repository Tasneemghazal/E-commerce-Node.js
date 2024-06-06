import { Router } from "express";
const authRouter = Router();
import * as User from "./auth.controller.js"
import { checkEmail } from "../../middlewares/checkEmail.middleWare.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { validation } from "../../middlewares/validation.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
authRouter.post('/register',validation(registerSchema),checkEmail,asyncHandler(User.register))
authRouter.post('/login',validation(loginSchema),User.login)
authRouter.patch('/send',User.sendCode)
authRouter.patch('/forget',User.forgetPassword)
authRouter.get('/confirmEmail/:token',User.confirmEmail)
export default authRouter;