import Event from '../models/Event.js';

class EventRepository {
  async create(eventData) {
    try 
    {
      return await Event.create(eventData);
    } catch (error) {
        throw error;
    }
  }

  async findById(id) {
    return await Event.findByPk(id);
  }

  async retrieveAll() {
    return await Event.findAll();
  }

  async update(id, eventData) {
    const [updatedRowsCount] = await Event.update(eventData, {
      where: { ID: id }
    });
    return updatedRowsCount > 0;
  }

  async delete(id) {
    try {

      const deletedRowsCount = await Event.destroy({
      where: { ID: id }
    });
    return deletedRowsCount > 0;
      
    } catch (error) {
      throw error;
    }

  }

  // Retrouve tous les évenements associés à un 
  async findByUserId(userId) {
    return await Event.findAll({
      where: { UserID: userId }
    });
  }


  // Retourne tous les évenements qui ont étés approuvés
  async findByApprovalStatus(approved) {
    return await Event.findAll({
      where: { Approved: approved }
    });
  }
}

export default new EventRepository();