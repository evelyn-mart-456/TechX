SELECT 
    order_items.id,
    order_items.order_id,
    order_items.product_id,
    order_items.quantity,
    order_items.price,
    products.name,
    products.price AS current_price
FROM order_items
JOIN products ON order_items.product_id = products.id
WHERE order_items.order_id = ?;