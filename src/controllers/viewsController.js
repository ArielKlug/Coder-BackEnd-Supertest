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
  restorePass = async (req, res) => {
    try {
      res.render("passRestore", {
        style: "index.css",
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
  chat = async (req, res)=>{
    try {
      res.render("chat", {
       
      });
    } catch (error) {
      req.logger.error(error);
    }
  }
}
module.exports = new ViewsController();
