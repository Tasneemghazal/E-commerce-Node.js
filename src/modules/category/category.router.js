import { Router } from "express";
import * as Categories from "./category.controller.js";
const categoryRouter = Router({caseSensitive: true});

categoryRouter.get('/getAll',Categories.getAllCategories);
export default categoryRouter;