const { productModel } = require("../../models/productModel");

class ProductManagerMongo {
  get = async () => {
    try {
      return await productModel.find();
    } catch (error) {
      return new Error(error);
    }
  };

  getById = async (pid) => {
    try {
      return await productModel.findOne({ _id: pid });
    } catch (error) {
      return new Error(error);
    }
  };
  add = async (newProduct) => {
    try {
      await productModel.create(newProduct);
    } catch (error) {
      return new Error(error);
    }
  };
  update = async (pid, prodToReplace) => {
    try {
      await productModel.updateOne({ _id: pid }, prodToReplace);
    } catch (error) {
      return new Error(error);
    }
  };
  delete = async (pid) => {
    try {
      await productModel.deleteOne({ _id: pid });
    } catch (error) {
      return new Error(error);
    }
  };
}

module.exports = ProductManagerMongo;
