export interface GetDishesToCartByUserResponse<T> {
  readonly cart: T[];
  readonly totalQuantity: number;
  readonly totalPayment: number;
}
