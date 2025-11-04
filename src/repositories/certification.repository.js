import CertificationRequest from '../models/CertificationRequest.js';

const certificationsRepository = {
  async retrieveAll() {
    return await CertificationRequest.findAll();
  }
};

export default certificationsRepository;