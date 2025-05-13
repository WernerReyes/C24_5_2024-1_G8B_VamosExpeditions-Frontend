import type { Platform } from "@/presentation/types";

type NavigatorUAData = {
  brands: { brand: string; version: string }[];
  platform: string;
  getHighEntropyValues?: (keys: string[]) => Promise<{ [key: string]: any }>;
  mobile: boolean;
};

function getDeviceInfo() {
  const nav = navigator as Navigator & { userAgentData?: NavigatorUAData };
  const uaData = nav.userAgentData;

  if (uaData) {
    const brands = uaData.brands || [];
    const mainBrand =
      brands.find((b) => b.brand !== "Not-A.Brand") || brands[0];

    return {
      browser: mainBrand.brand.toLowerCase().replace(/\s+/g, "-"),
      version: mainBrand.version,
      platform: uaData.platform,
      // isMobile: entropy?.mobile ?? false,
    };
  } else {
    // Fallback for browsers that don't support userAgentData
    let browser = detectBrowser();
    let version = "Unknown";

    return {
      browser,
      version,
      platform: navigator.platform || "Unknown",
    };
  }
}

export function getDeviceKey() {
  const info = getDeviceInfo();

  return `${info.browser}_${info.version}_${info.platform}`;
}

export function detectBrowser() {
  const ua = navigator.userAgent;

  if (
    /Brave/i.test(ua) ||
    ((navigator as any).brave &&
      typeof (navigator as any).brave.isBrave === "function")
  ) {
    return "brave";
  } else if (/Edg\//i.test(ua)) {
    return "edge";
  } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    return "opera";
  } else if (/Chrome\//i.test(ua)) {
    return "google-chrome";
  } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
    return "safari";
  } else if (/Firefox\//i.test(ua)) {
    return "firefox";
  } else {
    return "Desconocido";
  }
}

export function fromDeviceIdToObject(id: string): {
  browser: string;
  version: string;
  platform: Platform;
} {
  const [browser, version, platform] = id.split("_");
  if (browser.includes("-")) {
    const [firstPart, secondPart] = browser.split("-");
    return {
      browser: `${capitalizeFirstLetter(firstPart)} ${capitalizeFirstLetter(
        secondPart
      )}`,
      version,
      platform: platform as Platform,
    };
  }
  return {
    browser: capitalizeFirstLetter(browser),
    version,
    platform: platform as Platform,
  };
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
