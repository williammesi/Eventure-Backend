import CertificationRequest from "../models/CertificationRequest.js";
import Organisation from "../models/Organisation.js";

const certificationsRepository = {
  async retrieveAll() {
    return await CertificationRequest.findAll();
  },

  async approveCertification(id) {
    const cert = await CertificationRequest.findByPk(id);
    if (!cert) return null;

    cert.Status = "Approved";
    await cert.save();

    // If the target is a user, it may correspond to an Organisation (Organisation.UserID)
    if (cert.TargetType === "user") {
      const org = await Organisation.findOne({
        where: { UserID: cert.TargetID },
      });
      if (org) {
        org.Certified = true; // set to 1 / true
        await org.save();
      }
    }

    return cert;
  },

  async rejectCertification(id) {
    const cert = await CertificationRequest.findByPk(id);
    if (!cert) return null;

    cert.Status = "Declined";
    await cert.save();

    if (cert.TargetType === "user") {
      const org = await Organisation.findOne({
        where: { UserID: cert.TargetID },
      });
      if (org) {
        org.Certified = false; // ensure it's 0 / false
        await org.save();
      }
    }

    return cert;
  },

  async create(certificationData) {
    const newCertificationRequest = await CertificationRequest.create({
      TargetType: certificationData.targetType,
      TargetID: certificationData.targetId,
    });

    return newCertificationRequest.dataValues;
  },
};

export default certificationsRepository;
