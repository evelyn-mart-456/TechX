SELECT PollVotes.OptionID, COUNT(PollVotes.OptionID) AS Votes, polloptions.OptionName AS OptionName
FROM PollVotes
JOIN polloptions ON PollVotes.OptionID = polloptions.OptionID
WHERE PollVotes.PollID = ?
GROUP BY PollVotes.OptionID, polloptions.OptionName;