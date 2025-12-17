<?php
namespace App\Controller;

use App\Core\Session;
use App\Model\User;
use PDOException;

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function login() {
        try {
            $payload = json_decode(file_get_contents('php://input'), true) ?? [];
            $email = $payload['email'] ?? '';
            $password = $payload['password'] ?? '';

            if (!$email || !$password) {
                http_response_code(400);
                return json_encode(['success' => false, 'message' => 'Email and password are required']);
            }

            $user = $this->userModel->getUserByEmail($email);
            if (!$user) {
                http_response_code(401);
                return json_encode(['success' => false, 'message' => 'Invalid credentials']);
            }

            // Plaintext comparison (not recommended for production)
            $storedHash = $user['password'] ?? '';
            $passwordOk = $storedHash !== '' && hash_equals($storedHash, $password);
            if (!$passwordOk) {
                http_response_code(401);
                return json_encode(['success' => false, 'message' => 'Invalid credentials']);
            }

            if (isset($user['status']) && strtolower($user['status']) === 'inactive') {
                http_response_code(403);
                return json_encode(['success' => false, 'message' => 'Account is inactive']);
            }

            Session::set('user_id', $user['id']);
            Session::set('user_email', $user['email']);
            Session::set('user_name', $user['name'] ?? '');

            return json_encode([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'id' => $user['id'],
                    'name' => $user['name'] ?? '',
                    'email' => $user['email'],
                ],
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'message' => 'Error during login: ' . $e->getMessage()]);
        }
    }

    public function logout() {
        Session::destroy();
        return json_encode(['success' => true, 'message' => 'Logged out']);
    }
}
