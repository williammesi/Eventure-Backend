import CertificationRequest from "../models/CertificationRequest.js";
import Organisation from "../models/Organisation.js";
import Event from "../models/Event.js";

const certificationsRepository = {
  async retrieveAll() {
    return await CertificationRequest.findAll();
  },

  async deleteByEventId(eventId) {
    return await CertificationRequest.destroy({
      where: { TargetID: eventId, TargetType: "event" },
    });
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
    // If the target is an event, it is event.Approved
    if (cert.TargetType === "event") {
      const event = await Event.findByPk(cert.TargetID);
      if (event) {
        event.Approved = true; // set to 1 / true
        await event.save();
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
    if (cert.TargetType === "event") {
      const event = await Event.findByPk(cert.TargetID);
      if (event) {
        event.Approved = false; // ensure it's 0 / false
        await event.save();
      }
    }

    return cert;
  },
};

export default certificationsRepository;
