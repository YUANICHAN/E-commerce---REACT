// Payment API Test Examples
// Copy-paste these into browser console or use Postman to test

// API Base URL
const API_URL = 'http://localhost:8000/api';

// Example 1: Process a successful payment
async function testSuccessfulPayment() {
  const paymentData = {
    cartItems: [
      {
        id: 1,
        product_id: 1,
        name: 'Premium Wireless Headphones',
        price: 299.99,
        quantity: 1
      },
      {
        id: 2,
        product_id: 2,
        name: 'Smart Watch Series 5',
        price: 399.99,
        quantity: 1
      }
    ],
    subtotal: 699.98,
    discount: 0,
    shipping: 0,
    tax: 55.99,
    total: 755.97,
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '09123456789',
      address: '123 Main Street, Apartment 4B',
      city: 'Manila',
      zipCode: '1000',
      country: 'Philippines'
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street, Apartment 4B',
      city: 'Manila',
      zipCode: '1000',
      country: 'Philippines'
    },
    paymentMethod: {
      type: 'Credit Card',
      cardNumber: '4111111111111111', // Test Visa card
      cardName: 'John Doe',
      expiryDate: '12/25',
      cvv: '123'
    }
  };

  try {
    const response = await fetch(`${API_URL}/payment/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    console.log('✅ Payment Success:', result);
    return result;
  } catch (error) {
    console.error('❌ Payment Error:', error);
  }
}

// Example 2: Test declined payment (card ending in 0000)
async function testDeclinedPayment() {
  const paymentData = {
    cartItems: [
      {
        id: 1,
        product_id: 1,
        name: 'Test Product',
        price: 99.99,
        quantity: 1
      }
    ],
    subtotal: 99.99,
    discount: 0,
    shipping: 15.00,
    tax: 7.99,
    total: 122.98,
    shippingAddress: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '09123456789',
      address: '123 Test St',
      city: 'Manila',
      zipCode: '1000',
      country: 'Philippines'
    },
    paymentMethod: {
      type: 'Credit Card',
      cardNumber: '4111111111110000', // This will be declined
      cardName: 'Test User',
      expiryDate: '12/25',
      cvv: '123'
    }
  };

  try {
    const response = await fetch(`${API_URL}/payment/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    console.log('❌ Payment Declined:', result);
    return result;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Example 3: Validate payment method
async function testValidatePayment() {
  const paymentMethod = {
    cardNumber: '4111111111111111',
    cvv: '123',
    expiryDate: '12/25'
  };

  try {
    const response = await fetch(`${API_URL}/payment/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentMethod)
    });

    const result = await response.json();
    console.log('✅ Validation Result:', result);
    return result;
  } catch (error) {
    console.error('❌ Validation Error:', error);
  }
}

// Example 4: Check payment status
async function testPaymentStatus(transactionId) {
  try {
    const response = await fetch(`${API_URL}/payment/status/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    console.log('✅ Payment Status:', result);
    return result;
  } catch (error) {
    console.error('❌ Status Error:', error);
  }
}

// Example 5: Process refund
async function testRefund(orderId, amount) {
  const refundData = {
    orderId: orderId,
    amount: amount,
    reason: 'Customer requested refund'
  };

  try {
    const response = await fetch(`${API_URL}/payment/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(refundData)
    });

    const result = await response.json();
    console.log('✅ Refund Result:', result);
    return result;
  } catch (error) {
    console.error('❌ Refund Error:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting Payment API Tests...\n');
  
  console.log('1️⃣ Testing successful payment...');
  const successResult = await testSuccessfulPayment();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('\n2️⃣ Testing declined payment...');
  await testDeclinedPayment();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('\n3️⃣ Testing payment method validation...');
  await testValidatePayment();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (successResult?.success && successResult?.data?.transactionId) {
    console.log('\n4️⃣ Testing payment status check...');
    await testPaymentStatus(successResult.data.transactionId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n5️⃣ Testing refund...');
    await testRefund(successResult.data.orderId, successResult.data.amount);
  }
  
  console.log('\n✅ All tests completed!');
}

// Uncomment to run:
// runAllTests();

// Or run individual tests:
// testSuccessfulPayment();
// testDeclinedPayment();
// testValidatePayment();
// testPaymentStatus('TXN_ABC123_1234567890');
// testRefund(123, 755.97);
