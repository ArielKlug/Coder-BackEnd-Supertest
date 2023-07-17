const { promises } = require("fs");
const fs = promises;
const fsSync = require("fs");
class productManager {
  #margenGanancia = 0.3;
  constructor(path) {
    this.products = [];
    this.path = path;
    this.createFile();
    this.loadProducts();
  }

  createFile = async () => {
    try {
      if (!fsSync.existsSync(this.path)) {
        await fs.writeFile(this.path, "{}", "utf-8");
      }
    } catch (err) {
      console.log(err);
    }
  };
  loadProducts = async () => {
    try {
      await this.createFile();
      let data = await fs.readFile(this.path, "utf-8");

      if (data.length > 0) {
        const parsedData = JSON.parse(data);

        this.products = parsedData;
      } else {
        this.products = [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  saveProducts = async () => {
    try {
      const dataJson = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.path, dataJson, "utf-8");
    } catch (err) {
      console.log(err);
    }
  };

  getProducts = async () => {
    try {
      await this.loadProducts();
      return this.products;
    } catch (err) {
      console.log(err);
    }
  };

  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status
  ) => {
    try {
      await this.loadProducts;
      const product = {
        title,
        description,
        price: price + price * this.#margenGanancia,
        thumbnail,
        code,
        stock,
        category,
        status,
      };

      if (this.products.length === 0) {
        product.id = 1;
      } else {
        product.id = this.products[this.products.length - 1].id + 1;
      }
      const codeCheck = this.products.find((item) => item.code === code);
      if (!codeCheck) {
        this.products.push(product);
        this.saveProducts();
      } else {
        console.log(
          `ERROR: Ya existe un producto con ese código. Código: ${code}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  getProductById = async (pid) => {
    try {
      await this.loadProducts();
      const findProduct = this.products.find((e) => e.id === pid);

      if (!findProduct || findProduct === 0) {
        console.error("El producto que buscas, lamentablemente no existe");
        return;
      } else {
        return findProduct;
      }
    } catch (err) {
      console.log(err);
    }
  };
  updateProduct = async (id, updatedFields) => {
    try {
      await this.loadProducts();
      const index = this.products.findIndex((producto) => producto.id === id);

      if (index !== -1) {
        const existingProduct = this.products[index];
        const updatedProduct = { ...existingProduct, ...updatedFields };
        this.products[index] = updatedProduct;

        await this.saveProducts();
      } else {
        console.log("Error, el producto a actualizar no esiste");
      }
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (id) => {
    try {
      await this.loadProducts();
      const index = this.products.findIndex((producto) => producto.id === id);

      if (index !== -1 && id !== null) {
        this.products.splice(index, 1);
        await this.saveProducts();
      }
    } catch (err) {
      console.log(`Error al eliminar el producto: ${err}`);
    }
  };
}

module.exports = productManager;
