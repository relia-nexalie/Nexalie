<?php
/**
 * Services options
 *
 * @package SimClick
 */

/**
 * Add services content options to theme options
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function simclick_service_options( $wp_customize ) {
	// Add note to Jetpack Testimonial Section
    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_service_jetpack_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'label'             => sprintf( esc_html__( 'For all Services Options for SimClick Theme, go %1$shere%2$s', 'simclick'  ),
                '<a href="javascript:wp.customize.section( \'simclick_service\' ).focus();">',
                 '</a>'
            ),
           'section'            => 'services',
            'type'              => 'description',
            'priority'          => 1,
        )
    );

    $wp_customize->add_section( 'simclick_service', array(
			'title' => esc_html__( 'Services', 'simclick'  ),
			'panel' => 'simclick_theme_options',
		)
	);

	$action = 'install-plugin';
    $slug   = 'essential-content-types';

    $install_url = wp_nonce_url(
        add_query_arg(
            array(
                'action' => $action,
                'plugin' => $slug
            ),
            admin_url( 'update.php' )
        ),
        $action . '_' . $slug
    );

    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_service_jetpack_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'active_callback'   => 'simclick_is_ect_services_inactive',
            /* translators: 1: <a>/link tag start, 2: </a>/link tag close. */
            'label'             => sprintf( esc_html__( 'For Services, install %1$sEssential Content Types%2$s Plugin with Service Type Enabled', 'simclick' ),
                '<a target="_blank" href="' . esc_url( $install_url ) . '">',
                '</a>'

            ),
           'section'            => 'simclick_service',
            'type'              => 'description',
            'priority'          => 1,
        )
    );

	// Add color scheme setting and control.
	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_service_option',
			'default'           => 'disabled',
			'active_callback'   => 'simclick_is_ect_services_active',
			'sanitize_callback' => 'simclick_sanitize_select',
			'choices'           => simclick_section_visibility_options(),
			'label'             => esc_html__( 'Enable on', 'simclick'  ),
			'section'           => 'simclick_service',
			'type'              => 'select',
		)
	);

    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_service_cpt_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'active_callback'   => 'simclick_is_services_active',
            /* translators: 1: <a>/link tag start, 2: </a>/link tag close. */
			'label'             => sprintf( esc_html__( 'For CPT heading and sub-heading, go %1$shere%2$s', 'simclick'  ),
                 '<a href="javascript:wp.customize.control( \'ect_service_title\' ).focus();">',
                 '</a>'
            ),
            'section'           => 'simclick_service',
            'type'              => 'description',
        )
    );

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_service_number',
			'default'           => 6,
			'sanitize_callback' => 'simclick_sanitize_number_range',
		 	'active_callback'   => 'simclick_is_services_active',
			'description'       => esc_html__( 'Save and refresh the page if No. of Services is changed (Max no of Services is 20)', 'simclick'  ),
			'input_attrs'       => array(
				'style' => 'width: 100px;',
				'min'   => 0,
			),
			'label'             => esc_html__( 'No of items', 'simclick'  ),
			'section'           => 'simclick_service',
			'type'              => 'number',
			'transport'         => 'postMessage',
		)
	);

	$number = get_theme_mod( 'simclick_service_number', 6 );

	//loop for services post content
	for ( $i = 1; $i <= $number ; $i++ ) {
		//CPT
		simclick_register_option( $wp_customize, array(
				'name'              => 'simclick_service_cpt_' . $i,
				'sanitize_callback' => 'simclick_sanitize_post',
			 	'active_callback'   => 'simclick_is_services_active',
				'label'             => esc_html__( 'Services', 'simclick'  ) . ' ' . $i ,
				'section'           => 'simclick_service',
				'type'              => 'select',
                'choices'           => simclick_generate_post_array( 'ect-service' ),
			)
		);
	} // End for().
}
add_action( 'customize_register', 'simclick_service_options', 10 );

/** Active Callback Functions **/
if ( ! function_exists( 'simclick_is_services_active' ) ) :
	/**
	* Return true if services content is active
	*
	* @since SimClick 0.1
	*/
	function simclick_is_services_active( $control ) {
		$enable = $control->manager->get_setting( 'simclick_service_option' )->value();

		//return true only if previewed page on customizer matches the type of content option selected
		return ( simclick_is_ect_services_active( $control ) &&  simclick_check_section( $enable ) );
	}
endif;

if ( ! function_exists( 'simclick_is_ect_services_inactive' ) ) :
    /**
    * Return true if service is active
    *
    * @since Simclick 1.0
    */
    function simclick_is_ect_services_inactive( $control ) {
        return ! ( class_exists( 'Essential_Content_Service' ) || class_exists( 'Essential_Content_Pro_Service' ) );
    }
endif;

if ( ! function_exists( 'simclick_is_ect_services_active' ) ) :
    /**
    * Return true if service is active
    *
    * @since Simclick 1.0
    */
    function simclick_is_ect_services_active( $control ) {
        return ( class_exists( 'Essential_Content_Service' ) || class_exists( 'Essential_Content_Pro_Service' ) );
    }
endif;
