CREATE DATABASE bamazon;
USE bamazaon;

CREATE TABLE products(
	item_id INTEGER(100) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price INTEGER(100),
    stock_quantity INTEGER(100),
    PRIMARY KEY(id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Echo speaker", "electronics" 75.00, 6)

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fire TV", "electronics", 199.00, 12)

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kindle", "electronics" 99.00, 13)

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Instant Pot", "kitchen", 79.99, 15)

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Furbo Dog", "cameras", 119.50, 9)