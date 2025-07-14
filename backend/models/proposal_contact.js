// backend/models/proposal_contact.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('proposal_contacts', {
    // nessun campo esplicitato, useremo solo la PK composite
  }, {
    tableName: 'proposal_contacts',
    timestamps: false       // IMPORTANTISSIMO: disabilita createdAt/updatedAt
  });
};
