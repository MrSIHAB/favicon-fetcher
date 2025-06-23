import { imageResponse } from "./types.ts";

export async function fetchImage(
  faviconLink: URL | string,
): Promise<imageResponse | null> {
  console.log(faviconLink);
  const imageRes = await fetch(faviconLink, {
    headers: {
      contentType: "image/",
    },
  });

  if (
    imageRes.status == 400 || imageRes.status == 401 ||
    imageRes.status == 402 ||
    imageRes.status == 404 ||
    imageRes.status == 405
  ) return null;

  const imageBuffer = await imageRes.arrayBuffer();
  let contentType = imageRes.headers.get("content-type");

  if (!contentType) return null;
  if (!contentType.startsWith("image") && !contentType.includes("document")) {
    if (faviconLink.toString().endsWith("svg")) {
      contentType = "text/html";
    } else {
      return null;
    }
  }

  return ({
    imageBuffer,
    contentType,
  });
}
