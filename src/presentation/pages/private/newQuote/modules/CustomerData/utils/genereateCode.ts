import { Continent, OrderType, TravelerStyle } from "@/domain/entities";

const firstLetterContinents: Record<Continent, string> = {
  Africa: "A",
  Antarctica: "N",
  Asia: "A",
  Europe: "E",
  Oceania: "O",
  "South America": "L",
  "North America": "N",
};

type GenerateCodeParams = {
  orderType?: OrderType;
  travelerStyle?: TravelerStyle;
  continent?: Continent;
  travelersAmount?: number;
  startDate?: Date;
};

export const generateCode = ({
  continent,
  orderType,
  startDate,
  travelerStyle,
  travelersAmount,
}: GenerateCodeParams) => {
  const orderTypeCode = orderType?.slice(0, 1).toUpperCase() || "";
  const travelerStyleCode = travelerStyle?.slice(0, 1).toUpperCase() || "";
  const continentCode = continent ? firstLetterContinents[continent] : "";
  const isShared = travelersAmount ? (travelersAmount > 1 ? "S" : "T") : "";
  const dateCode = startDate ? generateDateCode(startDate) : "";
  return `${orderTypeCode}${travelerStyleCode}${isShared}${continentCode}${dateCode}`;
};

const generateDateCode = (date: Date) => {
  //* Format: 200918
  //* Example: 18 de septiembre de 2024
  const year = date.getFullYear().toString().slice(0, 2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  console.log(year, date.getFullYear().toString().slice(-1));
  return `${year}${month}${day}`;
};
