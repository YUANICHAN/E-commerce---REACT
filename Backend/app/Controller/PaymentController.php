<?php
namespace App\Controller;

use App\Model\Order;
use App\Model\Cart;
use App\Core\Session;
use PDOException;
use Exception;

class PaymentController {
    private $orderModel;
    private $cartModel;

    public function __construct() {
        $this->orderModel = new Order();
        $this->cartModel = new Cart();
    }

    /**
     * Process Payment - Mockup Payment API
     * Simulates payment processing and creates order
     */
    public function processPayment() {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                // For demo purposes, allow payment without login
                $user_id = 1; // Default user for testing
            }

            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validate required fields
            $requiredFields = ['cartItems', 'total', 'shippingAddress', 'paymentMethod'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field])) {
                    http_response_code(400);
                    return json_encode([
                        'success' => false,
                        'message' => "Missing required field: {$field}"
                    ]);
                }
            }

            // Simulate payment processing delay (only for card payments)
            $paymentMethod = $data['paymentMethod'];
            $isCOD = ($paymentMethod['type'] ?? '') === 'Cash on Delivery';
            
            if (!$isCOD) {
                usleep(1500000); // 1.5 second delay for card processing
            }

            // Mock card validation (only for card payments)
            if (isset($paymentMethod['cardNumber']) && !$isCOD) {
                $cardNumber = preg_replace('/\s+/', '', $paymentMethod['cardNumber']);
                
                // Simulate declined card (for testing)
                if (substr($cardNumber, -4) === '0000') {
                    http_response_code(402);
                    return json_encode([
                        'success' => false,
                        'message' => 'Payment declined. Please use a different payment method.',
                        'error_code' => 'CARD_DECLINED'
                    ]);
                }
            }

            // Generate mockup payment transaction ID
            $transactionId = $isCOD ? 'COD_' . strtoupper(uniqid()) . '_' . time() : 'TXN_' . strtoupper(uniqid()) . '_' . time();
            
            // Calculate order totals
            $subtotal = floatval($data['subtotal'] ?? 0);
            $shipping = floatval($data['shipping'] ?? 0);
            $tax = floatval($data['tax'] ?? 0);
            $discount = floatval($data['discount'] ?? 0);
            $total = floatval($data['total']);

            // Create order in database
            $orderData = [
                'user_id' => $user_id,
                'total_amount' => $total,
                'subtotal' => $subtotal,
                'shipping_cost' => $shipping,
                'tax_amount' => $tax,
                'discount_amount' => $discount,
                'status' => 'processing',
                'payment_status' => $isCOD ? 'pending' : 'paid',
                'payment_method' => $paymentMethod['type'] ?? 'Credit Card',
                'transaction_id' => $transactionId,
                'shipping_address' => json_encode($data['shippingAddress']),
                'billing_address' => json_encode($data['billingAddress'] ?? $data['shippingAddress']),
            ];

            // Create order
            $orderId = $this->orderModel->createOrder($orderData);

            if (!$orderId) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'message' => 'Failed to create order'
                ]);
            }

            // Add order items
            foreach ($data['cartItems'] as $item) {
                $this->orderModel->addOrderItem($orderId, [
                    'product_id' => $item['product_id'] ?? $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'product_name' => $item['name']
                ]);
            }

            // Clear cart after successful order (optional)
            // $this->cartModel->clearCart($user_id);

            return json_encode([
                'success' => true,
                'message' => 'Payment processed successfully',
                'data' => [
                    'orderId' => $orderId,
                    'transactionId' => $transactionId,
                    'amount' => $total,
                    'status' => 'paid',
                    'paymentMethod' => $paymentMethod['type'] ?? 'Credit Card',
                    'timestamp' => date('Y-m-d H:i:s')
                ]
            ]);

        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Payment processing error: ' . $e->getMessage()
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Unexpected error: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Validate Payment Method - Mockup Validation
     * Simulates payment method validation
     */
    public function validatePaymentMethod() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['cardNumber']) || !isset($data['cvv']) || !isset($data['expiryDate'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'Invalid payment details'
                ]);
            }

            // Mock validation logic
            $cardNumber = preg_replace('/\s+/', '', $data['cardNumber']);
            $cvv = $data['cvv'];
            $expiry = $data['expiryDate'];

            // Basic validation
            if (strlen($cardNumber) < 13 || strlen($cardNumber) > 19) {
                return json_encode([
                    'success' => false,
                    'message' => 'Invalid card number length'
                ]);
            }

            if (strlen($cvv) < 3 || strlen($cvv) > 4) {
                return json_encode([
                    'success' => false,
                    'message' => 'Invalid CVV'
                ]);
            }

            // Determine card type (mock)
            $cardType = 'Unknown';
            if (preg_match('/^4/', $cardNumber)) {
                $cardType = 'Visa';
            } elseif (preg_match('/^5[1-5]/', $cardNumber)) {
                $cardType = 'Mastercard';
            } elseif (preg_match('/^3[47]/', $cardNumber)) {
                $cardType = 'American Express';
            }

            return json_encode([
                'success' => true,
                'message' => 'Payment method validated',
                'data' => [
                    'cardType' => $cardType,
                    'last4' => substr($cardNumber, -4),
                    'valid' => true
                ]
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Validation error: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get Payment Status - Check transaction status
     */
    public function getPaymentStatus($transactionId) {
        try {
            // Mock payment status lookup
            return json_encode([
                'success' => true,
                'data' => [
                    'transactionId' => $transactionId,
                    'status' => 'completed',
                    'timestamp' => date('Y-m-d H:i:s'),
                    'message' => 'Payment completed successfully'
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error fetching payment status: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Refund Payment - Mockup refund processing
     */
    public function refundPayment() {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['orderId']) || !isset($data['amount'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'Missing required fields'
                ]);
            }

            // Simulate refund processing
            usleep(1000000); // 1 second delay

            $refundId = 'REF_' . strtoupper(uniqid());

            return json_encode([
                'success' => true,
                'message' => 'Refund processed successfully',
                'data' => [
                    'refundId' => $refundId,
                    'amount' => $data['amount'],
                    'status' => 'refunded',
                    'timestamp' => date('Y-m-d H:i:s')
                ]
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Refund error: ' . $e->getMessage()
            ]);
        }
    }
}
?>
