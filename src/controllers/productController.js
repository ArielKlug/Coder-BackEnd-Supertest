const products = require("../daos/mongo/productManagerMongo");
const { productModel } = require("../models/productModel");
const productsManager = new products();

class ProductController {
  createProd = async (req, res) => {
    try {
      const prod = req.body;

      if (
        !prod.title ||
        !prod.description ||
        !prod.price ||
        !prod.thumbnail ||
        !prod.code ||
        !prod.stock ||
        !prod.category
      ) {
        return res.status(400).send({
          status: "error",
          mensaje: "Todos los campos son necesarios",
        });
      } else {
        await productsManager.addProduct(prod);
      }

      res.status(200).sendSuccess("Product created successfully");
    } catch (error) {
      console.log(error);
    }
  };

  updateProd = async (req, res) => {
    try {
      const { pid } = req.params;
      if (!pid) {
        return res.send({
          status: "error",
          message: "Insert valid product Id",
        });
      }
      const prodToReplace = req.body;
      if (
        !prodToReplace ||
        !prodToReplace.title ||
        !prodToReplace.description ||
        !prodToReplace.price ||
        !prodToReplace.thumbnail ||
        !prodToReplace.code ||
        !prodToReplace.stock ||
        !prodToReplace.category
      ) {
        return res.send({
          status: "error",
          message: "Insert valid updated fields",
        });
      }

      await productsManager.updateProduct(pid, prodToReplace);

      res.status(200).sendSuccess("Product updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  deleteProd = async (req, res) => {
    const { pid } = req.params;
    await productsManager.deleteProduct(pid);
    res.status(200).sendSuccess("Product deleted successfully");
  };

  getProd = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.sort === "desc" ? -1 : 1;
      const category = req.query.category || "";

      let productos;
      if (category === "") {
        productos = await productModel.paginate(
          {},
          {
            limit: limit,
            page: page,
            lean: true,
            sort: { _id: sort, createdAt: 1 },
          }
        );
      } else {
        productos = await productModel.paginate(
          { category: { $eq: category } },
          {
            limit: limit,
            page: page,
            lean: true,
            sort: { _id: sort, createdAt: 1 },
          }
        );
      }

      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } =
        productos;
      if (!docs) {
        res.send({
          status: "Error",
          message: "Can not find the products",
        });
      }
      const payload = `Se encontraron ${docs.length} productos en la página ${page}`;
      if (req.user) {
        
        const { first_name, last_name, role, cartId } = req.user;
        return res.render("products", {
          status: "success",
          payload: payload,
          products: docs,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          totalPages,
          limit,
          first_name,
          last_name,
          role,
          cartId
        });
      } else {
        res.render("products", {
          status: "success",
          payload: payload,
          products: docs,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          totalPages,
          limit,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new ProductController();
