import Report from "../models/Report.js";
import User from "../models/User.js";

class ReportRepository {
  async retrieveAll() {
    return await Report.findAll({
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["ID", "Username", "Email"],
        },
      ],
      order: [["Date", "DESC"]],
    });
  }

  async create(reportData, senderId) {
    try {
      const report = {
        Date: new Date(),
        SenderID: senderId,
        TargetType: reportData.TargetType,
        TargetID: reportData.TargetID,
      };
      return await Report.create(report);
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }

  async findById(id) {
    return await Report.findByPk(id);
  }

  async delete(id) {
    try {
      const deletedRowsCount = await Report.destroy({
        where: { ID: id },
      });
      return deletedRowsCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new ReportRepository();
