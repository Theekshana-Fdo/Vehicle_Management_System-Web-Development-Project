export const inputClass =
  "w-full rounded-xl border border-brand-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-brand-900/70">{label}</span>
      {children}
    </label>
  );
}

export function FormButtons({ onCancel, saveText }) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button type="button" onClick={onCancel} className="rounded-xl border border-brand-100 px-4 py-2 text-sm font-semibold hover:bg-brand-50">
        Cancel
      </button>
      <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
        {saveText}
      </button>
    </div>
  );
}
