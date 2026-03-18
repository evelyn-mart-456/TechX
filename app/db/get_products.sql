SELECT ProductName, ProductID, ProductDesc, ProductImage, Featured, ProductLink, RetailPrice, Product.CategoryID, ProductCategory.Name as CategoryName 
FROM Product
LEFT JOIN ProductCategory ON Product.CategoryID=ProductCategory.CategoryID;