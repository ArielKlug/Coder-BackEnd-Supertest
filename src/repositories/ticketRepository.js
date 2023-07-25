class TicketRepository {
    constructor(dao) {
      this.dao = dao;
    }
    getTickets = async () => {
      return await this.dao.get();
    };
  
    getTicketById = async (tid) => {
      return await this.dao.getById(tid);
    };
    addTicket = async (newTicket) => {
      return await this.dao.add(newTicket);
    };
  
    updateTicket = async (tid, updatedTicket) => {
      return await this.dao.update(tid, updatedTicket);
    };
    deleteTicket = async (tid) => {
      return await this.dao.delete(tid);
    };
  }
  
  module.exports = TicketRepository;
  