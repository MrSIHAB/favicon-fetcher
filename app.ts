import {Hono} from "@hono/hono";
import {getFavicon} from "./getFavicon.ts";

const app = new Hono();

app.get("/", async (c) => {
  try {
    let url = c.req.query("url");
    if (!url) return c.text("No URL found.", 403);
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const res = await getFavicon(url);
    if (res === null) return c.text("No Favicon found.", 404);
    const { imageBuffer, contentType } = res;
    if (!contentType.startsWith("image")) {
      return c.text("No Image found.", 404);
    }

    return c.body(imageBuffer, 200, { "Content-Type": contentType });
  } catch (_) {
    return c.text("something went wrong", 500);
  }
});

export default app;
