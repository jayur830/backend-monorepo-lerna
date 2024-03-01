USE `cliping`;

CREATE TABLE `follower` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `from_user_id` VARCHAR(28) NOT NULL,
  `to_user_id` VARCHAR(28) NOT NULL
);

CREATE TABLE `place_like` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` VARCHAR(28) NOT NULL,
  `place_id` VARCHAR(32) NOT NULL
);

CREATE TABLE `place_rating` (
  `place_id` VARCHAR(32) NOT NULL,
  `user_id` VARCHAR(28) NOT NULL,
  `rating` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`place_id`,`user_id`)
);

CREATE TABLE `profile` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nick_name` VARCHAR(128) NOT NULL,
  `description` VARCHAR(4096) DEFAULT NULL,
  `sub_title` VARCHAR(256) DEFAULT NULL,
  `background_image_url` VARCHAR(128) DEFAULT NULL,
  `profile_image_url` VARCHAR(128) DEFAULT NULL,
  `instagram_url` VARCHAR(128) DEFAULT NULL,
  `user_id` VARCHAR(28) NOT NULL
);

CREATE TABLE `review` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(128) NOT NULL,
  `content` VARCHAR(4096) DEFAULT NULL,
  `image_url` VARCHAR(128) DEFAULT NULL,
  `rating` INT NOT NULL DEFAULT 0,
  `instagram_post_url` VARCHAR(128) DEFAULT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `user_id` VARCHAR(28) NOT NULL,
  `place_id` VARCHAR(32) NOT NULL
);

CREATE TABLE `review_like` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` VARCHAR(28) NOT NULL,
  `review_id` INT NOT NULL,
  FOREIGN KEY (`review_id`) REFERENCES `review` (`id`)
);
