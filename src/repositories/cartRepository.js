class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCart = async (cid) => {
    return await this.dao.getById(cid);
  };

  getCarts = async () => {
    return await this.dao.get();
  };
  addCart = async () => {
    return await this.dao.add();
  };
  
  updateQuantityOfProduct = async (cid, pid) => {
    return await this.dao.updateProductQuantity(cid, pid);
  };

  emptyCart = async (cid) => {
    return await this.dao.emptyCart(cid);
  };
  updateCart = async (cid, cart) => {
    return await this.dao.updateCart(cid, cart);
  };
}

module.exports = { CartRepository };
