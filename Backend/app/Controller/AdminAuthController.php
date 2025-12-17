<?php
namespace App\Controller;

use App\Core\Session;
use App\Model\AdminUser;
use PDOException;

class AdminAuthController {
    private $adminModel;

    public function __construct() {
        $this->adminModel = new AdminUser();
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

            $admin = $this->adminModel->getByEmail($email);
            if (!$admin) {
                http_response_code(401);
                return json_encode(['success' => false, 'message' => 'Invalid credentials']);
            }

            $stored = $admin['password'] ?? '';
            $ok = $stored !== '' && $stored === $password;
            if (!$ok) {
                http_response_code(401);
                return json_encode(['success' => false, 'message' => 'Invalid credentials']);
            }

            // Set admin session flags
            Session::set('admin_id', $admin['id']);
            Session::set('admin_email', $admin['email']);
            Session::set('admin_name', $admin['name'] ?? '');
            Session::set('admin_role', $admin['role'] ?? 'Staff');
            Session::set('is_admin', true);

            return json_encode([
                'success' => true,
                'message' => 'Admin login successful',
                'data' => [
                    'id' => $admin['id'],
                    'name' => $admin['name'] ?? '',
                    'email' => $admin['email'],
                    'role' => $admin['role'] ?? 'Staff',
                ],
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'message' => 'Error during login: ' . $e->getMessage()]);
        }
    }

    public function logout() {
        // Only clear admin session keys to avoid logging user out if both are present
        Session::remove('admin_id');
        Session::remove('admin_email');
        Session::remove('admin_name');
        Session::remove('admin_role');
        Session::remove('is_admin');
        return json_encode(['success' => true, 'message' => 'Admin logged out']);
    }
}
?>
