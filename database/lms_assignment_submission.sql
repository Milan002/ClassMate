DROP TABLE IF EXISTS `assignment_submission`;

CREATE TABLE `assignment_submission` (
  `assignment_submissionId` bigint NOT NULL AUTO_INCREMENT,
  `assignmentId` bigint NOT NULL,
  `courseId` bigint NOT NULL,
  `studentId` bigint NOT NULL,
  `file` varchar(1000) NOT NULL,
  `fileName` varchar(45) NOT NULL,
  `comment` varchar(1000) NOT NULL,
  `roll` varchar(45) NOT NULL,
  `late` tinyint NOT NULL,
  PRIMARY KEY (`assignment_submissionId`),
  KEY `fk_assign_courseId_idx` (`courseId`),
  KEY `fk_assign_studentId_idx` (`studentId`),
  KEY `fk_assignSubmission_assignmentId_idx` (`assignmentId`),
  CONSTRAINT `fk_assignSubmission_assignmentId` FOREIGN KEY (`assignmentId`) REFERENCES `assignment` (`assignmentId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_assignSubmission_courseId` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_assignSubmission_studentId` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `assignment_submission` WRITE;

INSERT INTO `assignment_submission` VALUES (21,2,1,18,'http://localhost:3002/StudentAssignmentSubmission/1636980795597.pdf','A11. SQL_Mix.pdf','','20BC002',0),(22,2,1,14,'http://localhost:3002/StudentAssignmentSubmission/1636980877028.pdf','A9. SQL_Airport.pdf','','20BCS253',0),(23,2,1,12,'http://localhost:3002/StudentAssignmentSubmission/1637040898992.pdf','A9. SQL_Airport.pdf','','20BC008',0),(26,7,1,25,'http://localhost:3002/StudentAssignmentSubmission/1637134395805.pdf','Car Servicing Management (1).pdf','test','20bcs008',0);

UNLOCK TABLES;
