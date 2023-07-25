const { messageModel } = require("../../models/messagesModel");

class MessagesManagerMongo {
  add = async (newMessage) => {
    try {
      await messageModel.create(newMessage);
    } catch (err) {
      console.log(err);
    }
  };
  get = async () => {
    try {
      return await messageModel.find();
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = MessagesManagerMongo;
