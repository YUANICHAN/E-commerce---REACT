<?php
namespace App\Controller;

use App\Core\Session;
use App\Model\Dashboard;
use PDOException;

class DashboardController {
    private $dashboardModel;

    public function __construct() {
        $this->dashboardModel = new Dashboard();
    }

    // Check if admin is logged in
    private function isAdminAuthenticated() {
        return Session::get('is_admin') === true;
    }

    // Get dashboard statistics
    public function getStats() {
        try {
            // Check admin authentication
            if (!$this->isAdminAuthenticated()) {
                http_response_code(403);
                return json_encode(['success' => false, 'message' => 'Admin access required']);
            }

            $stats = [
                'totalRevenue' => $this->dashboardModel->getTotalRevenue(),
                'totalOrders' => $this->dashboardModel->getTotalOrders(),
                'totalCustomers' => $this->dashboardModel->getTotalCustomers(),
                'totalProducts' => $this->dashboardModel->getTotalProducts(),
                'revenueChange' => $this->dashboardModel->getRevenueChange(),
                'ordersChange' => $this->dashboardModel->getOrdersChange(),
                'customersChange' => $this->dashboardModel->getCustomersChange(),
                'productsChange' => $this->dashboardModel->getProductsChange(),
            ];

            return json_encode([
                'success' => true,
                'data' => $stats
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'message' => 'Error fetching dashboard stats: ' . $e->getMessage()]);
        }
    }

    // Get recent orders for dashboard
    public function getRecentOrders() {
        try {
            // Check admin authentication
            if (!$this->isAdminAuthenticated()) {
                http_response_code(403);
                return json_encode(['success' => false, 'message' => 'Admin access required']);
            }

            $orders = $this->dashboardModel->getRecentOrders(10);

            return json_encode([
                'success' => true,
                'data' => $orders
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'message' => 'Error fetching recent orders: ' . $e->getMessage()]);
        }
    }

    // Get order status breakdown
    public function getOrderStatusBreakdown() {
        try {
            // Check admin authentication
            if (!$this->isAdminAuthenticated()) {
                http_response_code(403);
                return json_encode(['success' => false, 'message' => 'Admin access required']);
            }

            $breakdown = $this->dashboardModel->getOrderStatusBreakdown();

            return json_encode([
                'success' => true,
                'data' => $breakdown
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'message' => 'Error fetching order breakdown: ' . $e->getMessage()]);
        }
    }

    // Get top selling products
    public function getTopProducts() {
        try {
            // Check admin authentication
            if (!$this->isAdminAuthenticated()) {
                http_response_code(403);
                return json_encode(['success' => false, 'message' => 'Admin access required']);
            }

            $products = $this->dashboardModel->getTopProducts(5);

            return json_encode([
                'success' => true,
                'data' => $products
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'message' => 'Error fetching top products: ' . $e->getMessage()]);
        }
    }

    // Get all dashboard data in one call
    public function getDashboardData() {
        try {
            // Check admin authentication
            if (!$this->isAdminAuthenticated()) {
                http_response_code(403);
                return json_encode(['success' => false, 'message' => 'Admin access required']);
            }

            $data = [
                'stats' => [
                    'totalRevenue' => $this->dashboardModel->getTotalRevenue(),
                    'totalOrders' => $this->dashboardModel->getTotalOrders(),
                    'totalCustomers' => $this->dashboardModel->getTotalCustomers(),
                    'totalProducts' => $this->dashboardModel->getTotalProducts(),
                    'revenueChange' => $this->dashboardModel->getRevenueChange(),
                    'ordersChange' => $this->dashboardModel->getOrdersChange(),
                    'customersChange' => $this->dashboardModel->getCustomersChange(),
                    'productsChange' => $this->dashboardModel->getProductsChange(),
                ],
                'recentOrders' => $this->dashboardModel->getRecentOrders(10),
                'orderStatusBreakdown' => $this->dashboardModel->getOrderStatusBreakdown(),
                'topProducts' => $this->dashboardModel->getTopProducts(5),
            ];

            return json_encode([
                'success' => true,
                'data' => $data
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'message' => 'Error fetching dashboard data: ' . $e->getMessage()]);
        }
    }
}
?>
