import { fetchImage } from "./fetchImage.ts";
import { getWebStandardUrl } from "./getWebStandardUrl.ts";

export const getManifestIcon = async (url: string) => {
  try {
    // ! remove all logs
    console.log("getting manifest url", url);

    const response = await fetch(url);
    const manifest = await response.json();

    const icon = manifest.icons?.[0 || 1 || 2];
    const baseUrl = new URL(url).origin;
    const faviconUrl = getWebStandardUrl(baseUrl, icon.src);

    console.log(icon.src);
    console.log(baseUrl);
    console.log(manifest);

    return fetchImage(faviconUrl);
  } catch (error) {
    console.log(error);
    return null;
  }
};
