import slugify from "slugify";
import categoryModel from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";
export const addCategory = async (req, res, next) => {
  req.body.name = req.body.name.toLowerCase();
  if (await categoryModel.findOne({ name: req.body.name })) {
    return res.status(409).json({ message: "category already exists" });
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APPNAME}/category`,
    }
  );
  req.body.slug = slugify(req.body.name);
  req.body.image = {
    secure_url,
    public_id,
  };
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;

  const category = await categoryModel.create(req.body);
  return res.status(201).json({ message: "success", category });
};
export const getAllCategories = async (req, res, next) => {
  const categories = await categoryModel.find({}).populate([{
    path:"createdBy",
    select:"userName"
  }, {path:"updatedBy", select:"userName"},{path:"subcategory"}]);
  return res.status(200).json({ message: "success", categories });
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
        folder: `${process.env.APPNAME}/category`,
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
