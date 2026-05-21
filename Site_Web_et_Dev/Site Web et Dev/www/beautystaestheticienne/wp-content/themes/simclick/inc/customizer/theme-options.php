<?php
/**
 * Theme Options
 *
 * @package SimClick
 */

/**
 * Add theme options
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function simclick_theme_options( $wp_customize ) {
	$wp_customize->add_panel( 'simclick_theme_options', array(
		'title'    => esc_html__( 'Theme Options', 'simclick'  ),
		'priority' => 130,
	) );

	// Layout Options
	$wp_customize->add_section( 'simclick_layout_options', array(
		'title' => esc_html__( 'Layout Options', 'simclick'  ),
		'panel' => 'simclick_theme_options',
		)
	);
	
	/* Default Layout */
	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_default_layout',
			'default'           => 'right-sidebar',
			'sanitize_callback' => 'simclick_sanitize_select',
			'label'             => esc_html__( 'Default Layout', 'simclick'  ),
			'section'           => 'simclick_layout_options',
			'type'              => 'select',
			'choices'           => array(
				'right-sidebar'         => esc_html__( 'Right Sidebar ( Content, Primary Sidebar )', 'simclick'  ),
				'no-sidebar'            => esc_html__( 'No Sidebar', 'simclick'  ),
			),
		)
	);

	/* Homepage Layout */
	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_homepage_layout',
			'default'           => 'right-sidebar',
			'sanitize_callback' => 'simclick_sanitize_select',
			'label'             => esc_html__( 'Homepage Layout', 'simclick'  ),
			'section'           => 'simclick_layout_options',
			'type'              => 'select',
			'choices'           => array(
				'right-sidebar'         => esc_html__( 'Right Sidebar ( Content, Primary Sidebar )', 'simclick'  ),
				'no-sidebar'            => esc_html__( 'No Sidebar', 'simclick'  ),
			),
		)
	);

	/* Blog/Archive Layout */
	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_archive_layout',
			'default'           => 'right-sidebar',
			'sanitize_callback' => 'simclick_sanitize_select',
			'label'             => esc_html__( 'Blog/Archive Layout', 'simclick'  ),
			'section'           => 'simclick_layout_options',
			'type'              => 'select',
			'choices'           => array(
				'right-sidebar'         => esc_html__( 'Right Sidebar ( Content, Primary Sidebar )', 'simclick'  ),
				'no-sidebar'            => esc_html__( 'No Sidebar', 'simclick'  ),
			),
		)
	);

	// Single Page/Post Image
	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_single_layout',
			'default'           => 'disabled',
			'sanitize_callback' => 'simclick_sanitize_select',
			'label'             => esc_html__( 'Single Page/Post Image', 'simclick'  ),
			'section'           => 'simclick_layout_options',
			'type'              => 'select',
			'choices'           => array(
				'disabled'            => esc_html__( 'Disabled', 'simclick'  ),
				'post-thumbnail'      => esc_html__( 'Post Thumbnail (1060x596)', 'simclick'  ),
			),
		)
	);

	// Excerpt Options.
	$wp_customize->add_section( 'simclick_excerpt_options', array(
		'panel' => 'simclick_theme_options',
		'title' => esc_html__( 'Excerpt Options', 'simclick'  ),
	) );

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_excerpt_length',
			'default'           => '30',
			'sanitize_callback' => 'absint',
			'input_attrs' => array(
				'min'   => 10,
				'max'   => 200,
				'step'  => 5,
				'style' => 'width: 60px;',
			),
			'label'    => esc_html__( 'Excerpt Length (words)', 'simclick'  ),
			'section'  => 'simclick_excerpt_options',
			'type'     => 'number',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_excerpt_more_text',
			'default'           => esc_html__( 'Continue reading', 'simclick'  ),
			'sanitize_callback' => 'sanitize_text_field',
			'label'             => esc_html__( 'Read More Text', 'simclick'  ),
			'section'           => 'simclick_excerpt_options',
			'type'              => 'text',
		)
	);

	// Excerpt Options.
	$wp_customize->add_section( 'simclick_search_options', array(
		'panel'     => 'simclick_theme_options',
		'title'     => esc_html__( 'Search Options', 'simclick'  ),
	) );

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_search_text',
			'default'           => esc_html__( 'Search ...', 'simclick'  ),
			'sanitize_callback' => 'wp_kses_data',
			'label'             => esc_html__( 'Search Text', 'simclick'  ),
			'section'           => 'simclick_search_options',
			'type'              => 'text',
		)
	);

	// Homepage / Frontpage Options.
	$wp_customize->add_section( 'simclick_homepage_options', array(
		'description' => esc_html__( 'Only posts that belong to the categories selected here will be displayed on the front page', 'simclick'  ),
		'panel'       => 'simclick_theme_options',
		'title'       => esc_html__( 'Homepage / Frontpage Options', 'simclick'  ),
	) );

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_recent_posts_heading',
			'sanitize_callback' => 'sanitize_text_field',
			'default'           => esc_html__( 'From The Blog', 'simclick'  ),
			'label'             => esc_html__( 'Recent Posts Heading', 'simclick'  ),
			'section'           => 'simclick_homepage_options',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_front_page_category',
			'sanitize_callback' => 'simclick_sanitize_category_list',
			'custom_control'    => 'Simclick_Multi_Cat',
			'label'             => esc_html__( 'Categories', 'simclick'  ),
			'section'           => 'simclick_homepage_options',
			'type'              => 'dropdown-categories',
		)
	);

	// Pagination Options.
	$wp_customize->add_section( 'simclick_pagination_options', array(
		'panel'       => 'simclick_theme_options',
		'title'       => esc_html__( 'Pagination Options', 'simclick'  ),
	) );

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_pagination_type',
			'default'           => 'default',
			'sanitize_callback' => 'simclick_sanitize_select',
			'choices'           => simclick_get_pagination_types(),
			'label'             => esc_html__( 'Pagination type', 'simclick'  ),
			'section'           => 'simclick_pagination_options',
			'type'              => 'select',
		)
	);
	
	/* Scrollup Options */
	$wp_customize->add_section( 'simclick_scrollup', array(
		'panel'    => 'simclick_theme_options',
		'title'    => esc_html__( 'Scrollup Options', 'simclick'  ),
	) );

	$action = 'install-plugin';
	$slug   = 'to-top';

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

	// Add note to Scroll up Section
    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_to_top_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'active_callback'   => 'simclick_is_to_top_inactive',
            /* translators: 1: <a>/link tag start, 2: </a>/link tag close. */
            'label'             => sprintf( esc_html__( 'For Scroll Up, install %1$sTo Top%2$s Plugin', 'simclick' ),
                '<a target="_blank" href="' . esc_url( $install_url ) . '">',
                '</a>'

            ),
           'section'            => 'simclick_scrollup',
            'type'              => 'description',
            'priority'          => 1,
        )
    );

    simclick_register_option( $wp_customize, array(
            'name'              => 'simclick_to_top_option_note',
            'sanitize_callback' => 'sanitize_text_field',
            'custom_control'    => 'Simclick_Note_Control',
            'active_callback'   => 'simclick_is_to_top_active',
            /* translators: 1: <a>/link tag start, 2: </a>/link tag close. */
			'label'             => sprintf( esc_html__( 'For Scroll Up Options, go %1$shere%2$s', 'simclick'  ),
                 '<a href="javascript:wp.customize.panel( \'to_top_panel\' ).focus();">',
                 '</a>'
            ),
            'section'           => 'simclick_scrollup',
            'type'              => 'description',
        )
    );
}
add_action( 'customize_register', 'simclick_theme_options' );

/** Active Callback Functions **/
if ( ! function_exists( 'simclick_is_to_top_inactive' ) ) :
    /**
    * Return true if featured_content is active
    *
    * @since Simclick 0.1
    */
    function simclick_is_to_top_inactive( $control ) {
        return ! ( class_exists( 'To_Top' ) );
    }
endif;

if ( ! function_exists( 'simclick_is_to_top_active' ) ) :
    /**
    * Return true if featured_content is active
    *
    * @since Simclick 0.1
    */
    function simclick_is_to_top_active( $control ) {
        return ( class_exists( 'To_Top' ) );
    }
endif;
