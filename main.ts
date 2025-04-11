import app from "./app.ts";

Deno.serve({
  handler: app.fetch,
  hostname: "127.0.0.1",
  port: 2000,
  onListen({ hostname, port }) {
    console.log(`Server Started at http://${hostname}:${port}`);
  },
});
