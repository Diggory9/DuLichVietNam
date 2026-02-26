import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import type { Province } from "@/types";
import { REGION_LABELS } from "@/types";

interface ProvinceHeroProps {
  province: Province;
}

export default function ProvinceHero({ province }: ProvinceHeroProps) {
  return (
    <section className="relative h-[50vh] min-h-[400px]">
      <ImageWithFallback
        src={province.heroImage}
        alt={province.name}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      <Container className="relative h-full flex flex-col justify-end pb-12">
        <Breadcrumb items={[{ label: province.name }]} />
        <Badge variant="primary" className="w-fit">
          {REGION_LABELS[province.region]}
        </Badge>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          {province.name}
        </h1>
        <p className="mt-3 text-lg text-white/80 max-w-2xl leading-relaxed">
          {province.description}
        </p>
      </Container>
    </section>
  );
}
