import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AnimatedSection from "@/components/shared/AnimatedSection";
import ContactForm from "@/components/shared/ContactForm";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với chúng tôi để đóng góp ý kiến, báo lỗi hoặc hợp tác quảng bá du lịch Việt Nam.",
};

const contactInfo = [
  { icon: "📧", label: "Email", value: "contact@dulichvietnam.vn" },
  { icon: "📍", label: "Địa chỉ", value: "Việt Nam" },
  { icon: "🕐", label: "Giờ làm việc", value: "Thứ 2 – Thứ 6, 9:00 – 17:00" },
];

export default function ContactPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Breadcrumb items={[{ label: "Liên hệ" }]} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <AnimatedSection className="lg:col-span-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Liên hệ với chúng tôi
          </h1>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Bạn có câu hỏi, góp ý hoặc muốn hợp tác? Hãy gửi tin nhắn cho chúng tôi.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-bold text-gray-900">Thông tin liên hệ</h3>
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.label}</p>
                  <p className="mt-0.5 font-semibold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </Container>
  );
}
