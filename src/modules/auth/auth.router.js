import { Router } from "express";
const authRouter = Router();
import * as User from "./auth.controller.js"
authRouter.post('/register',User.register)
authRouter.post('/login',User.login)
authRouter.patch('/send',User.sendCode)
authRouter.patch('/forget',User.forgetPassword)
export default authRouter;