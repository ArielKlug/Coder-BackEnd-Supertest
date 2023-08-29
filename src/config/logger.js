const winston = require("winston");
const { enviroment } = require("../config/objectConfig");

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

const dev = new winston.transports.Console({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize({ colors: customLevelOptions.colors }),
    winston.format.simple()
  ),
});
const prod = [
  new winston.transports.Console({
    level: "info",
    format: winston.format.combine(
      winston.format.colorize({ colors: customLevelOptions.colors }),
      winston.format.simple()
    ),
  }),
  new winston.transports.File({
    filename: "./errors.log",
    level: "error",
    format: winston.format.simple(),
  }),
];

const logger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: enviroment === "DEVELOPMENT" ? dev : prod,
});

// let logger
// if (enviroment === "DEVELOPMENT") {
//     logger = winston.createLogger({
//         levels: customLevelOptions.levels,
//         transports: [
//           new winston.transports.Console({
//             level: "debug",
//             format: winston.format.combine(
//               winston.format.colorize({ colors: customLevelOptions.colors }),
//               winston.format.simple()
//             ),
//           }),

//         ],
//       });
// } else {
//     logger = winston.createLogger({
//         levels: customLevelOptions.levels,
//         transports: [
//           new winston.transports.Console({
//             level: "info",
//             format: winston.format.combine(
//               winston.format.colorize({ colors: customLevelOptions.colors }),
//               winston.format.simple()
//             ),
//           }),
//           new winston.transports.File({
//             filename: "./errors.log",
//             level: "error",
//             format: winston.format.simple(),
//           }),
//         ],
//       });
// }

module.exports = {
  logger,
};
