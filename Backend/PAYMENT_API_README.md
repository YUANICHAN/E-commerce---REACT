# Payment API Documentation (Mockup)

## Overview
This is a mockup payment API that simulates payment processing for the e-commerce application. It provides endpoints for payment processing, validation, status checking, and refunds.

⚠️ **Important**: This is a MOCKUP/DEMONSTRATION API only. It does NOT process real payments and should NOT be used in production.

## Features

### 1. Process Payment
**Endpoint**: `POST /api/payment/process`

Simulates payment processing and creates an order in the database.

**Request Body**:
```json
{
  "cartItems": [
    {
      "id": 1,
      "product_id": 1,
      "name": "Product Name",
      "price": 99.99,
      "quantity": 2
    }
  ],
  "subtotal": 199.98,
  "discount": 0,
  "shipping": 15.00,
  "tax": 15.99,
  "total": 230.97,
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "09123456789",
    "address": "123 Main St",
    "city": "Manila",
    "zipCode": "1000",
    "country": "Philippines"
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "Manila",
    "zipCode": "1000",
    "country": "Philippines"
  },
  "paymentMethod": {
    "type": "Credit Card",
    "cardNumber": "4111111111111111",
    "cardName": "John Doe",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

**Success Response**:
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "orderId": 123,
    "transactionId": "TXN_ABC123_1234567890",
    "amount": 230.97,
    "status": "paid",
    "paymentMethod": "Credit Card",
    "timestamp": "2025-12-17 10:30:45"
  }
}
```

**Test Scenarios**:
- Card ending in `0000` → Payment will be declined
- Any other card number → Payment will succeed
- Processing delay: 1.5 seconds

---

### 2. Validate Payment Method
**Endpoint**: `POST /api/payment/validate`

Validates payment method details (card number, CVV, expiry date).

**Request Body**:
```json
{
  "cardNumber": "4111111111111111",
  "cvv": "123",
  "expiryDate": "12/25"
}
```

**Success Response**:
```json
{
  "success": true,
  "message": "Payment method validated",
  "data": {
    "cardType": "Visa",
    "last4": "1111",
    "valid": true
  }
}
```

**Card Type Detection**:
- Starts with `4` → Visa
- Starts with `51-55` → Mastercard
- Starts with `34` or `37` → American Express

---

### 3. Get Payment Status
**Endpoint**: `GET /api/payment/status/{transactionId}`

Retrieves the status of a payment transaction.

**Success Response**:
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN_ABC123_1234567890",
    "status": "completed",
    "timestamp": "2025-12-17 10:30:45",
    "message": "Payment completed successfully"
  }
}
```

---

### 4. Refund Payment
**Endpoint**: `POST /api/payment/refund`

Simulates payment refund processing.

**Request Body**:
```json
{
  "orderId": 123,
  "amount": 230.97,
  "reason": "Customer request"
}
```

**Success Response**:
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "refundId": "REF_XYZ789",
    "amount": 230.97,
    "status": "refunded",
    "timestamp": "2025-12-17 10:30:45"
  }
}
```

**Processing delay**: 1 second

---

## Frontend Integration

### Cart Page
The Cart page now includes a "Proceed to Checkout" button that:
1. Validates the cart is not empty
2. Stores cart data in `sessionStorage`
3. Navigates to the checkout page

```javascript
const handleProceedToCheckout = () => {
  if (cartItems.length === 0) {
    // Show warning
    return;
  }
  sessionStorage.setItem('checkoutData', JSON.stringify({
    cartItems,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    appliedPromo
  }));
  window.location.href = '/checkout';
};
```

### Checkout Page
The Checkout page:
1. Loads cart data from `sessionStorage`
2. Collects shipping and payment information
3. Validates all required fields
4. Calls the payment API
5. Shows success/error messages
6. Redirects based on payment result

```javascript
const response = await paymentAPI.processPayment(paymentData);
if (response.success) {
  // Show success message and redirect
} else {
  // Show error message
}
```

---

## API Service (Frontend)

New payment API methods in `/Frontend/Users/src/Services/api.js`:

```javascript
export const paymentAPI = {
  processPayment: (paymentData) => 
    fetchAPI('/payment/process', { 
      method: 'POST', 
      body: JSON.stringify(paymentData) 
    }),
  
  validatePaymentMethod: (paymentMethod) => 
    fetchAPI('/payment/validate', { 
      method: 'POST', 
      body: JSON.stringify(paymentMethod) 
    }),
  
  getPaymentStatus: (transactionId) => 
    fetchAPI(`/payment/status/${transactionId}`, { 
      method: 'GET' 
    }),
  
  refundPayment: (refundData) => 
    fetchAPI('/payment/refund', { 
      method: 'POST', 
      body: JSON.stringify(refundData) 
    }),
};
```

---

## Database Schema Requirements

### Orders Table
The payment API expects the following columns in the `orders` table:

```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2),
  shipping_cost DECIMAL(10, 2),
  tax_amount DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'processing',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  shipping_address TEXT,
  billing_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

---

## Error Handling

### Common Error Responses

**400 Bad Request**:
```json
{
  "success": false,
  "message": "Missing required field: cartItems"
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

**402 Payment Required** (Card Declined):
```json
{
  "success": false,
  "message": "Payment declined. Please use a different payment method.",
  "error_code": "CARD_DECLINED"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Payment processing error: Database connection failed"
}
```

---

## Security Considerations (For Production)

This mockup does NOT include:
- ❌ PCI DSS compliance
- ❌ Card data encryption
- ❌ Secure token generation
- ❌ 3D Secure authentication
- ❌ Fraud detection
- ❌ SSL/TLS requirements

**For Production Use**:
1. Integrate with real payment gateway (Stripe, PayPal, etc.)
2. Never store card numbers or CVV
3. Use tokenization for payment methods
4. Implement proper authentication and authorization
5. Add rate limiting and abuse prevention
6. Enable audit logging
7. Comply with PCI DSS standards

---

## Testing

### Test Cards
- **Success**: Any card number except ending in `0000`
- **Declined**: Card ending in `0000` (e.g., `4111111111110000`)

### Test Flow
1. Add items to cart
2. Click "Proceed to Checkout"
3. Fill in shipping information
4. Fill in payment details
5. Submit order
6. View success/error message
7. Check order in database

---

## Files Modified/Created

### Backend:
- ✅ `Backend/app/Controller/PaymentController.php` (NEW)
- ✅ `Backend/app/Routes/web.php` (UPDATED)
- ✅ `Backend/app/Model/Order.php` (UPDATED)

### Frontend:
- ✅ `Frontend/Users/src/Pages/Users/Cart.jsx` (UPDATED)
- ✅ `Frontend/Users/src/Pages/Users/Checkout.jsx` (UPDATED)
- ✅ `Frontend/Users/src/Services/api.js` (UPDATED)

---

## Support
For questions or issues, please refer to the main project documentation.
