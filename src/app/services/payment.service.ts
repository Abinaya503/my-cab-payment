import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Payment, PaymentMethod, PaymentStatus, PaymentRequest, FareCalculation, Receipt, RideDetails } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  // Dummy fare calculation constants
  private readonly BASE_FARE = 50; // Base fare in INR
  private readonly PER_KM_RATE = 12; // Rate per kilometer in INR
  private readonly PER_MINUTE_RATE = 2; // Rate per minute in INR
  private readonly TAX_RATE = 0.18; // 18% GST

  // Dummy data storage
  private payments: Payment[] = [];
  private receipts: Receipt[] = [];
  private rideDetails: RideDetails[] = [];

  constructor() {
    this.initializeDummyData();
  }

  /**
   * Calculate fare based on ride details
   */
  calculateFare(rideDetails: RideDetails): FareCalculation {
    const baseFare = this.BASE_FARE;
    const distanceFare = rideDetails.distance * this.PER_KM_RATE;
   const timeFare = rideDetails.duration * this.PER_MINUTE_RATE;
    const subtotal = baseFare + distanceFare ;
    const tax = subtotal * this.TAX_RATE;
    const total = subtotal + tax;

    return {
      baseFare,
      distanceFare,
      timeFare:0,
      tax,
      total,
      breakdown: {
        baseFare,
        distanceFare,
       timeFare:0,
        tax,
        total
      }
    };
  }

  /**
   * Process payment for a ride
   */
  processPayment(paymentRequest: PaymentRequest): Observable<Payment> {
    const payment: Payment = {
      paymentId: this.generatePaymentId(),
      rideId: paymentRequest.rideId,
      userId: paymentRequest.userId,
      amount: paymentRequest.amount,
      method: paymentRequest.method,
      status: PaymentStatus.PROCESSING,
      timestamp: new Date()
    };

    // Simulate payment processing delay
    return new Observable(observer => {
      setTimeout(() => {
        // Simulate payment success/failure (90% success rate)
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          payment.status = PaymentStatus.COMPLETED;
          this.payments.push(payment);
          observer.next(payment);
          observer.complete();
        } else {
          payment.status = PaymentStatus.FAILED;
          observer.error(new Error('Payment processing failed'));
        }
      }, 2000); // 2 second delay to simulate processing
    });
  }

  /**
   * Generate receipt for a completed payment
   */
  generateReceipt(paymentId: string): Observable<Receipt> {
    const payment = this.payments.find(p => p.paymentId === paymentId);
    
    if (!payment || payment.status !== PaymentStatus.COMPLETED) {
      return new Observable(observer => {
        observer.error(new Error('Payment not found or not completed'));
      });
    }

    const ride = this.rideDetails.find(r => r.rideId === payment.rideId);
    if (!ride) {
      return new Observable(observer => {
        observer.error(new Error('Ride details not found'));
      });
    }

    const fareCalculation = this.calculateFare(ride);
    
    const receipt: Receipt = {
      receiptId: this.generateReceiptId(),
      paymentId: payment.paymentId,
      rideId: payment.rideId,
      userId: payment.userId,
      driverId: ride.driverId,
      amount: payment.amount,
      method: payment.method,
      timestamp: payment.timestamp,
      pickupLocation: ride.pickupLocation,
      dropoffLocation: ride.dropoffLocation,
      distance: ride.distance,
      duration: ride.duration,
      baseFare: fareCalculation.baseFare,
      distanceFare: fareCalculation.distanceFare,
      timeFare: fareCalculation.timeFare,
      tax: fareCalculation.tax,
      total: fareCalculation.total
    };

    this.receipts.push(receipt);
    payment.receipt = receipt;

    return of(receipt).pipe(delay(500));
  }

  /**
   * Get payment by ID
   */
  getPayment(paymentId: string): Observable<Payment | undefined> {
    const payment = this.payments.find(p => p.paymentId === paymentId);
    return of(payment).pipe(delay(300));
  }

  /**
   * Get all payments for a user
   */
  getUserPayments(userId: string): Observable<Payment[]> {
    const userPayments = this.payments.filter(p => p.userId === userId);
    return of(userPayments).pipe(delay(300));
  }

  /**
   * Get receipt by payment ID
   */
  getReceipt(paymentId: string): Observable<Receipt | undefined> {
    const receipt = this.receipts.find(r => r.paymentId === paymentId);
    return of(receipt).pipe(delay(300));
  }

  /**
   * Get ride details by ID
   */
  getRideDetails(rideId: string): Observable<RideDetails | undefined> {
    const ride = this.rideDetails.find(r => r.rideId === rideId);
    return of(ride).pipe(delay(300));
  }

  /**
   * Initialize dummy data for testing
   */
  private initializeDummyData(): void {
    // Dummy ride details
    this.rideDetails = [
      {
        rideId: 'ride-001',
        userId: 'user-001',
        driverId: 'driver-001',
        pickupLocation: 'Airport Terminal 1',
        dropoffLocation: 'City Center Mall',
        distance: 15.5,
        duration: 25,
        startTime: new Date('2024-01-15T10:00:00'),
        endTime: new Date('2024-01-15T10:25:00')
      },
      {
        rideId: 'ride-002',
        userId: 'user-002',
        driverId: 'driver-002',
        pickupLocation: 'Central Railway Station',
        dropoffLocation: 'Tech Park',
        distance: 8.2,
        duration: 18,
        startTime: new Date('2024-01-15T14:30:00'),
        endTime: new Date('2024-01-15T14:48:00')
      },
      {
        rideId: 'ride-003',
        userId: 'user-003',
        driverId: 'driver-003',
        pickupLocation: 'Residential Area',
        dropoffLocation: 'Shopping Complex',
        distance: 5.8,
        duration: 12,
        startTime: new Date('2024-01-15T16:00:00'),
        endTime: new Date('2024-01-15T16:12:00')
      }
    ];

    // Dummy completed payments
    this.payments = [
      {
        paymentId: 'pay-001',
        rideId: 'ride-001',
        userId: 'user-001',
        amount: 285.4,
        method: PaymentMethod.CARD,
        status: PaymentStatus.COMPLETED,
        timestamp: new Date('2024-01-15T10:26:00')
      },
      {
        paymentId: 'pay-002',
        rideId: 'ride-002',
        userId: 'user-002',
        amount: 178.2,
        method: PaymentMethod.UPI,
        status: PaymentStatus.COMPLETED,
        timestamp: new Date('2024-01-15T14:49:00')
      }
    ];

    // Dummy receipts
    this.receipts = [
      {
        receiptId: 'receipt-001',
        paymentId: 'pay-001',
        rideId: 'ride-001',
        userId: 'user-001',
        driverId: 'driver-001',
        amount: 285.4,
        method: PaymentMethod.CARD,
        timestamp: new Date('2024-01-15T10:26:00'),
        pickupLocation: 'Airport Terminal 1',
        dropoffLocation: 'City Center Mall',
        distance: 15.5,
        duration: 25,
        baseFare: 50,
        distanceFare: 186,
        timeFare: 50,
        tax: 51.4,
        total: 285.4
      }
    ];
  }

  /**
   * Generate unique payment ID
   */
  private generatePaymentId(): string {
    return 'pay-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generate unique receipt ID
   */
  private generateReceiptId(): string {
    return 'receipt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
