<?php
namespace App\Controller;

use App\Model\User;
use PDOException;

class UserController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    // Get all users (Admin)
    public function getAllUsers() {
        try {
            $users = $this->userModel->getAllUsers();
            return json_encode([
                'success' => true,
                'data' => $users
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error fetching users: ' . $e->getMessage()
            ]);
        }
    }

    // Get single user profile by ID
    public function getProfile($id) {
        try {
            $user = $this->userModel->getUserById((int)$id);
            if (!$user) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'message' => 'User not found'
                ]);
            }
            return json_encode([
                'success' => true,
                'data' => $user
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error fetching user: ' . $e->getMessage()
            ]);
        }
    }

    public function createUser() {
        try {
            $payload = json_decode(file_get_contents('php://input'), true) ?? [];
            $created = $this->userModel->createUser($payload);
            if (!$created) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'User creation failed'
                ]);
            }
            return json_encode([
                'success' => true,
                'message' => 'User created successfully'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error creating user: ' . $e->getMessage()
            ]);
        }
    }

    // Update user profile by ID
    public function updateProfile($id) {
        try {
            $payload = json_decode(file_get_contents('php://input'), true) ?? [];
            $updated = $this->userModel->updateUser((int)$id, $payload);
            if (!$updated) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'No valid fields to update or update failed'
                ]);
            }
            $user = $this->userModel->getUserById((int)$id);
            return json_encode([
                'success' => true,
                'data' => $user
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error updating user: ' . $e->getMessage()
            ]);
        }
    }

    // Delete user by ID
    public function deleteProfile($id) {
        try {
            $deleted = $this->userModel->deleteUser((int)$id);
            if (!$deleted) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'Delete failed'
                ]);
            }
            return json_encode([
                'success' => true,
                'message' => 'User deleted'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error deleting user: ' . $e->getMessage()
            ]);
        }
    }
}
?>