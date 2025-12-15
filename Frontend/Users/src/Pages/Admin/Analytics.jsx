import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react';
import Chart from 'chart.js/auto';
import Sidebar from '../../Components/Admin/Sidebar.jsx';
import Header from '../../Components/Admin/Header.jsx';

function Analytics() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const areaChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const doughnutChartInstance = useRef(null);
  const areaChartInstance = useRef(null);

  // Mock analytics data
  const [metrics] = useState({
    revenue: { value: '$125,430', change: 12.5, trend: 'up' },
    orders: { value: '1,247', change: 8.2, trend: 'up' },
    customers: { value: '892', change: -2.1, trend: 'down' },
    avgOrder: { value: '$100.58', change: 5.3, trend: 'up' },
    conversionRate: { value: '3.24%', change: 0.8, trend: 'up' },
    pageViews: { value: '45,892', change: 15.7, trend: 'up' }
  });

  // Chart data based on time range
  const getChartData = () => {
    if (timeRange === '7days') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        revenue: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        orders: [45, 67, 52, 89, 78, 95, 88]
      };
    } else if (timeRange === '30days') {
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        revenue: [85000, 92000, 88000, 95000],
        orders: [320, 345, 330, 355]
      };
    } else {
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        revenue: [280000, 310000, 295000, 340000, 355000, 380000],
        orders: [1050, 1150, 1100, 1280, 1320, 1400]
      };
    }
  };

  useEffect(() => {
    const chartData = getChartData();

    // Line Chart - Revenue Over Time
    if (lineChartRef.current) {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
      
      const ctx = lineChartRef.current.getContext('2d');
      lineChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Revenue',
            data: chartData.revenue,
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgb(79, 70, 229)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleFont: { size: 14 },
              bodyFont: { size: 13 },
              callbacks: {
                label: function(context) {
                  return 'Revenue: $' + context.parsed.y.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + (value / 1000) + 'k';
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Bar Chart - Orders Over Time
    if (barChartRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      
      const ctx = barChartRef.current.getContext('2d');
      barChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Orders',
            data: chartData.orders,
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 2,
            borderRadius: 6,
            barThickness: 30
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              callbacks: {
                label: function(context) {
                  return 'Orders: ' + context.parsed.y;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Doughnut Chart - Category Sales
    if (doughnutChartRef.current) {
      if (doughnutChartInstance.current) {
        doughnutChartInstance.current.destroy();
      }
      
      const ctx = doughnutChartRef.current.getContext('2d');
      doughnutChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'],
          datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(251, 146, 60, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)'
            ],
            borderColor: [
              'rgb(79, 70, 229)',
              'rgb(16, 185, 129)',
              'rgb(251, 146, 60)',
              'rgb(139, 92, 246)',
              'rgb(236, 72, 153)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: { size: 12 },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          },
          cutout: '65%'
        }
      });
    }

    // Area Chart - Traffic Sources
    if (areaChartRef.current) {
      if (areaChartInstance.current) {
        areaChartInstance.current.destroy();
      }
      
      const ctx = areaChartRef.current.getContext('2d');
      areaChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Organic',
              data: timeRange === '7days' ? [450, 520, 480, 580, 620, 680, 720] : 
                    timeRange === '30days' ? [2100, 2300, 2200, 2500] : 
                    [8200, 8800, 8500, 9200, 9500, 10100],
              borderColor: 'rgb(79, 70, 229)',
              backgroundColor: 'rgba(79, 70, 229, 0.3)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Direct',
              data: timeRange === '7days' ? [320, 380, 350, 420, 450, 490, 520] : 
                    timeRange === '30days' ? [1500, 1650, 1600, 1800] : 
                    [6100, 6500, 6300, 6900, 7200, 7600],
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.3)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Social',
              data: timeRange === '7days' ? [180, 220, 200, 260, 280, 310, 340] : 
                    timeRange === '30days' ? [850, 920, 900, 1000] : 
                    [3400, 3700, 3600, 4100, 4300, 4600],
              borderColor: 'rgb(251, 146, 60)',
              backgroundColor: 'rgba(251, 146, 60, 0.3)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                padding: 15,
                font: { size: 12 },
                usePointStyle: true
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });
    }

    return () => {
      if (lineChartInstance.current) lineChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();
      if (areaChartInstance.current) areaChartInstance.current.destroy();
    };
  }, [timeRange]);

  const MetricCard = ({ title, value, change, trend, icon: Icon, color }) => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 sm:p-3 rounded-full ${color}`}>
          <Icon size={20} className="sm:w-6 sm:h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {trend === 'up' ? (
            <ArrowUpRight size={14} className="text-green-600" />
          ) : (
            <ArrowDownRight size={14} className="text-red-600" />
          )}
          <span className={`text-xs font-semibold ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {Math.abs(change)}%
          </span>
        </div>
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <Sidebar activeItem="analytics" />
      </div>
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out max-h-screen overflow-auto">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        
        <div className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
          {/* Header with Time Range Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Track your business performance and insights</p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setTimeRange('7days')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  timeRange === '7days'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30days')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  timeRange === '30days'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange('6months')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  timeRange === '6months'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                6 Months
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 animate-in fade-in duration-500">
            <MetricCard 
              title="Total Revenue" 
              value={metrics.revenue.value}
              change={metrics.revenue.change}
              trend={metrics.revenue.trend}
              icon={DollarSign} 
              color="bg-green-500" 
            />
            <MetricCard 
              title="Total Orders" 
              value={metrics.orders.value}
              change={metrics.orders.change}
              trend={metrics.orders.trend}
              icon={ShoppingCart} 
              color="bg-blue-500" 
            />
            <MetricCard 
              title="New Customers" 
              value={metrics.customers.value}
              change={metrics.customers.change}
              trend={metrics.customers.trend}
              icon={Users} 
              color="bg-purple-500" 
            />
            <MetricCard 
              title="Avg Order Value" 
              value={metrics.avgOrder.value}
              change={metrics.avgOrder.change}
              trend={metrics.avgOrder.trend}
              icon={DollarSign} 
              color="bg-orange-500" 
            />
            <MetricCard 
              title="Conversion Rate" 
              value={metrics.conversionRate.value}
              change={metrics.conversionRate.change}
              trend={metrics.conversionRate.trend}
              icon={TrendingUp} 
              color="bg-indigo-500" 
            />
            <MetricCard 
              title="Page Views" 
              value={metrics.pageViews.value}
              change={metrics.pageViews.change}
              trend={metrics.pageViews.trend}
              icon={Eye} 
              color="bg-pink-500" 
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Line Chart - Revenue */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
              <div className="h-64 sm:h-80">
                <canvas ref={lineChartRef}></canvas>
              </div>
            </div>

            {/* Bar Chart - Orders */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Over Time</h3>
              <div className="h-64 sm:h-80">
                <canvas ref={barChartRef}></canvas>
              </div>
            </div>

            {/* Doughnut Chart - Category Sales */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
              <div className="h-64 sm:h-80 flex items-center justify-center">
                <canvas ref={doughnutChartRef}></canvas>
              </div>
            </div>

            {/* Area Chart - Traffic Sources */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
              <div className="h-64 sm:h-80">
                <canvas ref={areaChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;