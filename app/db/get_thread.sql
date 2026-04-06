SELECT
    Thread.ThreadID,
    Thread.ProductID,
    Thread.Title,
    poster.Username,
    poster.UserID,
    post.CreationDate,
    post.ModificationDate,
    post.Text
FROM Thread
LEFT JOIN ThreadPost post
    ON post.ThreadID = Thread.ThreadID
LEFT JOIN UAccount poster
    ON poster.UserID = post.UserID
WHERE Thread.ThreadID = ?
ORDER BY post.CreationDate ASC;