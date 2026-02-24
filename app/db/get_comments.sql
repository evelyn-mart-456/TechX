SELECT CommentID, CommentText, CommentCreated, PostID, UserID
FROM Comment
WHERE PostID = ?;
