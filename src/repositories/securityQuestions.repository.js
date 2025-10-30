import SecretQuestion from '../models/SecretQuestion.js';

class SecurityQuestionsRepository {


  async findById(id) {
    return await SecretQuestion.findByPk(id);
  }

  async retrieveAll() {
    return await SecretQuestion.findAll();
  }

}

export default new SecurityQuestionsRepository();