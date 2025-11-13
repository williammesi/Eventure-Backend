import SecretQuestion from '../models/SecretQuestion.js';
import userRepository from './user.repository.js';


class SecurityQuestionsRepository {

  async findByUserCredentials(username, email) {

    try {
    const user = await userRepository.retrieveByUsernameEmail(username, email);
    if (!user) {
      return null;
    }
    return await SecretQuestion.findOne({
      where: {
        ID : user.SecretQuestionID
      }
    });
  } catch (err) {
    console.error("Error in findByUserCredentials:", err);
    throw err;
  }
  }

  async findById(id) {
    return await SecretQuestion.findByPk(id);
  }

 

  async retrieveAll() {
    return await SecretQuestion.findAll();
  }

}

export default new SecurityQuestionsRepository();