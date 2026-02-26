import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AnimatedSection from "@/components/shared/AnimatedSection";
import ProvinceCard from "@/components/shared/ProvinceCard";
import { getAllProvinces } from "@/lib/data";

export default function ProvinceGrid() {
  const provinces = getAllProvinces();

  return (
    <section id="tinh-thanh" className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          title="Tỉnh thành nổi bật"
          subtitle="Khám phá những vùng đất tuyệt đẹp trên khắp Việt Nam"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {provinces.map((province, i) => (
            <AnimatedSection key={province.id} delay={i * 0.1}>
              <ProvinceCard province={province} />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
