import { HotelRoomTripDetailsEntity } from "@/domain/entities";
import { CostTableEnum } from "../CostSummary/enums/costTable.enum";
import { CostTableType } from "../types/costTable.type";

const generateDataTable = (): CostTableType[] => {
  const costEnum = Object.values(CostTableEnum);
  const tableData = costEnum.map((name) => ({ name, total: 0, grandTotal: 0 }));
  return tableData;
};

const tableData: CostTableType[] = generateDataTable();

export const calculateCosts = (
  hotelRoomQuotations: HotelRoomTripDetailsEntity[],
  indirectCostPercentage: number = 5,
  serviceCost: number = 0
): CostTableType[] => {
  // 2. Crear un mapa de totales por hotel (suma acumulada para los repetidos)
  const totalPricesByHotel = hotelRoomQuotations.reduce((acc, quote) => {
    const hotelKey = `${quote.hotelRoom?.hotel?.id}-${quote.hotelRoom?.roomType}`;
    if (!acc[hotelKey]) {
      acc[hotelKey] = {
        number: 0,
        total: 0,
        hotelName: `${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`,
        indirectCost: 0,
        directCost: 0,
        totalCost: 0,
        serviceCost,
      };
    }
    acc[hotelKey].number += 1; // Incrementamos el número de habitaciones del mismo hotel
    acc[hotelKey].total += quote.costPerson || 0; // Sumamos el precio
    acc[hotelKey].directCost += quote.costPerson || 0;  + serviceCost; // Calculamos el costo directo
    acc[hotelKey].indirectCost +=
      (quote.costPerson || 0) * (indirectCostPercentage / 100); // Calculamos el costo indirecto
    acc[hotelKey].totalCost +=
      (quote.costPerson || 0 + serviceCost) +
      (quote.costPerson || 0) * (indirectCostPercentage / 100); // Calculamos el costo total
    return acc;
  }, {} as Record<string, { total: number; number: number, serviceCost: number; hotelName: string; indirectCost: number; directCost: number; totalCost: number }>);

  // 3. Calcular el total de todos los hoteles únicos
  const grandTotal = Object.values(totalPricesByHotel).reduce(
    (sum, hotel) => sum + hotel.total,
    0
  );

  // 4. Actualizar los datos de la tabla
  const totalPricesPerTableData = tableData.map((data) => {
    // Crear un objeto total con los totales por cada hotel único
    const hotelTotals = Object.keys(totalPricesByHotel).reduce(
      (totals, hotelKey) => {
        const { total, hotelName, number, indirectCost, directCost, totalCost, serviceCost } =
          totalPricesByHotel[hotelKey];
        return {
          ...totals,
          hotelName,
          [hotelName]: {
            total,
            number,
            indirectCost,
            directCost,
            totalCost,
            serviceCost,

          },
        };
      },
      {}
    );
    return {
      ...data,
      total: {
        ...hotelTotals, // Totales desglosados por hotel
      },
      grandTotal, // Total acumulado de todos los hoteles
    };
  });

  return totalPricesPerTableData;
};
