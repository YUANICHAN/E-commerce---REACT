<?php
    namespace App\Controller;

    use App\Model\Categories;
    use PDOException;

    class CategoryController {
        private $categoryModel;

        public function __construct() {
            $this->categoryModel = new Categories();
        }   

        // Get all categories
        public function getAllCategories() {
            try {
                $categories = $this->categoryModel->getAllCategories();
                return json_encode([
                    'success' => true,
                    'data' => $categories
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'message' => 'Error fetching categories: ' . $e->getMessage()
                ]);
            }
        }
    }
?>