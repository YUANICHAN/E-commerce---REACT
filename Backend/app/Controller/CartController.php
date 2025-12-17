<?php
    namespace App\Controller;
    use App\Model\Cart;
    use PDOException;

    class CartController {
        private $cartModel;
        public function __construct() {
            $this->cartModel = new Cart();
        }

        public function addToCart() {
            try {
                $payload = json_decode(file_get_contents('php://input'), true) ?? [];
                $userId = (int)($payload['user_id'] ?? 0);
                $productId = (int)($payload['product_id'] ?? 0);
                $quantity = (int)($payload['quantity'] ?? 1);

                if (!$userId || !$productId || $quantity <= 0) {
                    http_response_code(400);
                    return json_encode([
                        'success' => false,
                        'message' => 'Invalid input data'
                    ]);
                }
                $this->cartModel->addtoCart($userId, $productId, $quantity);
                return json_encode([
                    'success' => true,
                    'message' => 'Product added to cart successfully'
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'message' => 'Error adding to cart: ' . $e->getMessage()
                ]);
            }   
        }

        public function index($userId) {
            try {
                $cartItems = $this->cartModel->getUserCart((int)$userId);
                return json_encode([
                    'success' => true,
                    'data' => $cartItems
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'message' => 'Error fetching cart: ' . $e->getMessage()
                ]);
            }
        }

        public function updateCartItem() {
            try {
                $payload = json_decode(file_get_contents('php://input'), true) ?? [];
                $cartId = (int)($payload['cart_id'] ?? 0);
                $userId = (int)($payload['user_id'] ?? 0);
                $quantity = (int)($payload['quantity'] ?? 1);

                if (!$cartId || !$userId || $quantity <= 0) {
                    http_response_code(400);
                    return json_encode([
                        'success' => false,
                        'message' => 'Invalid input data'
                    ]);
                }

                $this->cartModel->updateCartItem($cartId, $userId, $quantity);

                return json_encode([
                    'success' => true,
                    'message' => 'Cart item updated successfully'
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'message' => 'Error updating cart item: ' . $e->getMessage()
                ]);
            }
        }

        public function removeCartItem() {
            try {
                $payload = json_decode(file_get_contents('php://input'), true) ?? [];
                $cartId = (int)($payload['cart_id'] ?? 0);
                $userId = (int)($payload['user_id'] ?? 0);

                if (!$cartId || !$userId) {
                    http_response_code(400);
                    return json_encode([
                        'success' => false,
                        'message' => 'Invalid input data'
                    ]);
                }

                $this->cartModel->removeFromCart((int)$cartId, (int)$userId);
                return json_encode([
                    'success' => true,
                    'message' => 'Cart item removed successfully'
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                return json_encode([
                    'success' => false,
                    'message' => 'Error removing cart item: ' . $e->getMessage()
                ]);
            }
        }
    }
?>