const { v4: uuidv4 } = require("uuid");
const { cartService } = require("../services/cartService");
const { productService } = require("../services/productService");
const { ticketService } = require("../services/ticketService");

class CartController {
  getOneCart = async (req, res) => {
    try {
      const { cid } = req.params;

      const cart = await cartService.getCart(cid);
      const cartData = cart.toObject();

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      res.render("cart", {
        cart: cartData,
      });
    } catch (error) {
      console.log(error);
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
        console.log(productsNotBuyed);
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
      console.log(error);
    }
  };
  getAllCarts = async (req, res) => {
    try {
      res.send(await cartService.getCarts());
    } catch (error) {
      console.log(error);
    }
  };
  addProdToCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { pid } = req.params;

      const findedCart = await cartService.getCart(cid);
      const foundProductIndex = findedCart.products.findIndex(
        (prod) => prod.product.id === pid
      );

      if (foundProductIndex !== -1) {
        // El producto ya existe en el carrito, se incrementa la cantidad
        await cartService.updateQuantityOfProduct(cid, pid);
      } else {
        // El producto no existe en el carrito, se agrega uno nuevo con cantidad 1

        const cart = await cartService.getCart(cid);

        if (!cart) {
          // El carrito no existe
          console.log("Carrito no encontrado");
          return;
        }

        cart.products.push({ product: pid, quantity: 1 });
        await cart.save();

        console.log("Producto agregado al carrito");
      }

      // Obtener el carrito actualizado después de la operación
      const updatedCart = await cartService.getCart(cid);

      res.send({
        status: "success",
        payload: "El producto fue agregado con éxito",
        cart: updatedCart,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "error",
        payload: "Error al agregar el producto al carrito",
      });
    }
  };

  emptyCart = async (req, res) => {
    try {
      const { cid } = req.params;
      await cartService.emptyCart(cid);
      res.status(200).send(await cartService.getCart(cid));
    } catch (error) {
      console.log(error);
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
        throw new Error("Se produjo un error al borrar el producto");
      }
      res.send(await cartService.getCart(cid));
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new CartController();
