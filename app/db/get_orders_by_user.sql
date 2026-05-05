SELECT 
    id,
    user_id,
    total_amount,
    order_date,
    status
FROM orders
WHERE user_id = ?
ORDER BY order_date DESC;