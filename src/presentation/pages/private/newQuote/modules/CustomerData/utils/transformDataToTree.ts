import type { CountryEntity } from "@/domain/entities";

export const transformDataToTree = (countries: CountryEntity[]) => {
    return countries.map((country) => ({
      key: country.code,
      label: country.name,
      selectable: false,
      children: country.cities.map((city: any) => ({
        key: city.id.toString(),
        label: city.name,
        selectable: true,
      })),
    }));
  };