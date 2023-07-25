class ViewsController {
  register = async (req, res) => {
    try {
      res.render("registerForm", {
        style: "index.css",
      });
    } catch (error) {
      return new Error(error);
    }
  };
  login = async (req, res) => {
    try {
      res.render("login", {
        style: "index.css",
      });
    } catch (error) {
      return new Error(error);
    }
  };
  restorePass = async (req, res) => {
    try {
      res.render("passRestore", {
        style: "index.css",
      });
    } catch (error) {
      return new Error(error);
    }
  };
  chat = async (req, res)=>{
    try {
      res.render("chat", {
       
      });
    } catch (error) {
      return new Error(error);
    }
  }
}
module.exports = new ViewsController();
