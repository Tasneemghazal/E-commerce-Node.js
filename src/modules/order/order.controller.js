import cartModel from "../../../DB/models/cart.model.js";
import couponModel from "../../../DB/models/coupon.model.js";
import orderModel from "../../../DB/models/order.model.js";
import productModel from "../../../DB/models/product.model.js";
import userModel from "../../../DB/models/user.model.js";
import createInvoice from "../../utils/pdf.js";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51PR7O2K4ueI4ci0XCBcovtSbg4Kui6qCqB8vtR5o2zpun2More6x2M1LRkx4cPweBqrizC4B7K7Kgdp8PgucWC4y003qogqRwv');
export const create = async (req, res) => {
  try {
    const { couponName } = req.body;
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    req.body.products = cart.products;
    if (couponName) {
      const coupon = await couponModel.findOne({ name: couponName });
      if (!coupon) {
        return res.status(400).json({ message: "Coupon not found" });
      }

      if (coupon.expireDate < new Date()) {
        return res.status(400).json({ message: "Coupon expired" });
      }

      if (coupon.usedBy.includes(req.user._id)) {
        return res.status(409).json({ message: "Coupon already used" });
      }

      req.body.coupon = coupon;
    }
    let finalProduct = [];
    let subTotal = 0;
    for (let product of req.body.products) {
      const checkProduct = await productModel.findOne({
        _id: product.productId,
        stock: { $gte: product.quantity },
      });
      if (!checkProduct) {
        return res.status(404).json({ message: "not enough" });
      }
      product = product.toObject();
      product.productName = checkProduct.name;
      product.unitPrice = checkProduct.price;
      product.discount = checkProduct.discount;
      product.finalPrice = product.quantity * checkProduct.finalPrice;
      subTotal += product.finalPrice;
      finalProduct.push(product);
    }
    const user = await userModel.findById(req.user._id);
    if (!req.body.address) {
      req.body.address = user.address;
    }
    if (!req.body.phoneNumber) {
      req.body.phoneNumber = user.phone;
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
          {
          
            price_data:{
              currency:'USD',
              unit_amount:subTotal - (subTotal * (( req.body.coupon?.amount || 0 )) / 100),
              product_data:{
                  name:user.userName
              }
            } ,
            quantity: 1,
          }
        ],
        mode: 'payment',
        success_url: `http://www.facebook.com`,
        cancel_url: `http://www.youtub.com`,
    })
    const order = await orderModel.create({
      userId: req.user._id,
      products: finalProduct,
      finalPrice: subTotal - subTotal * ((req.body.coupon?.amount || 0) / 100),
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      updatedBy: req.user._id,
    });

    if (order) {
     

      for (const product of req.body.products) {
        await productModel.findByIdAndUpdate(
          { _id: product.productId },
          {
            $inc: {
              stock: -product.quantity,
            },
          }
        );
      }
      const invoice = {
        shipping: {
          name: user.userName,
          address: order.address,
          city: "San Francisco",
          state: "CA",
          country: "US",
          postal_code: 94111,
        },
        items: order.products,
        subtotal:order.finalPrice,
        invoice_nr: order._id,
      };
      createInvoice(invoice, "invoice.pdf");

      if (req.body.coupon) {
        await couponModel.findByIdAndUpdate(
          { _id: req.body.coupon._id },
          {
            $addToSet: {
              usedBy: req.user._id,
            },
          }
        );
      }

      await cartModel.updateOne({ userId: req.user._id }, { products: [] });
    }
    return res
      .status(200)
      .json({ message: "success", finalProduct, subTotal, order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  const orders = await orderModel.find({
    $or: [
      {
        status: "pending",
      },
      {
        status: "onWay",
      },
    ],
  });
  return res.json({ message: "success", orders });
};
export const getMyOrders = async (req, res) => {
  const orders = await orderModel.find({ userId: req.user._id });
  return res.json({ message: "success", orders });
};
export const changeStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await orderModel.findById({ _id: orderId });
  if (!order) {
    return res.json({ message: " orders not found" });
  }
  order.status = status;
  await order.save();
  return res.json({ message: "success", order });
};
