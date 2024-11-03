import type { OrderDishStatusEnum } from "@/domain/entities";

export interface GetOrderDishesByUserResponse<T> {
  status: OrderDishStatusEnum[];
  orderDishes: T[];
}
