import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { getStats } from "@/lib/data";

const statLabels: Record<string, { label: string; icon: string }> = {
  provinces: { label: "Tỉnh thành", icon: "🗺️" },
  destinations: { label: "Địa danh", icon: "📍" },
  posts: { label: "Bài viết", icon: "📝" },
  categories: { label: "Danh mục", icon: "🏷️" },
  regions: { label: "Vùng miền", icon: "🌏" },
};

export default async function StatsSection() {
  const stats = await getStats();

  return (
    <section className="py-14 sm:py-16 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-900">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {Object.entries(stats).filter(([key]) => key in statLabels).map(([key, value], i) => (
            <AnimatedSection key={key} delay={i * 0.1}>
              <div className="text-center p-4">
                <span className="text-3xl">{statLabels[key].icon}</span>
                <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-primary-700 dark:text-primary-400">
                  {value}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {statLabels[key].label}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
