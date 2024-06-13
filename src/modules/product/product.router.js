import { Router } from "express";
import * as Products from "./product.controller.js";
import uploadFile, { fileTypes } from "../../utils/multer.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPoints } from "./product.role.js";
import reviewRouter from "../review/review.router.js"
const productRouter = Router();
productRouter.use('/:productId/review',reviewRouter)
productRouter.post(
  "/create",auth(endPoints.create),
  uploadFile(fileTypes.image).fields([
    { name: "image", maxCount: 1 },
    { name: "subImages", maxCount: 5 },
  ]),
  Products.create
);

productRouter.get('/',Products.getProducts)
export default productRouter;
