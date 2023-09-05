const { productModel } = require("../../models/productModel");

class ProductManagerMongo {
  get = async () => {
    return await productModel.find();
  };

  getById = async (pid) => {
    return await productModel.findOne({ _id: pid });
  };
  add = async (newProduct) => {
    return await productModel.create(newProduct);
  };
  update = async (pid, prodToReplace) => {
    return await productModel.updateOne({ _id: pid }, prodToReplace);
  };
  delete = async (pid) => {
    return await productModel.deleteOne({ _id: pid });
  };
}

module.exports = ProductManagerMongo;
