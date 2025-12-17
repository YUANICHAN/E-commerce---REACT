<?php
namespace App\Controller;

use App\Model\Wishlist;
use App\Core\Session;
use PDOException;

class WishlistController {
    private $wishlistModel;

    public function __construct() {
        $this->wishlistModel = new Wishlist();
    }

    // Get all wishlist items for logged-in user
    public function getUserWishlist() {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            $items = $this->wishlistModel->getWishlistByUserId($user_id);
            $count = $this->wishlistModel->getWishlistCount($user_id);
            
            return json_encode([
                'success' => true,
                'data' => $items,
                'count' => $count
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error fetching wishlist: ' . $e->getMessage()
            ]);
        }
    }

    // Add to wishlist
    public function addToWishlist() {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data || !isset($data['product_id'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'Product ID is required'
                ]);
            }

            $id = $this->wishlistModel->addToWishlist($user_id, $data['product_id']);
            
            if ($id) {
                return json_encode([
                    'success' => true,
                    'data' => ['id' => $id, 'product_id' => $data['product_id']],
                    'message' => 'Added to wishlist successfully'
                ]);
            }

            http_response_code(409);
            return json_encode([
                'success' => false,
                'message' => 'Product already in wishlist'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error adding to wishlist: ' . $e->getMessage()
            ]);
        }
    }

    // Remove from wishlist
    public function removeFromWishlist($id) {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            if ($this->wishlistModel->removeFromWishlist($id, $user_id)) {
                return json_encode([
                    'success' => true,
                    'message' => 'Removed from wishlist successfully'
                ]);
            }

            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Failed to remove from wishlist'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error removing from wishlist: ' . $e->getMessage()
            ]);
        }
    }
}
?>
