USE `resume`;

CREATE TABLE `resume_info` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(64) NOT NULL DEFAULT '',
  `email` VARCHAR(64),
  `github` VARCHAR(128),
  `blog` VARCHAR(256),
  `user_id` VARCHAR(28) NOT NULL
);

CREATE TABLE `company_logo` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `src` VARCHAR(256) NOT NULL,
  `alt` VARCHAR(16) NOT NULL DEFAULT '',
  `width` INT NOT NULL,
  `height` INT NOT NULL
);

CREATE TABLE `resume_company` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE,
  `website` VARCHAR(128),
  `description` VARCHAR(1024),
  `resume_info_id` INT NOT NULL,
  `logo_id` INT NOT NULL,
  FOREIGN KEY (`resume_info_id`) REFERENCES `resume_info`(`id`),
  FOREIGN KEY (`logo_id`) REFERENCES `company_logo`(`id`)
);

CREATE TABLE `resume_project` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `group` VARCHAR(32),
  `title` VARCHAR(64) NOT NULL,
  `description` VARCHAR(1024),
  `start_date` DATE NOT NULL,
  `end_date` DATE,
  `resume_company_id` INT NOT NULL,
  FOREIGN KEY (`resume_company_id`) REFERENCES `resume_company`(`id`)
);

CREATE TABLE `tech` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(16) NOT NULL
);

CREATE TABLE `resume_project_tech` (
  `tech_id` INT NOT NULL,
  `resume_project_id` INT NOT NULL,
  PRIMARY KEY (`tech_id`, `resume_project_id`),
  FOREIGN KEY (`tech_id`) REFERENCES `tech`(`id`),
  FOREIGN KEY (`resume_project_id`) REFERENCES `resume_project`(`id`)
);
