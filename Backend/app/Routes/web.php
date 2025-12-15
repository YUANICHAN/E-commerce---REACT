<?php
namespace App\Routes;

use App\Core\Router;

class web {
    public static function register(Router $router) {
        // User/Customer Routes (Admin Customer Page)
        $router->get('users', 'UserController@getAllUsers');
        $router->get('users/{id}', 'UserController@getProfile');
        $router->put('users/{id}', 'UserController@updateProfile');
        $router->delete('users/{id}', 'UserController@deleteProfile');

        $router->get('categories', 'CategoryController@getAllCategories');

        $router->get('products', 'ProductsController@getAllProducts');
        $router->get('products/{id}', 'ProductsController@getProductById');
        $router->post('products', 'ProductsController@createProduct');
        $router->post('products/upload', 'ProductsController@uploadImage');
        $router->put('products/{id}', 'ProductsController@updateProduct');
        $router->delete('products/{id}', 'ProductsController@deleteProduct');
    }
}
?>
