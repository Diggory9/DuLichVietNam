import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-32 text-center">
      <h1 className="text-8xl font-extrabold text-primary-200">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">
        Không tìm thấy trang
      </h2>
      <p className="mt-3 text-gray-500 max-w-md leading-relaxed">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy quay lại trang chủ để tiếp tục khám phá.
      </p>
      <div className="mt-8">
        <Button href="/">Quay lại trang chủ</Button>
      </div>
    </Container>
  );
}
