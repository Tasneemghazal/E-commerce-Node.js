import { Router } from "express";
import * as Users from "./user.controller.js"
import { auth } from "../../middlewares/auth.middleware.js";
import { endPoints } from "./user.role.js";
const userRouter = Router();
userRouter.get('/',auth(endPoints.getUsers),Users.getUsers);
userRouter.get('/userData',auth(endPoints.getUserData),Users.getUserData);

export default userRouter;