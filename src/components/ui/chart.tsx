import {
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";



export function ChartContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full h-[300px] ${className || ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function ChartTooltipContent({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border rounded-lg p-2 shadow text-sm">
      <p className="font-semibold mb-1">{label}</p>

      {payload.map((item, index) => (
        <div key={index} className="flex justify-between gap-4">
          <span>{item.name}</span>
          <span>{Number(item.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartLegendContent({ payload }: { payload?: any[] }) {
  if (!payload) return null;

  return (
    <div className="flex justify-center gap-4 mt-2 text-sm">
      {payload.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
}