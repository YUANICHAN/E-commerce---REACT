<?php
namespace App\Model;

use App\Config\db;
use PDO;

class Analytics {
    private $conn;

    public function __construct() {
        $database = new db();
        $this->conn = $database->getConnection();
    }

    // Get analytics metrics with changes
    public function getMetrics($timeRange = '7days') {
        $days = $this->getDaysFromTimeRange($timeRange);
        
        return [
            'revenue' => $this->getRevenueMetric($days),
            'orders' => $this->getOrdersMetric($days),
            'customers' => $this->getCustomersMetric($days),
            'avgOrder' => $this->getAvgOrderMetric($days),
            'conversionRate' => $this->getConversionRateMetric($days),
            'pageViews' => $this->getPageViewsMetric($days)
        ];
    }

    // Get revenue over time
    public function getRevenueOverTime($timeRange = '7days') {
        $labels = $this->getLabelsForTimeRange($timeRange);
        
        $sql = $this->getRevenueTimeSeriesQuery($timeRange);
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $data = array_fill(0, count($labels), 0);
        foreach ($results as $row) {
            $index = (int)$row['period'] - 1;
            if ($index >= 0 && $index < count($data)) {
                $data[$index] = (float)$row['revenue'];
            }
        }
        
        return [
            'labels' => $labels,
            'data' => $data
        ];
    }

    // Get orders over time
    public function getOrdersOverTime($timeRange = '7days') {
        $labels = $this->getLabelsForTimeRange($timeRange);
        
        $sql = $this->getOrdersTimeSeriesQuery($timeRange);
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $data = array_fill(0, count($labels), 0);
        foreach ($results as $row) {
            $index = (int)$row['period'] - 1;
            if ($index >= 0 && $index < count($data)) {
                $data[$index] = (int)$row['orders'];
            }
        }
        
        return [
            'labels' => $labels,
            'data' => $data
        ];
    }

    // Get sales by category
    public function getSalesByCategory() {
        $sql = "SELECT c.name, 
                       COALESCE(SUM(oi.quantity * oi.price), 0) as revenue,
                       COALESCE(SUM(oi.quantity), 0) as quantity_sold
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id
                LEFT JOIN order_items oi ON p.id = oi.product_id
                GROUP BY c.id, c.name
                ORDER BY revenue DESC
                LIMIT 5";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $total = array_sum(array_column($results, 'revenue'));
        
        $labels = [];
        $data = [];
        
        foreach ($results as $row) {
            $labels[] = $row['name'];
            $data[] = $total > 0 ? round(($row['revenue'] / $total) * 100, 1) : 0;
        }
        
        return [
            'labels' => $labels,
            'data' => $data
        ];
    }

    // Get traffic sources (simulated data as we don't have tracking)
    public function getTrafficSources($timeRange = '7days') {
        $labels = $this->getLabelsForTimeRange($timeRange);
        
        // For now, return simulated data based on order patterns
        // In a real scenario, you'd track this in a separate table
        $orderData = $this->getOrdersOverTime($timeRange);
        $orderValues = $orderData['data'];
        
        $organic = [];
        $direct = [];
        $social = [];
        
        foreach ($orderValues as $orders) {
            $organic[] = (int)($orders * 0.45); // 45% organic
            $direct[] = (int)($orders * 0.35); // 35% direct
            $social[] = (int)($orders * 0.20); // 20% social
        }
        
        return [
            'labels' => $labels,
            'datasets' => [
                ['label' => 'Organic', 'data' => $organic],
                ['label' => 'Direct', 'data' => $direct],
                ['label' => 'Social', 'data' => $social]
            ]
        ];
    }

