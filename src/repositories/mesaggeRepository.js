class MessageRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getMessages = async () => {
    return await this.dao.get();
  };

  addMessage = async (newMessage) => {
    return await this.dao.add(newMessage);
  };
}

module.exports = MessageRepository;
