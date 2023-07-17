const { connect } = require("mongoose");

class MongoSingleton {
  static #instance;
  constructor() {
  
    connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  static getInstance() {
    if (this.#instance) {
      console.log("Base de datos previamente conectada");
      return this.#instance;
    }
    this.#instance = new MongoSingleton()
    console.log('Base de datos conectada correctamente')
    return this.#instance;
  }
}


module.exports = {
    MongoSingleton
}