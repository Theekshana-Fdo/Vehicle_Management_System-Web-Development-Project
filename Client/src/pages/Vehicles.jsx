import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Car } from "lucide-react";
import { useFleet } from "../context/FleetContext";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { Field, FormButtons, inputClass } from "../components/Field";
import { formatDate } from "../utils";

const emptyVehicle = {
  make: "", model: "", year: new Date().getFullYear(),
  registration: "", status: "Active", odometer: 0, nextService: "",
};

function VehicleForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  // set("make") returns a function that updates only the "make" field
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, year: Number(form.year), odometer: Number(form.odometer) });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Make"><input required className={inputClass} value={form.make} onChange={set("make")} placeholder="e.g. Toyota" /></Field>
        <Field label="Model"><input required className={inputClass} value={form.model} onChange={set("model")} placeholder="e.g. Hilux" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Year"><input required type="number" min="1980" max="2100" className={inputClass} value={form.year} onChange={set("year")} /></Field>
        <Field label="Registration"><input required className={inputClass} value={form.registration} onChange={set("registration")} placeholder="ABC 123" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Odometer (km)"><input required type="number" min="0" className={inputClass} value={form.odometer} onChange={set("odometer")} /></Field>
        <Field label="Status">
          <select className={inputClass} value={form.status} onChange={set("status")}>
            <option>Active</option><option>In service</option><option>Inactive</option>
          </select>
        </Field>
      </div>
      <Field label="Next service date"><input type="date" className={inputClass} value={form.nextService} onChange={set("nextService")} /></Field>
      <FormButtons onCancel={onCancel} saveText="Save vehicle" />
    </form>
  );
}

export default function Vehicles() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useFleet();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  // editing: null = closed, "new" = add form, or a vehicle object = edit form
  const [editing, setEditing] = useState(location.state?.openAdd ? "new" : null);

  const shown = vehicles.filter((v) => {
    const text = `${v.make} ${v.model} ${v.registration}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (statusFilter === "All" || v.status === statusFilter);
  });

  const handleSave = (data) => {
    if (editing === "new") addVehicle(data);
    else updateVehicle(editing.id, data);
    setEditing(null);
  };

  const handleDelete = (v) => {
    if (window.confirm(`Delete ${v.make} ${v.model}? Its maintenance records and photos will be removed too.`)) {
      deleteVehicle(v.id);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Your fleet"
        title="Vehicle register"
        subtitle="A clear view of every vehicle, what shape it’s in and when it’s due for service."
        action={
          <button onClick={() => setEditing("new")}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <Plus size={16} /> Add vehicle
          </button>
        }
      />

      <div className="rounded-2xl border border-brand-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h3 className="font-bold">All vehicles <span className="text-sm font-normal text-brand-900/50">({shown.length})</span></h3>
            <p className="text-xs text-brand-900/50">Manage the details your team relies on</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/40" />
              <input className={`${inputClass} pl-9`} placeholder="Search make, model" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className={`${inputClass} w-auto`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All statuses</option>
              <option>Active</option><option>In service</option><option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-y border-brand-100 text-[11px] uppercase tracking-wider text-brand-900/50">
                <th className="px-5 py-3 font-semibold">Vehicle</th>
                <th className="px-3 py-3 font-semibold">Registration</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Odometer</th>
                <th className="px-3 py-3 font-semibold">Next service</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((v) => (
                <tr key={v.id} className="border-b border-brand-100 last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><Car size={17} /></div>
                      <div>
                        <p className="font-semibold">{v.make} {v.model}</p>
                        <p className="text-xs text-brand-900/50">{v.year} model</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3"><span className="rounded-md border border-brand-100 bg-brand-50 px-2 py-1 font-mono text-xs">{v.registration}</span></td>
                  <td className="px-3"><StatusBadge status={v.status} /></td>
                  <td className="px-3 font-semibold">{v.odometer.toLocaleString()} <span className="text-xs font-normal text-brand-900/50">km</span></td>
                  <td className="px-3 text-brand-900/70">{formatDate(v.nextService)}</td>
                  <td className="px-5 text-right">
                    <button onClick={() => setEditing(v)} className="rounded-lg p-2 text-brand-900/50 hover:bg-brand-50"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(v)} className="rounded-lg p-2 text-brand-900/50 hover:bg-orange-50 hover:text-orange-600"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {shown.length === 0 && <p className="p-8 text-center text-sm text-brand-900/50">No vehicles match your search.</p>}
        </div>
        <p className="border-t border-brand-100 px-5 py-3 text-xs text-brand-900/50">Showing {shown.length} of {vehicles.length} vehicles</p>
      </div>

      {editing && (
        <Modal eyebrow="Vehicle record" title={editing === "new" ? "Add vehicle" : "Edit vehicle"} onClose={() => setEditing(null)}>
          <VehicleForm initial={editing === "new" ? emptyVehicle : editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
