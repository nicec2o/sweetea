-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS sweetea CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sweetea;

-- 사용자 테이블
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 상품 테이블
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_ja VARCHAR(255),
  description TEXT,
  description_en TEXT,
  description_ja TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(500),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 주문 테이블
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'preparing', 'shipping', 'completed', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 주문 상세 테이블
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 공통코드 테이블
CREATE TABLE common_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code_group VARCHAR(50) NOT NULL,
  code VARCHAR(50) NOT NULL,
  code_name VARCHAR(100) NOT NULL,
  code_name_en VARCHAR(100),
  code_name_ja VARCHAR(100),
  sort_order INT DEFAULT 0,
  use_yn CHAR(1) DEFAULT 'Y',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code_group_code (code_group, code),
  INDEX idx_code_group (code_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 샘플 데이터: 관리자 계정 (비밀번호: admin123)
INSERT INTO users (email, password, name, phone, role) VALUES
('admin@sweetea.com', '$2a$10$X8xhKZQzYYb9v.qMk4V5wuGN5p1B0r7VXlT5xHg4nKrN8h9w.7Yry', '관리자', '010-1234-5678', 'admin');

-- 샘플 데이터: 공통코드
INSERT INTO common_codes (code_group, code, code_name, code_name_en, code_name_ja, sort_order) VALUES
('CATEGORY', 'MILK_TEA', '밀크티', 'Milk Tea', 'ミルクティー', 1),
('CATEGORY', 'FRUIT_TEA', '과일티', 'Fruit Tea', 'フルーツティー', 2),
('CATEGORY', 'COFFEE', '커피', 'Coffee', 'コーヒー', 3),
('CATEGORY', 'SMOOTHIE', '스무디', 'Smoothie', 'スムージー', 4),
('CATEGORY', 'ADE', '에이드', 'Ade', 'エード', 5),
('ORDER_STATUS', 'pending', '주문접수', 'Order Received', '注文受付', 1),
('ORDER_STATUS', 'confirmed', '주문확인', 'Order Confirmed', '注文確認', 2),
('ORDER_STATUS', 'preparing', '준비중', 'Preparing', '準備中', 3),
('ORDER_STATUS', 'shipping', '배송중', 'Shipping', '配送中', 4),
('ORDER_STATUS', 'completed', '배송완료', 'Completed', '配送完了', 5),
('ORDER_STATUS', 'cancelled', '취소', 'Cancelled', 'キャンセル', 6);

-- 샘플 데이터: 상품
INSERT INTO products (name, name_en, name_ja, description, description_en, description_ja, price, category, image_url, stock) VALUES
('클래식 밀크티', 'Classic Milk Tea', 'クラシックミルクティー', '진한 홍차와 부드러운 우유의 조화', 'Perfect blend of strong black tea and smooth milk', '濃厚な紅茶とまろやかな牛乳の調和', 4500, 'MILK_TEA', '/images/classic-milk-tea.jpg', 100),
('타로 밀크티', 'Taro Milk Tea', 'タロミルクティー', '고소한 타로의 풍미가 가득한 밀크티', 'Milk tea filled with the nutty flavor of taro', 'タロのナッツのような風味がたっぷりのミルクティー', 5000, 'MILK_TEA', '/images/taro-milk-tea.jpg', 80),
('흑당 밀크티', 'Brown Sugar Milk Tea', '黒糖ミルクティー', '달콤한 흑당과 진한 밀크티의 만남', 'Sweet brown sugar meets rich milk tea', '甘い黒糖と濃厚なミルクティーの出会い', 5500, 'MILK_TEA', '/images/brown-sugar-milk-tea.jpg', 90),
('딸기 밀크티', 'Strawberry Milk Tea', 'ストロベリーミルクティー', '상큼한 딸기와 부드러운 밀크티', 'Fresh strawberries with smooth milk tea', 'フレッシュなイチゴとまろやかなミルクティー', 5500, 'MILK_TEA', '/images/strawberry-milk-tea.jpg', 70),
('망고 스무디', 'Mango Smoothie', 'マンゴースムージー', '달콤한 망고로 만든 시원한 스무디', 'Cool smoothie made with sweet mangoes', '甘いマンゴーで作ったクールなスムージー', 6000, 'SMOOTHIE', '/images/mango-smoothie.jpg', 60);
