<?php
/**
 * The template for displaying the Slider
 *
 * @package SimClick
 */

if ( ! function_exists( 'simclick_featured_slider' ) ) :
	/**
	 * Add slider.
	 *
	 * @uses action hook simclick_before_content.
	 *
	 * @since SimClick 0.1
	 */
	function simclick_featured_slider() {
		if ( simclick_is_slider_displayed() ) {
				
			$output = '
				<div class="slider-content-wrapper section content-aligned-center text-aligned-center content-frame">
					<div class="wrapper">
						<div class="section-content-wrap">
							<div class="cycle-slideshow"
							    data-cycle-log="false"
							    data-cycle-pause-on-hover="true"
							    data-cycle-swipe="true"
							    data-cycle-auto-height=container
							    data-cycle-fx="fade"
								data-cycle-speed="1000"
								data-cycle-timeout="4000"
								data-cycle-pager="#featured-slider-pager"
								data-cycle-prev="#featured-slider-prev"
        						data-cycle-next="#featured-slider-next"
								data-cycle-slides="> .post-slide"
								>';

			$output .= '
							<div class="controllers">
								<!-- prev/next links -->
								<div id="featured-slider-prev" class="cycle-prev fa fa-angle-left" aria-label="' . esc_attr__( 'Previous Slide', 'simclick'  ) . '" aria-hidden="true"><span class="screen-reader-text">' . esc_html__( 'Previous Slide', 'simclick'  ) . '</span></div>

								<!-- empty element for pager links -->
								<div id="featured-slider-pager" class="cycle-pager"></div>

								<div id="featured-slider-next" class="cycle-next fa fa-angle-right" aria-label="' . esc_attr__( 'Next Slide', 'simclick'  ) . '" aria-hidden="true"><span class="screen-reader-text">' . esc_html__( 'Next Slide', 'simclick'  ) . '</span></div>

							</div><!-- .controllers -->';
			
							// Select Slider

			$output .= simclick_post_page_category_slider();
			

			$output .= '
							</div><!-- .cycle-slideshow -->
						</div><!-- .section-content-wrap -->
					</div><!-- .wrapper -->';

			$output .='<div class="scroll-down">
					<span>' . esc_html__( 'Scroll', 'simclick'  ) . '</span>
					<span class="scroll-here" aria-hidden="true"><i class="fas fa-angle-down"></i></span>
				</div><!-- .scroll-down -->';
			

			$output .= '
				</div><!-- .slider-content-wrapper -->';

			echo $output;
		} // End if().
	}
	endif;
add_action( 'simclick_slider', 'simclick_featured_slider', 10 );

if ( ! function_exists( 'simclick_post_page_category_slider' ) ) :
	/**
	 * This function to display featured posts/page/category slider
	 *
	 * @param $options: simclick_theme_options from customizer
	 *
	 * @since SimClick 0.1
	 */
	function simclick_post_page_category_slider() {
		$quantity     = get_theme_mod( 'simclick_slider_number', 4 );
		$no_of_post   = 0; // for number of posts
		$post_list    = array();// list of valid post/page ids
		$output       = '';

		$args = array(
			'post_type'           => 'any',
			'ignore_sticky_posts' => 1, // ignore sticky posts
		);

		//Get valid number of posts

		for ( $i = 1; $i <= $quantity; $i++ ) {
			$post_id = '';

			$post_id = get_theme_mod( 'simclick_slider_page_' . $i );
			

			if ( $post_id && '' !== $post_id ) {
				$post_list = array_merge( $post_list, array( $post_id ) );

				$no_of_post++;
			}
		}

		$args['post__in'] = $post_list;
		$args['orderby'] = 'post__in';

		if ( ! $no_of_post ) {
			return;
		}

		$args['posts_per_page'] = $no_of_post;

		$loop = new WP_Query( $args );

		while ( $loop->have_posts() ) :
			$loop->the_post();

			$title_attribute = the_title_attribute( 'echo=0' );

			if ( 0 === $loop->current_post ) {
				$classes = 'post post-' . get_the_ID() . ' hentry slides displayblock ';

			} else {
				$classes = 'post post-' . get_the_ID() . ' hentry slides displaynone ';
			}

			// Default value if there is no featurd image or first image.
			$thumbnail = 'simclick-slider';
			$image_url = trailingslashit( esc_url ( get_template_directory_uri() ) ) . 'assets/images/no-thumb-1920x1080.jpg';



			if ( has_post_thumbnail() ) {
				$image_url = get_the_post_thumbnail_url( get_the_ID(), $thumbnail );
			} else {
				// Get the first image in page, returns false if there is no image.
				$first_image_url = simclick_get_first_image( get_the_ID(), $thumbnail, '', true );

				// Set value of image as first image if there is an image present in the page.
				if ( $first_image_url ) {
					$image_url = $first_image_url;
				}
			}

			$more_tag_text = get_theme_mod( 'simclick_excerpt_more_text',  esc_html__( 'Continue reading', 'simclick'  ) );

			$output .= '
			<div class="post-slide">
				<article class="' . esc_attr( $classes ) . '">';

					$output .= '
					<div class="slider-image" alt="' . $title_attribute . '">						
						<img class="wp-post-image" src='. esc_url( $image_url ) .'>
					</div><!-- .slider-image -->
					<div class="entry-container"><div class="entry-container-wrap">';

				$output .= the_title( '<header class="entry-header"><h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '">', '</a></h2></header>', false );
				
				$output .= '<div class="entry-summary"><p>' . get_the_excerpt() . '</p></div><!-- .entry-summary -->';
				

						$output .= '
					</div></div><!-- .entry-container -->
				</article><!-- .slides -->
			</div><!-- .post-slide -->';
		endwhile;

		wp_reset_postdata();

		return $output;
	}
endif; // simclick_post_page_category_slider.

if ( ! function_exists( 'simclick_is_slider_displayed' ) ) :
	/**
	 * Return true if slider image is displayed
	 *
	 */
	function simclick_is_slider_displayed() {
		$enable_slider = get_theme_mod( 'simclick_slider_option', 'disabled' );

		return simclick_check_section( $enable_slider );
	}
endif; // simclick_is_slider_displayed.
