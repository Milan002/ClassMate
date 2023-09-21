
DROP TABLE IF EXISTS `quiz_question`;
CREATE TABLE `quiz_question` (
  `quizId` bigint NOT NULL,
  `questionId` bigint NOT NULL AUTO_INCREMENT,
  `questionName` text NOT NULL,
  `maxScore` int NOT NULL,
  `penaltyScore` int NOT NULL,
  `answer` int NOT NULL,
  `opt1` text NOT NULL,
  `opt2` text NOT NULL,
  `opt3` text,
  `opt4` text,
  PRIMARY KEY (`questionId`),
  KEY `fk_question_idx` (`quizId`),
  CONSTRAINT `fk_question` FOREIGN KEY (`quizId`) REFERENCES `quiz` (`quizId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `quiz_question` WRITE;
INSERT INTO `quiz_question` VALUES (32,1,'What is java',4,-1,1,'Programming language','Gaming software','Coffee','Teaching software'),(32,3,'ewgt',3,0,4,'asg','q','r',NULL),(39,20,'Which of the following are correct about Activation Functions in neural network?',4,-2,1,'Derivative of a sigmoid activation function g(z) is g(z)[1-g(z)]','Derivative of a hyperbolic tangent activation k(z) function is 1+(k(z))2',' Derivative of RELU activation function l(z) is 0 for z<0','Derivative of a leaky RELU Activation function h(z) is 2'),(39,21,'Choose the correct option for residuals in linear regression?',4,0,3,' Residuals are horizontal offset, and the sum of residuals varies between [0,1]','Residuals are horizontal offset, and the sum of residuals can be unity','Residuals are vertical offset, and the sum of residuals is always unity','Residuals are vertical offset, and the sum of residuals is always unity');
UNLOCK TABLES;
