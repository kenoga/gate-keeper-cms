-- Create syntax for TABLE 'gateway'
CREATE TABLE `gateway` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `playground_id` int(11) unsigned NOT NULL,
  `type` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'gateway_controller'
CREATE TABLE `gateway_controller` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `gateway_id` int(11) unsigned NOT NULL,
  `type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `key` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`gateway_id`)
    REFERENCES gateway(`id`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'gateway_session'
CREATE TABLE `gateway_session` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `gateway_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `reservation_id` int(11) unsigned DEFAULT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `token` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`gateway_id`)
    REFERENCES gateway(`id`)
    ON DELETE RESTRICT,
  FOREIGN KEY (`user_id`)
    REFERENCES user(`id`)
    ON DELETE RESTRICT,
  FOREIGN KEY (`reservation_id`)
    REFERENCES reservation(`id`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'plan'
CREATE TABLE `plan` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `monthly_limit` int(11) unsigned NOT NULL,
  `simul_limit` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'playground'
CREATE TABLE `playground` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ' ',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'reservation'
CREATE TABLE `reservation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `playground_id` int(11) unsigned NOT NULL,
  `date` date NOT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `time_range` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT 'OTHER',
  `status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RESERVED',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) 
    REFERENCES user(`id`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'time_range'
CREATE TABLE `time_range` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `start_hour` int(11) unsigned NOT NULL,
  `end_hour` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'user'
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `encrypted_password` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `plan_id` int(11) unsigned NOT NULL,
  `admin` tinyint(1) DEFAULT '0',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`plan_id`)
    REFERENCES plan(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'user_session'
CREATE TABLE `user_session` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `token` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `index_on_token` (`token`),
  FOREIGN KEY (`user_id`)
    REFERENCES user(`id`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;