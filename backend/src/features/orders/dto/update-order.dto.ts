export class UpdateOrderStatusDto {
  status: string;
}

export class PlaceOrderDto {
  address: string;
  paymentMethod?: string;
}
