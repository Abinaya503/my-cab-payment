export interface Payment {
  paymentId: string;
  rideId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  timestamp: Date;
  receipt?: Receipt;
}

export interface Receipt {
  receiptId: string;
  paymentId: string;
  rideId: string;
  userId: string;
  driverId: string;
  amount: number;
  method: PaymentMethod;
  timestamp: Date;
  pickupLocation: string;
  dropoffLocation: string;
  distance: number;
  duration: number;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  tax: number;
  total: number;
}

export interface FareCalculation {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  tax: number;
  total: number;
  breakdown: FareBreakdown;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  tax: number;
  total: number;
}

export interface RideDetails {
  rideId: string;
  userId: string;
  driverId: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: number; // in kilometers
  duration: number; // in minutes
  startTime: Date;
  endTime: Date;
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  WALLET = 'WALLET'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface PaymentRequest {
  rideId: string;
  userId: string;
  method: PaymentMethod;
  amount: number;
}
