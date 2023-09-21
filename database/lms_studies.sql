DROP TABLE IF EXISTS `studies`;
CREATE TABLE `studies` (
  `studentId` bigint NOT NULL,
  `courseId` bigint NOT NULL,
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`studentId`,`courseId`),
  KEY `fk_courseId_idx` (`courseId`),
  CONSTRAINT `fk_courseId` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_studentId` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `studies` WRITE;
INSERT INTO `studies` VALUES (1,1,'Enrolled'),(1,2,'Enrolled'),(1,3,'Enrolled'),(1,4,'Enrolled'),(1,5,'Enrolled'),(1,6,'Enrolled'),(7,1,'Enrolled'),(11,1,'Enrolled'),(11,2,'Enrolled'),(11,3,'Enrolled'),(11,4,'Enrolled'),(11,5,'Enrolled'),(11,6,'Enrolled'),(12,1,'Enrolled'),(12,3,'Enrolled'),(12,5,'Enrolled'),(14,1,'Enrolled'),(17,1,'Enrolled'),(18,1,'Enrolled'),(25,1,'Enrolled'),(26,1,'Enrolled'),(26,2,'Enrolled'),(26,6,'Enrolled'),(27,1,'Enrolled'),(27,3,'Enrolled');
UNLOCK TABLES;
