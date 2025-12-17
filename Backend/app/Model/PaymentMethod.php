<?php
namespace App\Model;

use App\Config\db;
use PDO;

class PaymentMethod {
    private $conn;
    
    public function __construct() {
        $database = new db();
        $this->conn = $database->getConnection();
    }

    // Get all payment methods for a user
    public function getPaymentMethodsByUserId($user_id) {
        $query = "SELECT id, type, last4, expiry, holder_name, is_default FROM payment_methods WHERE user_id = :user_id ORDER BY is_default DESC, created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get single payment method
    public function getPaymentMethodById($id, $user_id) {
        $query = "SELECT id, type, last4, expiry, holder_name, is_default FROM payment_methods WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create payment method
    public function createPaymentMethod($user_id, $data) {
        if ($data['is_default']) {
            $query = "UPDATE payment_methods SET is_default = 0 WHERE user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
        }

        $query = "INSERT INTO payment_methods (user_id, type, last4, expiry, holder_name, is_default, created_at) 
                  VALUES (:user_id, :type, :last4, :expiry, :holder_name, :is_default, NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':type', $data['type']);
        $stmt->bindParam(':last4', $data['last4']);
        $stmt->bindParam(':expiry', $data['expiry']);
        $stmt->bindParam(':holder_name', $data['holder_name']);
        $stmt->bindParam(':is_default', $data['is_default']);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update payment method
    public function updatePaymentMethod($id, $user_id, $data) {
        if ($data['is_default']) {
            $query = "UPDATE payment_methods SET is_default = 0 WHERE user_id = :user_id AND id != :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
        }

        $query = "UPDATE payment_methods SET is_default = :is_default, updated_at = NOW() WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':is_default', $data['is_default']);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // Delete payment method
    public function deletePaymentMethod($id, $user_id) {
        $query = "DELETE FROM payment_methods WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
