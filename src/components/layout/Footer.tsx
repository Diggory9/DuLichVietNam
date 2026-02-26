import Link from "next/link";
import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container>
        <div className="py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                VN
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Du Lịch Việt Nam
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Khám phá vẻ đẹp của đất nước Việt Nam qua những địa danh du lịch nổi tiếng từ Bắc vào Nam.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Tỉnh thành
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/tinh/ha-noi" className="text-sm hover:text-white transition-colors">
                  Hà Nội
                </Link>
              </li>
              <li>
                <Link href="/tinh/da-nang" className="text-sm hover:text-white transition-colors">
                  Đà Nẵng
                </Link>
              </li>
              <li>
                <Link href="/tinh/ho-chi-minh" className="text-sm hover:text-white transition-colors">
                  TP. Hồ Chí Minh
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Liên kết
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/ve-chung-toi" className="text-sm hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-sm hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Du Lịch Việt Nam. Dự án phi lợi nhuận quảng bá du lịch Việt Nam.
        </div>
      </Container>
    </footer>
  );
}
