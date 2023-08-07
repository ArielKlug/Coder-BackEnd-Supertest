const { userModel } = require("../../models/userModel");

class UserManagerMongo {
  add = async (newUser) => {
    const user = await userModel.create(newUser);
    return user._id;
  };
  get = async () => {
    return await userModel.find();
  };
  getByEmail = async (email) => {
    return await userModel.findOne(email);
  };

  update = async (uid, userToReplace) => {
    await userModel.updateOne({ _id: uid }, userToReplace);
  };
  delete = async (uid) => {
    await userModel.deleteOne({ _id: uid });
  };
}

module.exports = UserManagerMongo;
