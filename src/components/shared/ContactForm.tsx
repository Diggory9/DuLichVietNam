"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
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
      <div className="text-center py-12 px-6 bg-emerald-50 rounded-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-gray-900">
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
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Gửi tin nhắn
      </Button>
    </form>
  );
}
