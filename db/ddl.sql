-- PostgreSQL DDL (simplificado)
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'client',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE clients (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(50),
  address TEXT
);

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  price NUMERIC(10,2) NOT NULL,
  cost NUMERIC(10,2),
  stock INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id),
  total NUMERIC(12,2),
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) UNIQUE,
  provider VARCHAR(100),
  amount NUMERIC(12,2),
  status VARCHAR(50),
  reference VARCHAR(200),
  paid_at TIMESTAMP
);

CREATE TABLE promotions (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  start_date DATE,
  end_date DATE,
  code VARCHAR(50),
  active BOOLEAN DEFAULT true
);

CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id),
  client_id BIGSERIAL REFERENCES clients(id),
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  action VARCHAR(200),
  detail TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_client ON orders(client_id);

