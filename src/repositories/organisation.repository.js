// repositories/organisation.repository.js
import Organisation from "../models/Organisation.js";

class OrganisationRepository {
  async create(organisationData) {
    return await Organisation.create(organisationData);
  }

   async findByUserId(userId) {
    return await Organisation.findOne({ where: { UserID: userId } });
  }
}

export default new OrganisationRepository();
