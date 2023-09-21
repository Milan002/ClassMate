DROP TABLE IF EXISTS `announce`;

CREATE TABLE `announce` (
  `courseId` bigint NOT NULL,
  `announcementId` bigint NOT NULL AUTO_INCREMENT,
  `announcement` text,
  `my_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`announcementId`),
  KEY `fk_announce_idx` (`courseId`),
  CONSTRAINT `fk_announce` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `announce` WRITE;
INSERT INTO `announce` VALUES (1,1,'Reminder for the Quiz tomorrow at 10 AM. ','2021-10-26 18:54:59'),(1,2,'Okay , for you guys I will not take exam and all will get 10cgpa','2021-10-26 18:54:59'),(1,3,'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda tempore error eum aspernatur at, ad vero. Accusamus reprehenderit blanditiis eius, corporis mollitia, possimus recusandae nobis labore impedit voluptatem, veniam temporibus?Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda tempore error eum aspernatur at, ad vero. Accusamus reprehenderit blanditiis eius, corporis mollitia, possimus recusandae nobis labore impedit voluptatem, veniam temporibus?Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda tempore error eum aspernatur at, ad vero. Accusamus reprehenderit blanditiis eius, corporis mollitia, possimus recusandae nobis labore impedit voluptatem, veniam temporibus?Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda tempore error eum aspernatur at, ad vero. Accusamus reprehenderit blanditiis eius, corporis mollitia, possimus recusandae nobis labore impedit voluptatem, veniam temporibus?','2021-10-26 18:54:59'),(1,4,'hi its new announcement','2021-10-26 18:54:59'),(8,14,'Be prepared for exams','2021-11-17 11:17:24');
UNLOCK TABLES;
