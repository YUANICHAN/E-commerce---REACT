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
    }
}
?>
