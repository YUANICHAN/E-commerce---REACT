<?php
namespace App\Model;
use App\Config\db;
use PDO;

class Categories {
    private $conn;

    public function __construct(){
        $database = new db();
        $this->conn = $database->getConnection();
    }

    public function getAllCategories() {
        $query = "SELECT id, name, icon FROM categories";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>