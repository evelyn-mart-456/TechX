SELECT 
    Thread.ThreadID,
    Thread.ProductID,
    Thread.UserID AS CreatorID,
    Thread.Title,
    firstPost.CreationDate AS CreationDate,
    latestPost.PostID,
    latestPost.UserID AS LastPosterID,
    latestPost.CreationDate AS LastPostDate,
    creator.Username AS CreatorName,
    lastPoster.Username AS LastPosterName,
    postCounts.PostCount - 1 AS Replies
FROM Thread
LEFT JOIN UAccount creator
    ON creator.UserID = Thread.UserID
LEFT JOIN ThreadPost firstPost
    on firstPost.PostID = (
        SELECT ThreadPost.PostID
        FROM ThreadPost
        WHERE ThreadPost.ThreadID = Thread.ThreadID
        ORDER BY ThreadPost.CreationDate ASC, ThreadPost.PostID ASC
        LIMIT 1
    )
LEFT JOIN ThreadPost latestPost
    ON latestPost.PostID = (
    SELECT ThreadPost.PostID
    FROM ThreadPost
    WHERE ThreadPost.ThreadID = Thread.ThreadID
    ORDER BY ThreadPost.CreationDate DESC, ThreadPost.PostID DESC
    LIMIT 1 
)
LEFT JOIN (
    SELECT ThreadID, COUNT(*) AS PostCount
    FROM ThreadPost
    GROUP BY ThreadID
) postCounts
    ON postCounts.ThreadID = Thread.ThreadID
LEFT JOIN UAccount lastPoster
    ON lastPoster.UserID = latestPost.UserID
WHERE Thread.ProductID = ?;