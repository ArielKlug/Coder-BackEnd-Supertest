const { RouterClass } = require("./routerClass");

const ProductController = require("../controllers/productController");
const products = new ProductController();

const { passportAuth } = require("../passportConfig/passportAuth");

class ProductRouter extends RouterClass {
  init() {
    this.post("/", ["USER_PREMIUM", "ADMIN"], passportAuth("jwt"), products.createProduct);
    this.put("/:pid", ["USER_PREMIUM", "ADMIN"], passportAuth("jwt"), products.updateProduct);
    this.delete("/:pid", ["USER_PREMIUM", "ADMIN"], passportAuth("jwt"), products.deleteProduct);
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
  }
}

module.exports = { ProductRouter };
