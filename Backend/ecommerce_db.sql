-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 17, 2025 at 02:06 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(50) DEFAULT 'Home',
  `name` varchar(150) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(120) NOT NULL,
  `state` varchar(120) DEFAULT '',
  `zipcode` varchar(20) NOT NULL,
  `phone` varchar(50) DEFAULT '',
  `country` varchar(120) DEFAULT '',
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Manager','Staff') DEFAULT 'Staff',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(6, 1, 32, 2, '2025-12-16 11:10:04', '2025-12-16 11:10:05'),
(7, 1, 27, 1, '2025-12-16 11:11:35', '2025-12-16 11:11:35'),
(8, 1, 28, 1, '2025-12-16 11:11:40', '2025-12-16 11:11:40');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `icon`, `created_at`) VALUES
(1, 'Electronics', 'tv', '2025-12-14 12:31:03'),
(2, 'Accessories', 'headphones', '2025-12-14 12:31:03'),
(3, 'Storage', 'hard-drive', '2025-12-14 12:31:03'),
(4, 'Office', 'briefcase', '2025-12-14 12:31:03'),
(5, 'Gaming', 'gamepad', '2025-12-14 12:31:03'),
(6, 'Mobile', 'smartphone', '2025-12-14 12:31:03'),
(7, 'Audio', 'speaker', '2025-12-14 12:31:03'),
(8, 'Networking', 'wifi', '2025-12-14 12:31:03');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `notification_type` enum('Order','Product','System','Promo') DEFAULT 'System',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `user_id` int DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
  `location_lat` decimal(10,6) DEFAULT NULL,
  `location_lng` decimal(10,6) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `last4` varchar(4) NOT NULL,
  `expiry` varchar(7) NOT NULL,
  `holder_name` varchar(150) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `user_id`, `type`, `last4`, `expiry`, `holder_name`, `is_default`, `created_at`, `updated_at`) VALUES
(2, 1, 'Visa', '1122', '12/28', 'Yuan', 1, '2025-12-16 13:09:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `rating` decimal(3,1) DEFAULT '0.0',
  `image_url` varchar(500) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `rating`, `image_url`, `category_id`, `status`, `created_at`, `updated_at`) VALUES
(21, 'Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 599.00, 50, 4.5, 'images/mouse.jpg', 1, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(22, 'Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 2499.00, 30, 4.7, 'images/keyboard.jpg', 1, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(23, 'Gaming Headset', 'Surround sound gaming headset with mic', 1799.00, 25, 4.6, 'images/headset.jpg', 1, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(24, 'USB Flash Drive 32GB', 'High-speed USB 3.0 flash drive', 399.00, 100, 4.3, 'images/usb32.jpg', 2, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(25, 'External Hard Drive 1TB', 'Portable external hard drive USB 3.0', 3499.00, 15, 4.8, 'images/hdd1tb.jpg', 2, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(26, 'Laptop Backpack', 'Water-resistant laptop backpack 15.6 inch', 1299.00, 40, 4.4, 'images/backpack.jpg', 3, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(27, 'Laptop Stand', 'Adjustable aluminum laptop stand', 899.00, 35, 4.5, 'images/stand.jpg', 3, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(28, 'Webcam HD', '1080p HD webcam with built-in microphone', 1599.00, 20, 4.2, 'images/webcam.jpg', 1, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(29, 'Bluetooth Speaker', 'Portable Bluetooth speaker with deep bass', 2199.00, 18, 4.6, 'http://localhost:8000/uploads/products/product_693fa5f4d4b6a1.39832930.png', 4, 'Active', '2025-12-14 12:31:17', '2025-12-15 06:08:52'),
(30, 'Smart Watch', 'Fitness smartwatch with heart rate monitor', 2999.00, 22, 4.5, 'images/smartwatch.jpg', 4, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(31, 'Power Bank 20000mAh', 'Fast-charging high-capacity power bank', 1499.00, 60, 4.7, 'images/powerbank.jpg', 4, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(32, 'Wireless Earbuds', 'Noise-cancelling wireless earbuds', 2499.00, 28, 4.6, 'images/earbuds.jpg', 4, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(33, 'HDMI Cable', 'High-speed HDMI cable 2 meters', 299.00, 120, 4.2, 'images/hdmi.jpg', 2, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(34, 'Smartphone Tripod', 'Flexible tripod for smartphones', 499.00, 45, 4.3, 'images/tripod.jpg', 3, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(35, 'Desk Lamp LED', 'LED desk lamp with touch control', 899.00, 33, 4.4, 'images/desklamp.jpg', 3, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(36, 'Wireless Charger', 'Fast wireless charging pad', 999.00, 27, 4.1, 'images/charger.jpg', 4, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(37, 'Gaming Mouse Pad', 'Extended RGB gaming mouse pad', 699.00, 55, 4.6, 'images/mousepad.jpg', 1, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(38, 'Ethernet Cable', 'CAT6 Ethernet cable 5 meters', 349.00, 80, 4.3, 'images/ethernet.jpg', 2, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(39, 'Portable SSD 512GB', 'High-speed portable SSD storage', 4999.00, 10, 4.9, 'images/ssd512.jpg', 2, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(40, 'USB-C Hub', 'Multi-port USB-C hub with HDMI', 1999.00, 26, 4.5, 'images/usbhub.jpg', 1, 'Active', '2025-12-14 12:31:17', '2025-12-14 12:31:17'),
(43, 'BBQ', 'ugh', 21.00, 12, 0.0, 'http://localhost:8000/uploads/products/product_693fa486427fa2.49913497.png', 3, 'Active', '2025-12-15 06:02:46', '2025-12-15 06:02:46');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `rating` decimal(3,1) NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `city`, `country`, `zipcode`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Juan Dela Cruz', 'juan@example.com', 'password123', '09171234567', '123 Rizal St', 'Baybay', 'Philippines', '6520', 'Active', '2025-12-14 06:52:00', '2025-12-16 12:53:31'),
(2, 'Maria Santos', 'maria@example.com', 'password123', '09179876543', '456 Mabini St', 'Ormoc', 'Philippines', '6540', 'Active', '2025-12-14 06:52:00', '2025-12-14 06:52:00');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_addresses_user` (`user_id`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_cart_user` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`is_read`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_orders_user` (`user_id`),
  ADD KEY `idx_orders_status` (`status`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_order_items_order` (`order_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payment_methods_user` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_products_category` (`category_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_reviews_product` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_wish` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD CONSTRAINT `fk_payment_methods_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
