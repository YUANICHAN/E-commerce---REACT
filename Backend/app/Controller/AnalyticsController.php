<?php
namespace App\Controller;

use App\Model\Analytics;

class AnalyticsController {
    private $analyticsModel;

    public function __construct() {
        $this->analyticsModel = new Analytics();
    }

    // Get all analytics data
    public function getAnalyticsData() {
        try {
            $timeRange = $_GET['timeRange'] ?? '7days';
            
            // Validate time range
            $validRanges = ['7days', '30days', '6months'];
            if (!in_array($timeRange, $validRanges)) {
                $timeRange = '7days';
            }

            $data = [
                'metrics' => $this->analyticsModel->getMetrics($timeRange),
                'revenueOverTime' => $this->analyticsModel->getRevenueOverTime($timeRange),
                'ordersOverTime' => $this->analyticsModel->getOrdersOverTime($timeRange),
                'salesByCategory' => $this->analyticsModel->getSalesByCategory(),
                'trafficSources' => $this->analyticsModel->getTrafficSources($timeRange)
            ];

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch analytics data: ' . $e->getMessage()
            ]);
        }
    }

    // Get metrics only
    public function getMetrics() {
        try {
            $timeRange = $_GET['timeRange'] ?? '7days';
            
            $validRanges = ['7days', '30days', '6months'];
            if (!in_array($timeRange, $validRanges)) {
                $timeRange = '7days';
            }

            $metrics = $this->analyticsModel->getMetrics($timeRange);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch metrics: ' . $e->getMessage()
            ]);
        }
    }

    // Get revenue chart data
    public function getRevenueChart() {
        try {
            $timeRange = $_GET['timeRange'] ?? '7days';
            
            $validRanges = ['7days', '30days', '6months'];
            if (!in_array($timeRange, $validRanges)) {
                $timeRange = '7days';
            }

            $data = $this->analyticsModel->getRevenueOverTime($timeRange);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch revenue chart: ' . $e->getMessage()
            ]);
        }
    }

    // Get orders chart data
    public function getOrdersChart() {
        try {
            $timeRange = $_GET['timeRange'] ?? '7days';
            
            $validRanges = ['7days', '30days', '6months'];
            if (!in_array($timeRange, $validRanges)) {
                $timeRange = '7days';
            }

            $data = $this->analyticsModel->getOrdersOverTime($timeRange);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch orders chart: ' . $e->getMessage()
            ]);
        }
    }

    // Get category sales data
    public function getCategorySales() {
        try {
            $data = $this->analyticsModel->getSalesByCategory();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch category sales: ' . $e->getMessage()
            ]);
        }
    }

    // Get traffic sources data
    public function getTrafficSources() {
        try {
            $timeRange = $_GET['timeRange'] ?? '7days';
            
            $validRanges = ['7days', '30days', '6months'];
            if (!in_array($timeRange, $validRanges)) {
                $timeRange = '7days';
            }

            $data = $this->analyticsModel->getTrafficSources($timeRange);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch traffic sources: ' . $e->getMessage()
            ]);
        }
    }
}
?>
