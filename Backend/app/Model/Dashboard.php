<?php
namespace App\Model;

use App\Config\db;
use PDO;

class Dashboard {
    private $conn;

    public function __construct() {
        $database = new db();
        $this->conn = $database->getConnection();
    }

    // Get total revenue from orders
    public function getTotalRevenue() {
        $sql = "SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE status != 'Cancelled'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (float)$result['total_revenue'];
    }

    // Get total number of orders
    public function getTotalOrders() {
        $sql = "SELECT COUNT(*) as total_orders FROM orders";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)$result['total_orders'];
    }

    // Get total number of customers/users
    public function getTotalCustomers() {
        $sql = "SELECT COUNT(*) as total_customers FROM users WHERE status = 'Active'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)$result['total_customers'];
    }

    // Get total number of products
    public function getTotalProducts() {
        $sql = "SELECT COUNT(*) as total_products FROM products WHERE status = 'Active'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)$result['total_products'];
    }

    // Get recent orders with details
    public function getRecentOrders($limit = 10) {
        $sql = "SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at, 
                       u.name as customer_name, u.email as customer_email
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC
                LIMIT :limit";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get order status breakdown
    public function getOrderStatusBreakdown() {
        $sql = "SELECT status, COUNT(*) as count FROM orders GROUP BY status";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get revenue change percentage (comparing current month to previous month)
    public function getRevenueChange() {
        $sql = "SELECT 
                    COALESCE(SUM(CASE 
                        WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) 
                        AND YEAR(created_at) = YEAR(CURRENT_DATE()) 
                        THEN total_amount 
                        ELSE 0 
                    END), 0) as current_month,
                    COALESCE(SUM(CASE 
                        WHEN MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) 
                        AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) 
                        THEN total_amount 
                        ELSE 0 
                    END), 0) as previous_month
                FROM orders WHERE status != 'Cancelled'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $current = (float)$result['current_month'];
        $previous = (float)$result['previous_month'];
        
        if ($previous == 0) {
            return $current > 0 ? 100.0 : 0.0;
        }
        
        return round((($current - $previous) / $previous) * 100, 1);
    }

    // Get orders change percentage
    public function getOrdersChange() {
        $sql = "SELECT 
                    COUNT(CASE 
                        WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) 
                        AND YEAR(created_at) = YEAR(CURRENT_DATE()) 
                        THEN 1 
                    END) as current_month,
                    COUNT(CASE 
                        WHEN MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) 
                        AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) 
                        THEN 1 
                    END) as previous_month
                FROM orders";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $current = (int)$result['current_month'];
        $previous = (int)$result['previous_month'];
        
        if ($previous == 0) {
            return $current > 0 ? 100.0 : 0.0;
        }
        
        return round((($current - $previous) / $previous) * 100, 1);
    }

    // Get customers change percentage
    public function getCustomersChange() {
        $sql = "SELECT 
                    COUNT(CASE 
                        WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) 
                        AND YEAR(created_at) = YEAR(CURRENT_DATE()) 
                        THEN 1 
                    END) as current_month,
                    COUNT(CASE 
                        WHEN MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) 
                        AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) 
                        THEN 1 
                    END) as previous_month
                FROM users WHERE status = 'Active'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $current = (int)$result['current_month'];
        $previous = (int)$result['previous_month'];
        
        if ($previous == 0) {
            return $current > 0 ? 100.0 : 0.0;
        }
        
        return round((($current - $previous) / $previous) * 100, 1);
    }

    // Get products change percentage
    public function getProductsChange() {
        $sql = "SELECT 
                    COUNT(CASE 
                        WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) 
                        AND YEAR(created_at) = YEAR(CURRENT_DATE()) 
                        THEN 1 
                    END) as current_month,
                    COUNT(CASE 
                        WHEN MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) 
                        AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) 
                        THEN 1 
                    END) as previous_month
                FROM products WHERE status = 'Active'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $current = (int)$result['current_month'];
        $previous = (int)$result['previous_month'];
        
        if ($previous == 0) {
            return $current > 0 ? 100.0 : 0.0;
        }
        
        return round((($current - $previous) / $previous) * 100, 1);
    }

    // Get top selling products
    public function getTopProducts($limit = 5) {
        $sql = "SELECT p.id, p.name, p.price, p.stock, p.image_url,
                       COUNT(oi.id) as total_orders,
                       COALESCE(SUM(oi.quantity), 0) as total_sold,
                       COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
                FROM products p
                LEFT JOIN order_items oi ON p.id = oi.product_id
                GROUP BY p.id
                ORDER BY total_sold DESC
                LIMIT :limit";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
