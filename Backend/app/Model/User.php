<?php
    namespace App\Model;

    use App\Config\db;
    use PDO;

    class User {
        private $conn;
        
        public function __construct(){
            $database = new db();
            $this->conn = $database->getConnection();
        }

        // Get all users
        public function getAllUsers() {
            $query = "SELECT id, name, email, phone, address, city, country, zipcode, status FROM users";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        // Get single user by id (matches Controller:getProfile)
        public function getUserById($id) {
            $query = "SELECT id, name, email, phone, address, city, country, zipcode, status FROM users WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function getUserByEmail(string $email) {
            $query = "SELECT id, name, email, password, status FROM users WHERE email = :email LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function createUser($data) {
            $query = "INSERT INTO users (name, email, phone, address, city, country, zipcode, status) 
                      VALUES (:name, :email, :phone, :address, :city, :country, :zipcode, :status)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':address', $data['address']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':country', $data['country']);
            $stmt->bindParam(':zipcode', $data['zipcode']);
            $stmt->bindParam(':status', $data['status']);
            return $stmt->execute();
        }

        // Update user fields by id (matches Controller:updateProfile)
        public function updateUser($id, array $data) {
            if (empty($data)) {
                return false;
            }

            $allowed = ['name','email','phone','address','city','country','zipcode','status','password'];
            $setParts = [];
            $params = [':id' => $id];
            foreach ($data as $key => $value) {
                if (in_array($key, $allowed, true)) {
                    $param = ':' . $key;
                    $setParts[] = "$key = $param";
                    $params[$param] = $value;
                }
            }

            if (empty($setParts)) {
                return false;
            }

            $sql = 'UPDATE users SET ' . implode(', ', $setParts) . ' WHERE id = :id';
            $stmt = $this->conn->prepare($sql);
            foreach ($params as $param => $value) {
                $stmt->bindValue($param, $value);
            }
            return $stmt->execute();
        }

        // Delete user by id (matches Controller:deleteProfile)
        public function deleteUser($id) {
            $stmt = $this->conn->prepare('DELETE FROM users WHERE id = :id');
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
        }
    }
?>