const { ProductDao } = require("../daos/factory");

const ProductRepository = require("../repositories/productRepository");

const productService = new ProductRepository(new ProductDao());

module.exports = {
  productService,
};
