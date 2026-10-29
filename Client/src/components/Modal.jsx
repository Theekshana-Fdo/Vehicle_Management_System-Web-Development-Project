import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ eyebrow, title, onClose, children }) {
  // Close with the Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} // clicking inside must not close it
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-brand-900/50 hover:bg-brand-50">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
