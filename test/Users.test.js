//dao
//mongoose
const mongoose = require("mongoose");

const UserManagerMongo = require("../src/daos/mongo/userManagerMongo");
const Assert = require("assert");

mongoose.connect("mongodb://127.0.0.1:27017/pruebasTesting");

const assert = Assert.strict;

describe("Testing de User Dao", () => {
  before(async function () {
    this.userDao = new UserManagerMongo();
  });
  beforeEach(async function () {
    await mongoose.connection.collections.usuarios.drop();
    this.timeout(5000);
  });
    it("El dao debe traer un usuario correctamente de la DB", async function () {
      const result = await this.userDao.get();
      assert.strictEqual(Array.isArray(result), true);
    });
  it("El dao debe crear un usuario correctamente de la DB", async function () {
    let userMock = {
      first_name: "el",
      last_name: "pepe",
      age: 23,
      email: "sdgklmkl@gmail.com",
      password: "124312",
      cartId: "rqas2413rarf321",
      role: "user",
    };

    const result = await this.userDao.add(userMock);

    const user = await this.userDao.getByEmail({ email: userMock.email });
    assert.strictEqual(typeof user, "object");
  });
  it("El dao debe modificar un usuario correctamente de la DB", async function () {
let updatedUser = {
  
}
  })
  it("El dao debe eliminar un usuario correctamente de la DB", async function () {

  })
});
