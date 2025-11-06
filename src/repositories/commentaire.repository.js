import Commentaire from "../models/Commentaire.js";

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



}

export default new CommentaireRepository();
