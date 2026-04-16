INSERT INTO orders (UserID, OrderNumber, Total, ShippingID, CreatedAt)
SELECT
    '4d2c39c4-89cf-4dcc-94cb-6ad0e95cd7d2',
    COALESCE(MAX(OrderNumber), 0) + 1,
    2999,
    1,
    NOW()
FROM (
    SELECT OrderNumber 
    FROM orders 
    WHERE UserID = '4d2c39c4-89cf-4dcc-94cb-6ad0e95cd7d2'
) AS t;