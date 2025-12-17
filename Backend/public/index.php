<?php
// CORS Headers
$allowed_origins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Import Router and Routes
use App\Core\Router;
use App\Routes\web;

// Create router instance
$router = new Router();

web::register($router);

// Dispatch the request
$router->dispatch();
?>