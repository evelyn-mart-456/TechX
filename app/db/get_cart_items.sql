SELECT 
    cart.id,
    cart.user_id,
    cart.product_id,
    cart.quantity,
    products.name,
    products.price
FROM cart
JOIN products ON cart.product_id = products.id
WHERE cart.user_id = ?;