
DROP TABLE IF EXISTS `assignment`;

CREATE TABLE `assignment` (
  `assignmentId` bigint NOT NULL AUTO_INCREMENT,
  `courseId` bigint NOT NULL,
  `file` varchar(1000) NOT NULL,
  `fileName` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `topic` varchar(100) NOT NULL,
  `deadline` varchar(45) NOT NULL,
  PRIMARY KEY (`assignmentId`),
  KEY `fk_assign_courseId_idx` (`courseId`),
  CONSTRAINT `fk_assign_courseId` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `assignment` WRITE;
INSERT INTO `assignment` VALUES (2,1,'http://localhost:3002/assignments/1636909924434.pdf','Lab 10 DML 28-Sep-2021.pdf','Data Manipulation with SQL','Dbms query','2021-10-28T20:00'),(3,1,'http://localhost:3002/assignments/1636914326191.pdf','A13. Transaction.pdf','Transaction','dbms multiuser','2021-11-15T17:00'),(4,1,'http://localhost:3002/assignments/1636914408556.pdf','A12. Normal Forms.pdf','Normal Forms','functional dependency','2021-11-22T20:00'),(5,1,'http://localhost:3002/assignments/1636914576689.pdf','A11. SQL_Mix.pdf','Sql_Mix','sql query','2021-11-30T00:00'),(6,1,'http://localhost:3002/assignments/1636914691964.pdf','A9. SQL_Airport.pdf','SQL_Airport','sql practice','2021-11-20T04:01'),(7,1,'http://localhost:3002/assignments/1636914839094.pdf','A10. SQL_Inventory.pdf','SQL_Inventory','sql','2021-11-25T12:00'),(21,8,'http://localhost:3002/assignments/1637147832099.pdf','statistics.pdf','data scienc','practice','2021-12-02T20:50');
UNLOCK TABLES;
