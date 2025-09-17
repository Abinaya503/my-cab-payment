import { Routes } from '@angular/router';
import { PaymentComponent } from './components/payment/payment.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { UpiPaymentComponent } from './upi-payment/upi-payment.component';
 

export const routes: Routes = [
  { path: '', redirectTo: '/payment', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent },
  { path: 'credit-card', component: CreditCardComponent },
  {path: 'upi-payment', component: UpiPaymentComponent},
  { path: '**', redirectTo: '/payment' }
];
