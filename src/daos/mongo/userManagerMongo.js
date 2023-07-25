const { userModel } = require("../../models/userModel");

class UserManagerMongo {
  add = async (newUser) => {
    try {
      const user = await userModel.create(newUser);
      return user._id;
    } catch (error) {
      return new Error(error);
    }
  };
  get = async () => {
    try {
      return await userModel.find();
    } catch (error) {
      return new Error(error);
    }
  };
  getByEmail = async (email) => {
    try {
      return await userModel.findOne(email);
    } catch (error) {
      return new Error(error);
    }
  };

  update = async (uid, userToReplace) => {
    try {
      await userModel.updateOne({ _id: uid }, userToReplace);
    } catch (error) {
      return new Error(error);
    }
  };
  delete = async (uid) => {
    try {
      await userModel.deleteOne({ _id: uid });
    } catch (error) {
      return new Error(error);
    }
  };
}

module.exports = UserManagerMongo;
