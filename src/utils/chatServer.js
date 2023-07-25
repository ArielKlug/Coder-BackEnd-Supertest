const { messageService } = require("../services/messageService");

const socketChat = async (io) => {
  io.on("connection", (socket) => {
    socket.on("message", async (data) => {
      try {
        await messageService.addMessage(data);
        let messages = await messageService.getMessages();
        socket.emit("messageLogs", messages);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("authenticated", (data) => {
      socket.broadcast.emit("newUserConnected", data);
    });
  });
};
module.exports = {
  socketChat,
};
