const { RouterClass } = require("./routerClass");

const {
  createProd,
  updateProd,
  deleteProd,
  getProd,
} = require("../controllers/productController");

const { passportAuth } = require("../passportConfig/passportAuth");

class ProductRouter extends RouterClass {
  init() {
    this.post("/",['USER_PREMIUM', 'ADMIN'], createProd);
    this.put("/:pid",['USER_PREMIUM', 'ADMIN'], updateProd);
    this.delete("/:pid",['USER_PREMIUM', 'ADMIN'], deleteProd);
    this.get("/",['USER', 'USER_PREMIUM', 'ADMIN'], passportAuth('jwt'), getProd )
  }
}

module.exports = { ProductRouter };
