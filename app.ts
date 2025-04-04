import { Hono } from "jsr:@hono/hono";
import { fetchFavicon } from "./domFetch.ts";

const app = new Hono();

app.get("/", async (context) => {
  let url = context.req.query("url"); // Get url
  if (!url) return context.text("No URL found", 403);
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  let faviconUrl = await fetchFavicon(url); // Getting Favicon URL from DOM
  if (!faviconUrl) {
    faviconUrl = `${url}/favicon.ico`;
  }

  const imageResponse = await fetch(faviconUrl);
  if (imageResponse) {
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType =
      imageResponse.headers.get("content-type") || "image/x-icon";

    return context.body(imageBuffer, 200, { "Content-Type": contentType });
  } else {
    return context.text("Failed to fetch the favicon image.", 500);
  }
});

export default app;
