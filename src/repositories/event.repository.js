import "../models/index.js";
import Event from "../models/Event.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";
import User from "../models/User.js";
import Client from "../models/Client.js";
import Organisation from "../models/Organisation.js";
import geocodingService from "../services/geocoding.service.js";
import { CertificationRequest } from "../models/index.js";

class EventRepository {
  async create(eventData) {
    try {
      const location = await Location.findOrCreate({
        where: {
          Adress: eventData.Location.Adress,
          City: eventData.Location.City,
          Province: eventData.Location.Province,
          Country: eventData.Location.Country,
          Latitude: eventData.Location.Latitude,
          Longitude: eventData.Location.Longitude,
        },
      });

      eventData.LocationID = location[0].dataValues.ID;
      const newEvent = await Event.create(eventData);

      // Règle métier: seule un utilisateur rôle Client (RoleID = 1) génère une demande de certification pour son événement.
      const user = await User.findByPk(newEvent.dataValues.UserID);
      if (user && user.RoleID === 1) {
        await CertificationRequest.create({
          TargetType: "event",
          TargetID: newEvent.dataValues.ID,
          Status: "Pending",
        });
      }

      return newEvent.dataValues;
    } catch (error) {
      console.log(error);
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

  async updateEvent(eventId, updates) {
    try {
      const event = await Event.findByPk(eventId, {
        include: ["Location"], // Inclure la relation Location
      });

      if (!event) {
        throw HttpErrors.NotFound("Événement non trouvé");
      }

      const updateData = {};

      if (updates.title !== undefined) updateData.Title = updates.title;
      if (updates.description !== undefined)
        updateData.Description = updates.description;
      if (updates.priceMin !== undefined)
        updateData.MinPrice = updates.priceMin;
      if (updates.priceMax !== undefined)
        updateData.MaxPrice = updates.priceMax;
      if (updates.startDate !== undefined)
        updateData.StartingDate = updates.startDate;
      if (updates.endDate !== undefined) updateData.EndDate = updates.endDate;
      if (updates.reservationUrl !== undefined)
        updateData.BookingURL = updates.reservationUrl;
      if (updates.categoryId !== undefined)
        updateData.CategoryID = updates.categoryId;

      // après avoir récupéré `event` avec include: ['Location']
      if (updates.location !== undefined) {
        // Si l'événement a déjà une Location liée, on met à jour cette instance
        if (event.Location) {
          await event.Location.update({
            Adress: updates.location.Adress,
            City: updates.location.City,
            Country: updates.location.Country,
            Province: updates.location.Province,
            Street: updates.location.Street,
            Latitude: updates.location.Latitude,
            Longitude: updates.location.Longitude,
          });
        } else {
          // sinon créer une nouvelle Location et l'associer
          const newLoc = await Location.create({
            Adress: updates.location.Adress,
            City: updates.location.City,
            Country: updates.location.Country,
            Province: updates.location.Province,
            Street: updates.location.Street,
            Latitude: updates.location.Latitude,
            Longitude: updates.location.Longitude,
            EventId: event.id, // ou lFK attendu selon le schema
          });
          // si ton ORM a une méthode setLocation :
          if (typeof event.setLocation === "function") {
            await event.setLocation(newLoc);
          }
        }
      }

      if (Object.keys(updateData).length > 0) {
        await event.update(updateData);
      }

      return await this.transform(event);
    } catch (err) {
      console.error("Erreur dans eventRepository.updateEvent:", err);
      throw err;
    }
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
