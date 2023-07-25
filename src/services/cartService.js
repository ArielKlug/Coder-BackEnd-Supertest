const { CartDao } = require("../daos/factory");
const { CartRepository } = require("../repositories/cartRepository");

const cartService = new CartRepository(new CartDao());

module.exports = { cartService };
