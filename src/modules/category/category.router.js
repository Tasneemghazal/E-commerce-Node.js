import { Router } from "express";
import * as Categories from "./category.controller.js";
import uploadFile, { fileTypes } from '../../utils/multer.js'
import { auth } from "../../middlewares/auth.middleware.js";
const categoryRouter = Router({caseSensitive: true});
categoryRouter.post('/addCategory',auth(),uploadFile(fileTypes.image).single('image'),Categories.addCategory);
categoryRouter.get('/getAll',Categories.getAllCategories);
categoryRouter.get('/active',Categories.getActive);
categoryRouter.get('/:id',Categories.getDetails);
categoryRouter.patch('/:id',auth(),uploadFile(fileTypes.image).single('image'),Categories.update);
categoryRouter.delete('/:id',Categories.destory);
export default categoryRouter;