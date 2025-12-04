// repositories/organisation.repository.js
import { Op } from "sequelize";
import Organisation from "../models/Organisation.js";

class OrganisationRepository {
  async create(organisationData) {
    return await Organisation.create(organisationData);
  }

   async findByUserId(userId) {
    return await Organisation.findOne({ where: { UserID: userId } });
  }

  async searchByName(searchPattern) {
    return await Organisation.findAll({
      where: {
        Name: { [Op.like]: searchPattern }
      }
    });
  }
}

export default new OrganisationRepository();
