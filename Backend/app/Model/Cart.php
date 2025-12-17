<?php
    namespace App\Model;
    use App\Config\db;
    use PDO;

    class Cart {
        private $conn;

        public function __construct(){
            $database = new db();
            $this->conn = $database->getConnection();
        }

        public function addtoCart($userId, $productId, $quantity) {
            //check if product already in cart
            $Checkquery = "SELECT id, quantity FROM cart WHERE user_id = :user_id AND  product_id = :product_id";
            $stmt = $this->conn->prepare($Checkquery);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();

            if($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                $updatequery = "UPDATE cart SET quantity = quantity + :quantity WHERE id = :id";
                $stmtUpdate = $this->conn->prepare($updatequery);
                $stmtUpdate->bindParam(':quantity', $quantity);
                $stmtUpdate->bindParam(':id', $row['id']);
                $stmtUpdate->execute();
            } else {
                $query = "INSERT INTO cart (user_id, product_id, quantity) VALUES (:user_id, :product_id, :quantity)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->bindParam(':product_id', $productId);
                $stmt->bindParam(':quantity', $quantity);
                $stmt->execute();
            }
        }

        public function getUserCart($userId) {
            $query = "SELECT c.id, c.product_id, p.name, p.image_url, p.price, c.quantity 
                      FROM cart c 
                      JOIN products p ON c.product_id = p.id 
                      WHERE c.user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function removeFromCart($cartId, $userId) {
            $query = "DELETE FROM cart WHERE id = :cart_id AND user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':cart_id', $cartId);
            $stmt->bindParam(':user_id', $userId);
            return $stmt->execute();
        }

        public function updateCartItem($cartId, $userId, $quantity) {
            $query = "UPDATE cart SET quantity = :quantity WHERE id = :cart_id AND user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':cart_id', $cartId);
            $stmt->bindParam(':user_id', $userId);
            return $stmt->execute();
        }
    }
?>