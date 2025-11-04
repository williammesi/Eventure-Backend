// repositories/client.repository.js
import Client from "../models/Client.js";

class ClientRepository {
  async create(clientData) {
    return await Client.create(clientData);
  }

  async findByUserId(userId) {
    return await Client.findOne({ where: { UserID: userId } });
  }
}

export default new ClientRepository();
