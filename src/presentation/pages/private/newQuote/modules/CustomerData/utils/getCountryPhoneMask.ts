import { phoneNumberAdapter, type CountryCode } from "@/core/adapters";
import type { ExternalCountryEntity } from "@/infraestructure/store/services";

export const getCountryPhoneMask = (country?: ExternalCountryEntity) => {
  if (country) {
    const countryCode = country.code as CountryCode;
    if (!phoneNumberAdapter.existsCountry(countryCode)) return null;
    const numberExample = phoneNumberAdapter
      .getExampleNumber(countryCode)
      ?.formatNational();
    const countryCallingCode =
      phoneNumberAdapter.getExampleNumber(countryCode)?.countryCallingCode;
    const numberReplaceByNine = numberExample?.replace(/[0-9]/g, "9");
    return `(+${countryCallingCode}) ${numberReplaceByNine}`;
  }

  return undefined;
};
