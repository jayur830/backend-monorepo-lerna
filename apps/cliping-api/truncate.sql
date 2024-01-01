
DELETE FROM `profile`;
DELETE FROM `follower`;
DELETE FROM `place_rating`;
DELETE FROM `place_like`;
DELETE FROM `review_like`;
DELETE FROM `review`;

SET foreign_key_checks = 0;
TRUNCATE TABLE `profile`;
TRUNCATE TABLE `follower`;
TRUNCATE TABLE `place_rating`;
TRUNCATE TABLE `place_like`;
TRUNCATE TABLE `review_like`;
TRUNCATE TABLE `review`;
SET foreign_key_checks = 1;

ALTER TABLE `profile` AUTO_INCREMENT = 0;
ALTER TABLE `follower` AUTO_INCREMENT = 0;
ALTER TABLE `place_rating` AUTO_INCREMENT = 0;
ALTER TABLE `place_like` AUTO_INCREMENT = 0;
ALTER TABLE `review_like` AUTO_INCREMENT = 0;
ALTER TABLE `review` AUTO_INCREMENT = 0;