export const getMenifestLink : Promise<string|null>= async (document: any, url: string)=>{

const menifestLink= document.querySelector("link[rel='menifest']")

if (!menifestLink) {
      return null;
    }

    // Extract the href attribute for the favicon URL
    const menifestUrl = menifestLink.getAttribute("href");

    // If the href is relative, make it absolute
    if (menifestUrl && ! menifestUrl.startsWith("http")) {
      if (menifestUrl.startsWith("//")){
         return "https:" + manifestUrl
    }
      if (menifestUrl.startsWith("/")) {
        const baseUrl = new URL(url);
        return new URL(menifestUrl, baseUrl).toString();
      }
      return `${url}/${menifestUrl}`;
    }

    return menifestUrl || null;

}

