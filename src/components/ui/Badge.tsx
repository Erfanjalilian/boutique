import { cn } from "@/utils/helpers";
import { getOrderStatusLabel } from "@/utils/labels";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function Badge({
  children,
  status,
  className,
}: {
  children?: React.ReactNode;
  status?: string;
  className?: string;
}) {
  const label = status ? getOrderStatusLabel(status) : children;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        status ? statusColors[status] : "bg-primary/20 text-primary border-primary/30",
        className
      )}
    >
      {label}
    </span>
  );
}
