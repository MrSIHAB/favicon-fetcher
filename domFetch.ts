// Import the necessary module for parsing HTML
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
const perser = new DOMParser();

// Function to fetch the favicon from a URL
export async function fetchFavicon(url: string): Promise<string | null> {
  try {
    // Fetch the HTML content of the website
    const response = await fetch(url);
    const html = await response.text();

    // Parse the HTML content with deno_dom
    const document = perser.parseFromString(html, "text/html");

    // Look for a link tag with rel="icon" or rel="shortcut icon"
    const iconLink =
      document.querySelector("link[rel='icon']") ||
      document.querySelector("link[rel='shortcut icon']");

    // If no favicon link found, return null
    if (!iconLink) {
      return null;
    }

    // Extract the href attribute for the favicon URL
    const faviconUrl = iconLink.getAttribute("href");

    // If the href is relative, make it absolute
    if (faviconUrl && !faviconUrl.startsWith("http")) {
      if (faviconUrl.startsWith("/")) {
        const baseUrl = new URL(url);
        return new URL(faviconUrl, baseUrl).toString();
      }
      return `${url}/${faviconUrl}`;
    }

    return faviconUrl || null;
  } catch (_) {
    return null;
  }
}
