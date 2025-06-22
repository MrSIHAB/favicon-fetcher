import { imageResponse } from "./types.ts";

export async function fetchImage(
  faviconLink: URL | string,
): Promise<imageResponse | null> {
  const imageRes = await fetch(faviconLink, {
    headers: {
      contentType: "image/",
    },
  });
  console.log(imageRes.text);

  const imageBuffer = await imageRes.arrayBuffer();
  const contentType = imageRes.headers.get("content-type") ||
    "image/x-icon";

  console.log(imageBuffer, contentType);

  return ({
    imageBuffer,
    contentType,
  });
}
