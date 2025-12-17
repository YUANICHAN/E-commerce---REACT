<?php
namespace App\Routes;

use App\Core\Router;

class web {
    public static function register(Router $router) {
        // Auth
        $router->post('auth/login', 'AuthController@login');
        $router->post('auth/logout', 'AuthController@logout');

        // User/Customer Routes (Admin Customer Page)
        $router->get('users', 'UserController@getAllUsers');
        $router->get('users/current', 'UserController@getCurrentUser');
        $router->get('users/{id}', 'UserController@getProfile');
        $router->post('users', 'UserController@createUser');
        $router->put('users/{id}', 'UserController@updateProfile');
        $router->delete('users/{id}', 'UserController@deleteProfile');

        $router->get('categories', 'CategoryController@getAllCategories');

        $router->get('products', 'ProductsController@getAllProducts');
        $router->get('products/{id}', 'ProductsController@getProductById');
        $router->post('products', 'ProductsController@createProduct');
        $router->post('products/upload', 'ProductsController@uploadImage');
        $router->put('products/{id}', 'ProductsController@updateProduct');
        $router->delete('products/{id}', 'ProductsController@deleteProduct');

        $router->get('cart/{user_id}', 'CartController@index');
        $router->post('cart/add', 'CartController@addToCart');
        $router->put('cart/update', 'CartController@updateCartItem');
        $router->delete('cart/remove', 'CartController@removeCartItem');

        // Admin Auth Routes
        $router->post('admin/auth/login', 'AdminAuthController@login');
        $router->post('admin/auth/logout', 'AdminAuthController@logout');

        // Admin Dashboard Routes
        $router->get('admin/dashboard/stats', 'DashboardController@getStats');
        $router->get('admin/dashboard/recent-orders', 'DashboardController@getRecentOrders');
        $router->get('admin/dashboard/order-breakdown', 'DashboardController@getOrderStatusBreakdown');
        $router->get('admin/dashboard/top-products', 'DashboardController@getTopProducts');
        $router->get('admin/dashboard', 'DashboardController@getDashboardData');

        // Admin Analytics Routes
        $router->get('admin/analytics', 'AnalyticsController@getAnalyticsData');
        $router->get('admin/analytics/metrics', 'AnalyticsController@getMetrics');
        $router->get('admin/analytics/revenue-chart', 'AnalyticsController@getRevenueChart');
        $router->get('admin/analytics/orders-chart', 'AnalyticsController@getOrdersChart');
        $router->get('admin/analytics/category-sales', 'AnalyticsController@getCategorySales');
        $router->get('admin/analytics/traffic-sources', 'AnalyticsController@getTrafficSources');

        // Admin Orders Routes (must be before /orders/{id} to avoid route conflict)
        $router->get('admin/orders', 'OrderController@getAllOrders');
        $router->put('admin/orders/{id}/status', 'OrderController@updateOrderStatus');

        // Orders Routes
        $router->get('orders', 'OrderController@getUserOrders');
        $router->get('orders/{id}', 'OrderController@getOrderDetails');

        // Addresses Routes
        $router->get('addresses', 'AddressController@getUserAddresses');
        $router->post('addresses', 'AddressController@createAddress');
        $router->put('addresses/{id}', 'AddressController@updateAddress');
        $router->delete('addresses/{id}', 'AddressController@deleteAddress');

        // Payment Methods Routes
        $router->get('payment-methods', 'PaymentMethodController@getUserPaymentMethods');
        $router->post('payment-methods', 'PaymentMethodController@createPaymentMethod');
        $router->put('payment-methods/{id}', 'PaymentMethodController@updatePaymentMethod');
        $router->put('payment-methods/{id}/default', 'PaymentMethodController@setDefaultPaymentMethod');
        $router->delete('payment-methods/{id}', 'PaymentMethodController@deletePaymentMethod');

        // Wishlist Routes
        $router->get('wishlist', 'WishlistController@getUserWishlist');
        $router->post('wishlist/add', 'WishlistController@addToWishlist');
        $router->delete('wishlist/{id}', 'WishlistController@removeFromWishlist');

        // Payment Routes (Mockup API)
        $router->post('payment/process', 'PaymentController@processPayment');
        $router->post('payment/validate', 'PaymentController@validatePaymentMethod');
        $router->get('payment/status/{transactionId}', 'PaymentController@getPaymentStatus');
        $router->post('payment/refund', 'PaymentController@refundPayment');
    }
}
?>
