SELECT Reviews.ReviewID, Reviews.ProductID, Reviews.Rating, Reviews.ProductReview, Reviews.UserID, UAccount.Username, Product.ProductName
FROM Reviews
JOIN UAccount ON Reviews.UserID = UAccount.UserID
JOIN Product ON Reviews.ProductID = Product.ProductID
WHERE Reviews.UserID = ?;