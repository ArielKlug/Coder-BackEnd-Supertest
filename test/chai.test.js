const mongoose = require("mongoose");
const User = require("../src/daos/mongo/userManagerMongo");
const chai = require("chai");

mongoose.connect("mongodb://127.0.0.1:27017/pruebasTesting");

const expect = chai.expect;

describe("Set de tests en chai", () => {
  before(function () {
    this.userDao = new User();
  });
  beforeEach(function () {
    //mongoose.connection.collections.users.drop();
    this.timeout(2000);
  });
  it("el dao obtiene todos los users", async function () {
    const result = await this.userDao.get();
    expect(Array.isArray(result)).equals(true);
  });
  //   it("El dao debe crear un usuario correctamente de la DB", async function () {
  //     let userMock = {
  //       first_name: "el",
  //       last_name: "pepe",
  //       age: 23,
  //       email: "sdgasfadsasasdffklmkl@gmail.com",
  //       password: "124312",
  //       cartId: "rqas2413rarf321",
  //       role: "user",
  //     };

  //     const result = await this.userDao.add(userMock);

  //     const user = await this.userDao.getByEmail({ email: userMock.email });
  //     expect(typeof user).equals("object");
  //   });
  //   it("El dao debe modificar un usuario correctamente de la DB", async function () {
  //     let _id = "64f15aa1ee0e7106c388836d";
  //     let updatedUser = {
  //       first_name: "el",
  //       last_name: "pepe",
  //       age: 23,
  //       email: "sdgasfadsasasdffklmkl@gmail.com",
  //       password: "12431asd2",
  //       cartId: "rqdsafas2413rarf321",
  //       role: "user",
  //     };
  //     const result = await this.userDao.update(_id, updatedUser);
  //     const user = await this.userDao.getByEmail({ email: updatedUser.email });
  //     expect(user.password).to.be.equal(updatedUser.password);
  //   });
  it("El dao debe eliminar un usuario correctamente de la DB", async function () {
    let userMock = {
      first_name: "el",
      last_name: "pepe",
      age: 23,
      email: "sdgasfadsasasdffklmkl@gmail.com",
      password: "124312",
      cartId: "rqas2413rarf321",
      role: "user",
    };
    const result = await this.userDao.add(userMock)
    const deletedUser = await this.userDao.delete(result._id);
    
    const user = await this.userDao.getByEmail({
      email: "sdgasfadsasasdffklmkl@gmail.com",
    });
    expect(user).equals(null);
  });
});
