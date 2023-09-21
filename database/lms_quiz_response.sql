DROP TABLE IF EXISTS `quiz_response`;
CREATE TABLE `quiz_response` (
  `quizId` bigint NOT NULL,
  `studentId` bigint NOT NULL,
  `questionId` bigint NOT NULL,
  `response` int DEFAULT NULL,
  `marks` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`quizId`,`studentId`,`questionId`),
  KEY `fk_response_user_idx` (`studentId`),
  KEY `fk_response_questionId_idx` (`questionId`),
  CONSTRAINT `fk_response_questionId` FOREIGN KEY (`questionId`) REFERENCES `quiz_question` (`questionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_response_quiz` FOREIGN KEY (`quizId`) REFERENCES `quiz` (`quizId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_response_user` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `quiz_response` WRITE;
INSERT INTO `quiz_response` VALUES (32,1,1,1,4),(32,1,3,2,0),(32,12,1,1,4),(32,12,3,2,0),(32,14,1,1,4),(32,14,3,2,0),(32,18,1,1,4),(32,18,3,3,0);
UNLOCK TABLES;
