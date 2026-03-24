SELECT ReviewID, Reviews.ProductID, Rating, ProductReview, Reviews.UserID, UAccount.UserName, Product.ProductName
FROM Reviews
JOIN UAccount ON Reviews.UserID = UAccount.UserID
JOIN Product ON Reviews.ProductID = Product.ProductID
WHERE Reviews.ProductID = ?;