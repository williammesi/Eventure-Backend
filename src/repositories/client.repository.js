// repositories/client.repository.js
import { Op } from "sequelize";
import Client from "../models/Client.js";

class ClientRepository {
  async create(clientData) {
    return await Client.create(clientData);
  }

  async findByUserId(userId) {
    return await Client.findOne({ where: { UserID: userId } });
  }

  async searchByName(searchPattern) {
    return await Client.findAll({
      where: {
        [Op.or]: [
          { FirstName: { [Op.like]: searchPattern } },
          { LastName: { [Op.like]: searchPattern } }
        ]
      }
    });
  }
}

export default new ClientRepository();
