// const commander = require("commander");

// const program = new commander.Command();

// program
//   .option("-d", "Variable para debug", false)
//   .option("-p, --port <port>", "Puerto para el servidor", 8080)
//   .option("--mode <mode>", "Modo de trabajo", "production")
//   .requiredOption(
//     "-u <user>",
//     "Usuario utilizando el aplicativo",
//     "No se ha declarado un usuario"
//   )
//   .option("-l, --letters [letter...]", "specify the letters")
  


// program.parse();
// console.log("opciones: ", program.opts());
// console.log("Argumentos definidos", program.args);

// // node commander.js -d -p 1234 --mode development -u root --letters s s h



process.on('exit', code =>{
  console.log('ésto se ejecuta justito antes de que termine todo el proceso que se ejecute', code)
})
process.on('uncaughtException', exception =>{
  console.log('ésto se ejecuta al encontrar un error/excepción', exception)
})
process.on('message', message =>{
  console.log('ésto se ejecuta para mostrar un mensaje de otro proceso', message)
})
console()

