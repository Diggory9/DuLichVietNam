import type { Metadata } from "next";
import ComparePageContent from "./ComparePageContent";

export const metadata: Metadata = {
  title: "So sánh địa danh",
  description: "So sánh các địa danh du lịch Việt Nam cạnh nhau",
};

export default function ComparePage() {
  return <ComparePageContent />;
}
