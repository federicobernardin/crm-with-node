const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const clientsRouter = require("./routes/client");

const app = express();
const PORT = 3001;

app.use(cors(
  {
    origin: ['https://nodejs.ddev.site', 'http://localhost:5173'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
  }
));
app.use(express.json());

// Sync models (crea tabelle se non esistono)
sequelize.sync()
  .then(() => console.log("✅ DB sincronizzato"))
  .catch(err => console.error("❌ ERRORE sync DB:", err));

// Monta le rotte
app.use("/api/clients", clientsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
});
