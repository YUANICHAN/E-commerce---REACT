<?php
namespace App\Model;

use App\Config\db;
use PDO;

class Address {
    private $conn;
    
    public function __construct() {
        $database = new db();
        $this->conn = $database->getConnection();
    }

    // Get all addresses for a user
    public function getAddressesByUserId($user_id) {
        $query = "SELECT id, type, name, address, city, state, zipcode, phone, country, is_default FROM addresses WHERE user_id = :user_id ORDER BY is_default DESC, created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get single address
    public function getAddressById($id, $user_id) {
        $query = "SELECT id, type, name, address, city, state, zipcode, phone, country, is_default FROM addresses WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create address
    public function createAddress($user_id, $data) {
        // If this is set as default, unset other defaults
        if ($data['is_default']) {
            $query = "UPDATE addresses SET is_default = 0 WHERE user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
        }

        $query = "INSERT INTO addresses (user_id, type, name, address, city, state, zipcode, phone, country, is_default, created_at) 
                  VALUES (:user_id, :type, :name, :address, :city, :state, :zipcode, :phone, :country, :is_default, NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':type', $data['type']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':address', $data['address']);
        $stmt->bindParam(':city', $data['city']);
        $stmt->bindParam(':state', $data['state']);
        $stmt->bindParam(':zipcode', $data['zipcode']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':country', $data['country']);
        $stmt->bindParam(':is_default', $data['is_default']);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update address
    public function updateAddress($id, $user_id, $data) {
        if ($data['is_default']) {
            $query = "UPDATE addresses SET is_default = 0 WHERE user_id = :user_id AND id != :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
        }

        $query = "UPDATE addresses SET type = :type, name = :name, address = :address, city = :city, state = :state, zipcode = :zipcode, phone = :phone, country = :country, is_default = :is_default, updated_at = NOW() WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':type', $data['type']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':address', $data['address']);
        $stmt->bindParam(':city', $data['city']);
        $stmt->bindParam(':state', $data['state']);
        $stmt->bindParam(':zipcode', $data['zipcode']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':country', $data['country']);
        $stmt->bindParam(':is_default', $data['is_default']);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // Delete address
    public function deleteAddress($id, $user_id) {
        $query = "DELETE FROM addresses WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
