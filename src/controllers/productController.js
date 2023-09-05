const { productService } = require("../services/productService");
const { productModel } = require("../models/productModel");
const { CustomError } = require("../utils/customError/customError");
const { generateProductErrorInfo } = require("../utils/customError/info");
const { EError } = require("../utils/customError/EErrors");

class ProductController {
  createProduct = async (req, res, next) => {
    try {
      const prod = req.body;
      const user = req.user;

      if (user.role === "user" || user.role !== 'admin' && user.role !== 'user_premium') {
        return res.send({ status: "error", message: "Not permission" });
      }
      
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
          name: "Product creation error",
          cause: generateProductErrorInfo(prod),
          message: "Error trying to create the product",
          code: EError.INVALID_TYPE_ERROR,
        });
      } else {
        const codeCheck = await productService.getProducts();

        if (codeCheck.find((item) => item.code === prod.code)) {
          return res.send({
            status: "error",
            mensaje: "Ya existe un producto con ese código",
          });
        } else {
       
          if (user.role === "user_premium") {
            let newProduct = {
              title: prod.title,
              description: prod.description,
              price: prod.price,
              thumbnail: prod.thumbnail,
              code: prod.code,
              stock: prod.stock,
              category: prod.category,
              owner: user.email,
            };
           const productCreated = await productService.addProduct(newProduct);
            return res.status(200).send({status: 'success', payload: productCreated});
          } else {
            let newProduct = {
              title: prod.title,
              description: prod.description,
              price: prod.price,
              thumbnail: prod.thumbnail,
              code: prod.code,
              stock: prod.stock,
              category: prod.category,
              owner: "admin",
            };
           const productCreated = await productService.addProduct(newProduct);
            return res.status(200).send({status: 'success', payload: productCreated});
          }
        }
      }
    } catch (error) {
      req.logger.error(error);
    }
  };

  updateProduct = async (req, res) => {
    try {
      const  user  = req.user;
      const { pid } = req.params;
      const prodToReplace = req.body;

      if (!pid) {
        return res.send({
          status: "error",
          message: "Insert valid product Id",
        });
      }
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
      if (user.role === "user_premium") {
        const product = await productService.getProductById(pid);

        if (product.owner === user.email) {
          const updatedProduct = await productService.updateProduct(pid, prodToReplace);
          return res.status(200).send({status: 'success', payload: updatedProduct});
        } else {
          return res.send({
            status: "Error",
            error: "El producto a actualizar, no le pertenece",
          });
        }
      }
      if (user.role === "admin") {
        const updatedProduct = await productService.updateProduct(pid, prodToReplace);
        return res.status(200).send({status: 'success', payload: updatedProduct});
      }
    } catch (error) {
      req.logger.error(error);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const user = req.user;
      if (user.role === "user_premium") {
        const product = await productService.getProductById(pid);

        if (product.owner === user.email) {
         const deletedProd = await productService.deleteProduct(pid);
          return res.send({status: 'success', payload: deletedProd});
        } else {
          return res.send({
            status: "Error",
            error: "El producto a eliminar, no le pertenece",
          });
        }
      }
      if (user.role === "admin") {
       const deletedProd = await productService.deleteProduct(pid);
        return res.status(200).send({status: 'success', payload: deletedProd});
      }
    } catch (error) {
      req.logger.error(error);
    }
  };
  getProduct = async (req, res) => {
    try {
      const { pid } = req.params;

      const result = await productService.getProductById(pid);

      return res.send({ status: "success", payload: result });
    } catch (error) {
      req.logger.error(error);
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
        return res.send({
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
        });
      }
    } catch (error) {
      req.logger.error(error);
    }
  };
}

module.exports = ProductController;
