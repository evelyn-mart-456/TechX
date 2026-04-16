INSERT INTO orders (UserID, OrderNumber, Total, ShippingID, CreatedAt)
VALUES (?, (SELECT COALESCE(MAX(OrderNumber), 0) + 1 FROM orders WHERE UserID = ?), ?, ?, NOW());