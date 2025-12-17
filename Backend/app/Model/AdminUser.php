<?php
namespace App\Model;

use App\Config\db;
use PDO;

class AdminUser {
    private $conn;

    public function __construct() {
        $database = new db();
        $this->conn = $database->getConnection();
    }

    public function getByEmail(string $email) {
        $sql = "SELECT id, name, email, password, role FROM admin_users WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
