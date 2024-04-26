import { Router } from "express";
import * as Products from "./product.controller.js";
const productRouter = Router();

productRouter.get('/',Products.getAllProducts);
export default productRouter;