import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const FleetContext = createContext(null);
export const useFleet = () => useContext(FleetContext);

export function FleetProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [maintenance, setMaintenance] = useState([]); // real API comes later
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fleet-user"));
    } catch {
      return null;
    }
  });

  // ---------- auth (real JWT login through the backend) ----------
  const authenticate = async (mode, email, password) => {
    // mode is "register" or "login"
    const data = await api(`/api/auth/${mode}`, { method: "POST", body: { email, password } });
    localStorage.setItem("fleet-token", data.token);
    localStorage.setItem("fleet-user", JSON.stringify(data.user));
    setUser(data.user);
  };
  const logout = () => {
    localStorage.removeItem("fleet-token");
    localStorage.removeItem("fleet-user");
    setUser(null);
  };

  // load my vehicles from the database whenever someone is logged in
  useEffect(() => {
    if (!user) {
      setVehicles([]);
      return;
    }
    api("/api/vehicles")
      .then(setVehicles)
      .catch(() => logout()); // bad or expired token, so send them back to login
  }, [user]);

  // ---------- vehicles (saved in MongoDB) ----------
  const getVehicle = (id) => vehicles.find((v) => v.id === id);
  const vehicleName = (id) => {
    const v = getVehicle(id);
    return v ? `${v.make} ${v.model}` : "Unknown vehicle";
  };
  const addVehicle = async (data) => {
    try {
      const saved = await api("/api/vehicles", { method: "POST", body: data });
      setVehicles((prev) => [saved, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };
  const updateVehicle = async (id, data) => {
    try {
      const saved = await api(`/api/vehicles/${id}`, { method: "PUT", body: data });
      setVehicles((prev) => prev.map((v) => (v.id === id ? saved : v)));
    } catch (err) {
      alert(err.message);
    }
  };
  const deleteVehicle = async (id) => {
    try {
      await api(`/api/vehicles/${id}`, { method: "DELETE" });
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setMaintenance((prev) => prev.filter((m) => m.vehicleId !== id));
      setPhotos((prev) => prev.filter((p) => p.vehicleId !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ---------- maintenance (still in memory for now) ----------
  const addJob = (data) =>
    setMaintenance((prev) => [...prev, { ...data, id: `m-${Date.now()}` }]);
  const updateJob = (id, data) =>
    setMaintenance((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
  const completeJob = (id) => updateJob(id, { status: "Complete" });

  // ---------- photos (still in memory) ----------
  const addPhotos = (vehicleId, files) => {
    const added = files.map((file, i) => ({
      id: `p-${Date.now()}-${i}`,
      vehicleId,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...added]);
  };
  const deletePhoto = (id) => {
    const p = photos.find((x) => x.id === id);
    if (p) URL.revokeObjectURL(p.url);
    setPhotos((prev) => prev.filter((x) => x.id !== id));
  };

  const value = {
    user, authenticate, logout,
    vehicles, getVehicle, vehicleName, addVehicle, updateVehicle, deleteVehicle,
    maintenance, addJob, updateJob, completeJob,
    photos, addPhotos, deletePhoto,
  };

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}