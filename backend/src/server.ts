import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { initSocketIO } from "./lib/socket";

async function start() {
  await connectDB();

  const server = http.createServer(app);
  initSocketIO(server);

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
  });
}

start();
