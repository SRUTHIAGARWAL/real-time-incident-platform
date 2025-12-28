const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const Incident = require("./models/Incident");

app.get("/api/incidents", async (req, res) => {
  const incidents = await Incident.find().sort({ createdAt: -1 });
  res.json(incidents);
});

app.post("/api/incidents", async (req, res) => {
  const incident = await Incident.create(req.body);
  io.emit("incident_updated", incident);
  res.json(incident);
});

app.post("/api/incidents/:id/upvote", async (req, res) => {
  const incident = await Incident.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );
  io.emit("incident_updated", incident);
  res.json(incident);
});

app.put("/api/incidents/:id", async (req, res) => {
  const incident = await Incident.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  io.emit("incident_updated", incident);
  res.json(incident);
});

server.listen(5000, () => console.log("Server running on port 5000"));
