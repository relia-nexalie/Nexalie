<?php

/**
 * Function to register control and setting
 */
function simclick_register_option( $wp_customize, $option ) {
	// Initialize Setting.
	$wp_customize->add_setting( $option['name'], array(
		'sanitize_callback'    => $option['sanitize_callback'],
		'default'              => isset( $option['default'] ) ? $option['default'] : '',
		'transport'            => isset( $option['transport'] ) ? $option['transport'] : 'refresh',
		'theme_supports'       => isset( $option['theme_supports'] ) ? $option['theme_supports'] : '',
	) );

	$control = array(
		'label'    => $option['label'],
		'section'  => $option['section'],
		'settings' => isset( $option['settings'] ) ? $option['settings'] : $option['name'],
	);

	if ( isset( $option['active_callback'] ) ) {
		$control['active_callback'] = $option['active_callback'];
	}

	if ( isset( $option['priority'] ) ) {
		$control['priority'] = $option['priority'];
	}

	if ( isset( $option['choices'] ) ) {
		$control['choices'] = $option['choices'];
	}

	if ( isset( $option['type'] ) ) {
		$control['type'] = $option['type'];
	}

	if ( isset( $option['input_attrs'] ) ) {
		$control['input_attrs'] = $option['input_attrs'];
	}

	if ( isset( $option['description'] ) ) {
		$control['description'] = $option['description'];
	}

	if ( isset( $option['custom_control'] ) ) {
		$wp_customize->add_control( new $option['custom_control']( $wp_customize, $option['name'], $control ) );
	} else {
		$wp_customize->add_control( $option['name'], $control );
	}
}

/**
 * Render the site title for the selective refresh partial.
 *
 * @since SimClick 0.1
 * @see simclick_customize_register()
 *
 * @return void
 */
function simclick_customize_partial_blogname() {
	bloginfo( 'name' );
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @since SimClick 0.1
 * @see simclick_customize_register()
 *
 * @return void
 */
function simclick_customize_partial_blogdescription() {
	bloginfo( 'description' );
}

/**
 * Alphabetically sort theme options sections
 *
 * @param  wp_customize object $wp_customize wp_customize object.
 */
function simclick_sort_sections_list( $wp_customize ) {
	foreach ( $wp_customize->sections() as $section_key => $section_object ) {
		if ( false !== strpos( $section_key, 'simclick_' ) && 'simclick_important_links' !== $section_key ) {
			$options[] = $section_key;
		}
	}

	sort( $options );

	$priority = 1;
	foreach ( $options as  $option ) {
		$wp_customize->get_section( $option )->priority = $priority++;
	}
}
add_action( 'customize_register', 'simclick_sort_sections_list' );

/**
 * Returns an array of visibility options for featured sections
 *
 * @since SimClick 0.1
 */
function simclick_section_visibility_options() {
	$options = array(
		'disabled'    => esc_html__( 'Disabled', 'simclick'  ),
		'homepage'    => esc_html__( 'Homepage / Frontpage', 'simclick'  ),
		'entire-site' => esc_html__( 'Entire Site', 'simclick'  ),
	);

	return apply_filters( 'simclick_section_visibility_options', $options );
}

/**
 * Returns an array of color schemes registered for catchresponsive.
 *
 * @since SimClick 0.1
 */
function simclick_get_pagination_types() {
	$pagination_types = array(
		'default' => esc_html__( 'Default(Older Posts/Newer Posts)', 'simclick'  ),
		'numeric' => esc_html__( 'Numeric', 'simclick'  ),
	);

	return apply_filters( 'simclick_get_pagination_types', $pagination_types );
}

/**
 * Generate a list of all available post array
 *
 * @param  string $post_type post type.
 * @return post_array
 */
function simclick_generate_post_array( $post_type = 'post' ) {
	$output = array();
	$posts = get_posts( array(
		'post_type'        => $post_type,
		'post_status'      => 'publish',
		'suppress_filters' => false,
		'posts_per_page'   => -1,
		)
	);

	$output['0']= esc_html__( '-- Select --', 'simclick'  );

	foreach ( $posts as $post ) {
		/* translators: 1: post id. */
		$output[ $post->ID ] = ! empty( $post->post_title ) ? $post->post_title : sprintf( __( '#%d (no title)', 'simclick'  ), $post->ID );
	}

	return $output;
}
