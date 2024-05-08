import { Router } from "express";
import * as Categories from "./subCategory.controller.js";
import uploadFile, { fileTypes } from '../../utils/multer.js'
import { auth } from "../../middlewares/auth.middleware.js";

const subCategoryRouter = Router({mergeParams: true});
subCategoryRouter.post('/addCategory',auth(),uploadFile(fileTypes.image).single('image'),Categories.addSubCategory);
subCategoryRouter.get('/getAll',Categories.getAllSubCategories);
subCategoryRouter.get('/active',Categories.getActive);
subCategoryRouter.get('/:id',Categories.getDetails);
subCategoryRouter.patch('/:id',auth(),uploadFile(fileTypes.image).single('image'),Categories.update);
subCategoryRouter.delete('/:id',Categories.destory);
export default subCategoryRouter;