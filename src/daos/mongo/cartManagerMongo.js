const { cartModel } = require("../../models/cartModel");

class CartManagerMongo {
  getById = async (cid) => {
    return await cartModel.findOne({ _id: cid });
  };

  get = async () => {
    return await cartModel.find();
  };
  add = async (newCart) => {
    return await cartModel.create(newCart);
  };

  updateProductQuantity = async (cid, pid) => {
    return await cartModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );
  };

  emptyCart = async (cid) => {
    await cartModel.findOneAndUpdate({ _id: cid }, { products: [] });
  };
  updateCart = async (cid, cart) => {
    await cartModel.findByIdAndUpdate({ _id: cid }, cart);
  };
}

module.exports = CartManagerMongo;
