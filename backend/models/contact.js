// backend/models/contact.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Contact", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      validate: { isEmail: true }
    },
    phone: DataTypes.STRING(50)
  }, {
    tableName:  "contacts",
    timestamps: false
  });
};
