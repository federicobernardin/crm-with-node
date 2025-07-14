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

// importa tutti i modelli
const Client           = require('./client')(sequelize);
const Contact          = require('./contact')(sequelize);
const Proposal         = require('./proposal')(sequelize);
const ProposalContacts = require('./proposal_contact')(sequelize);

// associazioni Client ↔ Contact
Client.hasMany(Contact,    { foreignKey: 'client_id', as: 'contacts' });
Contact.belongsTo(Client,  { foreignKey: 'client_id', as: 'client' });

// associazioni Client ↔ Proposal
Client.hasMany(Proposal,   { foreignKey: 'client_id', as: 'proposals' });
Proposal.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

// associazioni Proposal ↔ Contact (N:N) attraverso il vero modello ProposalContacts
Proposal.belongsToMany(Contact, {
  through: ProposalContacts,
  foreignKey: 'proposal_id',
  otherKey:   'contact_id',
  as:        'contacts'
});
Contact.belongsToMany(Proposal, {
  through: ProposalContacts,
  foreignKey: 'contact_id',
  otherKey:   'proposal_id',
  as:        'proposals'
});

module.exports = {
  sequelize,
  Client,
  Contact,
  Proposal,
  ProposalContacts
};