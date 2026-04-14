SELECT 
    UAccount.UserID, 
    UAccount.Username,
    Product.ProductID,
    Product.ProductName
FROM UAccount
LEFT JOIN BoardModerators 
    ON UAccount.UserID = BoardModerators.UserID
LEFT JOIN Product
    ON BoardModerators.ProductID = Product.ProductID
WHERE BoardModerators.UserID IS NOT NULL;