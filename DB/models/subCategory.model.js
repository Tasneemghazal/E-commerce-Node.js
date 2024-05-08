import{ model, Schema, Types } from "mongoose";
const subcategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  image: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: "Active",
    enum: ["Active", "NotActive"],
  },
  categoryId: {
    type: Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdBy:{type:Types.ObjectId,ref:'User'},
  updatedBy:{type:Types.ObjectId,ref:'User'},
},{
    timestamps:true,
});
const subCategoryModel = model("SubCategory",subcategorySchema);
export default subCategoryModel;
