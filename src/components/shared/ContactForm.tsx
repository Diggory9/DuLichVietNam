"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = "Vui lòng nhập họ tên";
    if (!formData.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Email không hợp lệ";
    if (!formData.subject.trim()) errs.subject = "Vui lòng nhập chủ đề";
    if (!formData.message.trim()) errs.message = "Vui lòng nhập nội dung";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API_URL}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gửi thất bại");
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12 px-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Cảm ơn bạn đã liên hệ!
        </h3>
        <p className="mt-2 text-gray-600">
          Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.
        </p>
        <div className="mt-6">
          <Button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}>
            Gửi tin nhắn khác
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          id="name"
          label="Họ tên"
          placeholder="Nguyễn Văn A"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
        />
      </div>
      <Input
        id="subject"
        label="Chủ đề"
        placeholder="Chủ đề tin nhắn"
        value={formData.subject}
        onChange={(e) => handleChange("subject", e.target.value)}
        error={errors.subject}
      />
      <Textarea
        id="message"
        label="Nội dung"
        placeholder="Nhập nội dung tin nhắn..."
        rows={5}
        value={formData.message}
        onChange={(e) => handleChange("message", e.target.value)}
        error={errors.message}
      />
      {submitError && (
        <p className="text-red-600 text-sm">{submitError}</p>
      )}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi tin nhắn"}
      </Button>
    </form>
  );
}
