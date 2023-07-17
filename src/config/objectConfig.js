const { connect } = require("mongoose");
const { commander } = require("../utils/commander");
const dotenv = require("dotenv");
const { MongoSingleton } = require("../utils/sigleton");
const { mode } = commander.opts();
dotenv.config({
  path: mode === "development" ? "./.env.development" : "./.env.production",
});

const JWT_PRIVATE_KEY = process.env.JWT_SECRET_KEY;

module.exports = {
  JWT_PRIVATE_KEY,
  connectDB: async () => await MongoSingleton.getInstance(),
};
