<?php
/**
 * Add Testimonial Settings in Customizer
 *
 * @package SimClick
*/

/**
 * Add testimonial options to theme options
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function simclick_testimonial_options( $wp_customize ) {
    // Add note to Jetpack Testimonial Section
    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_jetpack_testimonial_cpt_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'label'             => sprintf( esc_html__( 'For Testimonial Options for SimClick Theme, go %1$shere%2$s', 'simclick'  ),
                '<a href="javascript:wp.customize.section( \'simclick_testimonials\' ).focus();">',
                 '</a>'
            ),
           'section'            => 'jetpack_testimonials',
            'type'              => 'description',
            'priority'          => 1,
        )
    );

    $wp_customize->add_section( 'simclick_testimonials', array(
            'panel'    => 'simclick_theme_options',
            'title'    => esc_html__( 'Testimonials', 'simclick'  ),
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
            'name'              => 'simclick_testimonial_jetpack_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'active_callback'   => 'simclick_is_ect_testimonial_inactive',
            /* translators: 1: <a>/link tag start, 2: </a>/link tag close. */
            'label'             => sprintf( esc_html__( 'For Testimonial, install %1$sEssential Content Types%2$s Plugin with testimonial Type Enabled', 'simclick' ),
                '<a target="_blank" href="' . esc_url( $install_url ) . '">',
                '</a>'

            ),
           'section'            => 'simclick_testimonials',
            'type'              => 'description',
            'priority'          => 1,
        )
    );

    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_testimonial_option',
            'default'           => 'disabled',
            'active_callback'   => 'simclick_is_ect_testimonial_active',
            'sanitize_callback' => 'simclick_sanitize_select',
            'choices'           => simclick_section_visibility_options(),
            'label'             => esc_html__( 'Enable on', 'simclick'  ),
            'section'           => 'simclick_testimonials',
            'type'              => 'select',
            'priority'          => 1,
        )
    );

    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_testimonial_bg_image',
            'sanitize_callback' => 'simclick_sanitize_image',
            'active_callback'   => 'simclick_is_testimonial_active',
            'custom_control'    => 'WP_Customize_Image_Control',
            'label'             => esc_html__( 'Section Background Image', 'simclick' ),
           'section'           => 'simclick_testimonials',
            'mime_type'         => 'image',
        )
    );

    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_testimonial_cpt_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'active_callback'   => 'simclick_is_testimonial_active',
            /* translators: 1: <a>/link tag start, 2: </a>/link tag close. */
			'label'             => sprintf( esc_html__( 'For CPT heading and sub-heading, go %1$shere%2$s', 'simclick'  ),
                '<a href="javascript:wp.customize.section( \'jetpack_testimonials\' ).focus();">',
                '</a>'
            ),
            'section'           => 'simclick_testimonials',
            'type'              => 'description',
        )
    );

    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_testimonial_number',
            'default'           => 4,
            'sanitize_callback' => 'simclick_sanitize_number_range',
            'active_callback'   => 'simclick_is_testimonial_active',
            'label'             => esc_html__( 'No of items', 'simclick'  ),
            'section'           => 'simclick_testimonials',
            'type'              => 'number',
            'input_attrs'       => array(
                'style'             => 'width: 100px;',
                'min'               => 1,
                'max'               => 7,
            ),
        )
    );

    $number = get_theme_mod( 'simclick_testimonial_number', 4 );

    for ( $i = 1; $i <= $number ; $i++ ) {
        //for CPT
        simclick_register_option( $wp_customize, array(
                'name'              => 'simclick_testimonial_cpt_' . $i,
                'sanitize_callback' => 'simclick_sanitize_post',
                'active_callback'   => 'simclick_is_testimonial_active',
                'label'             => esc_html__( 'Testimonial', 'simclick'  ) . ' ' . $i ,
                'section'           => 'simclick_testimonials',
                'type'              => 'select',
                'choices'           => simclick_generate_post_array( 'jetpack-testimonial' ),
            )
        );
    } // End for().
}
add_action( 'customize_register', 'simclick_testimonial_options' );

/**
 * Active Callback Functions
 */
if ( ! function_exists( 'simclick_is_testimonial_active' ) ) :
    /**
    * Return true if testimonial is active
    *
    * @since SimClick 0.1
    */
    function simclick_is_testimonial_active( $control ) {
        $enable = $control->manager->get_setting( 'simclick_testimonial_option' )->value();

        //return true only if previewed page on customizer matches the type of content option selected
        return ( simclick_is_ect_testimonial_active( $control ) &&  simclick_check_section( $enable ) );
    }
endif;

if ( ! function_exists( 'simclick_is_ect_testimonial_inactive' ) ) :
    /**
    *
    * @since Simclick 1.0
    */
    function simclick_is_ect_testimonial_inactive( $control ) {
        return ! ( class_exists( 'Essential_Content_Jetpack_testimonial' ) || class_exists( 'Essential_Content_Pro_Jetpack_testimonial' ) );
    }
endif;

if ( ! function_exists( 'simclick_is_ect_testimonial_active' ) ) :
    /**
    *
    * @since Simclick 1.0
    */
    function simclick_is_ect_testimonial_active( $control ) {
        return ( class_exists( 'Essential_Content_Jetpack_testimonial' ) || class_exists( 'Essential_Content_Pro_Jetpack_testimonial' ) );
    }
endif;
