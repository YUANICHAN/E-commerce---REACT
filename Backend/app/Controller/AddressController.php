<?php
namespace App\Controller;

use App\Model\Address;
use App\Core\Session;
use PDOException;

class AddressController {
    private $addressModel;

    public function __construct() {
        $this->addressModel = new Address();
    }

    // Get all addresses for logged-in user
    public function getUserAddresses() {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            $addresses = $this->addressModel->getAddressesByUserId($user_id);
            return json_encode([
                'success' => true,
                'data' => $addresses
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error fetching addresses: ' . $e->getMessage()
            ]);
        }
    }

    // Create new address
    public function createAddress() {
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
            
            if (!$data || !isset($data['type'], $data['name'], $data['address'], $data['city'], $data['zipcode'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'Invalid request data'
                ]);
            }

            $data['is_default'] = $data['is_default'] ?? false;
            $data['state'] = $data['state'] ?? '';
            $data['country'] = $data['country'] ?? '';
            $data['phone'] = $data['phone'] ?? '';

            $id = $this->addressModel->createAddress($user_id, $data);
            
            if ($id) {
                $newAddress = $this->addressModel->getAddressById($id, $user_id);
                return json_encode([
                    'success' => true,
                    'data' => $newAddress,
                    'message' => 'Address added successfully'
                ]);
            }

            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Failed to add address'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error creating address: ' . $e->getMessage()
            ]);
        }
    }

    // Update address
    public function updateAddress($id) {
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
            
            if (!$data) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'message' => 'Invalid request data'
                ]);
            }

            if ($this->addressModel->updateAddress($id, $user_id, $data)) {
                $updatedAddress = $this->addressModel->getAddressById($id, $user_id);
                return json_encode([
                    'success' => true,
                    'data' => $updatedAddress,
                    'message' => 'Address updated successfully'
                ]);
            }

            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Failed to update address'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error updating address: ' . $e->getMessage()
            ]);
        }
    }

    // Delete address
    public function deleteAddress($id) {
        try {
            $user_id = Session::get('user_id');
            if (!$user_id) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'message' => 'User not authenticated'
                ]);
            }

            if ($this->addressModel->deleteAddress($id, $user_id)) {
                return json_encode([
                    'success' => true,
                    'message' => 'Address deleted successfully'
                ]);
            }

            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Failed to delete address'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'message' => 'Error deleting address: ' . $e->getMessage()
            ]);
        }
    }
}
?>
