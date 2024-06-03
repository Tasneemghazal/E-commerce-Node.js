import mongoose, { model, Schema, Types } from "mongoose";
const reviewSchema = Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment:{
    type:String,
    required: true,
  },
  rating:{
    type:Number,
    required: true,
    min:1,
    max:5
  },
  productId:{
    type:Types.ObjectId,
    ref: "Product",
    required: true,
  },
  image:{
    type:Object
  }
 
},{ timestamps: true});
const reviewModel = model("Review", reviewSchema);
export default reviewModel;
