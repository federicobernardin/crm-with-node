// backend/src/routes/clients.js
const express = require('express');
const { Client, Contact, sequelize } = require('../models');
const router = express.Router();

// GET /api/clients
router.get('/', async (req, res, next) => {
  try {
    const clients = await Client.findAll({ include: 'contacts' });
    res.json(clients);
  } catch (err) {
    next(err);
  }
});

// POST /api/clients
router.post('/', async (req, res, next) => {
  const { contacts = [], ...clientData } = req.body;
  const t = await sequelize.transaction();
  try {
    // 1) creo il client
    const client = await Client.create(clientData, { transaction: t });

    // 2) creo i singoli contatti, impostando client_id (non clientId!)
    await Promise.all(contacts.map(c =>
      Contact.create({
        ...c,
        client_id: client.id     // <—— qui
      }, { transaction: t })
    ));

    await t.commit();

    // 3) ricarico il client con i contatti
    const newClient = await Client.findByPk(client.id, { include: 'contacts' });
    res.status(201).json(newClient);
  } catch (err) {
    await t.rollback();
    next(err);
  }
});

// PUT /api/clients/:id
router.put('/:id', async (req, res, next) => {
  const { contacts = [], ...clientData } = req.body;
  const t = await sequelize.transaction();
  try {
    // aggiorno i dati base
    await Client.update(clientData, {
      where: { id: req.params.id },
      transaction: t
    });

    // distruggo e ricreo tutti i contatti
    await Contact.destroy({
      where: { client_id: req.params.id },
      transaction: t
    });
    await Promise.all(contacts.map(c =>
      Contact.create({
        ...c,
        client_id: req.params.id    // <—— e qui
      }, { transaction: t })
    ));

    await t.commit();
    const updated = await Client.findByPk(req.params.id, { include: 'contacts' });
    res.json(updated);
  } catch (err) {
    await t.rollback();
    next(err);
  }
});

// DELETE /api/clients/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await Client.destroy({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
