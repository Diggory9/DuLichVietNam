import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700",
        hover && "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