    // Helper: Get revenue metric
    private function getRevenueMetric(int $days) {
        $days = max(1, (int)$days);
        $prevDays = $days * 2;
        $sql = "SELECT 
                    COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL $days DAY) THEN total_amount ELSE 0 END), 0) as current_value,
                    COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL $prevDays DAY) AND created_at < DATE_SUB(NOW(), INTERVAL $days DAY) THEN total_amount ELSE 0 END), 0) as previous_value
                FROM orders WHERE status != 'Cancelled'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $current = (float)$result['current_value'];
        $previous = (float)$result['previous_value'];
        $change = $this->calculateChange($current, $previous);
        
        return [
            'value' => '$' . number_format($current, 2),
            'change' => abs($change),
            'trend' => $change >= 0 ? 'up' : 'down'
        ];
    }

    // Helper: Get orders metric
    private function getOrdersMetric(int $days) {
        $days = max(1, (int)$days);
        $prevDays = $days * 2;
        $sql = "SELECT 
                    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL $days DAY) THEN 1 END) as current_value,
                    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL $prevDays DAY) AND created_at < DATE_SUB(NOW(), INTERVAL $days DAY) THEN 1 END) as previous_value
                FROM orders";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $current = (int)$result['current_value'];
        $previous = (int)$result['previous_value'];
        $change = $this->calculateChange($current, $previous);
        
        return [
            'value' => number_format($current),
            'change' => abs($change),
            'trend' => $change >= 0 ? 'up' : 'down'
        ];
    }

    // Helper: Get customers metric
    private function getCustomersMetric(int $days) {
        $days = max(1, (int)$days);
        $prevDays = $days * 2;
        $sql = "SELECT 
                    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL $days DAY) THEN 1 END) as current_value,
                    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL $prevDays DAY) AND created_at < DATE_SUB(NOW(), INTERVAL $days DAY) THEN 1 END) as previous_value
                FROM users WHERE status = 'Active'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $current = (int)$result['current_value'];
        $previous = (int)$result['previous_value'];
        $change = $this->calculateChange($current, $previous);
        
        return [
            'value' => number_format($current),
            'change' => abs($change),
            'trend' => $change >= 0 ? 'up' : 'down'
        ];
    }

    // Helper: Get average order metric
    private function getAvgOrderMetric(int $days) {
        $days = max(1, (int)$days);
        $prevDays = $days * 2;
        $sql = "SELECT 
                    COALESCE(AVG(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL $days DAY) THEN total_amount END), 0) as current_value,
                    COALESCE(AVG(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL $prevDays DAY) AND created_at < DATE_SUB(NOW(), INTERVAL $days DAY) THEN total_amount END), 0) as previous_value
                FROM orders WHERE status != 'Cancelled'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $current = (float)$result['current_value'];
        $previous = (float)$result['previous_value'];
        $change = $this->calculateChange($current, $previous);
        
        return [
            'value' => '$' . number_format($current, 2),
            'change' => abs($change),
            'trend' => $change >= 0 ? 'up' : 'down'
        ];
    }

    // Helper: Get conversion rate metric (orders / customers ratio)
    private function getConversionRateMetric(int $days) {
        $days = max(1, (int)$days);
        $prevDays = $days * 2;
        $sql = "SELECT 
                    COUNT(DISTINCT CASE WHEN o.created_at >= DATE_SUB(NOW(), INTERVAL $days DAY) THEN o.id END) as current_orders,
                    COUNT(DISTINCT CASE WHEN u.created_at >= DATE_SUB(NOW(), INTERVAL $days DAY) THEN u.id END) as current_users,
                    COUNT(DISTINCT CASE WHEN o.created_at >= DATE_SUB(NOW(), INTERVAL $prevDays DAY) AND o.created_at < DATE_SUB(NOW(), INTERVAL $days DAY) THEN o.id END) as previous_orders,
                    COUNT(DISTINCT CASE WHEN u.created_at >= DATE_SUB(NOW(), INTERVAL $prevDays DAY) AND u.created_at < DATE_SUB(NOW(), INTERVAL $days DAY) THEN u.id END) as previous_users
                FROM orders o
                CROSS JOIN users u";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $currentRate = $result['current_users'] > 0 ? ($result['current_orders'] / $result['current_users']) * 100 : 0;
        $previousRate = $result['previous_users'] > 0 ? ($result['previous_orders'] / $result['previous_users']) * 100 : 0;
        $change = $this->calculateChange($currentRate, $previousRate);
        
        return [
            'value' => number_format($currentRate, 2) . '%',
            'change' => abs($change),
            'trend' => $change >= 0 ? 'up' : 'down'
        ];
    }

    // Helper: Get page views metric (simulated)
    private function getPageViewsMetric(int $days) {
        // Since we don't have actual page view tracking, simulate based on orders
        $days = max(1, (int)$days);
        $sql = "SELECT COUNT(*) * 50 as page_views FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL $days DAY)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $current = (int)$result['page_views'];
        $change = rand(5, 20); // Simulated change
        
        return [
            'value' => number_format($current),
            'change' => $change,
            'trend' => 'up'
        ];
    }

    // Helper: Get interval from time range
    private function getDaysFromTimeRange($timeRange) {
        switch ($timeRange) {
            case '7days':
                return 7;
            case '30days':
                return 30;
            case '6months':
                return 180;
            default:
                return 7;
        }
    }

    // Helper: Get labels for time range
    private function getLabelsForTimeRange($timeRange) {
        switch ($timeRange) {
            case '7days':
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            case '30days':
                return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            case '6months':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            default:
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        }
    }

    // Helper: Get revenue time series query
    private function getRevenueTimeSeriesQuery($timeRange) {
        if ($timeRange === '7days') {
            return "SELECT DAYOFWEEK(created_at) as period, 
                           COALESCE(SUM(total_amount), 0) as revenue
                    FROM orders 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                    AND status != 'Cancelled'
                    GROUP BY DAYOFWEEK(created_at)
                    ORDER BY period";
        } elseif ($timeRange === '30days') {
                 return "SELECT CEILING((DATEDIFF(CURRENT_DATE(), DATE(created_at)) + 1) / 7) as period,
                          COALESCE(SUM(total_amount), 0) as revenue
                      FROM orders 
                      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                      AND status != 'Cancelled'
                      GROUP BY period
                      ORDER BY period";
        } else {
            return "SELECT MONTH(created_at) as period,
                           COALESCE(SUM(total_amount), 0) as revenue
                    FROM orders 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                    AND status != 'Cancelled'
                    GROUP BY MONTH(created_at)
                    ORDER BY period";
        }
    }

    // Helper: Get orders time series query
    private function getOrdersTimeSeriesQuery($timeRange) {
        if ($timeRange === '7days') {
            return "SELECT DAYOFWEEK(created_at) as period, 
                           COUNT(*) as orders
                    FROM orders 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                    GROUP BY DAYOFWEEK(created_at)
                    ORDER BY period";
        } elseif ($timeRange === '30days') {
                 return "SELECT CEILING((DATEDIFF(CURRENT_DATE(), DATE(created_at)) + 1) / 7) as period,
                          COUNT(*) as orders
                      FROM orders 
                      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                      GROUP BY period
                      ORDER BY period";
        } else {
            return "SELECT MONTH(created_at) as period,
                           COUNT(*) as orders
                    FROM orders 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                    GROUP BY MONTH(created_at)
                    ORDER BY period";
        }
    }

    // Helper: Calculate percentage change
    private function calculateChange($current, $previous) {
        if ($previous == 0) {
            return $current > 0 ? 100.0 : 0.0;
        }
        return round((($current - $previous) / $previous) * 100, 1);
    }
}
?>
