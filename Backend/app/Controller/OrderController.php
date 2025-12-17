<?php
namespace App\Controller;

use App\Model\Order;
use App\Core\Session;
use PDOException;

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
}
?>
