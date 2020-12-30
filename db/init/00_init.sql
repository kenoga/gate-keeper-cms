-- Create syntax for TABLE 'playground'
CREATE TABLE `playground` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'reservation'
CREATE TABLE `reservation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `playground_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `time_range` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `status` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '''RESERVED''',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'user'
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `encrypted_password` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create syntax for TABLE 'user_session'
CREATE TABLE `user_session` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;