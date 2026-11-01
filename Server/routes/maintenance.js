import express from "express";
import Maintenance from "../models/Maintenance.js";
import Vehicle from "../models/Vehicle.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.use(auth); // login required for everything below

// only copy the fields the form sends (and skip ones that weren't sent)
const FIELDS = ["vehicleId", "service", "dueDate", "status"];
const pick = (b) =>
  Object.fromEntries(
    FIELDS.filter((k) => b[k] !== undefined).map((k) => [k, b[k]]),
  );

// a job may only be attached to one of MY vehicles
const ownsVehicle = (vehicleId, userId) =>
  Vehicle.exists({ _id: vehicleId, owner: userId });

// GET /api/maintenance : list my jobs
router.get("/", async (req, res) => {
  try {
    res.json(
      await Maintenance.find({ owner: req.user.id }).sort({ dueDate: 1 }),
    );
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/maintenance : add a job
router.post("/", async (req, res) => {
  try {
    const data = pick(req.body);
    if (!(await ownsVehicle(data.vehicleId, req.user.id)))
      return res.status(400).json({ message: "Choose one of your vehicles" });
    const job = await Maintenance.create({ ...data, owner: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/maintenance/:id : edit a job (also used to mark it complete)
router.put("/:id", async (req, res) => {
  try {
    const data = pick(req.body);
    if (data.vehicleId && !(await ownsVehicle(data.vehicleId, req.user.id)))
      return res.status(400).json({ message: "Choose one of your vehicles" });
    const job = await Maintenance.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      { new: true, runValidators: true },
    );
    if (!job) return res.status(404).json({ message: "Service not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/maintenance/:id
router.delete("/:id", async (req, res) => {
  try {
    const job = await Maintenance.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!job) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch {
    res.status(400).json({ message: "Invalid service id" });
  }
});

export default router;
