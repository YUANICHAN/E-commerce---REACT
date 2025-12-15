<?php
namespace App\Model;
use App\Config\db;
use PDO;

class Products {
    private $conn;

    public function __construct(){
        $database = new db();
        $this->conn = $database->getConnection();
    }

    // Example method: Get all products
    public function getAllProducts() {
        $query = "SELECT p.id, p.name, p.description, p.price, p.stock, p.rating, p.image_url, p.status, c.name as category 
                  FROM products p 
                  LEFT JOIN categories c ON p.category_id = c.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Transform to match frontend expectations
        return array_map(function($product) {
            return [
                'id' => (int)$product['id'],
                'name' => $product['name'],
                'description' => $product['description'] ?? '',
                'category' => $product['category'] ?? 'Electronics',
                'price' => (float)$product['price'],
                'rating' => (float)($product['rating'] ?? 4.5),
                'status' => $product['status'],
                'reviews' => 100, 
                'inStock' => (int)$product['stock'] > 0,
                'stock' => (int)$product['stock'],
                'image' => $product['image_url'] ?? '📦'
            ];
        }, $products);
    }

    public function AddProduct($data) {
        $query = "INSERT INTO products (name, description, price, stock, category_id, image_url, status) 
                  VALUES (:name, :description, :price, :stock, :category_id, :image_url, :status)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':stock', $data['stock']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':image_url', $data['image_url']);
        $stmt->bindParam(':status', $data['status']);
        return $stmt->execute();
    }

    public function updateProduct($id, $data) {
        $query = "UPDATE products
                  SET name = :name,
                      description = :description,
                      price = :price,
                      stock = :stock,
                      category_id = :category_id,
                      image_url = :image_url,
                      status = :status
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':stock', $data['stock']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':image_url', $data['image_url']);
        $stmt->bindParam(':status', $data['status']);
        return $stmt->execute();
    }

    public function deleteProduct($id) {
        $query = "DELETE FROM products WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getProductById($id) {
        $query = "SELECT p.id, p.name, p.description, p.price, p.stock, p.rating, p.image_url, p.status, c.name as category 
                  FROM products p 
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$product) return null;
        return [
            'id' => (int)$product['id'],
            'name' => $product['name'],
            'description' => $product['description'],
            'category' => $product['category'] ?? 'Electronics',
            'price' => (float)$product['price'],
            'rating' => (float)($product['rating'] ?? 4.5),
            'status' => $product['status'],
            'reviews' => 100,
            'inStock' => (int)$product['stock'] > 0,
            'stock' => (int)$product['stock'],
            'image' => $product['image_url'] ?? '📦'
        ];
    }

    public function getCategoryIdByName($name) {
        $query = "SELECT id FROM categories WHERE name = :name LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? (int)$row['id'] : null;
    }

    public function getLastInsertId() {
        return $this->conn->lastInsertId();
    }
}
?>