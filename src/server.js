const express = require("express");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const passport = require("passport");
const compression = require("express-compression");
const cors = require("cors");


const { initPassport } = require("./passportConfig/passportConfig.js");
const { socketChat } = require("./utils/chatServer.js");
const { errorHandler } = require("./middlewares/errorMiddleware.js");
const { addLogger } = require("./middlewares/loggerMiddleware.js");
const { logger } = require("./config/logger.js");
const router = require("./router/index.js");


const { Server: ServerHTTP } = require('http')
const { Server: ServerIO } = require('socket.io')

const app = express();
const serverHttp = new ServerHTTP(app)
const io = new ServerIO(serverHttp);



const PORT = process.env.PORT;



socketChat(io);
initPassport();
passport.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);
app.use(cookieParser(process.env.COOKIEPARSER_WORD));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(__dirname + "/public"));
app.use(addLogger);
app.use(errorHandler);
app.use(router);

// exports.initServer = () => serverHttp.listen(PORT, () => {
//     logger.info(`Server listening ${PORT}`);
//   });
 
  

 serverHttp.listen(PORT, () => {
    logger.info(`Server listening ${PORT}`);
  });