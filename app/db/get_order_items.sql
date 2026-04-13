SELECT oi.OrderItemID, oi.ProductID, p.ProductName, oi.Quantity, oi.Price
FROM orderitem oi
JOIN Product p ON oi.ProductID = p.ProductID
WHERE oi.OrderID = ?