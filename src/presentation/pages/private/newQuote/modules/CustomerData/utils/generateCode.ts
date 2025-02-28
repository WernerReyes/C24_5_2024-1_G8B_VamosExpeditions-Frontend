import { OrderType, TravelerStyle } from "@/domain/entities";
import { firstLetterSubregions, Subregion } from "@/presentation/types";


type GenerateCodeParams = {
  orderType?: OrderType;
  travelerStyle?: TravelerStyle;
  subregion?: Subregion;
  travelersAmount?: number;
  startDate?: Date;
};

export const generateCode = ({
  subregion,
  orderType,
  startDate,
  travelerStyle,
  travelersAmount,
}: GenerateCodeParams) => {
  const orderTypeCode = orderType?.slice(0, 1).toUpperCase() || "";
  const travelerStyleCode = travelerStyle?.slice(0, 1).toUpperCase() || "";
  const SubregionCode = subregion ? firstLetterSubregions[subregion] : "";
  const isShared = travelersAmount ? (travelersAmount > 1 ? "S" : "T") : "";
  const dateCode = startDate ? generateDateCode(startDate) : "";
  return `${orderTypeCode}${travelerStyleCode}${isShared}${SubregionCode}${dateCode}`;
};

const generateDateCode = (date: Date) => {
  //* Format: 240918
  //* Example: 18 de septiembre de 2024
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
};
