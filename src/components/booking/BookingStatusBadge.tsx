import type { BookingStatus } from "@/types";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; classes: string }> = {
  pending: {
    label: "Ch\u1edd x\u00e1c nh\u1eadn",
    classes:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  confirmed: {
    label: "\u0110\u00e3 x\u00e1c nh\u1eadn",
    classes:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  cancelled: {
    label: "\u0110\u00e3 hu\u1ef7",
    classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
