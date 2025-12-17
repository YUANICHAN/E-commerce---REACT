<?php
namespace App\Model;

use App\Config\db;
use PDO;

class Wishlist {
    private $conn;
    
    public function __construct() {
        $database = new db();
        $this->conn = $database->getConnection();
    }

    // Get all wishlist items for a user
    public function getWishlistByUserId($user_id) {
        $query = "SELECT w.id, w.product_id, p.name, p.price, p.image, p.category FROM wishlist w 
                  JOIN products p ON w.product_id = p.id 
                  WHERE w.user_id = :user_id 
                  ORDER BY w.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Check if product is in wishlist
    public function isInWishlist($user_id, $product_id) {
        $query = "SELECT id FROM wishlist WHERE user_id = :user_id AND product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':product_id', $product_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) !== false;
    }

    // Add to wishlist
    public function addToWishlist($user_id, $product_id) {
        // Check if already exists
        if ($this->isInWishlist($user_id, $product_id)) {
            return false;
        }

        $query = "INSERT INTO wishlist (user_id, product_id, created_at) 
                  VALUES (:user_id, :product_id, NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':product_id', $product_id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Remove from wishlist
    public function removeFromWishlist($id, $user_id) {
        $query = "DELETE FROM wishlist WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // Get wishlist count for a user
    public function getWishlistCount($user_id) {
        $query = "SELECT COUNT(*) as count FROM wishlist WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'] ?? 0;
    }
}
?>
