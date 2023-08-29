const { RouterClass } = require("./routerClass");

const {
  getOneCart,
  getAllCarts,
  addProdToCart,
  emptyCart,
  deleteProdFromCart,
  purchase,
} = require("../controllers/cartController");
const { passportAuth } = require("../passportConfig/passportAuth");

class CartRouter extends RouterClass {
  init() {
    this.get("/:cid", ["USER", "USER_PREMIUM"], getOneCart);
    this.get("/", ["ADMIN"], getAllCarts);
    this.post(
      "/:cid/products/:pid",
      ["USER", "USER_PREMIUM"],
      passportAuth("jwt"),
      addProdToCart
    );
    this.delete("/:cid", ["USER", "USER_PREMIUM"], emptyCart);
    this.delete(
      "/:cid/products/:pid",
      ["USER", "USER_PREMIUM"],
      deleteProdFromCart
    );
    this.get("/:cid/purchase", ["USER", "USER_PREMIUM"], purchase);
  }
}

//ID carrito: 646c1654fdd633759a71a074
//ID productos ya existentes en el carrito : 6472dae2319d717aed29367e, 6472db04319d717aed293686
//ID de otros productos de la DB : 6472dbd06e17547c73e2a872, 647426de34ee0a57cc1b3c8f, 647426e934ee0a57cc1b3c97

module.exports = { CartRouter };
