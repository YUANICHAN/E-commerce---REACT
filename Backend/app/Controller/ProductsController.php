<?php
    namespace App\Controller;

    use App\Model\Products;
    use PDOException;

    class ProductsController {
        private $productModel;

        public function __construct() {
            $this->productModel = new Products();
        }   

        // Get all products
        public function getAllProducts() {
            try {
                $products = $this->productModel->getAllProducts();
                return json_encode([
                    'success' => true,
                    'data' => $products
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'message' => 'Error fetching products: ' . $e->getMessage()
                ]);
            }
        }

        // Create product
        public function createProduct() {
            try {
                $payload = json_decode(file_get_contents('php://input'), true) ?? [];

                $name = trim($payload['name'] ?? '');
                $description = trim($payload['description'] ?? '');
                $price = (float)($payload['price'] ?? 0);
                $stock = (int)($payload['stock'] ?? 0);
                $status = $payload['status'] ?? 'Active';
                $imageUrl = $payload['image_url'] ?? '';

                // Resolve category id (prefer id, fallback to name)
                $categoryId = isset($payload['category_id']) ? (int)$payload['category_id'] : null;
                if (!$categoryId && !empty($payload['category'])) {
                    $categoryId = $this->productModel->getCategoryIdByName($payload['category']);
                }

                if (!$name || !$price || !$categoryId) {
                    http_response_code(400);
                    return json_encode([
                        'success' => false,
                        'message' => 'Missing required fields: name, price, category'
                    ]);
                }

                $created = $this->productModel->AddProduct([
                    'name' => $name,
                    'description' => $description,
                    'price' => $price,
                    'stock' => $stock,
                    'category_id' => $categoryId,
                    'image_url' => $imageUrl,
                    'status' => $status,
                ]);

                if (!$created) {
                    http_response_code(500);
                    return json_encode([
                        'success' => false,
                        'message' => 'Failed to create product'
                    ]);
                }

                // Return the created product
                $newId = $this->productModel->getLastInsertId();
                $product = $this->productModel->getProductById((int)$newId);

                return json_encode([
                    'success' => true,
                    'data' => $product
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'message' => 'Error creating product: ' . $e->getMessage()
                ]);
            }
        }

        // Update product
        public function updateProduct($id) {
            try {
                $payload = json_decode(file_get_contents('php://input'), true) ?? [];

                $name = trim($payload['name'] ?? '');
                $description = trim($payload['description'] ?? '');
                $price = (float)($payload['price'] ?? 0);
                $stock = (int)($payload['stock'] ?? 0);
                $status = $payload['status'] ?? 'Active';
                $imageUrl = $payload['image_url'] ?? '';

                $categoryId = isset($payload['category_id']) ? (int)$payload['category_id'] : null;
                if (!$categoryId && !empty($payload['category'])) {
                    $categoryId = $this->productModel->getCategoryIdByName($payload['category']);
                }

                if (!$name || !$price || !$categoryId) {
                    http_response_code(400);
                    return json_encode([
                        'success' => false,
                        'message' => 'Missing required fields: name, price, category'
                    ]);
                }

                $updated = $this->productModel->updateProduct((int)$id, [
                    'name' => $name,
                    'description' => $description,
                    'price' => $price,
                    'stock' => $stock,
                    'category_id' => $categoryId,
                    'image_url' => $imageUrl,
                    'status' => $status,
                ]);

                if (!$updated) {
                    http_response_code(500);
                    return json_encode([
                        'success' => false,
                        'message' => 'Failed to update product'
                    ]);
                }

                $product = $this->productModel->getProductById((int)$id);

                return json_encode([
                    'success' => true,
                    'data' => $product
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'message' => 'Error updating product: ' . $e->getMessage()
                ]);
            }
        }

        // Delete product
        public function deleteProduct($id) {
            try {
                $deleted = $this->productModel->deleteProduct((int)$id);
                if (!$deleted) {
                    http_response_code(500);
                    return json_encode([
                        'success' => false,
                        'message' => 'Failed to delete product'
                    ]);
                }

                return json_encode([
                    'success' => true,
                    'message' => 'Product deleted'
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'message' => 'Error deleting product: ' . $e->getMessage()
                ]);
            }
        }

            // Upload product image (multipart/form-data)
            public function uploadImage() {
                try {
                    header('Content-Type: application/json');

                    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
                        http_response_code(400);
                        return json_encode([
                            'success' => false,
                            'message' => 'No image uploaded or upload error'
                        ]);
                    }

                    $file = $_FILES['image'];
                    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
                    if (!in_array($file['type'], $allowedTypes, true)) {
                        http_response_code(400);
                        return json_encode([
                            'success' => false,
                            'message' => 'Unsupported file type. Use JPG, PNG, WEBP, or GIF.'
                        ]);
                    }

                    $maxSize = 5 * 1024 * 1024; // 5MB
                    if ($file['size'] > $maxSize) {
                        http_response_code(400);
                        return json_encode([
                            'success' => false,
                            'message' => 'File too large (max 5MB).'
                        ]);
                    }

                    $uploadDir = dirname(__DIR__, 2) . '/public/uploads/products/';
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }

                    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
                    $safeName = 'product_' . uniqid('', true) . '.' . $extension;
                    $targetPath = $uploadDir . $safeName;

                    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                        http_response_code(500);
                        return json_encode([
                            'success' => false,
                            'message' => 'Failed to move uploaded file.'
                        ]);
                    }

                    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
                    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
                    $publicPath = '/uploads/products/' . $safeName;
                    $url = $scheme . '://' . $host . $publicPath;

                    return json_encode([
                        'success' => true,
                        'url' => $url,
                        'path' => $publicPath
                    ]);
                } catch (PDOException $e) {
                    http_response_code(500);
                    return json_encode([
                        'success' => false,
                        'message' => 'Error uploading image: ' . $e->getMessage()
                    ]);
                }
            }
    }   
?>