import Link from "next/link";
import Container from "@/components/ui/Container";
import MobileNav from "./MobileNav";
import SearchBar from "@/components/shared/SearchBar";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/kham-pha", label: "Khám phá" },
  { href: "/cau-chuyen", label: "Câu chuyện" },
  { href: "/bai-viet", label: "Bài viết" },
  { href: "/ban-do", label: "Bản đồ" },
  { href: "/lo-trinh", label: "Lộ trình" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm dark:bg-gray-900/90 dark:border-gray-800">
      <Container>
        <nav className="flex items-center justify-between h-16 sm:h-[72px]">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
              VN
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Du Lịch <span className="text-primary-600 dark:text-primary-400">Việt Nam</span>
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
                className="px-3 py-2 text-[13px] font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-800 dark:hover:text-primary-400 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/yeu-thich"
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Yêu thích"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>
            <ThemeToggle />
            <NotificationBell />
            <UserMenu />
          </div>

          <MobileNav links={navLinks} />
        </nav>
      </Container>
    </header>
  );
}
