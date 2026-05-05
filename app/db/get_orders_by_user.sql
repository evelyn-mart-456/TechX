SELECT OrderID, OrderNumber, Total, ShippingID, CreatedAt
FROM orders
WHERE UserID = ?
ORDER BY CreatedAt DESC;