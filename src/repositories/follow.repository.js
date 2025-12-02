import "../models/index.js";
import { FollowedEvent, FollowedOrganisation } from "../models/index.js";
import eventRepository from "./event.repository.js";
import organisationRepository from "./organisation.repository.js";

class FollowRepository {
  async create(type, id, userID) {
    if ((type = "event")) {
      if (eventRepository.findById(id) != null) {
        FollowedEvent.create({
          EventID: id,
          UserID: userID,
        });
      } else {
        throw "Évènement invalide";
      }
    } else if ((type = "organisation")) {
      if (organisationRepository.findByUserId(id) != null) {
        FollowedOrganisation.create({
          OrganisationID: id,
          UserID: userID,
        });
      } else {
        throw "Organisation invalide";
      }
    }
  }
}

export default new FollowRepository();
