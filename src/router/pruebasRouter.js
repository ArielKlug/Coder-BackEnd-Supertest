const { RouterClass } = require("./routerClass");
const {fork} = require("child_process");


class RouterPruebas extends RouterClass {
  init() {
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
