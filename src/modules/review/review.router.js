import { Router } from "express";
import * as Review from "./review.controller.js";
import uploadFile, { fileTypes } from "../../utils/multer.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPoints } from "./review.role.js";

const revRouter = Router({mergeParams:true});
revRouter.post('/',auth(endPoints.create),uploadFile(fileTypes.image).single('image'),Review.create);
export default revRouter;
