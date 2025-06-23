import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.49/deno-dom-wasm.ts";
import { imageResponse } from "./types.ts";

const parser = new DOMParser();
export async function svgFetch(url: string): Promise<imageResponse | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const document = parser.parseFromString(html, "text/html");

    const svgList = document.getElementsByTagName("svg");
    const contentType = response.headers.get("content-type") || "image/svg+xml";

    if (svgList.length == 0) return null;

    const svg = svgList[0].TEXT_NODE.toString();

    return {
      imageBuffer: svg,
      contentType,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
