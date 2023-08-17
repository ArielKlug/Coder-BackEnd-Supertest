const {

  login,
  register,
  chat,
  emailRestorePass,
  passRestore,
} = require("../controllers/viewsController");
const { passportAuth } = require("../passportConfig/passportAuth");
const { RouterClass } = require("./routerClass");

class ViewsRouter extends RouterClass {
  init() {
    this.get("/views/register", ["PUBLIC"], register);
    this.get("/", ["PUBLIC"], login);
    this.get("/views/passRestore/:email", ["PUBLIC"], passRestore);
    this.get("/chat", ["USER"], chat);
    this.get("/views/emailRestorePass", ['PUBLIC'], emailRestorePass)
  }
}

module.exports = { ViewsRouter };
