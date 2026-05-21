<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package SimClick
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function simclick_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}
	
	$classes[] = 'navigation-classic';
	$classes[] = 'fluid-layout';

	// Adds a class with respect to layout selected.
	$layout  = simclick_get_theme_layout();
	$sidebar = simclick_get_sidebar_id();

	if ( 'no-sidebar' === $layout ) {
		$classes[] = 'no-sidebar content-width-layout';
	}
	elseif ( 'no-sidebar-full-width' === $layout ) {
		$classes[] = 'no-sidebar full-width-layout';
	} elseif ( 'left-sidebar' === $layout ) {
		if ( '' !== $sidebar ) {
			$classes[] = 'two-columns-layout content-right';
		}
	} elseif ( 'right-sidebar' === $layout ) {
		if ( '' !== $sidebar ) {
			$classes[] = 'two-columns-layout content-left';
		}
	}

	$header_media_title    = get_theme_mod( 'simclick_header_media_title' );
	$header_media_subtitle = get_theme_mod( 'simclick_header_media_subtitle' );
	$header_media_text     = get_theme_mod( 'simclick_header_media_text' );
	$header_media_url      = get_theme_mod( 'simclick_header_media_url', '' );
	$header_media_url_text = get_theme_mod( 'simclick_header_media_url_text' );

	$header_image = simclick_featured_overall_image();

	if ( '' == $header_image ) {
		$classes[] = 'no-header-media-image';
	}

	$header_text_enabled = simclick_has_header_media_text();

	if ( ! $header_text_enabled ) {
		$classes[] = 'no-header-media-text';
	}

	$enable_slider = simclick_check_section( get_theme_mod( 'simclick_slider_option', 'disabled' ) );

	if ( '' == $header_image && ! simclick_has_header_media_text() )

	if ( ! $enable_slider ) {
		$classes[] = 'no-featured-slider';
	}

	if ( ! ( '' == $header_image && ! simclick_has_header_media_text() ) ) {
		$classes[] = 'absolute-header';
	}
	
	if (  $enable_slider ) {
		$classes[] = 'absolute-header';
	}

	if ( '' == $header_image && ! $header_text_enabled && ! $enable_slider ) {
		$classes[] = 'content-has-padding-top';
	}

	// Add Color Scheme to Body Class.
	$classes[] = esc_attr( 'color-scheme-' . get_theme_mod( 'color_scheme', 'default' ) );

	return $classes;
}
add_filter( 'body_class', 'simclick_body_classes' );

/**
 * Add a pingback url auto-discovery header for singularly identifiable articles.
 */
function simclick_pingback_header() {
	if ( is_singular() && pings_open() ) {
		echo '<link rel="pingback" href="', esc_url( get_bloginfo( 'pingback_url' ) ), '">';
	}
}
add_action( 'wp_head', 'simclick_pingback_header' );

/**
 * Adds header image overlay for each section
 */
function simclick_header_image_overlay_css() {
	$css = '';

	$overlay = get_theme_mod( 'simclick_header_media_opacity', 0 );

	$overlay_bg = $overlay / 100;

	if ( '' !== $overlay ) {
		$css = '.custom-header:after { background-color: rgba(0, 0, 0, ' . esc_attr( $overlay_bg ) . '); } '; // Dividing by 100 as the option is shown as % for user
	}

	wp_add_inline_style( 'simclick-style', $css );
}
add_action( 'wp_enqueue_scripts', 'simclick_header_image_overlay_css', 11 );

/**
 * Remove first post from blog as it is already show via recent post template
 */
function simclick_alter_home( $query ) {
	if ( $query->is_home() && $query->is_main_query() ) {
		$cats = get_theme_mod( 'simclick_front_page_category' );

		if ( is_array( $cats ) && ! in_array( '0', $cats ) ) {
			$query->query_vars['category__in'] = $cats;
		}
	}
}
add_action( 'pre_get_posts', 'simclick_alter_home' );

