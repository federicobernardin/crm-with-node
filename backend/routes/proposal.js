// backend/routes/proposals.js

const express = require('express');
const { Proposal, Contact, Client, sequelize } = require('../models');
const router = express.Router();

// GET all proposals
router.get('/', async (req, res, next) => {
  try {
    const list = await Proposal.findAll({
      include: [
        { model: Contact, as: 'contacts' },
        { model: Client, as: 'client' }
      ],
      logging: console.log
    });
    res.json(list);
  } catch (err) { console.error('Sequelize error in GET /proposals:', err.original?.sqlMessage || err.message);
    next(err); }
});

// POST create proposal
router.post('/', async (req, res, next) => {
  const { contacts = [], ...data } = req.body;
  const t = await sequelize.transaction();
  try {
    const prop = await Proposal.create(data, { transaction: t });
    await prop.setContacts(contacts, { transaction: t });
    await t.commit();
    const full = await Proposal.findByPk(prop.id, { include: 'contacts' });
    res.status(201).json(full);
  } catch (e) {
    await t.rollback();
    next(e);
  }
});

// PUT update proposal
router.put('/:id', async (req, res, next) => {
  const { contacts = [], ...data } = req.body;
  const t = await sequelize.transaction();
  try {
    await Proposal.update(data, { where: { id: req.params.id }, transaction: t });
    const prop = await Proposal.findByPk(req.params.id, { transaction: t });
    await prop.setContacts(contacts, { transaction: t });
    await t.commit();
    const updated = await Proposal.findByPk(req.params.id, { include: 'contacts' });
    res.json(updated);
  } catch (e) {
    await t.rollback();
    next(e);
  }
});

// DELETE proposal
router.delete('/:id', async (req, res, next) => {
  try {
    await Proposal.destroy({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (e) { next(e); }
});

module.exports = router;
