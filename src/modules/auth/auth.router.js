import { Router } from "express";
const authRouter = Router();
import * as User from "./auth.controller.js"
import { checkEmail } from "../../middlewares/checkEmail.middleWare.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { validation } from "../../middlewares/validation.js";
import { loginSchema, registerSchema, sendCodeSchema } from "./auth.validation.js";
import uploadFile, { fileTypes } from "../../utils/multer.js";
authRouter.post('/register',validation(registerSchema),checkEmail,asyncHandler(User.register))
authRouter.post('/Excel', uploadFile(fileTypes.excel).single('excel'), asyncHandler(User.addUserExcel));
authRouter.post('/login',User.login)
authRouter.patch('/send',validation(sendCodeSchema),User.sendCode)
authRouter.patch('/forget',User.forgetPassword)
authRouter.get('/confirmEmail/:token',User.confirmEmail)
export default authRouter;