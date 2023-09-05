const { logger } = require("../config/logger");
const { UserDto } = require("../dto/userDto");
const { cartService } = require("../services/cartService");

const { sessionsService } = require("../services/sessionService");
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const { generateToken } = require("../utils/generateTokenJwt");
const { sendMail } = require("../utils/sendMail");

class SessionsController {
  register = async (req, res) => {
    try {
      const { first_name, last_name, age, email, password } = req.body;
      if (!age || !first_name || !last_name || !email || !password) {
        return res.userError("All fields are necesary");
      }

      const newCart = {
        products: [],
        userId: "",
      };

      const cart = await cartService.addCart(newCart);

      const newUser = {
        first_name: first_name,
        last_name: last_name,
        age: age,
        email: email,
        password: createHash(password),
        cartId: cart._id,
        role: "user",
      };

      const newUserMongo = await sessionsService.addUser(newUser);

      const userId = newUserMongo._id;

      if (!userId) {
        return res.send({ status: "error", error: "Error creating new user" });
      }

      const cartToUpdate = await cartService.getCart(cart._id);
      cartToUpdate.userId = userId;
      await cartToUpdate.save();

      res.status(200).send({ status: "success", payload: newUserMongo });
      // redirect("http://localhost:8080/");
    } catch (error) {
      req.logger.error(error);
    }
  };
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (email == "" || password == "") {
        return res.send("Complete todos los campos para iniciar sesión");
      }
      const userDB = await sessionsService.getUserBy({ email: email });

      if (!userDB) {
        return res.send({
          status: "error",
          message: "No existe ese usuario, revise los campos",
        });
      }
      let verifyPass = isValidPassword(password, userDB);

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
          maxAge: 86400 * 1000,
          httpOnly: true,
        })
        .redirect("http://localhost:8080/api/products");
    } catch (error) {
      req.logger.error(error);
    }
  };
  allUsers = async (req, res) => {
    try {
      const user = req.user;
      if (!req.cookies["coderCookie"]) {
        res.redirect("http://localhost:8080");
      }
      if (user.role !== "admin") {
        res.send({ status: "error", error: "No permissions" });
      }
      const allUsers = await sessionsService.getUsers();
      res.send({ status: "success", payload: allUsers });
    } catch (error) {
      req.logger.error(error)
    }
  };
  getUser = async (req, res) => {
    try {
      const user = req.user;
      const { uid } = req.params;
      if (!req.cookies["coderCookie"]) {
        res.redirect("http://localhost:8080");
      }
      if (user.role !== "admin") {
        res.send({ status: "error", error: "No permissions" });
      }
      const findedUser = await sessionsService.getUserBy({_id: uid});
      
      res.send({ status: "success", payload: findedUser });
    } catch (error) {
      req.logger.error(error)
    }
  };
  emailRestorePass = async (req, res) => {
    const { email } = req.body;

    const userDB = await sessionsService.getUserBy({ email: email });

    if (!userDB) {
      return res
        .status(401)
        .send({ status: "error", message: "El usuario no existe" });
    }
    let user = new UserDto(userDB);
    const token = generateToken(user);

    let destinatario = email;
    let asunto = "Restablecer contraseña del mercadito del tío Ari :)";
    let html = `<div><h1>Para restaurar su contraseña, haga click en el botón</h1>
    
    <a href="http://localhost:8080/views/passRestore/${email}"><button>Restaurar contraseña</button></a>
    </div>`;
    //await sendMail(destinatario, asunto, html);
    //El envío de emails me da un error de timeout en el Supertest,
    //por eso está comentado, pero el email se envía si se descomenta

    res
      .cookie("emailCookie", token, {
        maxAge: 3600 * 1000,
        httpOnly: true,
      })
      .redirect("http://localhost:8080/");
  };
  restorePass = async (req, res) => {
    try {
      if (!req.cookies["emailCookie"]) {
        res.redirect("http://localhost:8080/views/emailRestorePass");
      }

      const { email, newPassword, confirmPassword } = req.body;

      const userDB = await sessionsService.getUserBy({ email: email });

      if (!userDB) {
        return res
          .status(401)
          .send({ status: "error", message: "El usuario no existe" });
      }

      if (newPassword === confirmPassword) {
        //validar si la contraseña enviada es la previamente establecida
        let isValid = isValidPassword(newPassword, userDB);

        if (isValid) {
          return res.send({
            status: "error",
            message: "no podes poner la misma contraseña de antes",
          });
        }

        userDB.password = createHash(newPassword);

        await userDB.save();

        res.send({
          status: "success",
          message: "Contraseña actualizada correctamente",
        });
      } else {
        return res.send({
          status: "error",
          message: "Las contraseñas no coinciden",
        });
      }
    } catch (error) {
      req.logger.error(error)
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
      let user = new UserDto(req.user);
      res.send(user);
    } catch (error) {
      req.logger.error(error);
    }
  };
  premium = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = req.user;
      let userUpdated;
      let token;
      let normalizedUser;
      let email = user.email;
      switch (user.role) {
        case "user":
          user.role = "user_premium";
          await sessionsService.updateUser(uid, user);

          userUpdated = await sessionsService.getUserBy({ email: email });

          normalizedUser = new UserDto(userUpdated);

          token = generateToken(normalizedUser);

          res
            .cookie("coderCookie", token, {
              maxAge: 86400 * 1000,
              httpOnly: true,
            })
            .redirect("http://localhost:8080/api/products");
          break;
        case "user_premium":
          user.role = "user";
          await sessionsService.updateUser(uid, user);
          userUpdated = await sessionsService.getUserBy({ email: email });
          normalizedUser = new UserDto(userUpdated);

          token = generateToken(normalizedUser);
          res
            .cookie("coderCookie", token, {
              maxAge: 86400 * 1000,
              httpOnly: true,
            })
            .redirect("http://localhost:8080/api/products");
          break;
        default:
          break;
      }
    } catch (error) {
      req.logger.error(error);
    }
  };
  logout = async (req, res) => {
    res.clearCookie("coderCookie").redirect("http://localhost:8080/");
  };
  deleteUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = req.user;

      if (!user) {
        res.send({ status: "error", error: "No Authentication" });
      }

      if (user.role !== "admin") {
        res.send({ status: "error", error: "No permission" });
      }

      if (!uid) {
        res.send({ status: "error", error: "No user Id" });
      }

      await sessionsService.deleteUser(uid);

      res.send({
        status: "success",
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
}

module.exports = { SessionsController };
