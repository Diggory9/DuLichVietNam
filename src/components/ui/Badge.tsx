import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "accent" | "emerald";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300",
    accent: "bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
