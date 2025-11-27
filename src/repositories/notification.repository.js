import FollowedOrganisation from "../models/FollowedOrganisation.js";
import Notification from "../models/Notification.js";
import NotificationType from "../models/NotificationType.js";
import User from "../models/User.js";

class NotificationRepository {
  async retrieveAllForUser(userId) {
    return await Notification.findAll({
      where: { UserID: userId },
      include: [
        {
          model: NotificationType,
          attributes: ["ID", "Name"],
        },
        {
          as: "Sender",
          model: User,
          attributes: ["ID", "Type"],
        },
      ],
    });
  }

  async createMany(usersIDs, typeID, content, senderID) {
    usersIDs.forEach((id) => {
      Notification.create({
        TypeID: typeID,
        Content: content,
        Date: Date.now(),
        userID: id,
        SenderID: senderID,
      });
    });
  }

  async findUserNotificationList(eventId = -1, organisationId = -1) {
    let fromOrganisation = [];
    let fromEvent = [];

    if (eventId != -1) {
      fromOrganisation = await FollowedOrganisation.findAll({
        where: (OrganisationID = organisationId),
      });
    }

    if (organisationId != -1) {
      fromEvent = await FollowedEvent.findAll({
        where: (EventId = eventId),
      });
    }

    const result = [];
    for (let i = 0; i < fromEvent.length; i++) {
      if (result.indexOf(fromEvent[i]) == -1)
        result.push({ id: fromEvent[i], source: "Event" });
    }
    for (let i = 0; i < fromOrganisation.length; i++) {
      if (result.indexOf(fromOrganisation[i]) == -1)
        result.push({ id: fromOrganisation[i], source: "Organisation" });
    }
    return result;
  }
}

export default new NotificationRepository();
