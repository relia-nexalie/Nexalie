<?php
/**
 * Featured Slider Options
 *
 * @package SimClick
 */

/**
 * Add hero content options to theme options
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function simclick_slider_options( $wp_customize ) {
	$wp_customize->add_section( 'simclick_featured_slider', array(
			'panel' => 'simclick_theme_options',
			'title' => esc_html__( 'Featured Slider', 'simclick'  ),
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_slider_option',
			'default'           => 'disabled',
			'sanitize_callback' => 'simclick_sanitize_select',
			'choices'           => simclick_section_visibility_options(),
			'label'             => esc_html__( 'Enable on', 'simclick'  ),
			'section'           => 'simclick_featured_slider',
			'type'              => 'select',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_slider_number',
			'default'           => '4',
			'sanitize_callback' => 'simclick_sanitize_number_range',

			'active_callback'   => 'simclick_is_slider_active',
			'description'       => esc_html__( 'Save and refresh the page if No. of Slides is changed (Max no of slides is 20)', 'simclick'  ),
			'input_attrs'       => array(
				'style' => 'width: 45px;',
				'min'   => 0,
				'max'   => 20,
				'step'  => 1,
			),
			'label'             => esc_html__( 'No of items', 'simclick'  ),
			'section'           => 'simclick_featured_slider',
			'type'              => 'number',
			'transport'         => 'postMessage',
		)
	);

	$slider_number = get_theme_mod( 'simclick_slider_number', 4 );

	for ( $i = 1; $i <= $slider_number ; $i++ ) {
		// Page Sliders
		simclick_register_option( $wp_customize, array(
				'name'              => 'simclick_slider_page_' . $i,
				'sanitize_callback' => 'simclick_sanitize_post',
				'active_callback'   => 'simclick_is_slider_active',
				'label'             => esc_html__( 'Page', 'simclick'  ) . ' # ' . $i,
				'section'           => 'simclick_featured_slider',
				'type'              => 'dropdown-pages',
				'allow_addition'    => true,
			)
		);
	} // End for().
}
add_action( 'customize_register', 'simclick_slider_options' );

/** Active Callback Functions */
if( ! function_exists( 'simclick_is_slider_active' ) ) :
	/**
	* Return true if slider is active
	*
	* @since SimClick 0.1
	*/
	function simclick_is_slider_active( $control ) {
		$enable = $control->manager->get_setting( 'simclick_slider_option' )->value();

		//return true only if previewed page on customizer matches the type of slider option selected
		return ( simclick_check_section( $enable ) );
	}
endif;
