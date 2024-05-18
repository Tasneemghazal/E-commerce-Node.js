import slugify from "slugify";
import categoryModel from "../../../DB/models/category.model.js";
import productModel from "../../../DB/models/product.model.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";
import cloudinary from "../../utils/cloudinary.js"
export const create = async (req, res) => {
    try {
        const { name, price, discount, categoryId, subcategoryId } = req.body;

        const checkCategory = await categoryModel.findById(categoryId);
        if (!checkCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        const checkSubCategory = await subCategoryModel.findOne({ _id: subcategoryId, categoryId: categoryId });
        if (!checkSubCategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        req.body.slug = slugify(name);
        req.body.finalPrice = price - ((price * (discount || 0)) / 100);
        const mainImageUpload = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APPNAME}/product/${name}` });
        req.body.mainImage = { secure_url: mainImageUpload.secure_url, public_id: mainImageUpload.public_id };
        req.body.subImages = [];
        for (const file of req.files.subImages) {
            const subImageUpload = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APPNAME}/product/${name}/subImages` });
            req.body.subImages.push({ secure_url: subImageUpload.secure_url, public_id: subImageUpload.public_id });
        }
        const product = await productModel.create(req.body);
        return res.status(201).json({ message: "Success", product });

    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: "Internal server error" });
    }
};
