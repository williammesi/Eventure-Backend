import Commentaire from "../models/Commentaire.js";

class CommentaireRepository {
  async retrieveAllForEvent(eventId) {
    return await Commentaire.findAll({ where: { EventID: eventId } });
  }
}

export default new CommentaireRepository();
