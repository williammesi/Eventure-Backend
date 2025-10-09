// repositories/organisation.repository.js
import Organisation from "../models/Organisation.js";

class OrganisationRepository {
  async create(organisationData) {
    return await Organisation.create(organisationData);
  }
}

export default new OrganisationRepository();
