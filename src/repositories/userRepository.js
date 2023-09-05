class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUsers = async () => {
    return await this.dao.get();
  };

  getUserBy = async (param) => {
    return await this.dao.getBy(param);
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