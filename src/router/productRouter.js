const { RouterClass } = require("./routerClass");

const ProductController = require("../controllers/productController");
const products = new ProductController();

const { passportAuth } = require("../passportConfig/passportAuth");

class ProductRouter extends RouterClass {
  init() {
    this.post("/", ["PUBLIC"], products.createProduct);
    this.put("/:pid", ["ADMIN"], products.updateProduct);
    this.delete("/:pid", ["ADMIN"], products.deleteProduct);
    this.get("/", ["USER", "ADMIN"], passportAuth("jwt"), products.getProducts);
    this.get(
      "/:pid",
      ["USER", "ADMIN"],
      passportAuth("jwt"),
      products.getProduct
    );
  }
}

module.exports = { ProductRouter };
