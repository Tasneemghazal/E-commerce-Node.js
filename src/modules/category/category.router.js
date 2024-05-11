import { Router } from "express";
import * as Categories from "./category.controller.js";
import uploadFile, { fileTypes } from '../../utils/multer.js'
import { auth } from "../../middlewares/auth.middleware.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";
import { endPoints } from "./category.role.js";

const categoryRouter = Router({caseSensitive: true});
categoryRouter.use('/:id/subcategory',subCategoryRouter)
categoryRouter.post('/addCategory',auth(endPoints.create),uploadFile(fileTypes.image).single('image'),Categories.addCategory);
categoryRouter.get('/getAll',auth(endPoints.get),Categories.getAllCategories);
categoryRouter.get('/active',Categories.getActive);
categoryRouter.get('/:id',Categories.getDetails);
categoryRouter.patch('/:id',auth(endPoints.delete),uploadFile(fileTypes.image).single('image'),Categories.update);
categoryRouter.delete('/:id',auth(endPoints.delete),Categories.destory);
export default categoryRouter;