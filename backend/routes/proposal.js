// backend/routes/proposals.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { Proposal, Contact, Client, sequelize } = require('../models');
const generateProposalDocx = require('../services/docxGenerator');
const router = express.Router();

// storage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/proposals');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // salva come <id>.docx
    cb(null, `${req.params.id}.docx`);
  }
});
const upload = multer({ storage });

// --- UPLOAD DOCX ---
router.post('/:id/upload', upload.single('file'), async (req, res, next) => {
  try {
    const prop = await Proposal.findByPk(req.params.id);
    if (!prop) return res.status(404).send('Proposal not found');
    // aggiorna campo document_path
    await prop.update({ document_path: `uploads/proposals/${req.params.id}.docx` });
    res.json({ success: true, path: prop.document_path });
  } catch (err) {
    next(err);
  }
});

// GET all proposals
router.get('/', async (req, res, next) => {
  try {
    const list = await Proposal.findAll({
      attributes: {
        include: ['document_path']
      },
      include: [
        { model: Contact, as: 'contacts' },
        { model: Client, as: 'client' }
      ],
      //logging: console.log
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

// Download .docx
router.get('/:id/download', async (req, res, next) => {
  try {
    const prop = await Proposal.findByPk(req.params.id, {
      include: [
        { model: Client,  as: 'client'   },
        { model: Contact, as: 'contacts' }
      ]
    });
    if (!prop) return res.status(404).send('Proposal not found');

    const buffer = await generateProposalDocx(prop);
    const filename = `proposal_${prop.language}_${prop.type}_${prop.id}.docx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(buffer);
  } catch (err) {
    console.error('Errore generazione DOCX:', err);
    next(err);
  }
});

router.get('/:id/file', async (req, res, next) => {
  try {
    const prop = await Proposal.findByPk(req.params.id);

    console.error(prop);
    if (!prop || !prop.document_path) {
      return res.status(404).send('File non trovato');
    }
    const fullPath = path.resolve(__dirname, '..', prop.document_path);
    console.error(fullPath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).send('File non trovato');
    }
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=proposal_${prop.id}.docx`
    );
    return res.sendFile(fullPath);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
