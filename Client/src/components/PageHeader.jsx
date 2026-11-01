export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-1 text-sm text-brand-900/60">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
