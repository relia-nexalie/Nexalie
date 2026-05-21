<?php
/**
 * Hero Content Options
 *
 * @package SimClick
 */

/**
 * Add hero content options to theme options
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function simclick_hero_content_options( $wp_customize ) {
	$wp_customize->add_section( 'simclick_hero_content_options', array(
			'title' => esc_html__( 'Hero Content', 'simclick'  ),
			'panel' => 'simclick_theme_options',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_hero_content_visibility',
			'default'           => 'disabled',
			'sanitize_callback' => 'simclick_sanitize_select',
			'choices'           => simclick_section_visibility_options(),
			'label'             => esc_html__( 'Enable on', 'simclick'  ),
			'section'           => 'simclick_hero_content_options',
			'type'              => 'select',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_hero_content',
			'default'           => '0',
			'sanitize_callback' => 'simclick_sanitize_post',
			'active_callback'   => 'simclick_is_hero_content_active',
			'label'             => esc_html__( 'Page', 'simclick'  ),
			'section'           => 'simclick_hero_content_options',
			'type'              => 'dropdown-pages',
			'allow_addition'    => true,
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_hero_content_subtitle',
			'default'           => esc_html__( 'About us', 'simclick' ),
			'sanitize_callback' => 'sanitize_text_field',
			'active_callback'   => 'simclick_is_hero_content_active',
			'label'             => esc_html__( 'Subtitle', 'simclick' ),
			'section'           => 'simclick_hero_content_options',
			'type'              => 'text',
		)
	);
}
add_action( 'customize_register', 'simclick_hero_content_options' );

/** Active Callback Functions **/
if ( ! function_exists( 'simclick_is_hero_content_active' ) ) :
	/**
	* Return true if hero content is active
	*
	* @since SimClick 0.1
	*/
	function simclick_is_hero_content_active( $control ) {
		$enable = $control->manager->get_setting( 'simclick_hero_content_visibility' )->value();

		//return true only if previewed page on customizer matches the type of content option selected
		return ( simclick_check_section( $enable ) );
	}
endif;
