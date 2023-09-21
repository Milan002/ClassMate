
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file` (
  `fileId` bigint NOT NULL AUTO_INCREMENT,
  `courseId` bigint NOT NULL,
  `file` varchar(5000) NOT NULL,
  `file_name` varchar(45) NOT NULL,
  PRIMARY KEY (`fileId`),
  KEY `fk_file_idx` (`courseId`),
  CONSTRAINT `fk_file` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `file` WRITE;
INSERT INTO `file` VALUES (7,1,'http://localhost:3002/file/1635427832986.pdf','Lab 14.pdf'),(8,1,'http://localhost:3002/file/1635428476678.docx','Learning_Management_System (3).docx'),(9,1,'http://localhost:3002/file/1636970231632.pdf','A13. Transaction.pdf'),(10,1,'http://localhost:3002/file/1636970266505.pdf','LAB-6_GrC2.pdf'),(13,8,'http://localhost:3002/file/1637141233513.pptx','DBMS_PROJECT (3).pptx'),(16,8,'http://localhost:3002/file/1637143166798.docx','group_2 (1).docx'),(17,8,'http://localhost:3002/file/1637143206287.docx','1635428476678 (2).docx'),(18,8,'http://localhost:3002/file/1637143292726.docx','DBMS_PROJECT.docx'),(22,8,'http://localhost:3002/file/1637144077485.docx','DBMS_PROJECT.docx');
UNLOCK TABLES;
