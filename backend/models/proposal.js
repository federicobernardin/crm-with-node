// backend/models/proposal.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Proposal = sequelize.define('Proposal', {
    id:            { type: DataTypes.INTEGER,   primaryKey: true, autoIncrement: true },
    language:      { type: DataTypes.STRING(10), allowNull: false },
    type:          { type: DataTypes.STRING(100),allowNull: false },
    code:          { type: DataTypes.STRING(50), unique: true, allowNull: false },
    date:          { type: DataTypes.DATEONLY,   allowNull: false },
    author:        { type: DataTypes.STRING(255),allowNull: false },
    title:         { type: DataTypes.STRING(255),allowNull: false },
    revenue:       { type: DataTypes.DECIMAL(15,2), defaultValue: 0 },
    version:       { type: DataTypes.STRING(20),  defaultValue: '1.0' },
    notes:         DataTypes.TEXT,
    tranche:       DataTypes.STRING(50),
    new_customer:  { type: DataTypes.BOOLEAN,     defaultValue: false },
    payment:       DataTypes.STRING(100),
    start_at:      DataTypes.DATEONLY,
    stop_at:       DataTypes.DATEONLY,
    estimation_end: DataTypes.DATEONLY
  }, {
    tableName:   'proposals',
    timestamps:  true,
    createdAt:   'created_at',
    updatedAt:   'updated_at'
  });

  return Proposal;
};
