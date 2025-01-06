import parsePhoneNumber, {
  AsYouType,
  type CountryCode as CountryCodeLib,
  getExampleNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

export type CountryCode = CountryCodeLib;

export const phoneNumberAdapter = {
  format(phoneNumber: string, code?: CountryCode) {
    return new AsYouType(code).input(phoneNumber);
  },

  parse(phoneNumber: string, code: CountryCode) {
    return parsePhoneNumber(phoneNumber, code);
  },
  getExampleNumber(code: CountryCode) {
    return getExampleNumber(code, examples);
  },

  existsCountry(code: CountryCode) {
    return examples[code] !== undefined;
  },
};
