UPDATE ThreadPost
SET
    Text = ?,
    ModificationDate = NOW()
WHERE
    ThreadPost.PostID = ?;