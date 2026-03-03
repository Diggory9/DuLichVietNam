import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import ReadingProgress from "@/components/ui/ReadingProgress";
import PageTransition from "@/components/layout/PageTransition";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ToastProvider>
          <ReadingProgress />
          <Header />
          <PageTransition>
            <main className="min-h-screen">{children}</main>
          </PageTransition>
          <Footer />
          <ScrollToTop />
        </ToastProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
