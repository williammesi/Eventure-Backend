import argon from 'argon2';

import { Client } from '../models/client.model.js';


class ClientRepository {

    async validateClient(clientId, clientSecret) {
        const client = await Client.findOne({ clientId: clientId });       
        return await argon.verify(client.clientSecret, clientSecret);    
    }

}

export default new ClientRepository();