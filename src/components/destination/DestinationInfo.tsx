import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/shared/AnimatedSection";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/shared/StarRating";
import type { Destination } from "@/types";

interface DestinationInfoProps {
  destination: Destination;
}

const infoItems = [
  { key: "address" as const, label: "Địa chỉ", icon: "📍" },
  { key: "openingHours" as const, label: "Giờ mở cửa", icon: "🕐" },
  { key: "entryFee" as const, label: "Giá vé", icon: "🎟️" },
  { key: "bestTimeToVisit" as const, label: "Thời điểm lý tưởng", icon: "🗓️" },
];

export default function DestinationInfo({ destination }: DestinationInfoProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <AnimatedSection className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Giới thiệu chi tiết
            </h2>
            <p className="mt-5 text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {destination.longDescription}
            </p>

            {destination.tips.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-900">Mẹo du lịch</h3>
                <ul className="mt-4 space-y-3">
                  {destination.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-gray-600 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {destination.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
            )}
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-primary-50 rounded-2xl p-6 space-y-5 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900">
                Thông tin tham quan
              </h3>
              {(destination.reviewCount ?? 0) > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={destination.averageRating ?? 0} size="md" showValue />
                  <span className="text-sm text-gray-500">({destination.reviewCount} đánh giá)</span>
                </div>
              )}
              {infoItems.map(
                (item) =>
                  destination[item.key] && (
                    <div key={item.key} className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.label}</p>
                        <p className="mt-0.5 font-semibold text-gray-900">
                          {destination[item.key]}
                        </p>
                      </div>
                    </div>
                  )
              )}
            </div>
          </AnimatedSection>
        </div>
      </Container>
    </section>
  );
}
