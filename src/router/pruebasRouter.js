const { sendMail } = require("../utils/sendMail");
const { RouterClass } = require("./routerClass");
const { fork } = require("child_process");
const { sessionsService } = require("../services/sessionService");
const { passportAuth } = require("../passportConfig/passportAuth");
const { sendSms } = require("../utils/sendSms");

//funcion para configurar Mail
class RouterPruebas extends RouterClass {
  init() {
    this.get("/sms", ["PUBLIC"], async (req, res) => {
      
      await sendSms()
      
      res.send('SMS enviado')
    });
    this.get("/mail", ["PUBLIC"], passportAuth('jwt'), async (req, res) => {
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
