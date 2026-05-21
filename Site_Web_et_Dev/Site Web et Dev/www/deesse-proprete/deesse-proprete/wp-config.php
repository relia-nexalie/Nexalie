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
define('DB_NAME', 'ywcqjvc923');

/** MySQL database username */
define('DB_USER', 'ywcqjvc923');

/** MySQL database password */
define('DB_PASSWORD', 'MeurxPerpXV4');

/** MySQL hostname */
define('DB_HOST', 'ywcqjvc923.mysql.db:3306');

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
define('AUTH_KEY',         '9MZ27owS/zUPG2TlxEHwpaXztvrWnrn4ZchVD8pY2XaW6u4fYKtP4c4f01YY');
define('SECURE_AUTH_KEY',  'bCVlGYUJAC9dS1sj9t4iNzQXVpvR0AfKtcRkoH/CsiJLXM0sQqKwHcvRmRWd');
define('LOGGED_IN_KEY',    'MtPik9C5ui1zmBk1DVVSYA/Gau4j5IoixUaWN4pnhhyyGbNkVJQ+HW9KlTJs');
define('NONCE_KEY',        'NY4tBRBsM/i4Slfl5+dwuwDzaJ3dmg/PaDzVB7Fs/O3/3Miza1YDhvxghEsR');
define('AUTH_SALT',        '5QrI8EqLf5kaC5J0u/yCaCN7FkOzByjb46TFtbG2qq0AZ4gDoq0gmaHVX4yq');
define('SECURE_AUTH_SALT', 'qTbgM+8do+Q0ZB1CUiLgDJtm7ySb39z3rR96zXBEDDhFXrBYdUMVvpFpnHut');
define('LOGGED_IN_SALT',   '+v5XL+x1XxDOkGEPkoRiyTRw+Zwr9plrP0Q2ZYj+WDiPxlpk7yRmJIaEVMru');
define('NONCE_SALT',       'MUh2DZhVc0BqxnpQ9+78TrC+xzb4eUZtnY6bzLFB9QCjF1PNmjY1XyfPINOL');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'mod686_';

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
