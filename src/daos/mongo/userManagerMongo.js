const { userModel } = require("../../models/userModel");

class UserManagerMongo {
  add = async (newUser) => {
    return await userModel.create(newUser);
     ;
  };
  get = async () => {
    return await userModel.find();
  };
  getBy = async (param) => {
    return await userModel.findOne(param);
  };

  update = async (uid, userToReplace) => {
    await userModel.updateOne({ _id: uid }, userToReplace);
  };
  delete = async (uid) => {
    await userModel.deleteOne({ _id: uid });
  };
}

module.exports = UserManagerMongo;
