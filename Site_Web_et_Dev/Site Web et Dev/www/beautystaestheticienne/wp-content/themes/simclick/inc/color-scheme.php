<?php
/**
 * Customizer functionality
 *
 * @package SimClick
 */

/**
 * Sets up the WordPress core custom header and custom background features.
 *
 * @since SimClick 0.1
 *
 * @see simclick_header_style()
 */
function simclick_custom_header_and_background() {
	$default_background_color = '#ffffff';
	$default_text_color       = '#ffffff';

	/**
	 * Filter the arguments used when adding 'custom-background' support in SimClick.
	 *
	 * @since SimClick 0.1
	 *
	 * @param array $args {
	 *     An array of custom-background support arguments.
	 *
	 *     @type string $default-color Default color of the background.
	 * }
	 */
	add_theme_support( 'custom-background', apply_filters( 'simclick_custom_background_args', array(
		'default-color'    => $default_background_color,
	) ) );

	/**
	 * Filter the arguments used when adding 'custom-header' support in SimClick.
	 *
	 * @since SimClick 0.1
	 *
	 * @param array $args {
	 *     An array of custom-header support arguments.
	 *
	 *     @type string $default-text-color Default color of the header text.
	 *     @type int      $width            Width in pixels of the custom header image. Default 1200.
	 *     @type int      $height           Height in pixels of the custom header image. Default 280.
	 *     @type bool     $flex-height      Whether to allow flexible-height header images. Default true.
	 *     @type callable $wp-head-callback Callback function used to style the header image and text
	 *                                      displayed on the blog.
	 * }
	 */
	add_theme_support( 'custom-header', apply_filters( 'simclick_custom_header_args', array(
		'default-image'      	 => get_parent_theme_file_uri( '/assets/images/header.jpg' ),
		'default-text-color'     => $default_text_color,
		'width'                  => 1920,
		'height'                 => 540,
		'flex-height'            => true,
		'flex-width'            => true,
		'wp-head-callback'       => 'simclick_header_style',
		'video'                  => true,
	) ) );

	$default_headers_args = array(
		'main' => array(
			'thumbnail_url' => get_stylesheet_directory_uri() . '/assets/images/header-thumb-275x77.jpg',
			'url'           => get_stylesheet_directory_uri() . '/assets/images/header.jpg',
		),
	);

	register_default_headers( $default_headers_args );
}
add_action( 'after_setup_theme', 'simclick_custom_header_and_background' );

/**
 * Binds the JS listener to make Customizer color_scheme control.
 *
 * Passes color scheme data as colorScheme global.
 *
 * @since SimClick 0.1
 */
function simclick_customize_control_js() {
	wp_enqueue_style( 'simclick-custom-controls-css', trailingslashit( esc_url( get_template_directory_uri() ) ) . 'assets/css/customizer.css' );
}
add_action( 'customize_controls_enqueue_scripts', 'simclick_customize_control_js' );

/**
 * Converts a HEX value to RGB.
 *
 * @since SimClick 0.1
 *
 * @param string $color The original color, in 3- or 6-digit hexadecimal form.
 * @return array Array containing RGB (red, green, and blue) values for the given
 *               HEX code, empty array otherwise.
 */
function simclick_hex2rgb( $color ) {
	$color = trim( $color, '#' );

	if ( strlen( $color ) === 3 ) {
		$r = hexdec( substr( $color, 0, 1 ).substr( $color, 0, 1 ) );
		$g = hexdec( substr( $color, 1, 1 ).substr( $color, 1, 1 ) );
		$b = hexdec( substr( $color, 2, 1 ).substr( $color, 2, 1 ) );
	} else if ( strlen( $color ) === 6 ) {
		$r = hexdec( substr( $color, 0, 2 ) );
		$g = hexdec( substr( $color, 2, 2 ) );
		$b = hexdec( substr( $color, 4, 2 ) );
	} else {
		return array();
	}

	return array( 'red' => $r, 'green' => $g, 'blue' => $b );
}
