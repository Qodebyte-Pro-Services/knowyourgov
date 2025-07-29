-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: blog_schema
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ads`
--

DROP TABLE IF EXISTS `ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `position` varchar(50) DEFAULT NULL,
  `embed_code` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ads`
--

LOCK TABLES `ads` WRITE;
/*!40000 ALTER TABLE `ads` DISABLE KEYS */;
/*!40000 ALTER TABLE `ads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Logistics','logistics','2025-07-25 10:25:42'),(2,'Sport','sport','2025-07-25 10:26:27');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `post_title` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `commenter` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `reply_count` int DEFAULT '0',
  `in_reply_to` varchar(100) DEFAULT 'no',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,6,'khalid','hrllo how are you doing','uzo charles','bensongame0019@gmail.com',0,'no','2025-07-26 12:09:36'),(5,6,'khalid','helllo can you hear me','uzo charles','bensongame0019@gmail.com',0,'1','2025-07-26 12:18:15'),(6,6,'khalid','good morning','uzo charles','bensongame0019@gmail.com',0,'no','2025-07-26 12:22:29'),(7,6,'khalid','whats your aim here','uzo charles','bensongame0019@gmail.com',0,'1','2025-07-26 12:31:39'),(8,6,'khalid','just checking','uzo charles','bensongame0019@gmail.com',0,'1','2025-07-27 09:59:31'),(9,6,'khalid','hellooo','uzo charles','bensongame0019@gmail.com',0,'1','2025-07-27 10:01:55'),(10,6,'khalid','good morning','Dominic Benson','bensongame0019@gmial.com',0,'no','2025-07-28 06:56:06'),(11,6,'khalid','what do you mean','Dominic Benson','bensongame0019@gmial.com',0,'no','2025-07-28 07:02:41'),(12,9,'The British Political System: Tradition, Power, and Public Pressure','Quality Info from this blog','uzo charles','bensongame0019@gmail.com',0,'no','2025-07-28 11:58:55');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_thread`
--

DROP TABLE IF EXISTS `comment_thread`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_thread` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `thread_comment` text NOT NULL,
  `thread_commenter` varchar(100) DEFAULT NULL,
  `thread_email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `comment_id` (`comment_id`),
  CONSTRAINT `comment_thread_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_thread`
--

LOCK TABLES `comment_thread` WRITE;
/*!40000 ALTER TABLE `comment_thread` DISABLE KEYS */;
INSERT INTO `comment_thread` VALUES (1,1,'helloo do ypu mean that','Dominic Benson','bensongame0019@gmail.com','2025-07-27 10:12:10'),(2,1,'whats your name','Dominic Benson','bensongame0019@gmail.com','2025-07-27 10:12:43'),(3,1,'crosschecking','Dominic Benson','bensongame0019@gmial.com','2025-07-27 10:19:03'),(4,1,'stop lying','uzo charles','bensongame0019@gmail.com','2025-07-27 10:24:48'),(5,7,'hellloo','uzo charles','bensongame0019@gmail.com','2025-07-28 06:39:44'),(6,5,'whats your name','Dominic Benson','bensongame0019@gmial.com','2025-07-28 06:40:46'),(7,6,'benson','uzo charles','bensongame0019@gmail.com','2025-07-28 06:41:15'),(11,10,'its not morning stop it','uzo charles','bensongame0019@gmail.com','2025-07-28 06:56:48'),(16,10,'what do you mean its 10:00 am bro ?','Dominic Benson','bensongame0019@gmial.com','2025-07-28 07:06:58'),(17,12,'would recommend to others','uzo charles','bensongame0019@gmail.com','2025-07-28 11:59:14');
/*!40000 ALTER TABLE `comment_thread` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commenters`
--

DROP TABLE IF EXISTS `commenters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commenters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `total_comments` int DEFAULT '0',
  `first_comment_date` timestamp NULL DEFAULT NULL,
  `last_comment_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commenters`
--

LOCK TABLES `commenters` WRITE;
/*!40000 ALTER TABLE `commenters` DISABLE KEYS */;
INSERT INTO `commenters` VALUES (1,'uzo charles','bensongame0019@gmail.com',9,'2025-07-26 12:09:36','2025-07-28 11:59:14'),(2,'Dominic Benson','bensongame0019@gmial.com',3,'2025-07-28 06:56:07','2025-07-28 07:06:58');
/*!40000 ALTER TABLE `commenters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `content` text,
  `is_approved` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_categories`
--

DROP TABLE IF EXISTS `post_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_categories` (
  `post_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`post_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `post_categories_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_categories`
--

LOCK TABLES `post_categories` WRITE;
/*!40000 ALTER TABLE `post_categories` DISABLE KEYS */;
INSERT INTO `post_categories` VALUES (6,1),(8,1),(10,1),(9,2),(10,2);
/*!40000 ALTER TABLE `post_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_tags`
--

DROP TABLE IF EXISTS `post_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_tags` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_tags`
--

