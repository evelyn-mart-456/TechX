SELECT OrderID, Total, ShippingID, CreatedAt
FROM Orders
WHERE UserID = ?
ORDER BY CreatedAt DESC