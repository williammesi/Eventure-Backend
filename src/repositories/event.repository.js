import "../models/index.js";
import Event from "../models/Event.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Client from "../models/Client.js";
import Organisation from "../models/Organisation.js";

class EventRepository {
  async create(eventData) {
    try {
      return await Event.create(eventData);
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    return await Event.findByPk(id);
  }

  async retrieveAll() {
    return await Event.findAll({
      include: [
        {
          model: Category,
          attributes: ["Name"],
        },
        {
          model: User,
          attributes: ["ID"],
          include: [
            {
              model: Client,
              attributes: ["FirstName", "LastName"],
              required: false,
            },
            {
              model: Organisation,
              attributes: ["Name"],
              required: false,
            },
          ],
        },
      ],
    });
  }

  async update(id, eventData) {
    const [updatedRowsCount] = await Event.update(eventData, {
      where: { ID: id },
    });
    return updatedRowsCount > 0;
  }

  async delete(id) {
    try {
      const deletedRowsCount = await Event.destroy({
        where: { ID: id },
      });
      return deletedRowsCount > 0;
    } catch (error) {
      throw error;
    }
  }

  // Retrouve tous les évenements associés à un
  async findByUserId(userId) {
    return await Event.findAll({
      where: { UserID: userId },
    });
  }

  // Retourne tous les évenements qui ont étés approuvés
  async findByApprovalStatus(approved) {
    return await Event.findAll({
      where: { Approved: approved },
    });
  }

  transform(event) {
    // Flatten Category to just the name and remove CategoryID
    if (event.Category) {
      event.Category = event.Category.Name;
    }
    delete event.CategoryID;

    // Transform User to Creator field
    if (event.User) {
      if (event.User.Organisation) {
        event.Creator = event.User.Organisation.Name;
      } else if (event.User.Client) {
        event.Creator = `${event.User.Client.FirstName} ${event.User.Client.LastName}`;
      } else {
        event.Creator = "Unknown";
      }
      delete event.User;
    }
    delete event.UserID;

    return event;
  }
}

export default new EventRepository();
