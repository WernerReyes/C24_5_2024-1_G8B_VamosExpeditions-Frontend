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
      const mainBrand = brands.find(b => b.brand !== 'Not-A.Brand') || brands[0];

     
      return {
        browser: mainBrand.brand.toLowerCase().replace(/\s+/g, '-'),
        version: mainBrand.version,
        platform: uaData.platform,
        // isMobile: entropy?.mobile ?? false,
      };
    } else {
      // Fallback con userAgent
      const ua = navigator.userAgent;
  
      let browser = 'Unknown';
      let version = 'Unknown';
  
      if (/Chrome\/([\d.]+)/.test(ua)) {
        browser = 'google-chrome';
      
      } else if (/Firefox\/([\d.]+)/.test(ua)) {
        browser = 'Firefox';
       
      } else if (/Safari\/([\d.]+)/.test(ua)) {
        browser = 'Safari';
       
      }
  
  
      return {
        browser,
        version,
        platform: navigator.platform || 'Unknown',
      
      };
    }
  }
  

  export async function getDeviceKey() {
    const info = await getDeviceInfo();
  
    return `${info.browser}_${info.version}_${info.platform}`;
  }

  