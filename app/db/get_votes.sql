SELECT OptionID, COUNT(*) as VoteCount
FROM PollVotes
WHERE PollID = ?
GROUP BY OptionID;
