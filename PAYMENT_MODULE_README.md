# Cab Booking System - Payment Processing Module

## Overview
This module implements a complete payment processing system for the Cab Booking System with fare calculation, payment processing, and receipt generation functionality.

## Features

### 1. Fare Calculation
- **Base Fare**: ₹50 (fixed)
- **Distance Rate**: ₹12 per kilometer
- **Time Rate**: ₹2 per minute
- **Tax**: 18% GST on subtotal
- **Total**: Base + Distance + Time + Tax

### 2. Payment Processing
- Support for multiple payment methods:
  - Credit/Debit Card
  - UPI
  - Digital Wallet
  - Cash
- Simulated payment processing with 90% success rate
- Real-time payment status updates

### 3. Receipt Generation
- Detailed receipt with ride information
- Complete fare breakdown
- Payment details and transaction ID
- Print functionality
- Professional receipt formatting

## File Structure

```
src/app/
├── models/
│   └── payment.model.ts          # Payment interfaces and enums
├── services/
│   └── payment.service.ts        # Payment business logic
├── components/
│   └── payment/
│       ├── payment.component.ts  # Payment component logic
│       ├── payment.component.html # Payment UI template
│       └── payment.component.css # Payment styling
└── app.routes.ts                 # Routing configuration
```

## Dummy Data

The module includes comprehensive dummy data for testing:

### Sample Rides
1. **Airport Terminal 1 → City Center Mall**
   - Distance: 15.5 km
   - Duration: 25 minutes
   - Total Fare: ₹285.40

2. **Central Railway Station → Tech Park**
   - Distance: 8.2 km
   - Duration: 18 minutes
   - Total Fare: ₹178.20

3. **Residential Area → Shopping Complex**
   - Distance: 5.8 km
   - Duration: 12 minutes
   - Total Fare: ₹142.60

## Usage

1. **Start the application**:
   ```bash
   npm start
   ```

2. **Navigate to Payment Module**:
   - Open http://localhost:4200
   - The app will redirect to the payment processing page

3. **Process a Payment**:
   - Select a ride from the dropdown
   - Review the fare calculation
   - Choose a payment method
   - Click "Pay" to process the payment
   - Generate and print receipt after successful payment

## API Endpoints (Simulated)

The service simulates the following REST API endpoints:

- `POST /api/payments/process` - Process payment
- `GET /api/payments/receipt/{rideId}` - Get receipt
- `GET /api/rides/{rideId}` - Get ride details

## Technical Details

### Technologies Used
- **Angular 19** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **CSS3** - Styling with modern features

### Key Features
- **Responsive Design** - Works on desktop and mobile
- **Real-time Updates** - Live payment status
- **Error Handling** - Comprehensive error management
- **Print Support** - Receipt printing functionality
- **Modern UI** - Clean and professional interface

### Payment Flow
1. User selects a ride
2. System calculates fare automatically
3. User chooses payment method
4. Payment is processed (simulated)
5. Receipt is generated and displayed
6. User can print or start new payment

## Testing

The module includes dummy data for comprehensive testing:
- Multiple ride scenarios
- Different payment methods
- Success and failure cases
- Various fare calculations

## Future Enhancements

Potential improvements for production:
- Integration with real payment gateways
- Database persistence
- User authentication
- Real-time ride tracking
- SMS/Email notifications
- Refund processing
- Payment history
- Analytics and reporting

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

To modify or extend the payment module:

1. **Add new payment methods**: Update `PaymentMethod` enum
2. **Modify fare calculation**: Update constants in `PaymentService`
3. **Change UI**: Modify component templates and styles
4. **Add features**: Extend service methods and component logic

## License

This is a demo implementation for educational purposes.
