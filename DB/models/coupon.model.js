import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    usedBy: [
      { type: Types.ObjectId, ref: "User", required: true },
    ],
    amount: { type: Number, required: true },
   expireDate: { type: Date, required: true}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const couponModel = model("Coupon", couponSchema);
export default couponModel;
