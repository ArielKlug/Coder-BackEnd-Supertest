const { RouterClass } = require("./routerClass");

const ProductController = require("../controllers/productController");
const products = new ProductController();

const { passportAuth } = require("../passportConfig/passportAuth");

class ProductRouter extends RouterClass {
  init() {
    this.get(
      "/",
      ["USER", "USER_PREMIUM", "ADMIN"],
      passportAuth("jwt"),
      products.getProducts
    );
    this.get(
      "/:pid",
      ["USER", "USER_PREMIUM", "ADMIN"],
      passportAuth("jwt"),
      products.getProduct
    );
    this.post(
      "/",
      ["USER_PREMIUM", "ADMIN"],
      passportAuth("jwt"),
      products.createProduct
    );
    this.put(
      "/:pid",
      ["USER_PREMIUM", "ADMIN"],
      passportAuth("jwt"),
      products.updateProduct
    );
    this.delete(
      "/:pid",
      ["USER_PREMIUM", "ADMIN"],
      passportAuth("jwt"),
      products.deleteProduct
    );
  }
}

module.exports = { ProductRouter };
