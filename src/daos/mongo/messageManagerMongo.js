const { messageModel } = require("../../models/messagesModel");

class MessagesManagerMongo {
  add = async (newMessage) => {
    await messageModel.create(newMessage);
  };
  get = async () => {
    return await messageModel.find();
  };
}

module.exports = MessagesManagerMongo;
