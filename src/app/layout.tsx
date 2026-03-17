import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/data";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();

  return {
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    metadataBase: new URL(site.url),
    openGraph: {
      title: site.name,
      description: site.description,
      url: site.url,
      siteName: site.name,
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Du Lịch VN" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("dulichvietnam_theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})();if("serviceWorker"in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js")})}`,
          }}
        />
      </head>
      <body className={`${beVietnamPro.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
