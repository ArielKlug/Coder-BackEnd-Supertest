const { promises } = require("fs");
const fs = promises;
const fsSync = require("fs");
class UserManagerFile {
  constructor(path) {
    this.Users = [];
    this.path = path;
    this.createFile();
    this.loadUsers();
  }

  createFile = async () => {
    try {
      if (!fsSync.existsSync(this.path)) {
        await fs.writeFile(this.path, "{}", "utf-8");
      }
    } catch (err) {
      console.log(err);
    }
  };
  loadUsers = async () => {
    try {
      await this.createFile();
      let data = await fs.readFile(this.path, "utf-8");

      if (data.length > 0) {
        const parsedData = JSON.parse(data);

        this.Users = parsedData;
      } else {
        this.Users = [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  saveUsers = async () => {
    try {
      const dataJson = JSON.stringify(this.Users, null, 2);
      await fs.writeFile(this.path, dataJson, "utf-8");
    } catch (err) {
      console.log(err);
    }
  };
  add = async (newUser) => {
    await this.loadUsers();
    const user = newUser;
    this.Users.push(user);
    this.saveUsers();
  };
  getByEmail = async (email) => {
    try {
      await this.loadUsers();
      const findUser = this.Users.find((e) => e.email === email);

      if (!findUser || findUser === 0) {
        console.error("El usuario que buscas, lamentablemente no existe");
        return;
      } else {
        return findUser;
      }
    } catch (err) {
      console.log(err);
    }
  };
  update = async (id, updatedFields) => {
    try {
      await this.loadUsers();
      const index = this.Users.findIndex((Usero) => Usero.id === id);

      if (index !== -1) {
        const existingUser = this.Users[index];
        const updatedUser = { ...existingUser, ...updatedFields };
        this.Users[index] = updatedUser;

        await this.saveUsers();
      } else {
        console.log("Error, el usuario a actualizar no esiste");
      }
    } catch (error) {
      console.log(error);
    }
  };

  delete = async (id) => {
    try {
      await this.loadUsers();
      const index = this.Users.findIndex((Usero) => Usero.id === id);

      if (index !== -1 && id !== null) {
        this.Users.splice(index, 1);
        await this.saveUsers();
      }
    } catch (err) {
      console.log(`Error al eliminar el Usero: ${err}`);
    }
  };
}

module.exports =  UserManagerFile ;
