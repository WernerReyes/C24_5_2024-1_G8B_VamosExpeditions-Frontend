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
  serviceDirectCost: number = 0,
  emptyHotelRoomName: string
): CostTableType[] => {
  // 2. Crear un mapa de totales por hotel (suma acumulada para los repetidos)
  const totalPricesByHotel = hotelRoomQuotations.reduce((acc, quote) => {
    const hotelKey = `${quote.hotelRoom?.hotel?.id}-${quote.hotelRoom?.roomType}`;
    if (!acc[hotelKey]) {
      acc[hotelKey] = {
        number: 0,
        total: 0,
        hotelName: `${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`,

        directCost: 0,
      };
    }
    acc[hotelKey].number += 1; // Incrementamos el número de habitaciones del mismo hotel
    acc[hotelKey].total += quote.costPerson || 0; // Sumamos el precio
    acc[hotelKey].directCost += quote.costPerson || 0; // Calculamos el costo directo

    return acc;
  }, {} as Record<string, { total: number; number: number; hotelName: string; directCost: number }>);

  // 3. Calcular el total de todos los hoteles únicos
  const grandTotal = Object.values(totalPricesByHotel).reduce(
    (sum, hotel) => sum + hotel.total,
    0
  );

  // 4. Actualizar los datos de la tabla
  const totalPricesPerTableData = tableData.map((data) => {
    // Crear un objeto total con los totales por cada hotel único
    const hotelTotals =
      Object.keys(totalPricesByHotel).length > 0
        ? Object.keys(totalPricesByHotel).reduce((_, hotelKey) => {
            const { total, hotelName, number, directCost } =
              totalPricesByHotel[hotelKey];
            const directCostWithService = directCost + serviceDirectCost;
            const indirectCostWithService =
              (directCost + serviceDirectCost) * (indirectCostPercentage / 100);
            const totalCostWithService =
              directCostWithService + indirectCostWithService;
            return {
              // ...totals,
              // hotelName,
              [hotelName]: {
                total,
                number,
                indirectCost: indirectCostWithService,
                directCost: directCostWithService,
                totalCost: totalCostWithService,
                serviceCost: serviceDirectCost,
              },
            };
          }, {})
        : {
            [emptyHotelRoomName]: {
              total: 0,
              number: 0,
              indirectCost: serviceDirectCost * (indirectCostPercentage / 100),
              directCost: serviceDirectCost,
              totalCost:
                serviceDirectCost +
                serviceDirectCost * (indirectCostPercentage / 100),
              serviceCost: serviceDirectCost,
            },
          };
    return {
      ...data,
      total: {
        ...hotelTotals, // Totales desglosados por hotel
      },
      grandTotal, // Total acumulado de todos los hoteles
    };
  });

  console.log("totalPricesPerTableData", totalPricesPerTableData);

  return totalPricesPerTableData;
};
