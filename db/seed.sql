-- insertar usuario admin y cliente demo
INSERT INTO users (name,email,password_hash,role) VALUES ('Admin','admin@demo.com','$2b$10$hash','admin');
INSERT INTO users (name,email,password_hash,role) VALUES ('Cliente Demo','cliente@demo.com','$2b$10$hash','client');
INSERT INTO clients (user_id,phone,address) VALUES (2,'987654321','Av. Demo 123');

-- productos demo
INSERT INTO products (sku,name,category,price,stock) VALUES ('P001','Polera básica','Ropa',35.00,15);
INSERT INTO products (sku,name,category,price,stock) VALUES ('P002','Tenis deportivo','Calzado',70.00,8);
INSERT INTO products (sku,name,category,price,stock) VALUES ('P003','Disfraz superhéroe','Disfraz',55.00,5);

