Select PollVotes.OptionID, COUNT (PollVotes.OptionID) AS 
Votes, polloptions.OptionName AS OptionName
From PollVotes
Join Polloptions on PollVotes.OptionID = polloptions.OptionID
Where PollVotes.PollID = ?
Group By PollVotes.OptionID, polloptions.OptionName

