import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Car, Wrench, Image, LogOut, Activity } from "lucide-react";
import { useFleet } from "../context/FleetContext";
import { maintenanceState } from "../utils";

const links = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/vehicles", label: "Vehicles", icon: Car },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/photos", label: "Vehicle photos", icon: Image },
];

export default function Layout() {
  const { vehicles, maintenance, user, logout } = useFleet();
  const navigate = useNavigate();

  const overdue = maintenance.filter((m) => maintenanceState(m) === "Overdue").length;
  const initials = user.email.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive ? "bg-brand-100 text-brand-700" : "text-brand-900/70 hover:bg-brand-50"
    }`;

  return (
    <div className="min-h-screen md:flex">
      {/* ---------- Sidebar (desktop) ---------- */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-brand-100 bg-white/70 p-4 md:flex">
        <div className="mb-8 flex items-center gap-3 px-2 pt-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
            <Car size={20} />
          </div>
          <div>
            <p className="font-bold leading-tight">Fleetwise</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-900/50">Vehicle operations</p>
          </div>
        </div>

        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Workspace</p>
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {label === "Maintenance" && overdue > 0 && (
                <span className="rounded-full bg-orange-100 px-2 text-xs font-bold text-orange-700">{overdue}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-brand-100 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-900/50">Fleet snapshot</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-bold">{String(vehicles.length).padStart(2, "0")}</p>
              <span className="flex items-center gap-1 text-xs font-semibold text-brand-600">
                <Activity size={14} /> Live
              </span>
            </div>
            <p className="text-xs text-brand-900/50">vehicles tracked</p>
          </div>

          <div className="flex items-center gap-3 px-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{initials}</div>
            <p className="min-w-0 flex-1 truncate text-sm font-semibold">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-brand-900/60 hover:text-brand-900">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* ---------- Main area ---------- */}
      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <header className="border-b border-brand-100 bg-white/80 px-4 py-3 md:hidden">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-bold">Fleetwise</p>
            <button onClick={handleLogout} className="text-sm text-brand-900/60">Sign out</button>
          </div>
          <nav className="flex gap-2 overflow-x-auto">
            {links.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${isActive ? "bg-brand-100 text-brand-700" : "text-brand-900/60"}`}>
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
