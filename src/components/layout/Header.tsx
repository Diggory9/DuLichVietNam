import Link from "next/link";
import Container from "@/components/ui/Container";
import MobileNav from "./MobileNav";
import SearchBar from "@/components/shared/SearchBar";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/kham-pha", label: "Khám phá" },
  { href: "/bai-viet", label: "Bài viết" },
  { href: "/tinh/ha-noi", label: "Hà Nội" },
  { href: "/tinh/da-nang", label: "Đà Nẵng" },
  { href: "/tinh/ho-chi-minh", label: "Hồ Chí Minh" },
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <Container>
        <nav className="flex items-center justify-between h-16 sm:h-[72px]">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
              VN
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Du Lịch <span className="text-primary-600">Việt Nam</span>
            </span>
          </Link>

          <div className="hidden lg:block flex-1 max-w-xs mx-6">
            <SearchBar />
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-[13px] font-medium text-gray-600 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <MobileNav links={navLinks} />
        </nav>
      </Container>
    </header>
  );
}
