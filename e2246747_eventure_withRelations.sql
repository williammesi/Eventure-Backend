-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 11, 2025 at 09:06 AM
-- Server version: 10.6.23-MariaDB
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e2246747_eventure`
--

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Client`
--

CREATE TABLE `Client` (
  `UserID` int(11) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `DateOfBirth` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

CREATE TABLE `Events` (
  `ID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `LocationID` int(11) NOT NULL,
  `CategoryID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `MinPrice` double NOT NULL,
  `MaxPrice` double NOT NULL,
  `StartingDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `Description` varchar(255) NOT NULL,
  `BookingURL` varchar(255) NOT NULL,
  `Approved` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `FollowedEvents`
--

CREATE TABLE `FollowedEvents` (
  `EventID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `FollowedOrganisation`
--

CREATE TABLE `FollowedOrganisation` (
  `OrganisationID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Image`
--

CREATE TABLE `Image` (
  `EventID` int(11) NOT NULL,
  `Href` varchar(255) NOT NULL,
  `isThumbnail` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Location`
--

CREATE TABLE `Location` (
  `ID` int(11) NOT NULL,
  `Adress` varchar(255) NOT NULL,
  `City` varchar(255) NOT NULL,
  `Province` varchar(255) NOT NULL,
  `Country` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Notification`
--

CREATE TABLE `Notification` (
  `ID` int(11) NOT NULL,
  `TypeID` int(11) NOT NULL,
  `Content` varchar(255) NOT NULL,
  `Date` date NOT NULL,
  `UserID` int(11) NOT NULL,
  `SenderID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `NotificationTypes`
--

CREATE TABLE `NotificationTypes` (
  `ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Organisation`
--

CREATE TABLE `Organisation` (
  `UserID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `PhoneNumber` varchar(255) NOT NULL,
  `Certified` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SecretQuestion`
--

CREATE TABLE `SecretQuestion` (
  `ID` int(11) NOT NULL,
  `Question` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Survey`
--

CREATE TABLE `Survey` (
  `ID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `CategoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SurveyAnswer`
--

CREATE TABLE `SurveyAnswer` (
  `UserID` int(11) NOT NULL,
  `SurveyID` int(11) NOT NULL,
  `SurveyChoiceID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SurveyChoice`
--

CREATE TABLE `SurveyChoice` (
  `ID` int(11) NOT NULL,
  `SurveyID` int(11) NOT NULL,
  `Content` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Thread`
--

CREATE TABLE `Thread` (
  `ID` int(11) NOT NULL,
  `EventID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `CreationDate` date NOT NULL,
  `Content` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ThreadAnswer`
--

CREATE TABLE `ThreadAnswer` (
  `ID` int(11) NOT NULL,
  `ThreadID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Content` varchar(255) NOT NULL,
  `CreationDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `ID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `ProfilePictureHref` varchar(255) NOT NULL,
  `SecretQuestionID` int(11) NOT NULL,
  `SecretQuestionAnswer` varchar(255) NOT NULL,
  `BannedUntil` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Client`
--
ALTER TABLE `Client`
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Events`
--
ALTER TABLE `Events`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UserID` (`UserID`,`LocationID`,`CategoryID`),
  ADD KEY `LocationID` (`LocationID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Indexes for table `FollowedEvents`
--
ALTER TABLE `FollowedEvents`
  ADD KEY `EventID` (`EventID`,`UserID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `FollowedOrganisation`
--
ALTER TABLE `FollowedOrganisation`
  ADD KEY `OrganisationID` (`OrganisationID`,`UserID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Image`
--
ALTER TABLE `Image`
  ADD KEY `EventID` (`EventID`);

--
-- Indexes for table `Location`
--
ALTER TABLE `Location`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Notification`
--
ALTER TABLE `Notification`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `TypeID` (`TypeID`,`UserID`,`SenderID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `SenderID` (`SenderID`);

--
-- Indexes for table `NotificationTypes`
--
ALTER TABLE `NotificationTypes`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Organisation`
--
ALTER TABLE `Organisation`
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `SecretQuestion`
--
ALTER TABLE `SecretQuestion`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Survey`
--
ALTER TABLE `Survey`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UserID` (`UserID`,`CategoryID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Indexes for table `SurveyAnswer`
--
ALTER TABLE `SurveyAnswer`
  ADD KEY `UserID` (`UserID`,`SurveyID`,`SurveyChoiceID`),
  ADD KEY `SurveyID` (`SurveyID`),
  ADD KEY `SurveyChoiceID` (`SurveyChoiceID`);

--
-- Indexes for table `SurveyChoice`
--
ALTER TABLE `SurveyChoice`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Survey_SurveyID_FK` (`SurveyID`);

--
-- Indexes for table `Thread`
--
ALTER TABLE `Thread`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `EventID` (`EventID`,`UserID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `ThreadAnswer`
--
ALTER TABLE `ThreadAnswer`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ThreadID` (`ThreadID`,`UserID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `RoleID` (`RoleID`),
  ADD KEY `SecretQuestionID` (`SecretQuestionID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Category`
--
ALTER TABLE `Category`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Events`
--
ALTER TABLE `Events`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Location`
--
ALTER TABLE `Location`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Notification`
--
ALTER TABLE `Notification`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `NotificationTypes`
--
ALTER TABLE `NotificationTypes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Roles`
--
ALTER TABLE `Roles`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SecretQuestion`
--
ALTER TABLE `SecretQuestion`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Survey`
--
ALTER TABLE `Survey`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SurveyChoice`
--
ALTER TABLE `SurveyChoice`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Thread`
--
ALTER TABLE `Thread`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ThreadAnswer`
--
ALTER TABLE `ThreadAnswer`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Client`
--
ALTER TABLE `Client`
  ADD CONSTRAINT `Client_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`);

--
-- Constraints for table `Events`
--
ALTER TABLE `Events`
  ADD CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `Events_ibfk_2` FOREIGN KEY (`LocationID`) REFERENCES `Location` (`ID`),
  ADD CONSTRAINT `Events_ibfk_3` FOREIGN KEY (`CategoryID`) REFERENCES `Category` (`ID`);

--
-- Constraints for table `FollowedEvents`
--
ALTER TABLE `FollowedEvents`
  ADD CONSTRAINT `FollowedEvents_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `FollowedEvents_ibfk_2` FOREIGN KEY (`EventID`) REFERENCES `Events` (`ID`);

--
-- Constraints for table `FollowedOrganisation`
--
ALTER TABLE `FollowedOrganisation`
  ADD CONSTRAINT `FollowedOrganisation_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `FollowedOrganisation_ibfk_2` FOREIGN KEY (`OrganisationID`) REFERENCES `Users` (`ID`);

--
-- Constraints for table `Image`
--
ALTER TABLE `Image`
  ADD CONSTRAINT `Image_ibfk_1` FOREIGN KEY (`EventID`) REFERENCES `Events` (`ID`);

--
-- Constraints for table `Notification`
--
ALTER TABLE `Notification`
  ADD CONSTRAINT `Notification_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `Notification_ibfk_2` FOREIGN KEY (`SenderID`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `Notification_ibfk_3` FOREIGN KEY (`TypeID`) REFERENCES `NotificationTypes` (`ID`);

--
-- Constraints for table `Organisation`
--
ALTER TABLE `Organisation`
  ADD CONSTRAINT `Organisation_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`);

--
-- Constraints for table `Survey`
--
ALTER TABLE `Survey`
  ADD CONSTRAINT `Survey_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `Survey_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `Category` (`ID`);

--
-- Constraints for table `SurveyAnswer`
--
ALTER TABLE `SurveyAnswer`
  ADD CONSTRAINT `SurveyAnswer_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `SurveyAnswer_ibfk_2` FOREIGN KEY (`SurveyID`) REFERENCES `Survey` (`ID`),
  ADD CONSTRAINT `SurveyAnswer_ibfk_3` FOREIGN KEY (`SurveyChoiceID`) REFERENCES `SurveyChoice` (`ID`);

--
-- Constraints for table `SurveyChoice`
--
ALTER TABLE `SurveyChoice`
  ADD CONSTRAINT `Survey_SurveyID_FK` FOREIGN KEY (`SurveyID`) REFERENCES `Survey` (`ID`);

--
-- Constraints for table `Thread`
--
ALTER TABLE `Thread`
  ADD CONSTRAINT `Thread_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `Thread_ibfk_2` FOREIGN KEY (`EventID`) REFERENCES `Events` (`ID`);

--
-- Constraints for table `ThreadAnswer`
--
ALTER TABLE `ThreadAnswer`
  ADD CONSTRAINT `ThreadAnswer_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`),
  ADD CONSTRAINT `ThreadAnswer_ibfk_2` FOREIGN KEY (`ThreadID`) REFERENCES `Thread` (`ID`);

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `Roles` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `Users_ibfk_2` FOREIGN KEY (`SecretQuestionID`) REFERENCES `SecretQuestion` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
