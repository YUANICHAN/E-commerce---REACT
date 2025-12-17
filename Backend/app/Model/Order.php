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
        $query = "SELECT 
                    id, 
                    order_number, 
                    total_amount as total, 
                    amount,
                    subtotal,
                    shipping_cost,
                    tax_amount,
                    discount_amount,
                    status, 
                    payment_status,
                    payment_method,
                    transaction_id,
                    created_at, 
                    updated_at 
                  FROM orders 
                  WHERE user_id = :user_id 
                  ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get all orders (for admin)
    public function getAllOrders() {
        $query = "SELECT 
                    o.id, 
                    o.order_number, 
                    o.user_id,
                    u.name as customer_name,
                    u.email as customer_email,
                    o.total_amount, 
                    o.amount,
                    o.subtotal,
                    o.shipping_cost,
                    o.tax_amount,
                    o.discount_amount,
                    o.status, 
                    o.payment_status,
                    o.payment_method,
                    o.transaction_id,
                    o.shipping_address,
                    o.billing_address,
                    o.location_lat,
                    o.location_lng,
                    o.created_at, 
                    o.updated_at 
                  FROM orders o
                  LEFT JOIN users u ON o.user_id = u.id
                  ORDER BY o.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get order details with items
    public function getOrderById($id, $user_id) {
        $query = "SELECT 
                    id, 
                    order_number, 
                    user_id,
                    total_amount as total, 
                    amount,
                    subtotal,
                    shipping_cost,
                    tax_amount,
                    discount_amount,
                    status, 
                    payment_status,
                    payment_method,
                    transaction_id,
                    shipping_address,
                    billing_address,
                    created_at, 
                    updated_at 
                  FROM orders 
                  WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create order
    public function createOrder($data) {
        $orderNumber = 'ORD-' . strtoupper(uniqid()) . '-' . time();
        
        $query = "INSERT INTO orders (
                    user_id, order_number, total_amount, subtotal, shipping_cost, 
                    tax_amount, discount_amount, status, payment_status, payment_method, 
                    transaction_id, shipping_address, billing_address, created_at
                  ) VALUES (
                    :user_id, :order_number, :total_amount, :subtotal, :shipping_cost,
                    :tax_amount, :discount_amount, :status, :payment_status, :payment_method,
                    :transaction_id, :shipping_address, :billing_address, NOW()
                  )";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $data['user_id']);
        $stmt->bindParam(':order_number', $orderNumber);
        $stmt->bindParam(':total_amount', $data['total_amount']);
        $stmt->bindParam(':subtotal', $data['subtotal']);
        $stmt->bindParam(':shipping_cost', $data['shipping_cost']);
        $stmt->bindParam(':tax_amount', $data['tax_amount']);
        $stmt->bindParam(':discount_amount', $data['discount_amount']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':payment_status', $data['payment_status']);
        $stmt->bindParam(':payment_method', $data['payment_method']);
        $stmt->bindParam(':transaction_id', $data['transaction_id']);
        $stmt->bindParam(':shipping_address', $data['shipping_address']);
        $stmt->bindParam(':billing_address', $data['billing_address']);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Add order item
    public function addOrderItem($order_id, $itemData) {
        $query = "INSERT INTO order_items (
                    order_id, product_id, product_name, quantity, price, created_at
                  ) VALUES (
                    :order_id, :product_id, :product_name, :quantity, :price, NOW()
                  )";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':order_id', $order_id);
        $stmt->bindParam(':product_id', $itemData['product_id']);
        $stmt->bindParam(':product_name', $itemData['product_name']);
        $stmt->bindParam(':quantity', $itemData['quantity']);
        $stmt->bindParam(':price', $itemData['price']);
        
        return $stmt->execute();
    }

    // Get order items
    public function getOrderItems($order_id) {
        $query = "SELECT * FROM order_items WHERE order_id = :order_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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
