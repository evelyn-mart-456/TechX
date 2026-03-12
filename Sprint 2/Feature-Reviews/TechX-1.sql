-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 04, 2026 at 01:55 AM
-- Server version: 8.0.45-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `TechX`
--

-- --------------------------------------------------------

--
-- Table structure for table `Comment`
--

CREATE TABLE `Comment` (
  `CommentID` varchar(300) NOT NULL,
  `CommentText` varchar(300) NOT NULL,
  `CommentCreated` date NOT NULL,
  `PostID` varchar(300) NOT NULL,
  `UserID` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Comment`
--

INSERT INTO `Comment` (`CommentID`, `CommentText`, `CommentCreated`, `PostID`, `UserID`) VALUES
('DC01', 'I\'d have to disagree. The specs of the Amata G50 Hard drive is asking for current day prices for 2007 quality.', '2026-02-17', 'DPost01', 'UD02'),
('DummyComment', 'I may have to wait more to understand the meaning of AI', '2026-02-15', 'DummyPost01', 'DummyID');

-- --------------------------------------------------------

--
-- Table structure for table `Poll`
--

CREATE TABLE `Poll` (
  `PollID` varchar(300) NOT NULL,
  `Question` varchar(300) NOT NULL,
  `PollCreated` date NOT NULL,
  `UserID` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Poll`
--

INSERT INTO `Poll` (`PollID`, `Question`, `PollCreated`, `UserID`) VALUES
('DP01', 'Between the options, which motherboard would you prefer', '2026-02-12', 'DS01'),
('DP02', 'Which tech innovation excites you the most?', '2026-02-23', '0b5cf974-c0c0-4df9-80e8-eb7de828414a'),
('DummyPoll', 'Do you see view the benefits of Artificial Intelligence outweighing negatives?', '2026-02-16', 'DummyID');

-- --------------------------------------------------------

--
-- Table structure for table `PollOptions`
--

CREATE TABLE `PollOptions` (
  `OptionID` varchar(300) NOT NULL,
  `OptionText` varchar(300) NOT NULL,
  `PollID` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `PollOptions`
--

INSERT INTO `PollOptions` (`OptionID`, `OptionText`, `PollID`) VALUES
('DO01', 'G50: The Amata G50 Hard drive provides a great value for the money, having nearly 2 Terabytes of storage space.', 'DP01'),
('DO02', 'The Hyperion Bulwark is expensive, but its immense 5 terabytes of storage make up for its price at 10 gigabytes per dollar ', 'DP01'),
('DO03', 'Artificial Intelligence', 'DP02'),
('DO04', 'Virtual Reality', 'DP02'),
('DO05', 'Electric Vehicles', 'DP02'),
('DummyOption1', 'I think that it can do more good than harm overall', 'DummyPoll');

-- --------------------------------------------------------

--
-- Table structure for table `PollVotes`
--

CREATE TABLE `PollVotes` (
  `VoteID` int NOT NULL,
  `PollID` varchar(300) NOT NULL,
  `OptionID` varchar(300) NOT NULL,
  `UserID` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `PollVotes`
--

INSERT INTO `PollVotes` (`VoteID`, `PollID`, `OptionID`, `UserID`) VALUES
(1, 'DP02', 'DO04', '69ce31a7-49dd-4b73-ab49-7b6748e9dc15'),
(12, 'DP02', 'DO05', '66f9ca22-fc01-459b-90d8-6ca31b271142'),
(13, 'DP02', 'DO04', '0eb44dd5-fd9d-4f66-ada2-df8454c35271'),
(14, 'DP02', 'DO03', '0b5cf974-c0c0-4df9-80e8-eb7de828414a'),
(15, 'DP02', 'DO04', '6c14bdc8-b46a-4a7d-a3b6-8ec879977d31');

-- --------------------------------------------------------

--
-- Table structure for table `Post`
--

CREATE TABLE `Post` (
  `PostID` varchar(300) NOT NULL,
  `Body` varchar(300) NOT NULL,
  `Title` varchar(300) NOT NULL,
  `PostCreated` date NOT NULL,
  `UserID` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Post`
--

INSERT INTO `Post` (`PostID`, `Body`, `Title`, `PostCreated`, `UserID`) VALUES
('DPost01', 'The poll options are a choice between good and better, it seems.', 'Have you seen the recent poll?', '2026-02-16', 'UD01'),
('DummyPost01', 'I like the idea of artificial intelligence, but it may stifle creativity', 'Concerns over Artificial Intelligence?', '2026-02-14', 'DummyID');

-- --------------------------------------------------------

--
-- Table structure for table `Product`
--

CREATE TABLE `Product` (
  `ProductID` int NOT NULL,
  `ProductName` varchar(1000) NOT NULL,
  `ProductDesc` varchar(10000) NOT NULL,
  `ProductImage` varchar(300) NOT NULL,
  `Featured` tinyint(1) NOT NULL,
  `ProductLink` varchar(5000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Reviews`
--

CREATE TABLE `Reviews` (
  `ReviewID` varchar(300) NOT NULL,
  `ProductName` varchar(150) NOT NULL,
  `Rating` int NOT NULL,
  `ProductReview` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Staff`
--

CREATE TABLE `Staff` (
  `StaffID` int NOT NULL,
  `Username` varchar(300) NOT NULL,
  `Email` varchar(1000) NOT NULL,
  `Password_Hash` varchar(1000) NOT NULL,
  `Activated` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Staff`
--

INSERT INTO `Staff` (`StaffID`, `Username`, `Email`, `Password_Hash`, `Activated`) VALUES
(1, 'ryan', 'mccann.ryan.92@gmail.com', '2e24e326945f68b6f242a8a733e5f15f401592616c15eeb468076c5e2011c087', 1),
(2, 'test', 'test@test.com', '52d231fa3e687f1d78815655628241b21c90eb97ddb840c13dfdf7022a0cb561', 1);

-- --------------------------------------------------------

--
-- Table structure for table `UAccount`
--

CREATE TABLE `UAccount` (
  `UserID` varchar(300) NOT NULL,
  `UserEmail` varchar(300) NOT NULL,
  `Username` varchar(300) NOT NULL,
  `Password_Hash` varchar(300) NOT NULL,
  `CreatedAt` date NOT NULL,
  `UpdatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `UAccount`
--

INSERT INTO `UAccount` (`UserID`, `UserEmail`, `Username`, `Password_Hash`, `CreatedAt`, `UpdatedAt`) VALUES
('0b5cf974-c0c0-4df9-80e8-eb7de828414a', 'test3@test.com', 'test3', '52d231fa3e687f1d78815655628241b21c90eb97ddb840c13dfdf7022a0cb561', '2026-02-23', NULL),
('0eb44dd5-fd9d-4f66-ada2-df8454c35271', 'test4@test.com', 'test4', '52d231fa3e687f1d78815655628241b21c90eb97ddb840c13dfdf7022a0cb561', '2026-02-24', NULL),
('66f9ca22-fc01-459b-90d8-6ca31b271142', 'test5@test.com', 'test5', '52d231fa3e687f1d78815655628241b21c90eb97ddb840c13dfdf7022a0cb561', '2026-02-24', NULL),
('69ce31a7-49dd-4b73-ab49-7b6748e9dc15', 'test@test.com', 'test', '52d231fa3e687f1d78815655628241b21c90eb97ddb840c13dfdf7022a0cb561', '2026-02-23', NULL),
('6c14bdc8-b46a-4a7d-a3b6-8ec879977d31', 'test7@test.com', 'test7', '52d231fa3e687f1d78815655628241b21c90eb97ddb840c13dfdf7022a0cb561', '2026-02-24', NULL),
('86b4421e-cf94-4a3b-98d4-446f35eec59b', 'test2@test.com', 'test2', '52d231fa3e687f1d78815655628241b21c90eb97ddb840c13dfdf7022a0cb561', '2026-02-23', NULL),
('8cc9b4fd-eddc-47a5-bae5-c1a50ad6ec43', 'test6@test.com', 'test6', '52d231fa3e687f1d78815655628241b21c90eb97ddb840c13dfdf7022a0cb561', '2026-02-24', NULL),
('DS01', 'Sellerman@Dummymail.com', 'Sellerbois', 'GetSellin', '2026-02-03', '2026-02-09'),
('DummyID', 'Querie@Dummymail.com', 'Queriename', 'blahblah', '2026-02-07', '2026-02-20'),
('UD01', 'Randall@Dummymail.com', 'Dummylife', 'e2d5d7dfd789757833e8b03d43e84705e6c0053677a6797297f765a2', '2026-02-11', NULL),
('UD02', 'Clark.Rindman@Dummymail.com', 'Porklord', '3db06e06b8be49c922ca441f136dabe0f2ee47479166185457d1ec07', '2026-02-06', '2026-02-15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Comment`
--
ALTER TABLE `Comment`
  ADD PRIMARY KEY (`CommentID`),
  ADD KEY `PostID` (`PostID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Poll`
--
ALTER TABLE `Poll`
  ADD PRIMARY KEY (`PollID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `PollOptions`
--
ALTER TABLE `PollOptions`
  ADD PRIMARY KEY (`OptionID`),
  ADD KEY `PollID` (`PollID`);

--
-- Indexes for table `PollVotes`
--
ALTER TABLE `PollVotes`
  ADD PRIMARY KEY (`VoteID`),
  ADD UNIQUE KEY `UniqueVotes` (`PollID`,`UserID`),
  ADD KEY `OptionID` (`OptionID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Post`
--
ALTER TABLE `Post`
  ADD PRIMARY KEY (`PostID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`ProductID`);

--
-- Indexes for table `Reviews`
--
ALTER TABLE `Reviews`
  ADD UNIQUE KEY `ReviewID` (`ReviewID`);

--
-- Indexes for table `Staff`
--
ALTER TABLE `Staff`
  ADD PRIMARY KEY (`StaffID`);

--
-- Indexes for table `UAccount`
--
ALTER TABLE `UAccount`
  ADD PRIMARY KEY (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `PollVotes`
--
ALTER TABLE `PollVotes`
  MODIFY `VoteID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `Product`
--
ALTER TABLE `Product`
  MODIFY `ProductID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Staff`
--
ALTER TABLE `Staff`
  MODIFY `StaffID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Comment`
--
ALTER TABLE `Comment`
  ADD CONSTRAINT `Commented on` FOREIGN KEY (`PostID`) REFERENCES `Post` (`PostID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Commenter` FOREIGN KEY (`UserID`) REFERENCES `UAccount` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Poll`
--
ALTER TABLE `Poll`
  ADD CONSTRAINT `Poll Creator` FOREIGN KEY (`UserID`) REFERENCES `UAccount` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `PollOptions`
--
ALTER TABLE `PollOptions`
  ADD CONSTRAINT `PollConnection` FOREIGN KEY (`PollID`) REFERENCES `Poll` (`PollID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `PollVotes`
--
ALTER TABLE `PollVotes`
  ADD CONSTRAINT `PollVotes_ibfk_1` FOREIGN KEY (`PollID`) REFERENCES `Poll` (`PollID`),
  ADD CONSTRAINT `PollVotes_ibfk_2` FOREIGN KEY (`OptionID`) REFERENCES `PollOptions` (`OptionID`),
  ADD CONSTRAINT `PollVotes_ibfk_3` FOREIGN KEY (`UserID`) REFERENCES `UAccount` (`UserID`);

--
-- Constraints for table `Post`
--
ALTER TABLE `Post`
  ADD CONSTRAINT `Poster` FOREIGN KEY (`UserID`) REFERENCES `UAccount` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
