import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { UpiPaymentComponent } from '../../upi-payment/upi-payment.component';

import { Payment, PaymentMethod, PaymentStatus, PaymentRequest, FareCalculation, Receipt, RideDetails } from '../../models/payment.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  display=true;
  hide(){
    this.display=!this.display;
  }
  
  // Component state
  selectedRideId: string = '';
  selectedPaymentMethod: PaymentMethod = PaymentMethod.CARD;
  fareCalculation: FareCalculation | null = null;
  payment: Payment | null = null;
  receipt: Receipt | null = null;
  isLoading = false;
  showReceipt = false;
  errorMessage = '';

  // Available data
  availableRides: RideDetails[] = [];
  paymentMethods = Object.values(PaymentMethod);

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
   this.loadAvailableRides();
    this.checkPaymentSuccess();
  }

  /**
   * Load available rides for payment
   */
  loadAvailableRides(): void {
    // In a real app, this would come from a ride service
    // For now, we'll use the dummy data from payment service
    this.paymentService.getRideDetails('ride-001').subscribe(ride => {
      if (ride) {
        this.availableRides = [ride];
        this.selectedRideId = ride.rideId;
        this.calculateFare();
      }
    });
  }

  /**
   * Calculate fare when ride is selected
   */
  calculateFare(): void {
    if (!this.selectedRideId) {
      this.fareCalculation = null;
      return;
    }

    this.paymentService.getRideDetails(this.selectedRideId).subscribe(ride => {
      if (ride) {
        this.fareCalculation = this.paymentService.calculateFare(ride);
      }
    });
  }

  /**
   * Process payment
   */
  processPayment(): void {
    if (!this.fareCalculation || !this.selectedRideId) {
      this.errorMessage = 'Please select a ride and ensure fare is calculated';
      return;
    }

    // If credit card is selected, navigate to credit card component
    if (this.selectedPaymentMethod === PaymentMethod.CARD) {
      this.router.navigate(['/credit-card'], {
        queryParams: { 
          rideId: this.selectedRideId,
          amount: this.fareCalculation.total
        }
      });
      return;
    }

    if (this.selectedPaymentMethod === PaymentMethod.UPI) {
      this.router.navigate(['/upi-payment'], {
        queryParams: { 
          rideId: this.selectedRideId,
          amount: this.fareCalculation.total
        }
      });
      return;
    }

    // For other payment methods, process directly
    this.isLoading = true;
    this.errorMessage = '';

    const paymentRequest: PaymentRequest = {
      rideId: this.selectedRideId,
      userId: 'user-001', // In real app, get from auth service
      method: this.selectedPaymentMethod,
      amount: this.fareCalculation.total
    };

    this.paymentService.processPayment(paymentRequest).subscribe({
      next: (payment) => {
        this.payment = payment;
        this.isLoading = false;
        this.router.navigate(['/receipt', payment.paymentId]);
        //this.generateReceipt();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Payment processing failed';
        this.isLoading = false;
      }
    });
  }

  /**
   * Generate receipt after successful payment
   */
  generateReceipt(): void {
    if (!this.payment) return;

    this.paymentService.generateReceipt(this.payment.paymentId).subscribe({
      next: (receipt) => {
        this.receipt = receipt;
        this.showReceipt = true;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to generate receipt';
      }
    });
  }

  /**
   * Reset form for new payment
   */
  resetForm(): void {
    this.payment = null;
    this.receipt = null;
    this.showReceipt = false;
    this.errorMessage = '';
    this.selectedPaymentMethod = PaymentMethod.CARD;
  }

  /**
   * Print receipt
   */
  printReceipt(): void {
    if (this.receipt) {
      window.print();
    }
  }

  /**
   * Get payment method display name
   */
  getPaymentMethodDisplay(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.CARD:
        return 'Credit/Debit Card';
      case PaymentMethod.UPI:
        return 'UPI';
      case PaymentMethod.WALLET:
        return 'Digital Wallet';
      case PaymentMethod.CASH:
        return 'Cash';
      default:
        return method;
    }
  }

  /**
   * Get payment status display
   */
  getPaymentStatusDisplay(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'Pending';
      case PaymentStatus.PROCESSING:
        return 'Processing';
      case PaymentStatus.COMPLETED:
        return 'Completed';
      case PaymentStatus.FAILED:
        return 'Failed';
      case PaymentStatus.REFUNDED:
        return 'Refunded';
      default:
        return status;
    }
  }

  /**
   * Get payment status class for styling
   */
  getPaymentStatusClass(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'status-completed';
      case PaymentStatus.FAILED:
        return 'status-failed';
      case PaymentStatus.PROCESSING:
        return 'status-processing';
      case PaymentStatus.PENDING:
        return 'status-pending';
      case PaymentStatus.REFUNDED:
        return 'status-refunded';
      default:
        return '';
    }
  }

  /**
   * Get selected ride distance
   */
  getSelectedRideDistance(): number {
    const ride = this.availableRides.find(r => r.rideId === this.selectedRideId);
    return ride ? ride.distance : 0;
  }

  /**
   * Get selected ride duration
   */
  getSelectedRideDuration(): number {
    const ride = this.availableRides.find(r => r.rideId === this.selectedRideId);
    return ride ? ride.duration : 0;
  }

  /**
   * Check for payment success from credit card component
   */
  checkPaymentSuccess(): void {
    this.route.queryParams.subscribe(params => {
      if (params['paymentSuccess'] === 'true' && params['paymentId']) {
        // Payment was successful, show success message and generate receipt
        this.paymentService.getPayment(params['paymentId']).subscribe(payment => {
          if (payment) {
            this.payment = payment;
            this.generateReceipt();
          }
        });
      }
    });
  }
}