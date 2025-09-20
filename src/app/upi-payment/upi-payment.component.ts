import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import {PaymentService} from '../services/payment.service';
import {PaymentMethod, PaymentRequest} from '../models/payment.model';

@Component({
  selector: 'app-upi-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upi-payment.component.html',
  styleUrls: ['./upi-payment.component.css']
})
export class UpiPaymentComponent implements OnInit {
  rideId: string = '';
  amount: number = 0;
  upiId: string = 'yourmerchant@upi'; // Replace with your UPI ID
  qrUrl: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  // constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.rideId = this.route.snapshot.queryParamMap.get('rideId') || '';
    this.amount = +(this.route.snapshot.queryParamMap.get('amount') || 0);

    // 👉 Generate UPI payment link
    const upiString = `upi://pay?pa=${this.upiId}&pn=YourMerchantName&am=${this.amount}&cu=INR&tn=Ride Payment ${this.rideId}`;

    // 👉 Use Google Chart API to generate QR
     this.qrUrl = `data:image/webp;base64,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`;
}
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  openUpiApp(): void {
    // window.location.href = this.qrUrl;
    this.isLoading = true;
    this.errorMessage = '';
    const paymentRequest: PaymentRequest = {
      rideId: this.rideId,
      userId: 'user-001', // In real app, get from auth service
      method: PaymentMethod.UPI,
      amount: this.amount
    };
    this.paymentService.processPayment(paymentRequest).subscribe({
      next: (payment) => {
        this.isLoading = false;
        // Navigate back to payment page with success
        this.router.navigate(['/payment'], {
          queryParams: {
            paymentSuccess: 'true',
            paymentId: payment.paymentId
          }
        });
      },
      error: (error) => {
        this.errorMessage = error.message || 'Payment processing failed';
        this.isLoading = false;
      }
    });
  }
}
