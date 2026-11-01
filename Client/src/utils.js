export const todayISO = () => new Date().toISOString().slice(0, 10);

export const formatDate = (iso) =>
  iso
    ? new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

// A job is "Overdue" when it is not complete and its due date has passed.
// We work this out instead of storing it, so it never goes out of date.
export const maintenanceState = (job) => {
  if (job.status === "Complete") return "Complete";
  return job.dueDate < todayISO() ? "Overdue" : "Scheduled";
};
