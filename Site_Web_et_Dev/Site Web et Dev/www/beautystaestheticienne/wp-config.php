<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'ywcqjvc366');

/** MySQL database username */
define('DB_USER', 'ywcqjvc366');

/** MySQL database password */
define('DB_PASSWORD', 'xkhcQu58UxPF');

/** MySQL hostname */
define('DB_HOST', 'ywcqjvc366.mysql.db:3306');

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
define('AUTH_KEY',         'O0iGovgG/Ret0nfpWJ3zVF/Ub6hwSNDhiq3MVXMut05mHMBX6CLoXG3FEBE/');
define('SECURE_AUTH_KEY',  'BGGUzIhxUiYbt6v3fWqec7FS4Gzrz+wD+35wzeRJJx/ME5gIs0BLTiAKZKh1');
define('LOGGED_IN_KEY',    'xsPlbPYmOaAVzOIT9mCRhdpICtkz1M8lkS6Gqhgq4fMlBVrYel0F0c05Rild');
define('NONCE_KEY',        '98vkRCKOwZ+t/tdrrce6tiVxzyXoYW00VX1dWPVw2V+PC7oGW5lnwr/JFxae');
define('AUTH_SALT',        '1dY60ChKY0UoSPXlpbaA2hp5BLLlFDXkiCRDeM/WKN2eAVN39bx+wKnzjhL/');
define('SECURE_AUTH_SALT', 'nohIL5CZKBOpt7Y5pfGD5cI1XrzQNHZylE421x/sEqMliJu0YZBCIEnkoUye');
define('LOGGED_IN_SALT',   'nqUnRJg8Qr2M32Iy+Gw3Q4qI14VJLE+xXbTGV1fhdiyEI7ardEK7MVW6Q/SI');
define('NONCE_SALT',       '2DKt9oDWkthon4wcxiFJnvr24SwYW4v+OobQoqQ47XSo7s6vIvjWH8yvIDUL');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'mod45_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/* Fixes "Add media button not working", see http://www.carnfieldwebdesign.co.uk/blog/wordpress-fix-add-media-button-not-working/ */
define('CONCATENATE_SCRIPTS', false );

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
