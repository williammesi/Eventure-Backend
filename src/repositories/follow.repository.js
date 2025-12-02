import "../models/index.js";
import { FollowedEvent, FollowedOrganisation } from "../models/index.js";
import eventRepository from "./event.repository.js";
import organisationRepository from "./organisation.repository.js";

class FollowRepository {
  async create(type, id, userID) {
    if ((type = "event")) {
      if (eventRepository.findById(id) != null) {
        FollowedEvent.create(
          {
            EventID: id,
            UserID: userID,
          },
          { fields: ["EventID", "UserID"] }
        );
      } else {
        throw "Évènement invalide";
      }
    } else if ((type = "organisation")) {
      if (organisationRepository.findByUserId(id) != null) {
        FollowedOrganisation.create(
          {
            OrganisationID: id,
            UserID: userID,
          },
          { fields: ["OrganisationID", "UserID"] }
        );
      } else {
        throw "Organisation invalide";
      }
    }
  }

  async delete(type, id, userID) {
    if ((type = "event")) {
      if ((await eventRepository.findById(id)) != null) {
        FollowedEvent.destroy({
          where: {
            EventID: id,
            UserID: userID,
          },
        });
      } else {
        throw "Évènement invalide";
      }
    } else if ((type = "organisation")) {
      if ((await organisationRepository.findByUserId(id)) != null) {
        FollowedOrganisation.destroy({
          where: {
            OrganisationID: id,
            UserID: userID,
          },
        });
      } else {
        throw "Organisation invalide";
      }
    }
  }

  async retrieveByUserID(userID) {
    const followedEvents = await FollowedEvent.findAll({
      attributes: ["EventID", "UserID"],
      where: { UserID: userID },
    });
    const followedOrganisations = await FollowedOrganisation.findAll({
      attributes: ["OrganisationID", "UserID"],
      where: { UserID: userID },
    });

    return {
      followedEvents: followedEvents,
      followedOrganisations: followedOrganisations,
    };
  }
}

export default new FollowRepository();
