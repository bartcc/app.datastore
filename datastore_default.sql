SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Datenbank: `datastore`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `acos`
--

DROP TABLE IF EXISTS `acos`;
CREATE TABLE `acos` (
  `id` int(10) NOT NULL auto_increment,
  `parent_id` int(10) default NULL,
  `model` varchar(255) default NULL,
  `foreign_key` int(10) default NULL,
  `alias` varchar(255) default NULL,
  `lft` int(10) default NULL,
  `rght` int(10) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=85 ;

--
-- Daten für Tabelle `acos`
--

INSERT INTO `acos` VALUES(1, NULL, NULL, NULL, 'controllers', 1, 168);
INSERT INTO `acos` VALUES(2, 1, NULL, NULL, 'Pages', 2, 17);
INSERT INTO `acos` VALUES(3, 2, NULL, NULL, 'display', 3, 4);
INSERT INTO `acos` VALUES(4, 2, NULL, NULL, 'verify_ajax', 5, 6);
INSERT INTO `acos` VALUES(5, 2, NULL, NULL, 'add', 7, 8);
INSERT INTO `acos` VALUES(6, 2, NULL, NULL, 'edit', 9, 10);
INSERT INTO `acos` VALUES(7, 2, NULL, NULL, 'index', 11, 12);
INSERT INTO `acos` VALUES(8, 2, NULL, NULL, 'view', 13, 14);
INSERT INTO `acos` VALUES(9, 2, NULL, NULL, 'delete', 15, 16);
INSERT INTO `acos` VALUES(10, 1, NULL, NULL, 'Groups', 18, 31);
INSERT INTO `acos` VALUES(11, 10, NULL, NULL, 'index', 19, 20);
INSERT INTO `acos` VALUES(12, 10, NULL, NULL, 'view', 21, 22);
INSERT INTO `acos` VALUES(13, 10, NULL, NULL, 'add', 23, 24);
INSERT INTO `acos` VALUES(14, 10, NULL, NULL, 'edit', 25, 26);
INSERT INTO `acos` VALUES(15, 10, NULL, NULL, 'delete', 27, 28);
INSERT INTO `acos` VALUES(16, 10, NULL, NULL, 'verify_ajax', 29, 30);
INSERT INTO `acos` VALUES(17, 1, NULL, NULL, 'Kodaks', 32, 47);
INSERT INTO `acos` VALUES(18, 17, NULL, NULL, 'index', 33, 34);
INSERT INTO `acos` VALUES(19, 17, NULL, NULL, 'develop', 35, 36);
INSERT INTO `acos` VALUES(20, 17, NULL, NULL, 'verify_ajax', 37, 38);
INSERT INTO `acos` VALUES(21, 17, NULL, NULL, 'add', 39, 40);
INSERT INTO `acos` VALUES(22, 17, NULL, NULL, 'edit', 41, 42);
INSERT INTO `acos` VALUES(23, 17, NULL, NULL, 'view', 43, 44);
INSERT INTO `acos` VALUES(24, 17, NULL, NULL, 'delete', 45, 46);
INSERT INTO `acos` VALUES(25, 1, NULL, NULL, 'Products', 48, 85);
INSERT INTO `acos` VALUES(26, 25, NULL, NULL, 'index', 49, 50);
INSERT INTO `acos` VALUES(27, 25, NULL, NULL, 'render_table_row', 51, 52);
INSERT INTO `acos` VALUES(28, 25, NULL, NULL, 'ajax_serial_count', 53, 54);
INSERT INTO `acos` VALUES(29, 25, NULL, NULL, 'get_title', 55, 56);
INSERT INTO `acos` VALUES(30, 25, NULL, NULL, 'view', 57, 58);
INSERT INTO `acos` VALUES(31, 25, NULL, NULL, 'add', 59, 60);
INSERT INTO `acos` VALUES(32, 25, NULL, NULL, 'delete', 61, 62);
INSERT INTO `acos` VALUES(33, 25, NULL, NULL, 'duplicate', 63, 64);
INSERT INTO `acos` VALUES(34, 25, NULL, NULL, 'edit', 65, 66);
INSERT INTO `acos` VALUES(35, 25, NULL, NULL, 'ajax_edit', 67, 68);
INSERT INTO `acos` VALUES(36, 25, NULL, NULL, 'product_editor_error', 69, 70);
INSERT INTO `acos` VALUES(37, 25, NULL, NULL, 'ajax_coll_edit', 71, 72);
INSERT INTO `acos` VALUES(38, 25, NULL, NULL, 'ajax_coll_view', 73, 74);
INSERT INTO `acos` VALUES(39, 25, NULL, NULL, 'load_upload_dialogue', 75, 76);
INSERT INTO `acos` VALUES(40, 25, NULL, NULL, 'reset_avatar', 77, 78);
INSERT INTO `acos` VALUES(41, 25, NULL, NULL, 'exit_uploader', 79, 80);
INSERT INTO `acos` VALUES(42, 25, NULL, NULL, 'avatar_uri', 81, 82);
INSERT INTO `acos` VALUES(43, 25, NULL, NULL, 'verify_ajax', 83, 84);
INSERT INTO `acos` VALUES(44, 1, NULL, NULL, 'Serials', 86, 103);
INSERT INTO `acos` VALUES(45, 44, NULL, NULL, 'start', 87, 88);
INSERT INTO `acos` VALUES(46, 44, NULL, NULL, 'index', 89, 90);
INSERT INTO `acos` VALUES(47, 44, NULL, NULL, 'view', 91, 92);
INSERT INTO `acos` VALUES(48, 44, NULL, NULL, 'add', 93, 94);
INSERT INTO `acos` VALUES(49, 44, NULL, NULL, 'edit', 95, 96);
INSERT INTO `acos` VALUES(50, 44, NULL, NULL, 'delete', 97, 98);
INSERT INTO `acos` VALUES(51, 44, NULL, NULL, 'search', 99, 100);
INSERT INTO `acos` VALUES(52, 44, NULL, NULL, 'verify_ajax', 101, 102);
INSERT INTO `acos` VALUES(53, 1, NULL, NULL, 'Systems', 104, 117);
INSERT INTO `acos` VALUES(54, 53, NULL, NULL, 'index', 105, 106);
INSERT INTO `acos` VALUES(55, 53, NULL, NULL, 'view', 107, 108);
INSERT INTO `acos` VALUES(56, 53, NULL, NULL, 'add', 109, 110);
INSERT INTO `acos` VALUES(57, 53, NULL, NULL, 'edit', 111, 112);
INSERT INTO `acos` VALUES(58, 53, NULL, NULL, 'delete', 113, 114);
INSERT INTO `acos` VALUES(59, 53, NULL, NULL, 'verify_ajax', 115, 116);
INSERT INTO `acos` VALUES(60, 1, NULL, NULL, 'Uploads', 118, 135);
INSERT INTO `acos` VALUES(61, 60, NULL, NULL, 'image', 119, 120);
INSERT INTO `acos` VALUES(62, 60, NULL, NULL, 'avatar', 121, 122);
INSERT INTO `acos` VALUES(63, 60, NULL, NULL, 'verify_ajax', 123, 124);
INSERT INTO `acos` VALUES(64, 60, NULL, NULL, 'add', 125, 126);
INSERT INTO `acos` VALUES(65, 60, NULL, NULL, 'edit', 127, 128);
INSERT INTO `acos` VALUES(66, 60, NULL, NULL, 'index', 129, 130);
INSERT INTO `acos` VALUES(67, 60, NULL, NULL, 'view', 131, 132);
INSERT INTO `acos` VALUES(68, 60, NULL, NULL, 'delete', 133, 134);
INSERT INTO `acos` VALUES(69, 1, NULL, NULL, 'Users', 136, 167);
INSERT INTO `acos` VALUES(70, 69, NULL, NULL, 'hash', 137, 138);
INSERT INTO `acos` VALUES(71, 69, NULL, NULL, 'login_ajax', 139, 140);
INSERT INTO `acos` VALUES(72, 69, NULL, NULL, 'login', 141, 142);
INSERT INTO `acos` VALUES(73, 69, NULL, NULL, 'refresh_header', 143, 144);
INSERT INTO `acos` VALUES(74, 69, NULL, NULL, 'logout', 145, 146);
INSERT INTO `acos` VALUES(75, 69, NULL, NULL, 'retrieve_session_status', 147, 148);
INSERT INTO `acos` VALUES(76, 69, NULL, NULL, 'index', 149, 150);
INSERT INTO `acos` VALUES(77, 69, NULL, NULL, 'view', 151, 152);
INSERT INTO `acos` VALUES(78, 69, NULL, NULL, 'add', 153, 154);
INSERT INTO `acos` VALUES(79, 69, NULL, NULL, 'edit', 155, 156);
INSERT INTO `acos` VALUES(80, 69, NULL, NULL, 'delete', 157, 158);
INSERT INTO `acos` VALUES(81, 69, NULL, NULL, 'autherror', 159, 160);
INSERT INTO `acos` VALUES(82, 69, NULL, NULL, 'build_acl', 161, 162);
INSERT INTO `acos` VALUES(83, 69, NULL, NULL, 'init_db', 163, 164);
INSERT INTO `acos` VALUES(84, 69, NULL, NULL, 'verify_ajax', 165, 166);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `aros`
--

DROP TABLE IF EXISTS `aros`;
CREATE TABLE `aros` (
  `id` int(10) NOT NULL auto_increment,
  `parent_id` int(10) default NULL,
  `model` varchar(255) default NULL,
  `foreign_key` int(10) default NULL,
  `alias` varchar(255) default NULL,
  `lft` int(10) default NULL,
  `rght` int(10) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Daten für Tabelle `aros`
--

INSERT INTO `aros` VALUES(1, NULL, 'Group', 1, NULL, 1, 4);
INSERT INTO `aros` VALUES(2, NULL, 'Group', 2, NULL, 5, 8);
INSERT INTO `aros` VALUES(3, NULL, 'Group', 3, NULL, 9, 12);
INSERT INTO `aros` VALUES(4, NULL, 'Group', 4, NULL, 13, 16);
INSERT INTO `aros` VALUES(5, 1, 'User', 1, NULL, 2, 3);
INSERT INTO `aros` VALUES(7, 2, 'User', 3, NULL, 6, 7);
INSERT INTO `aros` VALUES(8, 3, 'User', 4, NULL, 10, 11);
INSERT INTO `aros` VALUES(9, 4, 'User', 5, NULL, 14, 15);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `aros_acos`
--

DROP TABLE IF EXISTS `aros_acos`;
CREATE TABLE `aros_acos` (
  `id` int(10) NOT NULL auto_increment,
  `aro_id` int(10) NOT NULL,
  `aco_id` int(10) NOT NULL,
  `_create` varchar(2) NOT NULL default '0',
  `_read` varchar(2) NOT NULL default '0',
  `_update` varchar(2) NOT NULL default '0',
  `_delete` varchar(2) NOT NULL default '0',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `ARO_ACO_KEY` (`aro_id`,`aco_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=23 ;

--
-- Daten für Tabelle `aros_acos`
--

INSERT INTO `aros_acos` VALUES(1, 1, 1, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(2, 2, 1, '-1', '-1', '-1', '-1');
INSERT INTO `aros_acos` VALUES(3, 2, 31, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(4, 2, 30, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(5, 2, 26, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(6, 2, 29, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(7, 2, 35, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(8, 2, 38, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(9, 2, 37, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(10, 2, 28, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(11, 2, 42, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(12, 2, 40, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(13, 2, 32, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(14, 2, 50, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(15, 2, 62, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(16, 3, 1, '-1', '-1', '-1', '-1');
INSERT INTO `aros_acos` VALUES(17, 3, 26, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(18, 3, 30, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(19, 3, 38, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(20, 4, 1, '-1', '-1', '-1', '-1');
INSERT INTO `aros_acos` VALUES(21, 4, 26, '1', '1', '1', '1');
INSERT INTO `aros_acos` VALUES(22, 2, 33, '1', '1', '1', '1');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `groups`
--

DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Daten für Tabelle `groups`
--

INSERT INTO `groups` VALUES(1, 'Administrators');
INSERT INTO `groups` VALUES(2, 'Managers');
INSERT INTO `groups` VALUES(3, 'Users');
INSERT INTO `groups` VALUES(4, 'Guests');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `company` varchar(50) NOT NULL,
  `title` varchar(50) NOT NULL,
  `notes` varchar(5000) default NULL,
  `system_id` char(36) NOT NULL,
  `modified` datetime NOT NULL,
  `created` datetime NOT NULL,
  `image` varchar(100) default NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `products`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `serials`
--

DROP TABLE IF EXISTS `serials`;
CREATE TABLE `serials` (
  `id` varchar(36) NOT NULL,
  `key` varchar(200) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `type` varchar(50) NOT NULL default 'Serial',
  `created` datetime default NULL,
  `modified` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `serials`
--


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `systems`
--

DROP TABLE IF EXISTS `systems`;
CREATE TABLE `systems` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `modified` datetime NOT NULL,
  `created` datetime NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `systems`
--

INSERT INTO `systems` VALUES('C3269BB7-D8EC-8AAA-485053B594023101', 'MAC', '2010-06-07 21:18:56', '0000-00-00 00:00:00');
INSERT INTO `systems` VALUES('C326DBC8-FAB3-91E3-C4DFBA0FE2259571', 'PC', '2010-06-21 22:21:46', '0000-00-00 00:00:00');
INSERT INTO `systems` VALUES('DAB53037-044A-18FB-C8CDC5F8EB55E607', 'Dual', '2010-07-16 14:44:13', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created` datetime default NULL,
  `modified` datetime default NULL,
  `lastlogin` datetime default NULL,
  `enabled` tinyint(1) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` VALUES(1, 'admin', '8ca1564ac0cd14cf403c5cd2417a5a3e62ec3dbc', 'SampleAdmin', '2011-01-04 11:10:55', '2011-03-24 00:32:15', '2011-03-24 00:32:15', 1, 1);
INSERT INTO `users` VALUES(3, 'manager', 'e19c8465a42ffb2371011a4a11751a6598bc56ed', 'SampleManager', '2011-01-04 12:00:58', '2011-03-20 04:55:32', '2011-03-20 04:55:32', 1, 2);
INSERT INTO `users` VALUES(4, 'user', '080c367b36aea3126c36ec555a18a62345e7d54f', 'SampleUser', '2011-01-04 12:01:31', '2011-03-17 17:48:10', '2011-03-17 17:48:10', 1, 3);
INSERT INTO `users` VALUES(5, 'guest', '701f9f95b384efe29f5949d10aa2e0e875fc32e7', 'SampleGuest', '2011-01-04 12:01:48', '2011-03-18 02:17:44', '2011-03-18 02:17:44', 1, 4);
