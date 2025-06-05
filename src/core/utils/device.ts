export function detectBrowser() {
  const ua = navigator.userAgent;

  if (
    /Brave/i.test(ua) ||
    ((navigator as any).brave &&
      typeof (navigator as any).brave.isBrave === "function")
  ) {
    return "Brave";
  } else if (/Edg\//i.test(ua)) {
    return "Edge";
  } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    return "Opera";
  } else if (/Chrome\//i.test(ua)) {
    return "Google Chrome";
  } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
    return "Safari";
  } else if (/Firefox\//i.test(ua)) {
    return "Firefox";
  } else {
    return "Desconocido";
  }
}

