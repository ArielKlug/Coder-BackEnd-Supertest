class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUsers = async () => {
    return await this.dao.get();
  };

  getUserByEmail = async (email) => {
    return await this.dao.getByEmail(email);
  };
  addUser = async (newUser) => {
    return await this.dao.add(newUser);
  };

  updateUser = async (uid, userToReplace) => {
    return await this.dao.update(uid, userToReplace);
  };
  deleteUser = async (uid) => {
    return await this.dao.delete(uid);
  };
}


module.exports= {
    UserRepository
}