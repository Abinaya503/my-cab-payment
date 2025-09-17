import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { PaymentMethod, PaymentRequest } from '../../models/payment.model';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent implements OnInit {
  
  // Credit card form data
  cardName: string = '';
  cardNumber: string = '';
  cardMonth: string = '';
  cardYear: string = '';
  cardCvv: string = '';
  
  // Component state
  isCardFlipped: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Payment data from route
  rideId: string = '';
  amount: number = 0;
  
  // Card validation
  minCardYear: number = new Date().getFullYear();
  minCardMonth: number = 1;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    // Get payment data from route parameters
    this.route.queryParams.subscribe(params => {
      this.rideId = params['rideId'] || '';
      this.amount = parseFloat(params['amount']) || 0;
    });
  }

  /**
   * Get card type based on card number
   */
  getCardType(): string {
    const number = this.cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(number)) return 'visa';
    if (/^(34|37)/.test(number)) return 'amex';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^6011/.test(number)) return 'discover';
    if (/^9792/.test(number)) return 'troy';
    
    return 'visa'; // default
  }

  /**
   * Get card mask based on card type
   */
  getCardMask(): string {
    return this.getCardType() === 'amex' ? '#### ###### #####' : '#### #### #### ####';
  }

  /**
   * Format card number with spaces
   */
  formatCardNumber(): string {
    const number = this.cardNumber.replace(/\s/g, '');
    const mask = this.getCardMask();
    let formatted = '';
    let numberIndex = 0;
    
    for (let i = 0; i < mask.length && numberIndex < number.length; i++) {
      if (mask[i] === '#') {
        formatted += number[numberIndex];
        numberIndex++;
      } else {
        formatted += mask[i];
      }
    }
    
    return formatted;
  }

  /**
   * Handle card number input
   */
  onCardNumberChange(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    // Remove non-numeric characters
    value = value.replace(/\D/g, '');
    
    // Limit length based on card type
    const maxLength = this.getCardType() === 'amex' ? 15 : 16;
    if (value.length > maxLength) {
      value = value.substring(0, maxLength);
    }
    
    this.cardNumber = value;
  }

  /**
   * Handle CVV focus - flip card
   */
  onCvvFocus(): void {
    this.isCardFlipped = true;
  }

  /**
   * Handle CVV blur - flip card back
   */
  onCvvBlur(): void {
    this.isCardFlipped = false;
  }

  /**
   * Handle year change - update minimum month
   */
  onYearChange(): void {
    if (this.cardYear === this.minCardYear.toString()) {
      this.minCardMonth = new Date().getMonth() + 1;
      if (parseInt(this.cardMonth) < this.minCardMonth) {
        this.cardMonth = '';
      }
    } else {
      this.minCardMonth = 1;
    }
  }

  /**
   * Validate credit card form
   */
  validateForm(): boolean {
    if (!this.cardName.trim()) {
      this.errorMessage = 'Please enter cardholder name';
      return false;
    }
    
    if (!this.cardNumber || this.cardNumber.length < 13) {
      this.errorMessage = 'Please enter a valid card number';
      return false;
    }
    
    if (!this.cardMonth) {
      this.errorMessage = 'Please select expiry month';
      return false;
    }
    
    if (!this.cardYear) {
      this.errorMessage = 'Please select expiry year';
      return false;
    }
    
    if (!this.cardCvv || this.cardCvv.length < 3) {
      this.errorMessage = 'Please enter a valid CVV';
      return false;
    }
    
    // Check if card is expired
    const currentDate = new Date();
    const expiryDate = new Date(parseInt(this.cardYear), parseInt(this.cardMonth) - 1);
    if (expiryDate < currentDate) {
      this.errorMessage = 'Card has expired';
      return false;
    }
    
    return true;
  }

  /**
   * Process credit card payment
   */
  processPayment(): void {
    if (!this.validateForm()) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    // Simulate payment processing
    setTimeout(() => {
      // Simulate 90% success rate
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        // Create payment request
        const paymentRequest: PaymentRequest = {
          rideId: this.rideId,
          userId: 'user-001', // In real app, get from auth service
          method: PaymentMethod.CARD,
          amount: this.amount
        };
        
        // Process payment
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
      } else {
        this.errorMessage = 'Payment declined. Please try again or use a different card.';
        this.isLoading = false;
      }
    }, 2000);
  }

  /**
   * Go back to payment page
   */
  goBack(): void {
    this.router.navigate(['/payment']);
  }

  /**
   * Get formatted card number for display
   */
  getDisplayCardNumber(): string {
    return this.formatCardNumber();
  }

  /**
   * Get masked card number for display
   */
  getMaskedCardNumber(): string {
    const formatted = this.formatCardNumber();
    const mask = this.getCardMask();
    let masked = '';
    let numberIndex = 0;
    
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === '#') {
        if (numberIndex < formatted.length) {
          // Show first 4 and last 4 digits, mask the rest
          if (numberIndex < 4 || numberIndex >= formatted.length - 4) {
            masked += formatted[numberIndex] || '';
          } else {
            masked += '*';
          }
          numberIndex++;
        } else {
          masked += mask[i];
        }
      } else {
        masked += mask[i];
      }
    }
    
    return masked;
  }

  /**
   * Get months for dropdown
   */
  getMonths(): Array<{value: string, label: string, disabled: boolean}> {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      const month = i < 10 ? '0' + i : i.toString();
      const disabled = this.cardYear === this.minCardYear.toString() && i < this.minCardMonth;
      months.push({
        value: month,
        label: month,
        disabled: disabled
      });
    }
    return months;
  }

  /**
   * Get years for dropdown
   */
  getYears(): number[] {
    const years = [];
    for (let i = 0; i < 12; i++) {
      years.push(this.minCardYear + i);
    }
    return years;
  }
}