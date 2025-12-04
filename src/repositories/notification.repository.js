import FollowedEvent from "../models/FollowedEvent.js";
import FollowedOrganisation from "../models/FollowedOrganisation.js";
import Notification from "../models/Notification.js";
import NotificationType from "../models/NotificationType.js";
import User from "../models/User.js";

class NotificationRepository {
  async retrieveAllForUser(userId) {
    return await Notification.findAll({
      where: { UserID: userId },
      include: [
        /*{
          model: NotificationType,
          attributes: ["ID", "Name"],
        },*/
        {
          as: "Sender",
          model: User,
          attributes: ["ID", "RoleID"],
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
}

export default new NotificationRepository();
