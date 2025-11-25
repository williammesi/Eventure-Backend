import Notification from "../models/Notification";
import NotificationType from "../models/NotificationType";
import User from "../models/User";

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
          model: User,
          attributes: ["ID", "Type"],
        },
      ],
    });
  }
}

export default NotificationRepository();
