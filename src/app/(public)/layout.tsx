import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { CompareProvider } from "@/components/compare/CompareProvider";
import CompareToolbar from "@/components/compare/CompareToolbar";
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
        <CompareProvider>
          <ToastProvider>
            <ReadingProgress />
            <Header />
            <PageTransition>
              <main className="min-h-screen">{children}</main>
            </PageTransition>
            <Footer />
            <CompareToolbar />
            <ScrollToTop />
          </ToastProvider>
        </CompareProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
