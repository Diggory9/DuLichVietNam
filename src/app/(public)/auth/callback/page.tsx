"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/ui/Container";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
      return;
    }

    if (token) {
      localStorage.setItem("dulichvietnam_token", token);
      router.push("/");
      router.refresh();
    } else {
      setError("Không nhận được token xác thực.");
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <section className="py-16 sm:py-24">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
            <a
              href="/dang-nhap"
              className="text-primary-600 hover:underline font-medium"
            >
              Quay lại đăng nhập
            </a>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-500">Đang xác thực...</p>
        </div>
      </Container>
    </section>
  );
}
