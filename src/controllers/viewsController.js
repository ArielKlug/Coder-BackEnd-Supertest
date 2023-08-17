class ViewsController {
  register = async (req, res) => {
    try {
      res.render("registerForm", {
        style: "index.css",
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
  login = async (req, res) => {
    try {
      res.render("login", {
        style: "index.css",
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
  emailRestorePass = async (req, res) => {
    try {
      res.render("emailRestorePass", {
        style: "index.css",
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
  passRestore = async (req, res) => {
    try {
      if (req.cookies["emailCookie"]) {
        const { email } = req.params;
        res.render("passRestore", {
          style: "index.css",
          email,
        });
      }
      res.render("emailRestorePass", {
        style: "index.css",
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
  chat = async (req, res) => {
    try {
      res.render("chat", {});
    } catch (error) {
      req.logger.error(error);
    }
  };
}
module.exports = new ViewsController();
