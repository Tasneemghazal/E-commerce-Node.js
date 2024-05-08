import slugify from "slugify";
import categoryModel from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";

export const addSubCategory = async(req, res)=>{
  const {categoryId} = req.body;
  const category= await categoryModel.findById(categoryId);
  if(!category) {
  return res.status(404).json({message:"category not found"});
  }
  req.body.name = req.body.name.toLowerCase();
  if(await categoryModel.findOne({name:req.body.name})){
  return res.status(409).json({messsage: "category already exists"});
  }
  req.body.slug = slugify(req.body.name);
  const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
  folder: `${process.env.APPNAME}/subcategories`
  });
  req.body.image = {secure_url, public_id};
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  const subcategory = await subCategoryModel.create(req.body);
  return res.json({message:"success", subcategory});
}
export const getAllSubCategories = async (req, res, next) => {
const{id}= req.params;
  const subCategories = await subCategoryModel.find({categoryId:id});
  return res.status(200).json({ message: "success", subCategories });
};
export const getActive = async (req, res) => {
  const categories = await categoryModel
    .find({ status: "active" })
    .select("name");
  return res.status(200).json({ message: "success", categories });
};
export const getDetails = async (req, res) => {
  const category = await categoryModel.findById(req.params.id);
  return res.status(200).json({ message: "success", category });
};
export const update = async (req, res) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "category not found" });
  }
  category.name = req.body.name.toLowerCase();
  if (
    await categoryModel.findOne({
      name: req.body.name,
      _id: { $ne: req.params.id },
    })
  ) {
    return res.status(409).json({ message: "name already exists" });
  }
  category.slug = slugify(req.body.name);
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "ghazalShop/category",
      }
    );
    cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };
  }
  category.status = req.body.status;
  req.body.updatedBy = req.user._id;
  await category.save();
  return res.json({ message: "success", category });
};
export const destory = async (req, res) => {
  const category = await categoryModel.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "category not found" });
  }
  await cloudinary.uploader.destroy(category.image.public_id);
  return res.status(200).json({ message: "success", category });
};
