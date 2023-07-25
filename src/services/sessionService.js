const { UserDao } = require("../daos/factory");
const { UserRepository } = require("../repositories/userRepository");

const sessionsService = new UserRepository(new UserDao());

module.exports = {
  sessionsService,
};
