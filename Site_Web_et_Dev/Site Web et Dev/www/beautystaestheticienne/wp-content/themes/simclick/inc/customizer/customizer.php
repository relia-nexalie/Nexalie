<?php
/**
 * Theme Customizer
 *
 * @package SimClick
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function simclick_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport            = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport     = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport    = 'postMessage';
	$wp_customize->get_setting( 'header_image' )->transport        = 'refresh';

	if ( isset( $wp_customize->selective_refresh ) ) {
		$wp_customize->selective_refresh->add_partial( 'blogname', array(
			'selector' => '.site-title a',
			'container_inclusive' => false,
			'render_callback' => 'simclick_customize_partial_blogname',
		) );
		$wp_customize->selective_refresh->add_partial( 'blogdescription', array(
			'selector' => '.site-description',
			'container_inclusive' => false,
			'render_callback' => 'simclick_customize_partial_blogdescription',
		) );
	}

	// Important Links.
	$wp_customize->add_section( 'simclick_important_links', array(
		'priority'      => 999,
		'title'         => esc_html__( 'Important Links', 'simclick'  ),
	) );

	// Has dummy Sanitizaition function as it contains no value to be sanitized.
	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_important_links',
			'sanitize_callback' => 'sanitize_text_field',
			'custom_control'    => 'Simclick_Important_Links',
			'label'             => esc_html__( 'Important Links', 'simclick'  ),
			'section'           => 'simclick_important_links',
			'type'              => 'simclick_important_links',
		)
	);
	// Important Links End.
}
add_action( 'customize_register', 'simclick_customize_register' );

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function simclick_customize_preview_js() {
	wp_enqueue_script( 'simclick-customize-preview', trailingslashit( esc_url ( get_template_directory_uri() ) ) . 'assets/js/customizer.min.js', array( 'customize-preview' ), '20170816', true );
}
add_action( 'customize_preview_init', 'simclick_customize_preview_js' );

/**
 * Include Custom Controls
 */
require get_parent_theme_file_path( 'inc/customizer/custom-controls.php' );

/**
 * Include Header Media Options
 */
require get_parent_theme_file_path( 'inc/customizer/header-media.php' );

/**
 * Include Theme Options
 */
require get_parent_theme_file_path( 'inc/customizer/theme-options.php' );

/**
 * Include Hero Content
 */
require get_parent_theme_file_path( 'inc/customizer/hero-content.php' );

/**
 * Include Featured Slider
 */
require get_parent_theme_file_path( 'inc/customizer/featured-slider.php' );

/**
 * Include Featured Content
 */
require get_parent_theme_file_path( 'inc/customizer/featured-content.php' );

/**
 * Include Testimonial
 */
require get_parent_theme_file_path( 'inc/customizer/testimonial.php' );

/**
 * Include Service
 */
require get_parent_theme_file_path( 'inc/customizer/service.php' );

/**
 * Include Portfolio
 */
require get_parent_theme_file_path( 'inc/customizer/portfolio.php' );

/**
 * Include Customizer Helper Functions
 */
require get_parent_theme_file_path( 'inc/customizer/helpers.php' );

/**
 * Include Sanitization functions
 */
require get_parent_theme_file_path( 'inc/customizer/sanitize-functions.php' );

/**
 * Include Reset Button
 */
require get_parent_theme_file_path( 'inc/customizer/reset.php' );

/**
 * Include Upgrade Button
 */
require get_parent_theme_file_path( 'inc/customizer/upgrade-button/class-customize.php' );
