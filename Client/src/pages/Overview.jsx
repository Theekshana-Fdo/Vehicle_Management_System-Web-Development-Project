import { useNavigate } from "react-router-dom";
import { Plus, Car, Gauge, AlertCircle, CalendarDays, Wrench, ArrowRight, ArrowUpRight } from "lucide-react";
import { useFleet } from "../context/FleetContext";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { formatDate, maintenanceState } from "../utils";

function StatCard({ label, value, note, icon: Icon, tint }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-brand-900/60">{label}</p>
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${tint}`}><Icon size={17} /></div>
      </div>
      <p className="mt-2 text-4xl font-bold">{String(value).padStart(2, "0")}</p>
      <p className="mt-1 text-xs text-brand-900/50">{note}</p>
    </div>
  );
}

export default function Overview() {
  const { vehicles, maintenance, vehicleName, getVehicle } = useFleet();
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "A good morning to you." : hour < 18 ? "A good afternoon to you." : "A good evening to you.";
  const today = new Date()
    .toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    .toUpperCase();

  // Count vehicles by status
  const count = (s) => vehicles.filter((v) => v.status === s).length;
  const active = count("Active");
  const inService = count("In service");
  const inactive = count("Inactive");

  // Maintenance numbers
  const overdue = maintenance.filter((m) => maintenanceState(m) === "Overdue").length;
  const upcoming = maintenance.filter((m) => maintenanceState(m) === "Scheduled").length;
  const next = maintenance
    .filter((m) => m.status !== "Complete")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  // Donut chart: CSS conic-gradient draws the coloured slices
  const total = vehicles.length || 1;
  const a = (active / total) * 100;
  const b = a + (inService / total) * 100;
  const donut = `conic-gradient(#3f9468 0 ${a}%, #7fb2d6 ${a}% ${b}%, #d9dedb ${b}% 100%)`;

  return (
    <div>
      <PageHeader
        eyebrow={today}
        title={greeting}
        subtitle="Here’s what’s happening across your fleet today."
        action={
          <button onClick={() => navigate("/vehicles", { state: { openAdd: true } })}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <Plus size={16} /> Add a vehicle
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Vehicles in fleet" value={vehicles.length} note="Across your workspace" icon={Car} tint="bg-brand-100 text-brand-700" />
        <StatCard label="Available today" value={active} note={`${inService} currently in service`} icon={Gauge} tint="bg-sky-50 text-sky-700" />
        <StatCard label="Overdue service" value={overdue} note="Worth taking a look today" icon={AlertCircle} tint="bg-orange-50 text-orange-700" />
        <StatCard label="Coming up" value={upcoming} note="Scheduled maintenance" icon={CalendarDays} tint="bg-indigo-50 text-indigo-700" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Maintenance list */}
        <div className="rounded-2xl border border-brand-100 bg-white lg:col-span-2">
          <div className="flex items-center justify-between p-5">
            <div>
              <h3 className="font-bold">Maintenance coming up</h3>
              <p className="text-xs text-brand-900/50">Your next jobs, sorted by due date</p>
            </div>
            <button onClick={() => navigate("/maintenance")} className="flex items-center gap-1 text-xs font-semibold text-brand-600">
              View schedule <ArrowRight size={14} />
            </button>
          </div>
          {next.length === 0 && <p className="px-5 pb-6 text-sm text-brand-900/50">Nothing scheduled. Nice and quiet.</p>}
          {next.map((m) => {
            const state = maintenanceState(m);
            const v = getVehicle(m.vehicleId);
            return (
              <div key={m.id} className="flex items-center gap-4 border-t border-brand-100 px-5 py-4">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${state === "Overdue" ? "bg-orange-50 text-orange-600" : "bg-sky-50 text-sky-600"}`}>
                  <Wrench size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{m.service}</p>
                  <p className="truncate text-xs text-brand-900/50">{vehicleName(m.vehicleId)} · {v?.registration}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={state} />
                  <p className="mt-1 text-xs text-brand-900/50">{formatDate(m.dueDate)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fleet availability donut */}
        <div className="rounded-2xl border border-brand-100 bg-white p-5">
          <h3 className="font-bold">Fleet availability</h3>
          <p className="mb-4 text-xs text-brand-900/50">Vehicle status at a glance</p>
          <div className="flex items-center gap-5">
            <div className="grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{ background: donut }}>
              <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center">
                <div>
                  <p className="text-2xl font-bold leading-none">{vehicles.length}</p>
                  <p className="text-[10px] text-brand-900/50">vehicles</p>
                </div>
              </div>
            </div>
            <ul className="flex-1 space-y-2 text-sm">
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-brand-500" />Active</span><b>{active}</b></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-sky-400" />In service</span><b>{inService}</b></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-stone-300" />Inactive</span><b>{inactive}</b></li>
            </ul>
          </div>
          <button onClick={() => navigate("/vehicles")}
            className="mt-5 flex w-full items-center justify-between rounded-xl bg-brand-50 px-4 py-3 text-xs font-semibold text-brand-700">
            Review vehicle register <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
