const { cartService } = require("../services/cartService");
const { productService } = require("../services/productService");
const { ticketService } = require("../services/ticketService");

class CartController {
  getOneCart = async (req, res) => {
    try {
      const { cid } = req.params;

      const cart = await cartService.getCart(cid);

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      const cartData = cart.toObject();

      res.render("cart", {
        cart: cartData,
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
  purchase = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCart(cid);

      if (cart.products.length === 0) {
        res.send({
          status: "error",
          payload:
            "No hay nada en el carrito, date una vuelta por el mercadito del Tío Ari :)",
        });
      }
      const outstockedProds = [];

      cart.products.forEach(async (item) => {
        let stock = item.product.stock;

        let pid = item.product._id;

        if (stock >= item.quantity) {
          item.product.stock -= item.quantity;

          await productService.updateProduct(pid, item.product);
        } else {
          outstockedProds.push(item);
        }
      });

      let productsToBuy = cart.products.filter(
        (item) =>
          !outstockedProds.some((p) => p.product._id === item.product._id)
      );
      let ticketResult;
      if (productsToBuy.length > 0) {
        const date = new Date().toLocaleString("en-GB", {
          hour12: false,
        });
        const ticket = {
          purchaseDateTime: date,
          amount: productsToBuy.reduce(
            (total, item) => total + item.quantity * item.product.price,
            0
          ),
          purcharser: cart.userId,
        };
        ticketResult = await ticketService.addTicket(ticket);
      }
      if (outstockedProds.length > 0) {
        cart.products = outstockedProds;
        await cartService.updateCart(cid, cart);

        let productsNotBuyed = [];
        outstockedProds.forEach((item) => {
          productsNotBuyed.push(item.product._id);
        });

        res.send({
          ticketResult: ticketResult,
          message:
            "Por el momento no tenemos stock para el total de su compra, ya estamos trabajando en ello",
          carrito: productsNotBuyed,
        });
      } else {
        await cartService.emptyCart(cid);
        res.send({ ticketResult: ticketResult });
      }
    } catch (error) {
      req.logger.error(error);
    }
  };
  getAllCarts = async (req, res) => {
    try {
      res.send(await cartService.getCarts());
    } catch (error) {
      req.logger.error(error);
    }
  };
  addProdToCart = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const { pid } = req.params;
      const user = req.user;

      const product = await productService.getProductById(pid);
      if (user.role === "user_premium" && product.owner === user.email) {
        return res.status(403).send({
          status: "error",
          message: "No puedes agregar tu propio producto al carrito",
        });
      }
      const findedCart = await cartService.getCart(cid);
      const foundProductIndex = findedCart.products.findIndex(
        (prod) => prod.product.id === pid
      );

      if (foundProductIndex !== -1) {
        await cartService.updateQuantityOfProduct(cid, pid);
      } else {
        const cart = await cartService.getCart(cid);

        if (!cart) {
          req.logger.warning("Carrito no encontrado");
          return;
        }

        cart.products.push({ product: pid, quantity: 1 });
        await cart.save();
      }

      // Obtener el carrito actualizado después de la operación
      const updatedCart = await cartService.getCart(cid);

      return res.send({
        status: "success",
        payload: "El producto fue agregado con éxito",
        cart: updatedCart,
      });
    } catch (error) {
      req.logger.error(error);
    }
  };

  emptyCart = async (req, res) => {
    try {
      const { cid } = req.params;
      await cartService.emptyCart(cid);
      res.status(200).send(await cartService.getCart(cid));
    } catch (error) {
      req.logger.error(error);
    }
  };
  deleteProdFromCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { pid } = req.params;

      const cart = await cartService.getCart(cid);

      const index = cart.products.find((product) => product._id === pid);

      if (index !== -1) {
        cart.products.splice(index, 1);
        await cartService.updateCart(cid, cart);
      } else {
        req.logger.error("Se produjo un error al borrar el producto");
      }
      res.send(await cartService.getCart(cid));
    } catch (error) {
      req.logger.error(error);
    }
  };
}

module.exports = new CartController();
