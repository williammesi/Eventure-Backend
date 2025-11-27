import { DataTypes } from "sequelize";
import sequelize from "../core/database.js";

const Report = sequelize.define(
  "Report",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    SenderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "ID",
      },
    },
    TargetType: {
      type: DataTypes.ENUM("event", "comment"),
      allowNull: false,
    },
    TargetID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Report",
    timestamps: false,
  }
);

export default Report;
