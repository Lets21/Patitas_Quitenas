export default function ScoreIndicator({ pct }: { pct: number }) {
  const color =
    pct >= 85 ? "bg-green-500" : pct >= 70 ? "bg-yellow-400" : "bg-red-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`${color} h-3 rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      ></div>
    </div>
  );
}

