INSERT INTO cart (user_id, product_id, quantity)
VALUES (?, ?, ?)
ON DUPLICATE KEY UPDATE
quantity = quantity + VALUES(quantity);
