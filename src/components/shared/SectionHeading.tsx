import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", "mb-14", className)}>
      <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
      {centered ? (
        <div className="mt-5 flex justify-center">
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
        </div>
      ) : (
        <div className="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
      )}
    </div>
  );
}