LOCK TABLES `post_tags` WRITE;
/*!40000 ALTER TABLE `post_tags` DISABLE KEYS */;
INSERT INTO `post_tags` VALUES (1,'Education','education','2025-07-25 10:25:57'),(2,'Football','football','2025-07-25 10:26:41');
/*!40000 ALTER TABLE `post_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `content` text,
  `feature_image` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `author_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('draft','pending','publish') DEFAULT NULL,
  `views` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (6,'khalid','khalid-education-football','<p>hellooo whats your name</p><figure class=\"image image-style-side\"><img style=\"aspect-ratio:494/348;\" src=\"/uploads/upload-1753447655468-314937046.png\" width=\"494\" height=\"348\"></figure>','/uploads/feature_image-1753447690441-425454442.png',0,1,'2025-07-25 12:48:10','draft',0),(8,'Understanding the UK Government: Structure, Strengths, and Challenges','understanding-the-uk-government-structure-strengths-and-challenges-education','<p>The <strong>United Kingdom (UK) Government</strong> operates under a <strong>parliamentary democracy and constitutional monarchy</strong>, meaning the Prime Minister leads the government while the monarch (currently King Charles III) serves as the ceremonial head of state. The system is grounded in long-standing institutions, including the <strong>House of Commons</strong> and <strong>House of Lords</strong>, which together form Parliament and play a central role in lawmaking. One of the key <strong>advantages</strong> of the UK government is its political stability and well-established legal framework, which has evolved over centuries. The system enables <strong>strong accountability mechanisms</strong> through regular elections, a free press, and active parliamentary debate. The <strong>National Health Service (NHS)</strong>, a publicly funded healthcare system, is often cited as one of the UK\'s most valued public services and reflects the government\'s commitment to social welfare. Additionally, <strong>devolution</strong> has allowed Scotland, Wales, and Northern Ireland to exercise some self-governance, promoting regional representation.</p><p>However, the UK government also faces significant <strong>criticisms and challenges</strong>. One major concern is the <strong>concentration of executive power</strong> in the hands of the Prime Minister, especially when the ruling party holds a large majority in Parliament—this can lead to weakened checks and balances. The <strong>House of Lords</strong>, an unelected body, is often criticized for being outdated and undemocratic, as it allows appointed or hereditary peers to influence legislation. Moreover, issues such as <strong>Brexit</strong> have exposed deep divisions in British society and raised questions about transparency, decision-making, and national unity. The <strong>NHS and public services</strong> face increasing pressure from underfunding and staffing shortages, while policies on immigration, social care, and climate change remain sources of public debate. Despite its many strengths, the UK government must continue to evolve to address these complex issues and maintain public trust in a changing world.</p><figure class=\"image\"><img style=\"aspect-ratio:500/304;\" src=\"/uploads/upload-1753693433949-997850338.png\" width=\"500\" height=\"304\"></figure>','/uploads/feature_image-1753693464673-696897893.png',1,1,'2025-07-28 09:04:24','publish',2),(9,'The British Political System: Tradition, Power, and Public Pressure','the-british-political-system-tradition-power-and-public-pressure-football','<p>The <strong>United Kingdom (UK) Government</strong> operates under a <strong>parliamentary democracy and constitutional monarchy</strong>, meaning the Prime Minister leads the government while the monarch (currently King Charles III) serves as the ceremonial head of state. The system is grounded in long-standing institutions, including the <strong>House of Commons</strong> and <strong>House of Lords</strong>, which together form Parliament and play a central role in lawmaking. One of the key <strong>advantages</strong> of the UK government is its political stability and well-established legal framework, which has evolved over centuries. The system enables <strong>strong accountability mechanisms</strong> through regular elections, a free press, and active parliamentary debate. The <strong>National Health Service (NHS)</strong>, a publicly funded healthcare system, is often cited as one of the UK\'s most valued public services and reflects the government\'s commitment to social welfare. Additionally, <strong>devolution</strong> has allowed Scotland, Wales, and Northern Ireland to exercise some self-governance, promoting regional representation.</p><p>However, the UK government also faces significant <strong>criticisms and challenges</strong>. One major concern is the <strong>concentration of executive power</strong> in the hands of the Prime Minister, especially when the ruling party holds a large majority in Parliament—this can lead to weakened checks and balances. The <strong>House of Lords</strong>, an unelected body, is often criticized for being outdated and undemocratic, as it allows appointed or hereditary peers to influence legislation. Moreover, issues such as <strong>Brexit</strong> have exposed deep divisions in British society and raised questions about transparency, decision-making, and national unity. The <strong>NHS and public services</strong> face increasing pressure from underfunding and staffing shortages, while policies on immigration, social care, and climate change remain sources of public debate. Despite its many strengths, the UK government must continue to evolve to address these complex issues and maintain public trust in a changing world.</p><figure class=\"image\"><img style=\"aspect-ratio:500/333;\" src=\"/uploads/upload-1753693554067-61000497.png\" width=\"500\" height=\"333\"></figure>','/uploads/feature_image-1753693584666-939618981.png',1,1,'2025-07-28 09:06:24','publish',1),(10,'What Makes the UK Government Work—and What Holds It Back','what-makes-the-uk-government-workand-what-holds-it-back-education-football','<p>The <strong>United Kingdom (UK) Government</strong> operates under a <strong>parliamentary democracy and constitutional monarchy</strong>, meaning the Prime Minister leads the government while the monarch (currently King Charles III) serves as the ceremonial head of state. The system is grounded in long-standing institutions, including the <strong>House of Commons</strong> and <strong>House of Lords</strong>, which together form Parliament and play a central role in lawmaking. One of the key <strong>advantages</strong> of the UK government is its political stability and well-established legal framework, which has evolved over centuries. The system enables <strong>strong accountability mechanisms</strong> through regular elections, a free press, and active parliamentary debate. The <strong>National Health Service (NHS)</strong>, a publicly funded healthcare system, is often cited as one of the UK\'s most valued public services and reflects the government\'s commitment to social welfare. Additionally, <strong>devolution</strong> has allowed Scotland, Wales, and Northern Ireland to exercise some self-governance, promoting regional representation.</p><p>However, the UK government also faces significant <strong>criticisms and challenges</strong>. One major concern is the <strong>concentration of executive power</strong> in the hands of the Prime Minister, especially when the ruling party holds a large majority in Parliament—this can lead to weakened checks and balances. The <strong>House of Lords</strong>, an unelected body, is often criticized for being outdated and undemocratic, as it allows appointed or hereditary peers to influence legislation. Moreover, issues such as <strong>Brexit</strong> have exposed deep divisions in British society and raised questions about transparency, decision-making, and national unity. The <strong>NHS and public services</strong> face increasing pressure from underfunding and staffing shortages, while policies on immigration, social care, and climate change remain sources of public debate. Despite its many strengths, the UK government must continue to evolve to address these complex issues and maintain public trust in a changing world.</p><figure class=\"image\"><img style=\"aspect-ratio:500/334;\" src=\"/uploads/upload-1753693624088-987794043.png\" width=\"500\" height=\"334\"></figure>','/uploads/feature_image-1753693643288-90297235.png',0,1,'2025-07-28 09:07:23','publish',0);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_tags`
--

DROP TABLE IF EXISTS `posts_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts_tags` (
  `post_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `posts_tags_ibfk_2` (`tag_id`),
  CONSTRAINT `posts_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `posts_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `post_tags` (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_tags`
--

LOCK TABLES `posts_tags` WRITE;
/*!40000 ALTER TABLE `posts_tags` DISABLE KEYS */;
INSERT INTO `posts_tags` VALUES (6,1),(8,1),(10,1),(6,2),(9,2),(10,2);
/*!40000 ALTER TABLE `posts_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key_name` varchar(100) DEFAULT NULL,
  `value` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social_links`
--

DROP TABLE IF EXISTS `social_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `social_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_links`
--

LOCK TABLES `social_links` WRITE;
/*!40000 ALTER TABLE `social_links` DISABLE KEYS */;
INSERT INTO `social_links` VALUES (1,'Facebook','http://localhost:3000/Admin/settings');
/*!40000 ALTER TABLE `social_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support`
--

DROP TABLE IF EXISTS `support`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `status` enum('not_seen','seen','replied') NOT NULL DEFAULT 'not_seen',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support`
--

LOCK TABLES `support` WRITE;
/*!40000 ALTER TABLE `support` DISABLE KEYS */;
INSERT INTO `support` VALUES (1,'Uzoefuna Benson','bensoncj19@gmail.com','helloo testing','not_seen','2025-07-26 13:10:29');
/*!40000 ALTER TABLE `support` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_reply`
--

DROP TABLE IF EXISTS `support_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_reply` (
  `id` int NOT NULL AUTO_INCREMENT,
  `support_id` int NOT NULL,
  `subject` varchar(255) NOT NULL,
  `reply` text NOT NULL,
  `reply_email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `support_id` (`support_id`),
  CONSTRAINT `support_reply_ibfk_1` FOREIGN KEY (`support_id`) REFERENCES `support` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_reply`
--

LOCK TABLES `support_reply` WRITE;
/*!40000 ALTER TABLE `support_reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'uzoefuna benson','uzoefuna.benson@gmail.com','$2b$10$Hn0Ai01bFOHpzhzesylmG.rM6dLVsnuaYX9Tl5OjMJI8A7EXj8e06','2025-07-25 07:44:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-29  7:26:46
