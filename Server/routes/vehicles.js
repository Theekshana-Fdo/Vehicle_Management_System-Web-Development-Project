import express from "express";
import Vehicle from "../models/Vehicle.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.use(auth); // every route below requires login

const pick = (b) => ({
  make: b.make,
  model: b.model,
  year: b.year,
  registration: b.registration,
  status: b.status,
  odometer: b.odometer,
  nextService: b.nextService,
});

// GET /api/vehicles : list my vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(vehicles);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/vehicles : add a vehicle
router.post("/", async (req, res) => {
  try {
    const vehicle = await Vehicle.create({
      ...pick(req.body),
      owner: req.user.id,
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/vehicles/:id : edit one of my vehicles
router.put("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      pick(req.body),
      { new: true, runValidators: true },
    );
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/vehicles/:id : delete one of my vehicles
router.delete("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle deleted" });
  } catch {
    res.status(400).json({ message: "Invalid vehicle id" });
  }
});

export default router;
