INSERT INTO ThreadPost (
    UserID,
    ThreadID,
    CreationDate,
    Text
) VALUES (?, ?, NOW(), ?);
