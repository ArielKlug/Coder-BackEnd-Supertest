const express = require("express");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const passport = require("passport");
const { Server } = require("socket.io");
const dataBase = require("./config/objectConfig.js");
const router = require("./router/index.js");
const { initPassport } = require("./passportConfig/passportConfig.js");
const cors = require("cors");

dataBase.connectDB();

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening ${PORT}`);
});

initPassport();
passport.use(passport.initialize());
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(cookieParser(process.env.COOKIEPARSER_WORD));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(__dirname + "/public"));
app.use(router);
