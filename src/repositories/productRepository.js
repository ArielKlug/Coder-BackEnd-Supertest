class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getProducts = async () => {
    return await this.dao.get();
  };

  getProductById = async (pid) => {
    return await this.dao.getById(pid);
  };
  addProduct = async (newProduct) => {
    return await this.dao.add(newProduct);
  };

  updateProduct = async (pid, prodToReplace) => {
    return await this.dao.update(pid, prodToReplace);
  };
  deleteProduct = async (pid) => {
    return await this.dao.delete(pid);
  };
}

module.exports = ProductRepository;
