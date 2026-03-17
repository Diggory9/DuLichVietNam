import * as Sentry from "@sentry/node";
import { env } from "./env";

export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn || env.nodeEnv !== "production") {
    console.log("[Sentry] Bỏ qua — chỉ bật ở production với SENTRY_DSN.");
    return;
  }

  Sentry.init({
    dsn,
    environment: env.nodeEnv,
    tracesSampleRate: 0.2,
  });

  console.log("[Sentry] Đã khởi tạo monitoring.");
}

export { Sentry };
