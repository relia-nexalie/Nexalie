<?php
/**
 * Add Portfolio Settings in Customizer
 *
 * @package Simclick
 */

/**
 * Add portfolio options to theme options
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function simclick_portfolio_options( $wp_customize ) {
    // Add note to Jetpack Portfolio Section
    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_jetpack_portfolio_cpt_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'label'             => sprintf( esc_html__( 'For Portfolio Options for SimClick Pro Theme, go %1$shere%2$s', 'simclick'  ),
                 '<a href="javascript:wp.customize.section( \'simclick_portfolio\' ).focus();">',
                 '</a>'
            ),
            'section'           => 'jetpack_portfolio',
            'type'              => 'description',
            'priority'          => 1,
        )
    );

    $wp_customize->add_section( 'simclick_portfolio', array(
            'panel'    => 'simclick_theme_options',
            'title'    => esc_html__( 'Portfolio', 'simclick'  ),
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
            'name'              => 'simclick_portfolio_jetpack_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'active_callback'   => 'simclick_is_ect_portfolio_inactive',
            /* translators: 1: <a>/link tag start, 2: </a>/link tag close. */
            'label'             => sprintf( esc_html__( 'For Portfolio, install %1$sEssential Content Types%2$s Plugin with Portfolio Type Enabled', 'simclick' ),
                '<a target="_blank" href="' . esc_url( $install_url ) . '">',
                '</a>'

            ),
           'section'            => 'simclick_portfolio',
            'type'              => 'description',
            'priority'          => 1,
        )
    );

    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_portfolio_option',
            'default'           => 'disabled',
            'active_callback'   => 'simclick_is_ect_portfolio_active',
            'sanitize_callback' => 'simclick_sanitize_select',
            'choices'           => simclick_section_visibility_options(),
            'label'             => esc_html__( 'Enable on', 'simclick'  ),
            'section'           => 'simclick_portfolio',
            'type'              => 'select',
        )
    );

    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_portfolio_cpt_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'active_callback'   => 'simclick_is_portfolio_active',
            /* translators: 1: <a>/link tag start, 2: </a>/link tag close. */
            'label'             => sprintf( esc_html__( 'For CPT heading and sub-heading, go %1$shere%2$s', 'simclick'  ),
                 '<a href="javascript:wp.customize.control( \'jetpack_portfolio_title\' ).focus();">',
                 '</a>'
            ),
            'section'           => 'simclick_portfolio',
            'type'              => 'description',
        )
    );

    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_portfolio_number',
            'default'           => '10',
            'sanitize_callback' => 'simclick_sanitize_number_range',
            'active_callback'   => 'simclick_is_portfolio_active',
            'label'             => esc_html__( 'Number of items to show', 'simclick'  ),
            'section'           => 'simclick_portfolio',
            'type'              => 'number',
            'input_attrs'       => array(
                'style'             => 'width: 100px;',
                'min'               => 0,
            ),
        )
    );

    $number = get_theme_mod( 'simclick_portfolio_number', 10 );

    for ( $i = 1; $i <= $number ; $i++ ) {
        //for CPT
        simclick_register_option( $wp_customize, array(
                'name'              => 'simclick_portfolio_cpt_' . $i,
                'sanitize_callback' => 'simclick_sanitize_post',
                'active_callback'   => 'simclick_is_portfolio_active',
                'label'             => esc_html__( 'Portfolio', 'simclick'  ) . ' ' . $i ,
                'section'           => 'simclick_portfolio',
                'type'              => 'select',
                'choices'           => simclick_generate_post_array( 'jetpack-portfolio' ),
            )
        );
    } // End for().
}
add_action( 'customize_register', 'simclick_portfolio_options' );

/**
 * Active Callback Functions
 */
if ( ! function_exists( 'simclick_is_portfolio_active' ) ) :
    /**
    * Return true if portfolio is active
    *
    * @since SimClick 0.1
    */
    function simclick_is_portfolio_active( $control ) {
        $enable = $control->manager->get_setting( 'simclick_portfolio_option' )->value();

        //return true only if previwed page on customizer matches the type of content option selected
        return ( simclick_is_ect_portfolio_active( $control ) &&  simclick_check_section( $enable ) );
    }
endif;

if ( ! function_exists( 'simclick_is_ect_portfolio_inactive' ) ) :
    /**
    *
    * @since Simclick 1.0
    */
    function simclick_is_ect_portfolio_inactive( $control ) {
        return ! ( class_exists( 'Essential_Content_Jetpack_Portfolio' ) || class_exists( 'Essential_Content_Pro_Jetpack_Portfolio' ) );
    }
endif;

if ( ! function_exists( 'simclick_is_ect_portfolio_active' ) ) :
    /**
    *
    * @since Simclick 1.0
    */
    function simclick_is_ect_portfolio_active( $control ) {
        return ( class_exists( 'Essential_Content_Jetpack_Portfolio' ) || class_exists( 'Essential_Content_Pro_Jetpack_Portfolio' ) );
    }
endif;
