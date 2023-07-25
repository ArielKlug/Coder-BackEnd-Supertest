const { ticketModel } = require("../../models/ticketModel");

class TicketManagerMongo {
  add = async (newTicket) => {
    try {
      return await ticketModel.create(newTicket);
    } catch (error) {
      throw new Error(error);
    }
  };
  get = async () => {
    try {
      return await ticketModel.find();
    } catch (error) {
      throw new Error(error);
    }
  };
  getById = async (tid) => {
    try {
      return await ticketModel.findOne({ _id: tid });
    } catch (error) {
      throw new Error(error);
    }
  };
  update = async (updatedTicket) => {
    try {
      return await ticketModel.findByIdAndUpdate({ _id: tid }, updatedTicket);
    } catch (error) {
      throw new Error(error);
    }
  };
  delete = async (tid) => {
    try {
      return await ticketModel.deleteOne({ _id: tid });
    } catch (error) {
      throw new Error(error);
    }
  };
}

module.exports = TicketManagerMongo;
