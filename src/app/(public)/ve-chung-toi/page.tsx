import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/shared/AnimatedSection";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Tìm hiểu về dự án Du Lịch Việt Nam – website quảng bá địa danh du lịch nổi tiếng của Việt Nam.",
};

const values = [
  {
    icon: "🎯",
    title: "Sứ mệnh",
    desc: "Quảng bá vẻ đẹp của đất nước và con người Việt Nam đến với bạn bè quốc tế và du khách trong nước.",
  },
  {
    icon: "💡",
    title: "Tầm nhìn",
    desc: "Trở thành nguồn cảm hứng và thông tin du lịch đáng tin cậy nhất cho những ai muốn khám phá Việt Nam.",
  },
  {
    icon: "🤝",
    title: "Giá trị",
    desc: "Thông tin chính xác, nội dung chất lượng, trải nghiệm người dùng tuyệt vời và tinh thần cộng đồng.",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Breadcrumb items={[{ label: "Về chúng tôi" }]} />

      <AnimatedSection>
        <div className="max-w-3xl mx-auto text-center mt-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Về chúng tôi
          </h1>
          <p className="mt-6 text-base sm:text-lg text-gray-500 leading-relaxed">
            Du Lịch Việt Nam là dự án phi lợi nhuận với mục tiêu quảng bá những địa danh du lịch nổi tiếng của Việt Nam.
            Chúng tôi mong muốn mang đến cho du khách những thông tin hữu ích, chính xác và cập nhật nhất
            về các điểm đến hấp dẫn trên khắp đất nước hình chữ S.
          </p>
        </div>
      </AnimatedSection>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {values.map((item, i) => (
          <AnimatedSection key={item.title} delay={i * 0.15}>
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-4xl">{item.icon}</span>
              <h3 className="mt-4 text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="mt-3 text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection className="mt-20 max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Dự án này được xây dựng với
          </h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Next.js", "TypeScript", "Tailwind CSS", "Motion"].map((tech) => (
              <div
                key={tech}
                className="bg-white rounded-xl p-4 text-center text-sm font-semibold text-gray-700 shadow-sm"
              >
                {tech}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Mã nguồn mở – deploy tự động trên Vercel.
          </p>
        </div>
      </AnimatedSection>
    </Container>
  );
}
