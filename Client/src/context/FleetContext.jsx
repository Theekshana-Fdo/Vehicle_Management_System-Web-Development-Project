import { createContext, useContext, useState } from "react";
import { sampleVehicles, sampleMaintenance } from "../data/sampleData";

const FleetContext = createContext(null);

// Shortcut so pages can write: const { vehicles } = useFleet();
export const useFleet = () => useContext(FleetContext);

export function FleetProvider({ children }) {
  const [vehicles, setVehicles] = useState(sampleVehicles);
  const [maintenance, setMaintenance] = useState(sampleMaintenance);
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fleet-user"));
    } catch {
      return null;
    }
  });

  // ---------- auth (fake for now, real JWT login comes with the backend) ----------
  const login = (email) => {
    const u = { email };
    localStorage.setItem("fleet-user", JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem("fleet-user");
    setUser(null);
  };

  // ---------- vehicles ----------
  const getVehicle = (id) => vehicles.find((v) => v.id === id);
  const vehicleName = (id) => {
    const v = getVehicle(id);
    return v ? `${v.make} ${v.model}` : "Unknown vehicle";
  };
  const addVehicle = (data) =>
    setVehicles((prev) => [...prev, { ...data, id: `vh-${Date.now()}` }]);
  const updateVehicle = (id, data) =>
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...data } : v)));
  const deleteVehicle = (id) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setMaintenance((prev) => prev.filter((m) => m.vehicleId !== id));
    setPhotos((prev) => prev.filter((p) => p.vehicleId !== id));
  };

  // ---------- maintenance ----------
  const addJob = (data) =>
    setMaintenance((prev) => [...prev, { ...data, id: `m-${Date.now()}` }]);
  const updateJob = (id, data) =>
    setMaintenance((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
  const completeJob = (id) => updateJob(id, { status: "Complete" });

  // ---------- photos ----------
  const addPhotos = (vehicleId, files) => {
    const added = files.map((file, i) => ({
      id: `p-${Date.now()}-${i}`,
      vehicleId,
      name: file.name,
      url: URL.createObjectURL(file), // temporary browser URL, lost on refresh
    }));
    setPhotos((prev) => [...prev, ...added]);
  };
  const deletePhoto = (id) => {
    const p = photos.find((x) => x.id === id);
    if (p) URL.revokeObjectURL(p.url);
    setPhotos((prev) => prev.filter((x) => x.id !== id));
  };

  const value = {
    user, login, logout,
    vehicles, getVehicle, vehicleName, addVehicle, updateVehicle, deleteVehicle,
    maintenance, addJob, updateJob, completeJob,
    photos, addPhotos, deletePhoto,
  };

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}
