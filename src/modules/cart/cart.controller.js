import cartModel from "../../../DB/models/cart.model.js";

export const getAll = async (req, res) => {
  const cart = await cartModel
    .findOne({ userId: req.user._id })
    .select("products");
  return res.json(cart);
};
export const create = async (req, res) => {
  const { productId } = req.body;
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    const newCart = await cartModel.create({
      userId: req.user._id,
      products: { productId },
    });
  }
  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].productId == productId) {
      return res.json({ message: "product already exists" });
    }
  }
  cart.products.push({ productId: productId });
  await cart.save();
  return res.json({ message: "success", cart });
};

export const remove = async (req, res) => {
  const { productId } = req.params;
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        products: {
          productId: productId,
        },
      },
    },
    { new: true }
  );
  return res.json({ message: "sucess", cart });
};

export const clear = async (req, res) => {
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      products: [],
    },
    { new: true }
  );
  return res.json({ message: "sucess", cart });
};
export const decrease = async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id, "products.productId": req.params.productId },
    {
      $inc: {
        "products.$.quantity": -quantity,
      },
    },
    {
      new: true,
    }
  );
  return res.json(cart);
};
export const increase = async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id, "products.productId": req.params.productId },
    {
      $inc: {
        "products.$.quantity": quantity,
      },
    },
    {
      new: true,
    }
  );
  return res.json(cart);
};
// instead of declaring two functions inc and dec
export const updateQuantity = async (req, res) => {
  const { quantity, operator } = req.body;
  const inc = operator == "+" ? quantity : -quantity;
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id, "products.productId": req.params.productId },
    {
      $inc: {
        "products.$.quantity": inc,
      },
    },
    {
      new: true,
    }
  );
  return res.json({ message: "success", cart });
};

// we want when the quantity equal 0 , remove product from cart
