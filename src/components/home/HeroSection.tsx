"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { API_URL } from "@/lib/api-config";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ provinces: 63, destinations: 233, regions: 3 });
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStats({
            provinces: json.data.provinces,
            destinations: json.data.destinations,
            regions: json.data.regions,
          });
        }
      })
      .catch(() => {});
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/kham-pha?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-primary-400/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <Container className="relative z-10 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-fade-slide-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Khám phá Việt Nam
            </span>
          </div>

          <h1
            className="animate-fade-slide-up mt-8 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight"
            style={{ animationDelay: "100ms" }}
          >
            Vẻ đẹp bất tận
            <br />
            của{" "}
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
              Việt Nam
            </span>
          </h1>

          <p
            className="animate-fade-slide-up mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-lg mx-auto"
            style={{ animationDelay: "200ms" }}
          >
            Từ những ruộng bậc thang miền Bắc đến những bãi biển xanh ngắt miền Trung
            và nhịp sống sôi động của Sài Gòn – Việt Nam luôn có điều kỳ diệu cho bạn.
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="animate-fade-slide-up mt-8 flex gap-2 max-w-md mx-auto"
            style={{ animationDelay: "300ms" }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Bạn muốn đi đâu?"
              className="flex-1 px-4 py-3 rounded-lg text-sm text-gray-900 bg-white/95 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-accent-400 outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors"
            >
              Tìm kiếm
            </button>
          </form>

          <div
            className="animate-fade-slide-up mt-6 flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: "400ms" }}
          >
            <Button href="#tinh-thanh" variant="secondary" size="lg">
              Khám phá ngay
            </Button>
            <Button
              href="/ve-chung-toi"
              variant="outline"
              size="lg"
              className="border-white/25 text-white hover:bg-white/10 hover:border-white/40"
            >
              Tìm hiểu thêm
            </Button>
          </div>

          {/* Quick stats */}
          <div
            className="animate-fade-slide-up mt-16 flex items-center gap-12 justify-center"
            style={{ animationDelay: "500ms" }}
          >
            {[
              { value: stats.provinces, label: "Tỉnh thành" },
              { value: stats.destinations, label: "Địa danh" },
              { value: stats.regions, label: "Vùng miền" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-xs sm:text-sm text-white/50 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
