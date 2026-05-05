INSERT INTO orders (user_id, total_amount, order_date, status)
VALUES (?, ?, NOW(), 'pending');