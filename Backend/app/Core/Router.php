<?php
namespace App\Core;

class Router {
    private $routes = [];

    public function get($path, $action) {
        $this->routes['GET'][$path] = $action;
        return $this;
    }

    public function post($path, $action) {
        $this->routes['POST'][$path] = $action;
        return $this;
    }

    public function put($path, $action) {
        $this->routes['PUT'][$path] = $action;
        return $this;
    }

    public function delete($path, $action) {
        $this->routes['DELETE'][$path] = $action;
        return $this;
    }

    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove the public folder from path
        $uri = str_replace('/public', '', $uri);
        $uri = str_replace('/api', '', $uri);
        $uri = trim($uri, '/');

        // Debug output
        error_log("Method: $method, URI: $uri");
        error_log("Available routes: " . json_encode(array_keys($this->routes[$method] ?? [])));

        if (empty($uri)) {
            echo json_encode(['success' => true, 'message' => 'API is running']);
            return;
        }

        $routes = $this->routes[$method] ?? [];

        foreach ($routes as $path => $action) {
            if ($this->matchRoute($path, $uri, $params)) {
                error_log("Matched route: $path with action: $action");
                $this->executeAction($action, $params);
                return;
            }
        }

        // Route not found
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Route not found', 'requested_uri' => $uri]);
    }

    private function matchRoute($route, $uri, &$params) {
        $params = [];
        
        // Exact match
        if ($route === $uri) {
            return true;
        }

        // Convert route pattern to regex
        $pattern = preg_quote($route, '#');
        $pattern = preg_replace('#\\\{(\w+)\\\}#', '([^/]+)', $pattern);
        
        if (preg_match('#^' . $pattern . '$#', $uri, $matches)) {
            // Extract named parameters
            $paramNames = [];
            preg_match_all('#\{(\w+)\}#', $route, $paramMatches);
            $paramNames = $paramMatches[1] ?? [];
            
            array_shift($matches); // Remove full match
            
            foreach ($paramNames as $i => $name) {
                $params[$name] = $matches[$i] ?? null;
            }
            
            return true;
        }

        return false;
    }

    private function executeAction($action, $params) {
        [$controller, $method] = explode('@', $action);
        $controllerClass = 'App\\Controller\\' . $controller;

        if (!class_exists($controllerClass)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => "Controller $controllerClass not found"]);
            return;
        }

        $instance = new $controllerClass();
        
        if (!method_exists($instance, $method)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => "Method $method not found in $controllerClass"]);
            return;
        }

        // Pass parameters as arguments
        $args = array_values($params);
        echo call_user_func_array([$instance, $method], $args);
    }
}
?>
