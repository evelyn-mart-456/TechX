SELECT OrderID, Total, ShippingID, CreatedAt
FROM orders
WHERE UserID = ?
ORDER BY CreatedAt DESC