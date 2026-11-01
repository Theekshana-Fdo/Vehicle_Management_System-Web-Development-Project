import { useState } from "react";
import { Plus, Search, Pencil, Check, Wrench, CalendarClock, CheckCircle2 } from "lucide-react";
import { useFleet } from "../context/FleetContext";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { Field, FormButtons, inputClass } from "../components/Field";
import { formatDate, maintenanceState } from "../utils";

function JobForm({ initial, vehicles, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <Field label="Vehicle">
        <select required className={inputClass} value={form.vehicleId} onChange={set("vehicleId")}>
          <option value="">Choose a vehicle</option>
          {vehicles.map((v) => <option key={v.id} value={v.id}>{v.make} {v.model} · {v.registration}</option>)}
        </select>
      </Field>
      <Field label="Service type">
        <input required className={inputClass} value={form.service} onChange={set("service")} placeholder="e.g. Annual inspection" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Due date"><input required type="date" className={inputClass} value={form.dueDate} onChange={set("dueDate")} /></Field>
        <Field label="Status">
          <select className={inputClass} value={form.status} onChange={set("status")}>
            <option>Scheduled</option><option>Complete</option>
          </select>
        </Field>
      </div>
      <FormButtons onCancel={onCancel} saveText="Save service" />
    </form>
  );
}

export default function Maintenance() {
  const { vehicles, maintenance, vehicleName, getVehicle, addJob, updateJob, completeJob } = useFleet();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null); // null | "new" | job object

  const count = (s) => maintenance.filter((m) => maintenanceState(m) === s).length;

  const shown = maintenance
    .filter((m) => {
      const text = `${m.service} ${vehicleName(m.vehicleId)} ${getVehicle(m.vehicleId)?.registration || ""}`.toLowerCase();
      return text.includes(search.toLowerCase()) && (filter === "All" || maintenanceState(m) === filter);
    })
    // overdue jobs first, then by due date
    .sort((a, b) => {
      const rank = (m) => (maintenanceState(m) === "Overdue" ? 0 : 1);
      return rank(a) - rank(b) || a.dueDate.localeCompare(b.dueDate);
    });

  const handleSave = (data) => {
    if (editing === "new") addJob(data);
    else updateJob(editing.id, data);
    setEditing(null);
  };

  const summary = [
    { label: "Overdue", value: count("Overdue"), icon: CalendarClock, tint: "bg-orange-50 text-orange-600" },
    { label: "Scheduled", value: count("Scheduled"), icon: Wrench, tint: "bg-sky-50 text-sky-600" },
    { label: "Complete", value: count("Complete"), icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Keep things moving"
        title="Maintenance schedule"
        subtitle="Plan service work, keep an eye on due dates and know what’s already been taken care of."
        action={
          <button onClick={() => setEditing("new")}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <Plus size={16} /> Schedule service
          </button>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {summary.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="flex items-center justify-between rounded-2xl border border-brand-100 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}><Icon size={17} /></div>
              <span className="text-sm font-semibold">{label}</span>
            </div>
            <span className="text-2xl font-bold">{String(value).padStart(2, "0")}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h3 className="font-bold">Service work <span className="text-sm font-normal text-brand-900/50">({shown.length})</span></h3>
            <p className="text-xs text-brand-900/50">Overdue work first, then by due date</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/40" />
              <input className={`${inputClass} pl-9`} placeholder="Search service or vehicle" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className={`${inputClass} w-auto`} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All work</option>
              <option>Overdue</option><option>Scheduled</option><option>Complete</option>
            </select>
          </div>
        </div>

        {shown.length === 0 && <p className="border-t border-brand-100 p-8 text-center text-sm text-brand-900/50">No service work found.</p>}
        {shown.map((m) => {
          const state = maintenanceState(m);
          return (
            <div key={m.id} className="flex items-center gap-4 border-t border-brand-100 px-5 py-4">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${state === "Overdue" ? "bg-orange-50 text-orange-600" : state === "Complete" ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"}`}>
                <Wrench size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-semibold">{m.service} <StatusBadge status={state} /></p>
                <p className="truncate text-xs text-brand-900/50">{vehicleName(m.vehicleId)} · {getVehicle(m.vehicleId)?.registration}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-900/40">Due date</p>
                <p className={`text-sm font-semibold ${state === "Overdue" ? "text-orange-600" : ""}`}>{formatDate(m.dueDate)}</p>
              </div>
              <div className="flex w-20 justify-end">
                {state !== "Complete" && (
                  <button title="Mark complete" onClick={() => completeJob(m.id)} className="rounded-lg p-2 text-brand-900/50 hover:bg-emerald-50 hover:text-emerald-600"><Check size={16} /></button>
                )}
                <button title="Edit" onClick={() => setEditing(m)} className="rounded-lg p-2 text-brand-900/50 hover:bg-brand-50"><Pencil size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <Modal eyebrow="Maintenance record" title="Schedule service" onClose={() => setEditing(null)}>
          <JobForm
            initial={editing === "new" ? { vehicleId: "", service: "", dueDate: "", status: "Scheduled" } : editing}
            vehicles={vehicles} onSave={handleSave} onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
