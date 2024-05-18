import mongoose, { model, Schema, Types } from "mongoose";
const cartSchema = Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  products: [
    {
      productId: { type: Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
 
},{ timestamps: true});
const cartModel = model("Cart", cartSchema);
export default cartModel;
