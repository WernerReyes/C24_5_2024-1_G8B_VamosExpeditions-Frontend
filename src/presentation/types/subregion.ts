export const SUBREGIONS: string[] = [
  "Southern Asia",
  "Northern Europe",
  "Southern Europe",
  "Northern Africa",
  "Polynesia",
  "Middle Africa",
  "Caribbean",
  "Antarctica",
  "South America",
  "Western Asia",
  "Australia and New Zealand",
  "Central Europe",
  "Eastern Europe",
  "Western Europe",
  "Central America",
  "Western Africa",
  "Northern America",
  "Southern Africa",
  "South Antarctic Ocean",
  "Eastern Africa",
  "South-Eastern Asia",
  "Eastern Asia",
  "Melanesia",
  "Micronesia",
  "Central Asia",
];

export type Subregion = (typeof SUBREGIONS)[number];

export const generateRecordFirstLetter = <T extends string>(
  subregions: T[],
  defaultLetters: { [key: string]: string } = {}
): Record<T, string> => {
  return subregions.reduce((acc, subregion) => {
    acc[subregion] = defaultLetters[subregion] || subregion[0];
    return acc;
  }, {} as Record<T, string>);
};

export const firstLetterSubregions = generateRecordFirstLetter(SUBREGIONS, {
  "South America": "L", // L* for Latin America
});
