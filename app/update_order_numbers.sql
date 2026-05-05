-- Update existing orders to have sequential OrderNumber per user
-- Run this after adding the OrderNumber column

-- For each user, set OrderNumber based on order of creation
UPDATE orders o1
JOIN (
    SELECT OrderID, UserID, 
           ROW_NUMBER() OVER (PARTITION BY UserID ORDER BY CreatedAt) AS rn
    FROM orders
) o2 ON o1.OrderID = o2.OrderID
SET o1.OrderNumber = o2.rn;