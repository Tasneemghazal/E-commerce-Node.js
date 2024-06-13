import { Router } from "express";
import * as Categories from "./category.controller.js";
import uploadFile, { fileTypes } from '../../utils/multer.js'
import { auth } from "../../middlewares/auth.middleware.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";
import { endPoints } from "./category.role.js";
import { validation } from "../../middlewares/validation.js";
import { createCategorySchema, deleteCategorySchema, getDetailsSchema, updateSchema } from "./category.validation.js";

const categoryRouter = Router({caseSensitive: true});
categoryRouter.use('/:id/subcategory',subCategoryRouter)
categoryRouter.post('/addCategory',uploadFile(fileTypes.image).single('image'),validation(createCategorySchema),auth(endPoints.create),Categories.addCategory);
categoryRouter.get('/getAll',auth(endPoints.get),Categories.getAllCategories);
categoryRouter.get('/active',Categories.getActive);
categoryRouter.get('/:id',validation(getDetailsSchema),Categories.getDetails);
categoryRouter.patch('/:id',uploadFile(fileTypes.image).single('image'),validation(updateSchema),auth(endPoints.delete),Categories.update);
categoryRouter.delete('/:id',validation(deleteCategorySchema),auth(endPoints.delete),Categories.destory);
export default categoryRouter;