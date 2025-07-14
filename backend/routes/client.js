const express = require("express");
const router = express.Router();
const { Client } = require("../models");

// GET all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

// POST create new client
router.post("/", async (req, res) => {
  try {
    const newClient = await Client.create(req.body);
    res.status(201).json(newClient);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT update client by id
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Client.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: "Cliente non trovato." });
    const updatedClient = await Client.findByPk(req.params.id);
    res.json(updatedClient);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE client by id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Client.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: "Cliente non trovato." });
    res.json({ message: "Cliente cancellato con successo." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

module.exports = router;
