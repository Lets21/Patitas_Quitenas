export default function EmptyState({ title="Sin datos", description="No hay información para mostrar", action }: {
  title?: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-8 text-center">
      <div className="text-lg font-semibold">{title}</div>
      <p className="text-stone-500 mt-2">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
