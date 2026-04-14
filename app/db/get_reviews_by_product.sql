SELECT ReviewID, Reviews.ProductID, Rating, ProductReview, Reviews.UserID, UAccount.Username, Product.ProductName, Reviews.Image
FROM Reviews
JOIN UAccount ON Reviews.UserID = UAccount.UserID
JOIN Product ON Reviews.ProductID = Product.ProductID
WHERE Reviews.ProductID = ?;