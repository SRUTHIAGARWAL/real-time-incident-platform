require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const Incident = require("./models/Incident");


// =====================
// ADMIN AUTH MIDDLEWARE
// =====================
const adminAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(403).json({ message: "No token" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") throw new Error();
    next();
  } catch {
    res.status(403).json({ message: "Unauthorized" });
  }
};


// =====================
// ADMIN LOGIN ROUTE ✅
// =====================
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});


  


// =====================
// INCIDENT ROUTES
// =====================

// Public: Get incidents
app.get("/api/incidents", async (req, res) => {
  const incidents = await Incident.find().sort({ createdAt: -1 });
  res.json(incidents);
});

// Public: Create incident
app.post("/api/incidents", async (req, res) => {
  const incident = await Incident.create(req.body);
  io.emit("incident_updated", incident);
  res.json(incident);
});

// Public: Upvote
app.post("/api/incidents/:id/upvote", async (req, res) => {
  const incident = await Incident.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );
  io.emit("incident_updated", incident);
  res.json(incident);
});

// 🔒 ADMIN ONLY: Update incident
app.put("/api/incidents/:id", adminAuth, async (req, res) => {
  const incident = await Incident.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  io.emit("incident_updated", incident);
  res.json(incident);
});


// =====================
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
