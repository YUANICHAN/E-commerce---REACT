<?php
namespace App\Controller;

use App\Model\Order;
use App\Core\Session;
use PDOException;
use Exception;

class OrderController {
    private $orderModel;

    public function __construct() {
        $this->orderModel = new Order();
    }

    // Get all orders for logged-in user
    public function getUserOrders() {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            $orders = $this->orderModel->getOrdersByUserId($user_id);
            return json_encode([
                'success' => true,
                'data' => $orders
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error fetching orders: ' . $e->getMessage()
            ]);
        }
    }

    // Get single order details
    public function getOrderDetails($id) {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            $order = $this->orderModel->getOrderById($id, $user_id);
            if (!$order) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'message' => 'Order not found'
                ]);
            }

            return json_encode([
                'success' => true,
                'data' => $order
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error fetching order: ' . $e->getMessage()
            ]);
        }
    }

    // Get all orders (for admin)
    public function getAllOrders() {
        try {
            // Ensure admin session
            if (!Session::get('is_admin')) {
                http_response_code(403);
                return json_encode([
                    'success' => false,
                    'message' => 'Admin authentication required'
                ]);
            }
            error_log("getAllOrders called");
            $orders = $this->orderModel->getAllOrders();
            error_log("Orders fetched: " . count($orders) . " orders");
            return json_encode([
                'success' => true,
                'data' => $orders
            ]);
        } catch (PDOException $e) {
            error_log("Database error in getAllOrders: " . $e->getMessage());
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error fetching orders: ' . $e->getMessage()
            ]);
        } catch (Exception $e) {
            error_log("General error in getAllOrders: " . $e->getMessage());
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error fetching orders: ' . $e->getMessage()
            ]);
        }
    }

    // Update order status (for admin)
    public function updateOrderStatus($id) {
        try {
            // Ensure admin session
            if (!Session::get('is_admin')) {
                http_response_code(403);
                return json_encode([
                    'success' => false,
                    'message' => 'Admin authentication required'
                ]);
            }
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['status'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'Status is required'
                ]);
            }

            $result = $this->orderModel->updateOrderStatus($id, $data['status']);
            
            if ($result) {
                return json_encode([
                    'success' => true,
                    'message' => 'Order status updated successfully'
                ]);
            } else {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'message' => 'Order not found'
                ]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error updating order: ' . $e->getMessage()
            ]);
        }
    }
}
?>
