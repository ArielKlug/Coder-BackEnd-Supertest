const {
  restorePass,
  login,
  register,
  chat,
} = require("../controllers/viewsController");
const { RouterClass } = require("./routerClass");

class ViewsRouter extends RouterClass {
  init() {
    this.get("/views/register", ["PUBLIC"], register);
    this.get("/", ["PUBLIC"], login);
    this.get("/views/passRestore", ["PUBLIC"], restorePass);
    this.get("/chat", ["USER"], chat);
  }
}

module.exports = { ViewsRouter };
