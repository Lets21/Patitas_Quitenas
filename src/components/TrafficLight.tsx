import clsx from "clsx";

interface TrafficLightProps {
  value?: number | null;
  className?: string;
}

export default function TrafficLight({ value, className }: TrafficLightProps) {
  const normalized =
    typeof value === "number" && !Number.isNaN(value)
      ? Math.max(0, Math.min(1, value))
      : 0;

  const colorClass =
    normalized >= 0.9
      ? "bg-green-500"
      : normalized >= 0.4
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <span
      className={clsx("h-3 w-3 rounded-full flex-shrink-0", colorClass, className)}
      aria-hidden="true"
    />
  );
}

