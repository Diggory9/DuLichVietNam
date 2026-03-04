export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("vi-VN").format(num);
}

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
}

export function getCloudinaryBlurUrl(src: string): string | undefined {
  const match = src.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/);
  if (!match) return undefined;
  return `${match[1]}e_blur:2000,q_1,w_20/${match[2]}`;
}
