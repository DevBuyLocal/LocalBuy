# Balance Payment Flow Implementation

## Overview
Complete implementation of balance payment flow for split payment orders, allowing users to complete their remaining balance payment after paying the initial delivery fee.

## Components Created

### 1. API Hooks (`src/api/order/use-balance-payment.ts`)
- **`useBalancePayment`**: Initializes balance payment with order linking
- **`useVerifyBalancePayment`**: Verifies completed balance payments

**Key Features:**
- Links balance payment to original order via `firstPaymentReference`
- Sends `orderId`, `balanceAmount`, and `firstPaymentReference` to backend
- Comprehensive error handling and logging
- Automatic data invalidation on success

### 2. Balance Payment Modal (`src/components/order/balance-payment-modal.tsx`)
- **Full-screen modal** for balance payment flow
- **WebView integration** for Paystack payment pages
- **Retry mechanism** with counter for failed payments
- **Payment state handling**: Success, Failed, Cancelled
- **Loading states** and user feedback
- **Automatic verification** when payment completes

### 3. Order Details Integration (`src/app/(main)/track-order.tsx`)
- **Payment status badges**: "PAID", "PARTIALLY PAID", "PENDING"
- **"Pay Balance Now" button** for split payment orders
- **Smart detection** of split payments and payment status
- **Order transaction analysis** to determine payment state

## API Endpoints Expected

### Initialize Balance Payment
```
POST /api/payment/orders/{orderId}/balance
```
**Payload:**
```json
{
  "balanceAmount": 15000,
  "firstPaymentReference": "T_abc123def456",
  "paymentMethod": "CARD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentReference": "T_xyz789ghi012",
    "paymentUrl": "https://checkout.paystack.com/...",
    "orderId": 74,
    "balanceAmount": 15000,
    "status": "PENDING",
    "transactionId": "txn_balance_123",
    "linkedPaymentReference": "T_abc123def456"
  }
}
```

### Verify Balance Payment
```
POST /api/payment/orders/{orderId}/balance/verify
```
**Payload:**
```json
{
  "reference": "T_xyz789ghi012"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentReference": "T_xyz789ghi012",
    "orderId": 74,
    "balanceAmount": 15000,
    "status": "PAID",
    "paidAt": "2024-01-15T10:30:00Z",
    "linkedPaymentReference": "T_abc123def456",
    "totalAmountPaid": 16000
  }
}
```

## User Experience Flow

1. **Order Details Page**: User sees "PARTIALLY PAID" badge and "Pay Balance Now" button
2. **Payment Initialization**: Modal opens, automatically initializes payment
3. **Paystack Payment**: User completes payment in WebView
4. **Automatic Verification**: System verifies payment and updates order status
5. **Success Feedback**: User sees success message and order updates to "PAID"

## Error Handling & Retry Mechanism

- **Initialization Failures**: User can retry payment initialization
- **Payment Failures**: Clear error messages with retry options
- **Network Issues**: WebView error handling with retry capability
- **Verification Failures**: Retry verification without re-payment

## Key Features Implemented

✅ **Order Linking**: Balance payments linked to original order via `firstPaymentReference`
✅ **Payment Status Badges**: Visual indicators for payment status
✅ **Retry Mechanism**: Comprehensive retry logic for all failure scenarios
✅ **Success/Failure/Cancellation Handling**: Complete payment state management
✅ **Real-time Status Updates**: Automatic data refresh after payment completion
✅ **User-friendly Messages**: Clear feedback for all payment states
✅ **Robust Error Handling**: Graceful handling of all error scenarios

## Testing Scenarios

1. **Successful Balance Payment**: Complete flow from order details to payment success
2. **Payment Failures**: Test retry mechanism and error messages
3. **Network Issues**: Verify WebView error handling and recovery
4. **Payment Cancellation**: Ensure proper handling when user cancels payment
5. **Already Paid Orders**: Verify "Pay Balance Now" button is hidden for completed orders

## Backend Requirements

The backend should:
1. **Link Payments**: Associate balance payment with original order using `firstPaymentReference`
2. **Update Order Status**: Mark order as fully paid when balance is completed
3. **Transaction History**: Maintain complete transaction history for the order
4. **Status Tracking**: Update `paymentStatus` and order `status` accordingly
