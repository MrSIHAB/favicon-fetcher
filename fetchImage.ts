import {imageResponse} from "./types.ts";

export async function fetchImage(
  faviconLink: URL | string,
): Promise<imageResponse | null> {
  const imageRes = await fetch(faviconLink);
  if (!imageRes.ok) return null;
  const imageBuffer = await imageRes.arrayBuffer();
  const contentType = imageRes.headers.get("content-type") ||
    "image/x-icon";
  return ({
    imageBuffer,
    contentType,
  });
}
