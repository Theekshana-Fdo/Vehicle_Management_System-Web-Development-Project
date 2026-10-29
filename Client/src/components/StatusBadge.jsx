const styles = {
  Active: "bg-emerald-50 text-emerald-700",
  "In service": "bg-sky-50 text-sky-700",
  Inactive: "bg-stone-100 text-stone-600",
  Overdue: "bg-orange-50 text-orange-700",
  Scheduled: "bg-sky-50 text-sky-700",
  Complete: "bg-emerald-50 text-emerald-700",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
