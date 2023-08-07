const { ticketModel } = require("../../models/ticketModel");

class TicketManagerMongo {
  add = async (newTicket) => {
    return await ticketModel.create(newTicket);
  };
  get = async () => {
    return await ticketModel.find();
  };
  getById = async (tid) => {
    return await ticketModel.findOne({ _id: tid });
  };
  update = async (updatedTicket) => {
    return await ticketModel.findByIdAndUpdate({ _id: tid }, updatedTicket);
  };
  delete = async (tid) => {
    return await ticketModel.deleteOne({ _id: tid });
  };
}

module.exports = TicketManagerMongo;
