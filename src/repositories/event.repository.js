import "../models/index.js";
import Event from "../models/Event.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";
import User from "../models/User.js";
import Client from "../models/Client.js";
import Organisation from "../models/Organisation.js";
import geocodingService from "../services/geocoding.service.js";

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
          model: Location,
          attributes: [
            "Adress",
            "City",
            "Province",
            "Country",
            "Latitude",
            "Longitude",
          ],
        },
        {
          model: User,
          attributes: ["ID", "Email"],
          include: [
            {
              model: Client,
              attributes: ["FirstName", "LastName"],
              required: false,
            },
            {
              model: Organisation,
              attributes: ["Name", "PhoneNumber"],
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

  async transform(event) {
    // Flatten Category to just the name and remove CategoryID
    if (event.Category) {
      event.Category = event.Category.Name;
    }
    delete event.CategoryID;

    // Transform User to Creator field
    // Transform User to Creator
    event.Creator = {
      Name: "Unknown",
      Type: "Unknown",
      Email: "N/A",
      PhoneNumber: null,
    }; // Default
    if (event.User) {
      if (event.User.Organisation) {
        event.Creator = {
          Type: "Organisation",
          Name: event.User.Organisation.Name || "Unknown Organisation",
          Email: event.User.Email || "N/A",
          PhoneNumber: event.User.Organisation.PhoneNumber || null,
        };
      } else if (event.User.Client) {
        event.Creator = {
          Type: "Client",
          Name: `${event.User.Client.FirstName || "Unknown"} ${
            event.User.Client.LastName || "User"
          }`,
          Email: event.User.Email || "N/A",
          PhoneNumber: null,
        };
      }
      delete event.User;
    }
    delete event.UserID;

    if (event.Location) {
      event.Location = {
        Street: event.Location.Adress,
        City: event.Location.City,
        Province: event.Location.Province,
        Country: event.Location.Country,
        Latitude: event.Location.Latitude,
        Longitude: event.Location.Longitude,
      };
    }
    delete event.LocationID;

    return event;
  }
}

export default new EventRepository();
