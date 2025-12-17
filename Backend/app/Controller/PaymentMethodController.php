<?php
namespace App\Controller;

use App\Model\PaymentMethod;
use App\Core\Session;
use PDOException;

class PaymentMethodController {
    private $paymentModel;

    public function __construct() {
        $this->paymentModel = new PaymentMethod();
    }

    // Get all payment methods for logged-in user
    public function getUserPaymentMethods() {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            $methods = $this->paymentModel->getPaymentMethodsByUserId($user_id);
            return json_encode([
                'success' => true,
                'data' => $methods
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error fetching payment methods: ' . $e->getMessage()
            ]);
        }
    }

    // Create new payment method
    public function createPaymentMethod() {
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
            
            if (!$data || !isset($data['type'], $data['last4'], $data['expiry'], $data['holder_name'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'Invalid request data'
                ]);
            }

            $data['is_default'] = $data['is_default'] ?? false;

            $id = $this->paymentModel->createPaymentMethod($user_id, $data);
            
            if ($id) {
                $newMethod = $this->paymentModel->getPaymentMethodById($id, $user_id);
                return json_encode([
                    'success' => true,
                    'data' => $newMethod,
                    'message' => 'Payment method added successfully'
                ]);
            }

            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Failed to add payment method'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error creating payment method: ' . $e->getMessage()
            ]);
        }
    }

    // Set as default payment method
    public function setDefaultPaymentMethod($id) {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            if ($this->paymentModel->updatePaymentMethod($id, $user_id, ['is_default' => true])) {
                $updatedMethod = $this->paymentModel->getPaymentMethodById($id, $user_id);
                return json_encode([
                    'success' => true,
                    'data' => $updatedMethod,
                    'message' => 'Default payment method updated'
                ]);
            }

            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Failed to update default payment method'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error updating payment method: ' . $e->getMessage()
            ]);
        }
    }

    // Update payment method
    public function updatePaymentMethod($id) {
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
            
            if (!$data) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'Invalid request data'
                ]);
            }

            if ($this->paymentModel->updatePaymentMethod($id, $user_id, $data)) {
                $updatedMethod = $this->paymentModel->getPaymentMethodById($id, $user_id);
                return json_encode([
                    'success' => true,
                    'data' => $updatedMethod,
                    'message' => 'Payment method updated successfully'
                ]);
            }

            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Failed to update payment method'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error updating payment method: ' . $e->getMessage()
            ]);
        }
    }

    // Delete payment method
    public function deletePaymentMethod($id) {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            if ($this->paymentModel->deletePaymentMethod($id, $user_id)) {
                return json_encode([
                    'success' => true,
                    'message' => 'Payment method deleted successfully'
                ]);
            }

            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Failed to delete payment method'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error deleting payment method: ' . $e->getMessage()
            ]);
        }
    }
}
?>
