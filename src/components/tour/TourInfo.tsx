import Badge from "@/components/ui/Badge";
import type { Tour } from "@/types";

const DIFFICULTY_LABELS: Record<string, string> = {
  de: "Dễ",
  "trung-binh": "Trung bình",
  kho: "Khó",
};

const DIFFICULTY_VARIANTS: Record<string, "default" | "primary" | "accent" | "emerald"> = {
  de: "emerald",
  "trung-binh": "accent",
  kho: "primary",
};

interface TourInfoProps {
  tour: Tour;
}

export default function TourInfo({ tour }: TourInfoProps) {
  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Giới thiệu
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {tour.description}
        </p>
        {tour.longDescription && (
          <div
            className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: tour.longDescription }}
          />
        )}
      </div>

      {/* Quick details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Max group size */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary-600 dark:text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Quy mô nhóm
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tối đa {tour.maxGroupSize} người
            </p>
          </div>
        </div>

        {/* Departure location */}
        {tour.departureLocation && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-900/50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-accent-600 dark:text-accent-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Nơi khởi hành
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tour.departureLocation}
              </p>
            </div>
          </div>
        )}

        {/* Difficulty */}
        {tour.difficulty && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Độ khó
              </p>
              <Badge variant={DIFFICULTY_VARIANTS[tour.difficulty]} className="mt-1">
                {DIFFICULTY_LABELS[tour.difficulty]}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Highlights */}
      {tour.highlights.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Điểm nổi bật
          </h2>
          <ul className="space-y-2">
            {tour.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Includes / Excludes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Includes */}
        {tour.includes.length > 0 && (
          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
            <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300 mb-3">
              Bao gồm
            </h3>
            <ul className="space-y-2">
              {tour.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <svg
                    className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-sm text-emerald-900 dark:text-emerald-200">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Excludes */}
        {tour.excludes.length > 0 && (
          <div className="p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
            <h3 className="text-base font-bold text-red-800 dark:text-red-300 mb-3">
              Không bao gồm
            </h3>
            <ul className="space-y-2">
              {tour.excludes.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <svg
                    className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-sm text-red-900 dark:text-red-200">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
