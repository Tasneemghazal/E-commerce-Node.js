import { Router } from "express";
import * as Categories from "./category.controller.js";
import uploadFile, { fileTypes } from '../../utils/multer.js'
const categoryRouter = Router({caseSensitive: true});
categoryRouter.post('/addCategory',uploadFile(fileTypes.image).single('image'),Categories.addCategory);
categoryRouter.get('/getAll',Categories.getAllCategories);
export default categoryRouter;