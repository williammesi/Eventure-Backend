// repositories/client.repository.js
import Client from "../models/Client.js";

class ClientRepository {
  async create(clientData) {
    return await Client.create(clientData);
  }
}

export default new ClientRepository();