if ( ! function_exists( 'simclick_content_nav' ) ) :
	/**
	 * Display navigation/pagination when applicable
	 *
	 * @since SimClick 0.1
	 */
	function simclick_content_nav() {
		global $wp_query;

		// Don't print empty markup in archives if there's only one page.
		if ( $wp_query->max_num_pages < 2 && ( is_home() || is_archive() || is_search() ) ) {
			return;
		}

		$pagination_type = get_theme_mod( 'simclick_pagination_type', 'default' );

		/**
		 * Check if navigation type is Jetpack Infinite Scroll and if it is enabled, else goto default pagination
		 * if it's active then disable pagination
		 */
		if ( ( 'infinite-scroll' === $pagination_type ) && class_exists( 'Jetpack' ) && Jetpack::is_module_active( 'infinite-scroll' ) ) {
			return false;
		}

		if ( 'numeric' === $pagination_type && function_exists( 'the_posts_pagination' ) ) {
			the_posts_pagination( array(
				'prev_text'          => esc_html__( 'Previous', 'simclick'  ),
				'next_text'          => esc_html__( 'Next', 'simclick'  ),
				'before_page_number' => '<span class="meta-nav screen-reader-text">' . esc_html__( 'Page', 'simclick'  ) . ' </span>',
			) );
		} else {
			the_posts_navigation();
		}
	}
endif; // simclick_content_nav

/**
 * Check if a section is enabled or not based on the $value parameter
 * @param  string $value Value of the section that is to be checked
 * @return boolean return true if section is enabled otherwise false
 */
function simclick_check_section( $value ) {
	return ( 'entire-site' == $value  || ( ( is_front_page() || ( is_home() && is_front_page() ) ) && 'homepage' == $value ) );
}

/**
 * Return the first image in a post. Works inside a loop.
 * @param [integer] $post_id [Post or page id]
 * @param [string/array] $size Image size. Either a string keyword (thumbnail, medium, large or full) or a 2-item array representing width and height in pixels, e.g. array(32,32).
 * @param [string/array] $attr Query string or array of attributes.
 * @return [string] image html
 *
 * @since SimClick 0.1
 */

function simclick_get_first_image( $postID, $size, $attr, $src = false ) {
	ob_start();

	ob_end_clean();

	$image 	= '';

	$output = preg_match_all( '/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', get_post_field( 'post_content', $postID ) , $matches );

	if( isset( $matches[1][0] ) ) {
		//Get first image
		$first_img = $matches[1][0];

		if ( $src ) {
			//Return url of src is true
			return $first_img;
		}

		return '<img class="pngfix wp-post-image" src="' . $first_img . '">';
	}

	return false;
}

function simclick_get_theme_layout() {
	$layout = '';

	if ( is_page_template( 'templates/no-sidebar.php' ) ) {
		$layout = 'no-sidebar';
	} elseif ( is_page_template( 'templates/right-sidebar.php' ) ) {
		$layout = 'right-sidebar';
	} else {
		$layout = get_theme_mod( 'simclick_default_layout', 'right-sidebar' );

		if ( is_front_page() ) {
			$layout = get_theme_mod( 'simclick_homepage_layout', 'right-sidebar' );
		} elseif ( is_home() || is_archive() || is_search() ) {
			$layout = get_theme_mod( 'simclick_archive_layout', 'right-sidebar' );
		}
	}

	return $layout;
}

function simclick_get_sidebar_id() {
	$sidebar = '';

	$layout = simclick_get_theme_layout();

	$sidebaroptions = '';

	if ( 'no-sidebar' === $layout ) {
		return $sidebar;
	}

		global $post, $wp_query;

		// Front page displays in Reading Settings.
		$page_on_front  = get_option( 'page_on_front' );
		$page_for_posts = get_option( 'page_for_posts' );

		// Get Page ID outside Loop.
		$page_id = $wp_query->get_queried_object_id();

		// Blog Page or Front Page setting in Reading Settings.
		if ( $page_id == $page_for_posts || $page_id == $page_on_front ) {
			$sidebaroptions = get_post_meta( $page_id, 'simclick-sidebar-option', true );
		} elseif ( is_singular() ) {
			if ( is_attachment() ) {
				$parent 		= $post->post_parent;
				$sidebaroptions = get_post_meta( $parent, 'simclick-sidebar-option', true );

			} else {
				$sidebaroptions = get_post_meta( $post->ID, 'simclick-sidebar-option', true );
			}
		}

	if ( is_active_sidebar( 'sidebar-1' ) ) {
		$sidebar = 'sidebar-1'; // Primary Sidebar.
	}

	return $sidebar;
}

