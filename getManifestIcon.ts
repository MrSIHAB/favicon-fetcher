import {fetchImage} from "./fetchImage.ts";

export const getManifestIcon = async (url: string) => {
  const response = await fetch(url);
  const manifest = await response.json();

  const icon = manifest.icons?.[0 || 1 || 2];
  const baseUrl = new URL(url).origin;
  const faviconUrl = `${baseUrl}${icon.src}`;

  return fetchImage(faviconUrl);
};
