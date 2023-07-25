const { cartModel } = require("../../models/cartModel");

class CartManagerMongo {
  getById = async (cid) => {
    try {
      return await cartModel.findOne({ _id: cid });
    } catch (err) {
      console.log(err);
    }
  };

  get = async () => {
    try {
      return await cartModel.find();
    } catch (error) {
      console.log(error);
    }
  };
  add = async (newCart) => {
    try {
      return await cartModel.create(newCart);
    } catch (err) {
      console.log(err);
    }
  };
  // updateCart = async (cid ) => {
  //   try {
  //     return await cartModel.findById(cid);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  updateProductQuantity = async (cid, pid) => {
    try {
      return await cartModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
      // if (!cart) {
      //   // El producto no existe en el carrito, así que lo agregamos
      //   const updatedCart = await cartModel.findOneAndUpdate(
      //     { _id: cid, "products.product": pid },
      //     { $set: { "products.$.quantity": 1 } },
      //     { new: true }
      //   );
    } catch (error) {
      console.log(error);
    }
  };

  emptyCart = async (cid) => {
    try {
      await cartModel.findOneAndUpdate({ _id: cid }, { products: [] });
    } catch (error) {
      console.log(error);
    }
  };
  updateCart = async (cid, cart) => {
    try {
      await cartModel.findByIdAndUpdate({ _id: cid }, cart);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = CartManagerMongo;
