export type Step = { label: string; date?: string; active?: boolean; done?: boolean; note?: string };
export default function Timeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative border-s ps-6">
      {steps.map((s,i)=>(
        <li key={i} className="mb-6">
          <span className={`absolute -start-2 w-3 h-3 rounded-full ${s.done ? "bg-[#2E7D32]" : s.active ? "bg-[#FB8C00]" : "bg-stone-300"}`} />
          <div className="font-medium">{s.label}</div>
          {s.date && <div className="text-xs text-stone-500">{s.date}</div>}
          {s.note && <div className="text-sm mt-1">{s.note}</div>}
        </li>
      ))}
    </ol>
  );
}
