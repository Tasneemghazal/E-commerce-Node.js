import slugify from "slugify";
import categoryModel from "../../../DB/models/category.model.js";
import productModel from "../../../DB/models/product.model.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { pagination } from "../../utils/pagination.js";
import { json } from "express";
export const create = async (req, res) => {
  try {
    const { name, price, discount, categoryId, subcategoryId } = req.body;

    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const checkSubCategory = await subCategoryModel.findOne({
      _id: subcategoryId,
      categoryId: categoryId,
    });
    if (!checkSubCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    req.body.slug = slugify(name);
    req.body.finalPrice = price - (price * (discount || 0)) / 100;
    const mainImageUpload = await cloudinary.uploader.upload(
      req.files.mainImage[0].path,
      { folder: `${process.env.APPNAME}/product/${name}` }
    );
    req.body.mainImage = {
      secure_url: mainImageUpload.secure_url,
      public_id: mainImageUpload.public_id,
    };
    req.body.subImages = [];
    for (const file of req.files.subImages) {
      const subImageUpload = await cloudinary.uploader.upload(file.path, {
        folder: `${process.env.APPNAME}/product/${name}/subImages`,
      });
      req.body.subImages.push({
        secure_url: subImageUpload.secure_url,
        public_id: subImageUpload.public_id,
      });
    }
    const product = await productModel.create(req.body);
    return res.status(201).json({ message: "Success", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProducts = async(req, res)=> {
    const {skip,limit} = pagination(req.query.page,req.query.limit);
    let queryObj = {...req.query};
    const execQuery = ['page', 'limit','sort','search','fields'];
    execQuery.map((ele)=>{
    delete queryObj[ele];
    });
    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(/gt|gte|lt|lte|in|nin|eq/g,match => `$${match}`);
    queryObj = JSON.parse(queryObj);
    const mongoseQuery = productModel.find(queryObj).skip(skip).limit(limit);
    /*.populate({
    path: 'reviews',
    populate:{
    path: 'userId',
    select: 'userName -_id'
    },
    })*/
    if(req.query.search){
        mongoseQuery.find({
        $or: [
        { name: {$regex:req.query.search}},
        {description: {$regex:req.query.search}}
        ]
        });
    }
        const count = await productModel.estimatedDocumentCount();
        mongoseQuery.select(req.query.fields);
        const products = await mongoseQuery.sort(req.query.sort);
        return res.status(200).json({message:"success", count, products});
}
