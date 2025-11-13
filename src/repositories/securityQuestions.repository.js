import SecretQuestion from '../models/SecretQuestion.js';
import userRepository from './user.repository.js';


class SecurityQuestionsRepository {

  async findByUserCredentials(username, email, showAnswer = false) {

    try {
    const user = await userRepository.retrieveByUsernameEmail(username, email);
    if (!user) {
      return null;
    }
    
    const securityQuestion = await SecretQuestion.findOne({
      where: {
        ID : user.SecretQuestionID
      }
    });

    if (!showAnswer) {
      securityQuestion.Answer = undefined;
    }

    else {
      securityQuestion.Answer = user.SecretQuestionAnswer;
    }

    return securityQuestion;

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