if ( ! function_exists( 'simclick_get_no_thumb_image' ) ) :
	/**
	 * $image_size post thumbnail size
	 * $type image, src
	 */
	function simclick_get_no_thumb_image( $image_size = 'post-thumbnail', $type = 'image' ) {
		$image = $image_url = '';

		global $_wp_additional_image_sizes;

		$size = $_wp_additional_image_sizes['post-thumbnail'];

		if ( isset( $_wp_additional_image_sizes[ $image_size ] ) ) {
			$size = $_wp_additional_image_sizes[ $image_size ];
		}

		$image_url  = trailingslashit( get_template_directory_uri() ) . 'assets/images/no-thumb.jpg';

		if ( 'post-thumbnail' !== $image_size ) {
			$image_url  = trailingslashit( get_template_directory_uri() ) . 'assets/images/no-thumb-' . $size['width'] . 'x' . $size['height'] . '.jpg';
		}

		if ( 'src' === $type ) {
			return $image_url;
		}

		return '<img class="no-thumb ' . esc_attr( $image_size ) . '" src="' . esc_url( $image_url ) . '" />';
	}
endif;

/**
 * Featured content posts
 */
function simclick_get_featured_posts() {
	$number = get_theme_mod( 'simclick_featured_content_number', 3 );

	$post_list    = array();

	$args = array(
		'posts_per_page'      => $number,
		'post_type'           => 'post',
		'ignore_sticky_posts' => 1, // ignore sticky posts.
	);

	// Get valid number of posts.

	$args['post_type'] = 'featured-content';

	for ( $i = 1; $i <= $number; $i++ ) {
		$post_id = '';

		$post_id = get_theme_mod( 'simclick_featured_content_cpt_' . $i );	

		if ( $post_id && '' !== $post_id ) {
			$post_list = array_merge( $post_list, array( $post_id ) );
		}
	}

	$args['post__in'] = $post_list;
	$args['orderby']  = 'post__in';
	

	$featured_posts = get_posts( $args );

	return $featured_posts;
}


/**
 * Services content posts
 */
function simclick_get_services_posts() {
	$number = get_theme_mod( 'simclick_service_number', 6 );

	$post_list    = array();

	$args = array(
		'posts_per_page'      => $number,
		'post_type'           => 'post',
		'ignore_sticky_posts' => 1, // ignore sticky posts.
	);

	// Get valid number of posts.

	$args['post_type'] = 'ect-service';

	for ( $i = 1; $i <= $number; $i++ ) {
		$post_id = '';

		$post_id = get_theme_mod( 'simclick_service_cpt_' . $i );

		if ( $post_id && '' !== $post_id ) {
			$post_list = array_merge( $post_list, array( $post_id ) );
		}
	}

	$args['post__in'] = $post_list;
	$args['orderby']  = 'post__in';

	$services_posts = get_posts( $args );

	return $services_posts;
}

if ( ! function_exists( 'simclick_sections' ) ) :
	/**
	 * Display Sections on header and footer with respect to the section option set in simclick_sections_sort
	 */
	function simclick_sections( $selector = 'header' ) {
				get_template_part( 'template-parts/header/header', 'media' );
				get_template_part( 'template-parts/slider/content', 'display' );
				get_template_part( 'template-parts/hero-content/content','hero' );
				get_template_part( 'template-parts/services/display', 'services' );
				get_template_part( 'template-parts/portfolio/display', 'portfolio' );
				get_template_part( 'template-parts/testimonials/display', 'testimonial' );
				get_template_part( 'template-parts/featured-content/display', 'featured' );
				get_template_part( 'template-parts/footer/footer', 'instagram' );
	}
endif;
