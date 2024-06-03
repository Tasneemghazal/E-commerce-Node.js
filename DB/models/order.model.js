import mongoose, { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productName:{type:String},
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, required: true },
        unitPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
      },
    ],
    finalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cash", "visa"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "confirmed", "onWay", "delivered"],
      default: "pending",
    },
    notes: { type: String },
    rejectedReasons: { type: String },
    updatedBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    couponId: {
        type: Types.ObjectId,
        ref: "Coupon",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const orderModel = model("Order", orderSchema);
export default orderModel;
