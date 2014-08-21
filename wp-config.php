<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'db_infinity');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', '127.0.0.1:3306');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ',}mWQ%v]&i]5zs^XuO(c)erK8ZML+)UpQ`1<;5A>kpH>Krl}[A<[Ms1Fc~w9[5C8');
define('SECURE_AUTH_KEY',  '-84*`CK^mufm Y.8^En;4V{?akrgAs*]sQST[Pmh-SJO=zQ2eJBDJzY-n0]]qs+q');
define('LOGGED_IN_KEY',    'YKERtCn#=O;SR}%-8jf(M-G CTg<b6,ghu4]ORJ.BWWlWkKl0ivceH_1TeL+D&#{');
define('NONCE_KEY',        '|%,O_q(Zw|A,Rjt-O<^lqLRC;?~A LSqK(VzfkyM(W1ryh4%&aW_*X![x!&Kt]kg');
define('AUTH_SALT',        '=H{;v )M{5@$M;7[a4*VX+aU{-Qdn2UAH)#hO6>n$k!H~fD+m)D+1M$U(&?#U9L]');
define('SECURE_AUTH_SALT', 'vm w0|8 N2gmvRjRYQDWAc/|^xsSHCE=/ZO-q7^+5bzPL9|ezjr-Df72}[d%)q-*');
define('LOGGED_IN_SALT',   '<F+k 7J_}dMVwlrIwq#ga_,M-9I3!Ww.&IU i+jUWF-w)z)yrs]TR+;T2!6jJ&*A');
define('NONCE_SALT',       'ML,TZ3zyW+6G<vL&t1CZZ@x.(TtHLj<S)}|@X]&uS]~QG2LOvR0A*fW?WM>8N]u$');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', true);
define ('WP_SITEURL', 'http://infiniti/');
define ('WP_HOME', 'http://infiniti/');

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
