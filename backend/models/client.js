const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Client = sequelize.define("Client", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contact: DataTypes.STRING(255),
    address: DataTypes.STRING(255),
    city: DataTypes.STRING(100),
    state: DataTypes.STRING(50),
    zip: DataTypes.STRING(10),
    vat: {
      type: DataTypes.STRING(20),
      unique: true
    },
    sdi: DataTypes.STRING(20),
    pec: {
      type: DataTypes.STRING(255),
      unique: true
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true
    },
    payment_term: DataTypes.STRING(50)
  }, {
    tableName: "clients",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return Client;
};
