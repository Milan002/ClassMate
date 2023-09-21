DROP TABLE IF EXISTS `quiz`;
CREATE TABLE `quiz` (
  `quizId` bigint NOT NULL AUTO_INCREMENT,
  `courseId` bigint NOT NULL,
  `title` text NOT NULL,
  `instruction` text NOT NULL,
  `duration` varchar(45) NOT NULL,
  `topic` text NOT NULL,
  `totalQues` int NOT NULL DEFAULT '0',
  `totalMarks` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`quizId`),
  KEY `fk_quiz_idx` (`courseId`),
  CONSTRAINT `fk_quiz` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `quiz` WRITE;
INSERT INTO `quiz` VALUES (32,1,'End Sem','Read it carefully , Be mindful with time','05:00','Java',2,7),(39,8,'Mid Sem','Read all question carefully','02:00','Full syllabus',2,8);
UNLOCK TABLES;
