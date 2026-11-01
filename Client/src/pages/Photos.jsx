import { useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useFleet } from "../context/FleetContext";
import PageHeader from "../components/PageHeader";
import { inputClass } from "../components/Field";

export default function Photos() {
  const { vehicles, photos, addPhotos, deletePhoto, vehicleName, getVehicle } = useFleet();
  const [target, setTarget] = useState(vehicles[0]?.id || "");
  const [filter, setFilter] = useState("All");

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length && target) addPhotos(target, files);
    e.target.value = ""; // lets you pick the same file again later
  };

  const shown = photos.filter((p) => filter === "All" || p.vehicleId === filter);

  return (
    <div>
      <PageHeader eyebrow="Fleet records" title="Vehicle photos" subtitle="A visual record of the vehicles your team keeps moving." />

      <div className="rounded-2xl border border-brand-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-2">
            <ImagePlus size={18} className="text-brand-600" />
            <div>
              <h3 className="font-bold">Add to the library</h3>
              <p className="text-xs text-brand-900/50">Select image files and link them to a vehicle.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-900/50">Associate with</span>
            <select className={`${inputClass} w-auto`} value={target} onChange={(e) => setTarget(e.target.value)}>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.make} {v.model} · {v.registration}</option>)}
            </select>
          </div>
        </div>
        <label className="m-5 mt-0 flex cursor-pointer items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-brand-100 bg-brand-50/50 py-8 hover:bg-brand-50">
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700"><Upload size={20} /></div>
          <div>
            <p className="font-semibold">Choose photos from this device</p>
            <p className="text-xs text-brand-900/50">Multiple image files are supported</p>
          </div>
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-brand-100 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold">Photo library <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs">{shown.length}</span></h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-900/50">Filter by vehicle</span>
            <select className={`${inputClass} w-auto`} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All vehicles</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.make} {v.model}</option>)}
            </select>
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="py-10 text-center text-sm text-brand-900/50">No photos yet. Upload some above.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-2xl border border-brand-100">
                <img src={p.url} alt={p.name} className="h-48 w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 font-mono text-[11px]">{getVehicle(p.vehicleId)?.registration}</span>
                <button onClick={() => deletePhoto(p.id)} className="absolute right-3 top-3 rounded-lg bg-white/90 p-1.5 text-brand-900/60 opacity-0 transition hover:text-orange-600 group-hover:opacity-100">
                  <Trash2 size={15} />
                </button>
                <div className="p-3">
                  <p className="text-sm font-semibold">{vehicleName(p.vehicleId)}</p>
                  <p className="truncate text-xs text-brand-900/50">{p.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-brand-900/50">Photos are kept in the browser for now. We’ll save them to the server later.</p>
      </div>
    </div>
  );
}
