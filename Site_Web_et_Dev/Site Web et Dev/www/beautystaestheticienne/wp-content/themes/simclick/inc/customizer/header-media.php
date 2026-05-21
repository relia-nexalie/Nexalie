<?php
/**
 * Header Media Options
 *
 * @package SimClick
 */

/**
 * Add Header Media options
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function simclick_header_media_options( $wp_customize ) {
	$wp_customize->get_section( 'header_image' )->description = esc_html__( 'If you add video, it will only show up on Homepage/FrontPage. Other Pages will use Header/Post/Page Image depending on your selection of option. Header Image will be used as a fallback while the video loads ', 'simclick'  );

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_media_option',
			'default'           => 'homepage',
			'sanitize_callback' => 'simclick_sanitize_select',
			'choices'           => array(
				'homepage'               => esc_html__( 'Homepage / Frontpage', 'simclick'  ),
				'entire-site'            => esc_html__( 'Entire Site', 'simclick'  ),
				'disable'                => esc_html__( 'Disabled', 'simclick'  ),
			),
			'label'             => esc_html__( 'Enable on', 'simclick'  ),
			'section'           => 'header_image',
			'type'              => 'select',
			'priority'          => 1,
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_media_content_align',
			'default'           => 'content-aligned-center',
			'sanitize_callback' => 'simclick_sanitize_select',
			'choices'           => array(
				'content-aligned-center' => esc_html__( 'Center', 'simclick'  ),
				'content-aligned-right'  => esc_html__( 'Right', 'simclick'  ),
				'content-aligned-left'   => esc_html__( 'Left', 'simclick'  ),
			),
			'label'             => esc_html__( 'Content Position', 'simclick'  ),
			'section'           => 'header_image',
			'type'              => 'select',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_media_text_align',
			'default'           => 'text-aligned-center',
			'sanitize_callback' => 'simclick_sanitize_select',
			'choices'           => array(
				'text-aligned-right'  => esc_html__( 'Right', 'simclick'  ),
				'text-aligned-center' => esc_html__( 'Center', 'simclick'  ),
				'text-aligned-left'   => esc_html__( 'Left', 'simclick'  ),
			),
			'label'             => esc_html__( 'Text Alignment', 'simclick'  ),
			'section'           => 'header_image',
			'type'              => 'select',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_media_opacity',
			'default'			=> 0,
			'sanitize_callback' => 'simclick_sanitize_number_range',
			'label'             => esc_html__( 'Header Media Overlay', 'simclick'  ),
			'section'           => 'header_image',
			'type'              => 'number',
			'input_attrs'       => array(
				'style' => 'width: 60px;',
				'min'   => 0,
				'max'   => 100,
			),
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_media_title',
			'sanitize_callback' => 'wp_kses_post',
			'label'             => esc_html__( 'Header Media Title', 'simclick'  ),
			'section'           => 'header_image',
			'type'              => 'text',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_media_subtitle',
			'sanitize_callback' => 'wp_kses_post',
			'label'             => esc_html__( 'Header Media Sub Title', 'simclick'  ),
			'section'           => 'header_image',
			'type'              => 'text',
		)
	);

    simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_media_text',
			'sanitize_callback' => 'wp_kses_post',
			'label'             => esc_html__( 'Header Media Text', 'simclick'  ),
			'section'           => 'header_image',
			'type'              => 'textarea',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_media_url',
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
			'label'             => esc_html__( 'Header Media Url', 'simclick'  ),
			'section'           => 'header_image',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_media_url_text',
			'sanitize_callback' => 'sanitize_text_field',
			'label'             => esc_html__( 'Header Media Url Text', 'simclick'  ),
			'section'           => 'header_image',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_url_target',
			'sanitize_callback' => 'simclick_sanitize_checkbox',
			'label'             => esc_html__( 'Open Link in New Window/Tab', 'simclick'  ),
			'section'           => 'header_image',
			'custom_control'    => 'Simclick_Toggle_Control',
		)
	);

	simclick_register_option( $wp_customize, array(
			'name'              => 'simclick_header_scroll_down',
			'default'			=> 1,
			'sanitize_callback' => 'simclick_sanitize_checkbox',
			'label'             => esc_html__( 'Scroll Link', 'simclick'  ),
			'section'           => 'header_image',
			'custom_control'	=> 'Simclick_Toggle_Control',
		)
	);
}
add_action( 'customize_register', 'simclick_header_media_options' );
