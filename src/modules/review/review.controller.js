import orderModel from "../../../DB/models/order.model.js";
import reviewModel from "../../../DB/models/review.model.js";
import cloudinary from "../../utils/cloudinary.js"
export const create = async (req, res) => {
    const{productId}=req.params;
    const {comment,rating}= req.body;

    const order = await orderModel.findOne({
        userId: req.user._id,
        status:'delivered',
        "products.productId": productId
    })
    if(!order){
        return res.status(400).json({message:"can't review order"});
    }

    const checkReview = await reviewModel.findOne({
        userId: req.user._id,
        productId
    });


    if(checkReview){
        return res.status(409).json({message:"you have already reviewed this product"});
    }

    if(req.file){
        const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
            folder:`${process.env.APPNAME}/${productId}/reviews`
        })
    req.body.image = {secure_url,public_id}
    }

    const review = await reviewModel.create({
        comment,
        rating,
        productId,
        userId:req.user._id,
        image:req.body.image
    })

    return res.status(200).json({message:"success",review})
};
