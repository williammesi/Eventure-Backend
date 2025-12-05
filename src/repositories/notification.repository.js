import Client from "../models/Client.js";
import FollowedEvent from "../models/FollowedEvent.js";
import FollowedOrganisation from "../models/FollowedOrganisation.js";
import Notification from "../models/Notification.js";
import Organisation from "../models/Organisation.js";
import User from "../models/User.js";

class NotificationRepository {
  async retrieveAllForUser(userId) {
    return await Notification.findAll({
      where: { UserID: userId },
      include: [
        {
          as: "Sender",
          model: User,
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

  async createMany(usersIDs, type, content, senderID) {
    usersIDs.forEach((id) => {
      console.log(`UserID: ${id}`);
      console.log(`Type: ${type}`);
      console.log(`Content: ${content}`);
      console.log(`senderID: ${senderID}`);

      Notification.create({
        Type: type,
        Content: content,
        Date: Date.now(),
        UserID: id,
        SenderID: senderID,
      });
    });
  }

  async findUserNotificationList(eventId = -1, organisationId = -1) {
    let fromOrganisation = [];
    let fromEvent = [];

    console.log(eventId);
    console.log(organisationId);

    if (eventId != -1) {
      fromOrganisation = await FollowedOrganisation.findAll({
        where: { OrganisationID: organisationId },
        attributes: ["UserID"],
      });
    }

    if (organisationId != -1) {
      fromEvent = await FollowedEvent.findAll({
        where: { EventId: eventId },
        attributes: ["UserID"],
      });
    }

    let result = [];
    for (let i = 0; i < fromEvent.length; i++) {
      if (result.indexOf(fromEvent[i]) == -1)
        result.push({ id: fromEvent[i].UserID, source: "Event" });
    }
    for (let i = 0; i < fromOrganisation.length; i++) {
      if (result.indexOf(fromOrganisation[i]) == -1)
        result.push({ id: fromOrganisation[i].UserID, source: "Organisation" });
    }
    console.log(result);

    return result;
  }

  async deleteOne(id) {
    try {
      const deletedRowsCount = await Notification.destroy({
        where: { ID: id },
      });
      return deletedRowsCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteAllforUser(userID) {
    try {
      const deletedRowsCount = await Notification.destroy({
        where: { UserID: userID },
      });
      return deletedRowsCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new NotificationRepository();
