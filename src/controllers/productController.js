const { productService } = require("../services/productService");
const { productModel } = require("../models/productModel");
const { CustomError } = require("../utils/customError/customError");
const { generateProductErrorInfo } = require("../utils/customError/info");
const { EError } = require("../utils/customError/EErrors");

class ProductController {
  createProduct = async (req, res, next) => {
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
        CustomError.createError({
          name: 'Product creation error',
          cause: generateProductErrorInfo(prod),
          message: 'Error trying to create the products',
          code: EError.INVALID_TYPE_ERROR
        })
      } else {
        const codeCheck = await productService.getProducts();

        if (codeCheck.find((item) => item.code === prod.code)) {
          return res.send({
            status: "error",
            mensaje: "Ya existe un producto con ese código",
          });
        } else {
          let newProduct = {
            title: prod.title,
            description: prod.description,
            price: prod.price,
            thumbnail: prod.thumbnail,
            code: prod.code,
            stock: prod.stock,
            category: prod.category,
          };
          await productService.addProduct(newProduct);
        }
      }

      res.status(200).sendSuccess("Product created successfully");
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res) => {
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

      await productService.updateProduct(pid, prodToReplace);

      res.status(200).sendSuccess("Product updated successfully");
    } catch (error) {
      return new Error(error);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const { pid } = req.params;

      await productService.deleteProduct(pid);
      res.status(200).sendSuccess("Product deleted successfully");
    } catch (error) {
      return new Error(error);
    }
  };
  getProduct = async (req, res) => {
    try {
      const { pid } = req.params;

      let result = await productService.getProductById(pid);

      res.send({ status: "success", payload: result });
    } catch (error) {
      return new Error(error);
    }
  };
  getProducts = async (req, res) => {
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
          cartId,
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
      return new Error(error);
    }
  };
}

module.exports = ProductController;
