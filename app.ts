import { Hono } from "@hono/hono";
import { getFavicon } from "./getFavicon.ts";

const app = new Hono();

const defaultImg = Deno.readFileSync("img/default.png").buffer;

app.get("/", async (c) => {
  try {
    let url = c.req.query("url");
    if (!url) return c.text("No URL found.", 403);
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    let res = await getFavicon(url);
    if (res === null) {
      // If there isn't any image, return default image
      res = {
        imageBuffer: defaultImg,
        contentType: "image/png",
      };
    }
    // if (!res.contentType.startsWith("image")) {
    //   const defaultImg = Deno.readFileSync("img/default.png").buffer;
    //   res = {
    //     imageBuffer: defaultImg,
    //     contentType: "image/png",
    //   };
    // }

    const { imageBuffer, contentType } = res;
    return c.body(imageBuffer, 200, { "Content-Type": contentType });
  } catch (err) {
    console.log(err);
    return c.body(defaultImg, 200, { "Content-Type": "image/png" });
  }
});

export default app;
