import { Navigate, Route, Routes } from "react-router-dom";
import { useFleet } from "./context/FleetContext";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Overview from "./pages/Overview";
import Vehicles from "./pages/Vehicles";
import Maintenance from "./pages/Maintenance";
import Photos from "./pages/Photos";

// Only lets logged-in users see the app pages
function Protected() {
  const { user } = useFleet();
  return user ? <Layout /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route element={<Protected />}>
        <Route index element={<Overview />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="photos" element={<Photos />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
