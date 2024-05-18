import { Router } from "express";
import * as Products from "./product.controller.js";
import uploadFile, { fileTypes } from "../../utils/multer.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPoints } from "./product.role.js";
const productRouter = Router();

productRouter.post(
  "/create",auth(endPoints.create),
  uploadFile(fileTypes.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  Products.create
);
export default productRouter;
