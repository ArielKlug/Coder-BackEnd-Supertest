const { sendMail } = require("../utils/sendMail");
const { RouterClass } = require("./routerClass");
const { fork } = require("child_process");
const { sessionsService } = require("../services/sessionService");
const { passportAuth } = require("../passportConfig/passportAuth");
const { sendSms } = require("../utils/sendSms");
const { generateUser } = require("../utils/TestingUtils/generateUserFaker");
const {
  generateProducts,
} = require("../utils/TestingUtils/generateProductFaker");


//funcion para configurar Mail
class RouterPruebas extends RouterClass {
  init() {
    this.get('/logger-test', ['PUBLIC'], (req, res) =>{
      req.logger.debug('éste es un texto de Debug desde logger')
      req.logger.http('éste es un texto de Http desde logger')
      req.logger.info('éste es un texto de Info desde logger')
      req.logger.warning('éste es un texto de Warning desde logger')
      req.logger.error('éste es un texto de Error desde logger')
      req.logger.fatal('éste es un texto de Fatal desde logger')
    
    })
    this.get("/testuser", ["PUBLIC"], (req, res) => {
     generateUser()
      
      res.send({ first_name, last_name, age, email, password });
    });
    this.get("/simple", ["PUBLIC"], (req, res) => {
      let suma = 0;
      for (let i = 0; i < 10000000; i++) {
        suma += i;
      }
      res.send({ suma: suma });
    });
    this.get("/compleja", ["PUBLIC"], (req, res) => {
      let suma = 0;
      for (let i = 0; i < 5e8; i++) {
        suma += i;
      }
      res.send({ suma: suma });
    });
    this.get("/logger", ["PUBLIC"], async (req, res) => {
      req.logger.warning("warning capo");
      res.send({ message: "prueba logger" });
    });
    this.get("/mockUsers", ["PUBLIC"], (req, res) => {
      let users = [];
      for (let i = 0; i < 100; i++) {
        users.push(generateUser());
      }

      res.send(users);
    });
    this.get("/mockingProducts", ["PUBLIC"], (req, res) => {
      let products = [];
      for (let i = 0; i < 100; i++) {
        products.push(generateProducts());
      }

      res.send(products);
    });
    this.get("/sms", ["PUBLIC"], async (req, res) => {
      await sendSms();

      res.send("SMS enviado");
    });
    this.get("/mail", ["PUBLIC"], passportAuth("jwt"), async (req, res) => {
      //A quién se le envía el Mail

      let destinatario = req.user.email;
      let asunto = "Coder test";
      let html = `<div><h1>Mail relevante :)</h1></div>`;
      await sendMail(destinatario, asunto, html);

      res.send("mail aaaa");
    });
    function operacionCompleja() {
      let result = 0;
      for (let i = 0; i < 5e9; i++) {
        result += i;
      }
      return result;
    }
    this.get("/sumablock", ["PUBLIC"], async (req, res) => {
      const result = operacionCompleja();
      res.send(`resultado de suma blockeadora ${result}`);
    });

    this.get("/suma", ["PUBLIC"], async (req, res) => {
      const child = fork("./src/utils/operacionCompleja");
      //el mensaje puede ser cualquier cosa al enviarlo al hijo
      child.send("inicia el calculo");
      //para escuchar el mensaje del hijo, debe ser el Listener
      //que corresponde, en este caso 'message'
      child.on("message", (result) => {
        res.send(`El resultado de la terrible suma es ${result}`);
      });
    });
  }
}

module.exports = {
  RouterPruebas,
};
