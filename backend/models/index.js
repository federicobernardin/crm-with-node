const { Sequelize } = require("sequelize");
const config = require("../config/config.js").development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging
  }
);

// importa i model
const Client = require("./client")(sequelize);
const Contact = require("./contact")(sequelize);

// definisci le associazioni
Client.hasMany(Contact, {
  foreignKey: "client_id",
  as: "contacts",
  onDelete: "CASCADE"
});
Contact.belongsTo(Client, {
  foreignKey: "client_id",
  as: "client"
});

module.exports = {
  sequelize,
  Client,
  Contact
};
