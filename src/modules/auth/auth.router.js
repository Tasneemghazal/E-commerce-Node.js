import { Router } from "express";
const authRouter = Router();
import * as User from "./auth.controller.js"
import { checkEmail } from "../../middlewares/checkEmail.middleWare.js";
authRouter.post('/register',checkEmail,User.register)
authRouter.post('/login',User.login)
authRouter.patch('/send',User.sendCode)
authRouter.patch('/forget',User.forgetPassword)
export default authRouter;