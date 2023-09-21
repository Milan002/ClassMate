
DROP TABLE IF EXISTS `courses`;

CREATE TABLE `courses` (
  `courseId` bigint NOT NULL AUTO_INCREMENT,
  `courseName` varchar(100) NOT NULL,
  `credits` int DEFAULT NULL,
  `bio` text NOT NULL,
  `teacherId` bigint NOT NULL,
  `prerequisite` text NOT NULL,
  PRIMARY KEY (`courseId`),
  UNIQUE KEY `courseName_UNIQUE` (`courseName`),
  KEY `id_idx` (`teacherId`),
  CONSTRAINT `id` FOREIGN KEY (`teacherId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `courses` WRITE;
INSERT INTO `courses` VALUES (1,'DBMS',4,'Learn Fundamental Concepts of Database Management from scratch',8,'None'),(2,'Machine Learning',4,'Demystify Machine Learning and build foundational Data Science skills like regression & forecasting, without any code!',8,'Linear Algebra, Probability and Statistics, Calculus, Python'),(3,'Computer Organization and Architecture',4,'Learn the internals of computer, such as how actually computer runs and build',9,'Digital Logic and Design, Switching Theory'),(4,'Compiler',3,'Deep Dive in Lexical Analysis, Syntax Analysis (Top Down Parsers and Bottom Up Parsers).',9,'COA, OS'),(5,'C',3,'Learn your first programming language and its memory management',4,'None'),(6,'Graph Theory',3,'Master the Nuts and Bolts of Graph Theory: the Heart of Communication and Transportation Networks, Internet, GPS, ...',4,'Data Structure and Algorithm'),(8,'data science',2,'data science for beginners',23,'maths'),(9,'mongodb',3,'Master MongoDB Development for Web & Mobile Apps. CRUD Operations, Indexes, Aggregation Framework - All about MongoDB!',23,'DBMS'),(12,'Digital Logic',3,'Digital, or boolean, logic is the fundamental concept underpinning all modern computer systems.',9,'none'),(13,'Discrete Mathematics',4,'Discrete mathematics is the study of mathematical structures that are fundamentally discrete rather than continuous',23,'+2 maths');
UNLOCK TABLES;
