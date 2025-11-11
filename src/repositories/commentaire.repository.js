import { tr } from "@faker-js/faker";
import Commentaire from "../models/Commentaire.js";
import User from "../models/User.js";

class CommentaireRepository {
  async retrieveAllForEvent(eventId) {
    return await Commentaire.findAll({ where: { EventID: eventId }, 
      include: [
        {
          model: User,
          attributes: ["ID", "Username"],
        },
      ],
    });
  }

  async create(commentaire, userId) {
    try {
      var commentaire = {
        CreationDate: new Date(),
        Content: commentaire.Content,
        EventID: commentaire.EventID,
        UserID: userId
      }
      return await Commentaire.create(commentaire);
    } catch (error) {
      console.error("Error creating commentaire:", error);
      throw error;
    }
  }

}

export default new CommentaireRepository();
