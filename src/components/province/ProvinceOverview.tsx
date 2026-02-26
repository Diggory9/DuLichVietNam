import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import AnimatedSection from "@/components/shared/AnimatedSection";
import type { Province } from "@/types";

interface ProvinceOverviewProps {
  province: Province;
}

const infoItems = [
  { key: "population" as const, label: "Dân số", icon: "👥" },
  { key: "area" as const, label: "Diện tích", icon: "📐" },
  { key: "bestTimeToVisit" as const, label: "Thời điểm lý tưởng", icon: "🗓️" },
];

export default function ProvinceOverview({ province }: ProvinceOverviewProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <AnimatedSection className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Giới thiệu về {province.name}
            </h2>
            <p className="mt-5 text-gray-600 leading-relaxed text-lg">
              {province.longDescription}
            </p>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900">Điểm nổi bật</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {province.highlights.map((highlight) => (
                  <Badge key={highlight} variant="emerald">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-primary-50 rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-bold text-gray-900">Thông tin chung</h3>
              {infoItems.map(
                (item) =>
                  province[item.key] && (
                    <div key={item.key} className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.label}</p>
                        <p className="mt-0.5 font-semibold text-gray-900">
                          {province[item.key]}
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
