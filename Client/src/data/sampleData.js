// Dates are relative to today so the demo always looks realistic
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const sampleVehicles = [
  { id: "vh-101", make: "Ford", model: "Transit 250", year: 2022, registration: "KRF 284", status: "Active", odometer: 42860, nextService: addDays(8) },
  { id: "vh-102", make: "Toyota", model: "Hilux SR5", year: 2021, registration: "YLM 731", status: "In service", odometer: 67240, nextService: addDays(2) },
  { id: "vh-103", make: "Mercedes-Benz", model: "Sprinter 315", year: 2023, registration: "BQT 916", status: "Active", odometer: 18320, nextService: addDays(12) },
  { id: "vh-104", make: "Isuzu", model: "NPR 45-155", year: 2020, registration: "FJX 502", status: "Active", odometer: 89110, nextService: addDays(-2) },
  { id: "vh-105", make: "Volkswagen", model: "Caddy Cargo", year: 2022, registration: "DPN 418", status: "Inactive", odometer: 51490, nextService: addDays(54) },
  { id: "vh-106", make: "Ford", model: "Ranger XLT", year: 2024, registration: "GMW 265", status: "Active", odometer: 12640, nextService: addDays(60) },
];

export const sampleMaintenance = [
  { id: "m-1", vehicleId: "vh-105", service: "Annual inspection", dueDate: addDays(-30), status: "Complete" },
  { id: "m-2", vehicleId: "vh-104", service: "Oil & filter change", dueDate: addDays(-2), status: "Scheduled" },
  { id: "m-3", vehicleId: "vh-102", service: "Brake inspection", dueDate: addDays(2), status: "Scheduled" },
  { id: "m-4", vehicleId: "vh-101", service: "Routine service", dueDate: addDays(8), status: "Scheduled" },
  { id: "m-5", vehicleId: "vh-103", service: "Tyre rotation", dueDate: addDays(12), status: "Scheduled" },
];
