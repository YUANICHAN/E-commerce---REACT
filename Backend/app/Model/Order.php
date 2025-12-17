<?php
namespace App\Model;

use App\Config\db;
use PDO;

class Order {
    private $conn;
    
    public function __construct() {
        $database = new db();
        $this->conn = $database->getConnection();
    }

    // Get all orders for a user
    public function getOrdersByUserId($user_id) {
        $query = "SELECT id, order_number, total, status, created_at, updated_at FROM orders WHERE user_id = :user_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get order details with items
    public function getOrderById($id, $user_id) {
        $query = "SELECT id, order_number, total, status, created_at, updated_at FROM orders WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create order
    public function createOrder($user_id, $data) {
        $query = "INSERT INTO orders (user_id, order_number, total, status, created_at) 
                  VALUES (:user_id, :order_number, :total, :status, NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':order_number', $data['order_number']);
        $stmt->bindParam(':total', $data['total']);
        $stmt->bindParam(':status', $data['status']);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update order status
    public function updateOrderStatus($id, $status) {
        $query = "UPDATE orders SET status = :status, updated_at = NOW() WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>
