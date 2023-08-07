const { UserDto } = require("../dto/userDto");
const { cartService } = require("../services/cartService");

const { sessionsService } = require("../services/sessionService");
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const { generateToken } = require("../utils/generateTokenJwt");

class SessionsController {
  register = async (req, res) => {
    try {
      const {  first_name, last_name, age, email, password } = req.body;
      const newCart = {
        products: [],
        userId: "",
      };

      const cart = await cartService.addCart(newCart);
      if (!age || !first_name || !last_name || !email || !password) {
        res.userError("All fields are necesary");
      }

      const newUser = {
        first_name: first_name,
        last_name: last_name,
        age: age,
        email: email,
        password: createHash(password),
        cartId: cart._id,
        role: "user",
      };

      const userId = await sessionsService.addUser(newUser);

      if (!userId) {
        res.send({ status: "error", error: "Error creating new user" });
      }

      //anterior updateCart para ponerle el Id del usuario
      const cartToUpdate = await cartService.getCart(cart._id);
      cartToUpdate.userId = userId;
      await cartToUpdate.save();
      res.status(200).redirect("http://localhost:8080/");
    } catch (error) {
      res.sendServerError(error);
    }
  };
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (email == "" || password == "") {
        return res.send("Complete todos los campos para iniciar sesión");
      }
      const userDB = await sessionsService.getUserByEmail({ email });

      let verifyPass = isValidPassword(password, userDB);

      if (!userDB) {
        return res.send({
          status: "error",
          message: "No existe ese usuario, revise los campos",
        });
      }
      if (!verifyPass) {
        return res.sendUserError("Email or password incorrect");
      }
      let userToToken = {
        first_name: userDB.first_name,
        last_name: userDB.last_name,
        email: userDB.email,
        cartId: userDB.cartId,
        role: userDB.role,
      };

      const access_token = generateToken(userToToken);
      if (!access_token) {
        return res.send({
          status: "error",
          message: "Token generation error",
        });
      }

      res
        .cookie("coderCookie", access_token, {
          maxAge: 60 * 60 * 100 * 10000,
          httpOnly: true,
        })
        .redirect("http://localhost:8080/api/products");
    } catch (error) {
      req.logger.error(error);
    }
  };
  allUsers = async (req, res) => {
    try {
      const allUsers = await sessionsService.getUsers();
      res.send({ status: "success", payload: allUsers });
    } catch (error) {
      req.logger.error(error);
    }
  };
  restorePass = async (req, res) => {
    try {
      const { email, password } = req.body;

      const userDB = await sessionsService.getUserByEmail({ email });

      if (!userDB) {
        return res
          .status(401)
          .send({ status: "error", message: "El usuario no existe" });
      }

      userDB.password = createHash(password);
      await userDB.save();

      res.status(200).send({
        status: "success",
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
  failRegister = async (req, res) => {
    try {
      req.logger.info("Falla en estrategia de autenticación");
      res.send({
        status: "error",
        message: "Falló la autenticación del registro",
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
  failLogin = async (req, res) => {
    try {
      req.logger.info("Falla en estrategia de autenticación");
      res.send({
        status: "error",
        message: "Falló la autenticación del login",
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
  current = async (req, res) => {
    try {
      
      let user = new UserDto(req.user)
      res.send(user);
    } catch (error) {
      req.logger.error(error);
    }
  };
}

module.exports = { SessionsController };
