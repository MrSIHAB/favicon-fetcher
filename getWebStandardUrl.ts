export const getWebStandardUrl = (
  baseUrl: string | URL,
  url: string,
): string | URL => {
  if (
    url.startsWith("http://") || url.startsWith("https://")
  ) return url;
  if (url.startsWith("//")) return ("https:" + url);
  if (url.startsWith("/")) {
    return (new URL(url, baseUrl)).href;
  }
  return (`${baseUrl}/${url}`);
};
