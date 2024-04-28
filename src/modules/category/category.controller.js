import slugify from "slugify";
import categoryModel from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js"
export const addCategory = async(req,res,next) => {
   req.body.name = req.body.name.toLowerCase();
    if(await categoryModel.findOne({name: req.body.name})){
        return res.status(409).json({message:"category already exists"});
    }
    
    const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:'ghazalShop/category',
    })
    req.body.slug = slugify(req.body.name);
    req.body.image ={
        secure_url,
        public_id
    }
    const category = await categoryModel.create(req.body)
    return res.status(201).json({message:"success",category})
}
export const getAllCategories = (req,res,next) =>{
    return res.json("categories");
}