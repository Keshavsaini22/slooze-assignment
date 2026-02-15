export class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export class User extends BaseEntity {
  email: string;
  name: string;
  role: Role;
  country?: string;
  password?: string;
}

export class Restaurant extends BaseEntity {
  name: string;
  address: string;
  country: string;
}

export class MenuItem extends BaseEntity {
  name: string;
  description?: string;
  price: number;
  restaurantId: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class Order extends BaseEntity {
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
}

export class OrderItem extends BaseEntity {
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class Payment extends BaseEntity {
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
}
