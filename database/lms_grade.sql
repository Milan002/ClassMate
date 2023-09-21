

DROP TABLE IF EXISTS `grade`;

CREATE TABLE `grade` (
  `studentId` bigint NOT NULL,
  `quizId` bigint NOT NULL,
  `score` int NOT NULL,
  PRIMARY KEY (`studentId`,`quizId`),
  KEY `fk_grade_quizId_idx` (`quizId`),
  CONSTRAINT `fk_grade_quizId` FOREIGN KEY (`quizId`) REFERENCES `quiz` (`quizId`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_grade_studentId` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `grade` WRITE;
INSERT INTO `grade` VALUES (1,32,4),(12,32,4),(14,32,4),(18,32,4);
UNLOCK TABLES;
