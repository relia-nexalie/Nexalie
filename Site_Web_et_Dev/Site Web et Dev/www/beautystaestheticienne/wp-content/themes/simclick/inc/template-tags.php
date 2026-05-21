<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package SimClick
 */

if ( ! function_exists( 'simclick_posted_on' ) ) :
	/**
	 * Prints HTML with meta information for the current post-date/time and author.
	 */
	function simclick_posted_on() {
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
		}

		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);

		$posted_on = sprintf(
			/* translators: %s: post date */
			__( '<span class="date-label"> </span>%s', 'simclick'  ),
			'<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>'
		);

		// Get the author name; wrap it in a link.
		$byline = sprintf(
			/* translators: %s: post author */
			__( '<span class="author-label screen-reader-text">By </span>%s', 'simclick'  ),
			'<span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a></span>'
		);

		echo '<span class="byline screen-reader-text"> ' . $byline . '</span><span class="posted-on">' . $posted_on . '</span>'; // WPCS: XSS OK.

	}
endif;

if ( ! function_exists( 'simclick_entry_category' ) ) :
	/**
	 * Prints HTML with meta information for the category.
	 */
	function simclick_entry_category( $echo = true ) {
		$output = '';

		// Hide category and tag text for pages.
		if ( 'post' === get_post_type() ) {
			/* translators: used between list items, there is a space after the comma */
			$categories_list = get_the_category_list( ' ' );
			if ( $categories_list ) {
				/* translators: 1: list of categories. */
				$output = sprintf( '<span class="cat-links">%1$s%2$s</span>',
					sprintf( _x( '<span class="cat-text screen-reader-text">Categories</span>', 'Used before category names.', 'simclick'  ) ),
					$categories_list
				); // WPCS: XSS OK.
			}
		}

		if ( 'ect-service' === get_post_type() || 'featured-content' === get_post_type() || 'jetpack-portfolio' === get_post_type() ) {
			/* translators: used between list items, there is a space after the comma */
			$term_list = get_the_term_list( get_the_ID(), get_post_type() . '-type' );
			if ( $term_list ) {
				/* translators: 1: list of categories. */
				$output = sprintf( '<span class="cat-links">%1$s%2$s</span>',
					sprintf( _x( '<span class="cat-text screen-reader-text">Categories</span>', 'Used before category names.', 'simclick'  ) ),
					$term_list
				); // WPCS: XSS OK.
			}
		}

		if ( $echo ) {
			echo $output;
		} else {
			return $output;
		}
	}
endif;

if ( ! function_exists( 'simclick_entry_footer' ) ) :
	/**
	 * Prints HTML with meta information for the categories, tags and comments.
	 */
	function simclick_entry_footer() {
		// Hide category and tag text for pages.
		if ( 'post' === get_post_type() ) {
			/* translators: used between list items, there is a space after the comma */
			$categories_list = get_the_category_list( ' ' );
			if ( $categories_list ) {
				/* translators: 1: list of categories. */
				printf( '<span class="cat-links">%1$s%2$s</span>',
					sprintf( _x( '<span class="cat-text screen-reader-text">Categories</span>', 'Used before category names.', 'simclick'  ) ),
					$categories_list
				); // WPCS: XSS OK.
			}

			/* translators: used between list items, there is a space after the comma */
			$tags_list = get_the_tag_list();
			if ( $tags_list ) {
				/* translators: 1: list of tags. */
				printf( '<span class="tags-links">%1$s%2$s</span>',
					sprintf( _x( '<span class="tags-text screen-reader-text">Tags</span>', 'Used before tag names.', 'simclick'  ) ),
					$tags_list
				); // WPCS: XSS OK.
			}
		}
		
		edit_post_link(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. Only visible to screen readers */
					__( 'Edit <span class="screen-reader-text">%s</span>', 'simclick'  ),
					array(
						'span' => array(
							'class' => array(),
						),
					)
				),
				get_the_title()
			),
			'<span class="edit-link">',
			'</span>'
		);
	}
endif;

if ( ! function_exists( 'simclick_blog_entry_meta_left' ) ) :
	/**
	 * Prints HTML with meta information for author and tag.
	 */
	function simclick_blog_entry_meta_left() {
		/* translators: used between list items, there is a space after the comma */
		$categories_list = get_the_category_list( ' ' );
		if ( $categories_list ) {
			/* translators: 1: list of categories. */
			printf( '<span class="cat-links">%1$s%2$s</span>',
				sprintf( _x( '<span class="cat-text screen-reader-text">Categories</span>', 'Used before category names.', 'simclick'  ) ),
				$categories_list
			); // WPCS: XSS OK.
		}
	}
endif;

if ( ! function_exists( 'simclick_entry_posted_on' ) ) :
	/**
	 * Prints HTML with date information for current post.
	 *
	 * Create your own simclick_entry_posted_on() function to override in a child theme.
	 *
	 * @since Izabel Pro 1.0
	 */
	function simclick_entry_posted_on() {
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';

		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
		}

		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( 'c' ) ),
			get_the_date(),
			esc_attr( get_the_modified_date( 'c' ) ),
			get_the_modified_date()
		);

		printf( '<span class="posted-on">'  . '<span class="date-label screen-reader-text">%1$s</span><a href="%2$s" rel="bookmark">%3$s</a></span>',
			_x( 'Posted on', 'Used before publish date.', 'simclick'  ),
			esc_url( get_permalink() ),
			$time_string
		);
	}
endif;

if ( ! function_exists( 'simclick_blog_entry_meta_right' ) ) :
	/**
	 * Prints HTML with meta information for the category and posted on.
	 */
	function simclick_blog_entry_meta_right() {
		// Hide category and tag text for pages.
		if ( 'post' === get_post_type() ) {
			$time_string = '<time class="entry-date published" datetime="%1$s"><span class="date-day">%2$s</span><span class="date-month-year">%3$s</span></time>';
			if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
				$time_string = '<time class="entry-date published" datetime="%1$s"><span class="date-day">%2$s</span><span class="date-month-year">%3$s</span></time><time class="updated" datetime="%4$s">%5$s</time>';
			}

			$time_string = sprintf( $time_string,
				esc_attr( get_the_date( 'c' ) ),
				esc_html( get_the_date('d') ),
				esc_html( get_the_date('M, Y') ),
				esc_attr( get_the_modified_date( 'c' ) ),
				esc_html( get_the_modified_date() )
			);

			printf(
				/* translators: %s: post date */
				__( '<span class="posted-on"><span class="date-label"> </span>%s', 'simclick' ),
				'<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a></span>'
			);
		}
	}
endif;

if ( ! function_exists( 'simclick_author_bio' ) ) :
	/**
	 * Prints HTML with meta information for the author bio.
	 */
	function simclick_author_bio() {
		if ( '' !== get_the_author_meta( 'description' ) ) {
			get_template_part( 'template-parts/biography' );
		}
	}
endif;

if ( ! function_exists( 'simclick_header_title' ) ) :
	/**
	 * Display Header Media Title
	 */
	function simclick_header_title() {
		if ( is_front_page() ) {
			$subtitle = get_theme_mod( 'simclick_header_media_subtitle' ) ? '<span class="sub-title">' . wp_kses_post( get_theme_mod( 'simclick_header_media_subtitle' ) ) . '</span><!-- .sub-title -->' : '';

			echo $subtitle . wp_kses_post( get_theme_mod( 'simclick_header_media_title' ) );
		} elseif ( is_singular() ) {
			the_title();
		} elseif ( is_404() ) {
			esc_html_e( 'Oops! That page can&rsquo;t be found.', 'simclick'  );
		} elseif ( is_search() ) {
			/* translators: %s: search query. */
			printf( esc_html__( 'Search Results for: %s', 'simclick'  ), '<span>' . get_search_query() . '</span>' );
		} else {
			the_archive_title();
		}
	}
endif;

if ( ! function_exists( 'simclick_header_text' ) ) :
	/**
	 * Display Header Media Text
	 */
	function simclick_header_text() {
		if ( is_front_page() ) {
			$content = get_theme_mod( 'simclick_header_media_text' );

			if ( $header_media_url = get_theme_mod( 'simclick_header_media_url', '' ) ) {
				$target = get_theme_mod( 'simclick_header_url_target' ) ? '_blank' : '_self';

				$content .= '<span class="more-button"><a href="'. esc_url( $header_media_url ) . '" target="' . $target . '" class="more-link">' .esc_html( get_theme_mod( 'simclick_header_media_url_text' ) ) . '<span class="screen-reader-text">' .wp_kses_post( get_theme_mod( 'simclick_header_media_title' ) ) . '</span></a></span>';
			}

			$content = apply_filters( 'the_content', $content );
			$content = str_replace( ']]>', ']]&gt;', $content );

			echo '<div class="entry-summary">' . wp_kses_post( $content ) . '</div>';
		} elseif ( is_404() ) {
			esc_html_e( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'simclick'  );
		} elseif( is_search() ) {
			// No Header Media Text.
			echo '<!-- No Header Media Text -->';
		} else {
			the_archive_description();
		}
	}
endif;

if ( ! function_exists( 'simclick_single_image' ) ) :
	/**
	 * Display Single Page/Post Image
	 */
	function simclick_single_image() {
		global $post, $wp_query;

		// Get Page ID outside Loop
		$page_id = $wp_query->get_queried_object_id();
		if ( $post) {
	 		if ( is_attachment() ) {
				$parent = $post->post_parent;
				$metabox_feat_img = get_post_meta( $parent,'simclick-featured-image', true );
			} else {
				$metabox_feat_img = get_post_meta( $page_id,'simclick-featured-image', true );
			}
		}

		if ( empty( $metabox_feat_img ) || ( !is_page() && !is_single() ) ) {
			$metabox_feat_img = 'default';
		}

		$featured_image = get_theme_mod( 'simclick_single_layout', 'disabled' );

		if ( ( 'disabled' == $metabox_feat_img  || ! has_post_thumbnail() || ( 'default' == $metabox_feat_img && 'disabled' == $featured_image ) ) ) {
			echo '<!-- Page/Post Single Image Disabled or No Image set in Post Thumbnail -->';
			return false;
		}
		else {
			$class = '';

			if ( 'default' == $metabox_feat_img ) {
				$class = $featured_image;
			}
			else {
				$class = 'from-metabox ' . $metabox_feat_img;
				$featured_image = $metabox_feat_img;
			}

			?>
			<div class="post-thumbnail <?php echo esc_attr( $class ); ?>">
                <?php the_post_thumbnail( $featured_image ); ?>
	        </div>
	   	<?php
		}
	}
endif;

if ( ! function_exists( 'simclick_comment' ) ) :
	/**
	 * Template for comments and pingbacks.
	 * Used as a callback by wp_list_comments() for displaying the comments.
	 */
	function simclick_comment( $comment, $args, $depth ) {
		if ( 'pingback' == $comment->comment_type || 'trackback' == $comment->comment_type ) : ?>

		<li id="comment-<?php comment_ID(); ?>" <?php comment_class(); ?>>
			<div class="comment-body">
				<?php esc_html_e( 'Pingback:', 'simclick'  ); ?> <?php comment_author_link(); ?> <?php edit_comment_link( esc_html__( 'Edit', 'simclick'  ), '<span class="edit-link">', '</span>' ); ?>
			</div>

		<?php else : ?>

		<li id="comment-<?php comment_ID(); ?>" <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ); ?>>
			<article id="div-comment-<?php comment_ID(); ?>" class="comment-body">

				<div class="comment-author-container">
					<div class="comment-author vcard">
						<?php if ( 0 != $args['avatar_size'] ) echo get_avatar( $comment, $args['avatar_size'] ); ?>
					</div><!-- .comment-author -->
				</div><!-- .comment-container -->

				<div class="comment-container">
					<div class="comment-header">
						<header class="comment-meta">
						<?php printf( __( '%s <span class="says screen-reader-text">says:</span>', 'simclick'  ), sprintf( '<cite class="fn author-name">%s</cite>', get_comment_author_link() ) ); ?>
						</header><!-- .comment-meta -->
						<div class="comment-metadata">
									<a class="comment-permalink" href="<?php echo esc_url( get_comment_link( $comment->comment_ID ) ); ?>">
								<time datetime="<?php comment_time( 'c' ); ?>">
									<?php
										printf(
											/* translators: Comment Date at Comment Time */
											esc_html__( '%1$s at %2$s', 'simclick'  ),
											get_comment_time( get_option( 'date_format' ) ),
											get_comment_time( get_option( 'time_format' ) )
										);
									?>
								</time></a>
							<?php edit_comment_link( esc_html__( 'Edit', 'simclick'  ), '<span class="edit-link">', '</span>' ); ?>

							<?php if ( '0' == $comment->comment_approved ) : ?>
								<p class="comment-awaiting-moderation"><?php esc_html_e( 'Your comment is awaiting moderation.', 'simclick'  ); ?></p>
							<?php endif; ?>
						</div> <!-- .comment-metadata -->
					</div><!-- .comment-header -->

					<div class="comment-content">
						<?php comment_text(); ?>
					</div><!-- .comment-content -->


					<div class="comment-metadata">
						<?php
							comment_reply_link( array_merge( $args, array(
								'add_below' => 'div-comment',
								'depth'     => $depth,
								'max_depth' => $args['max_depth'],
								'before'    => '<span class="reply">',
								'after'     => '</span>',
							) ) );
						?>
					</div><!-- .comment-metadata -->

				</div><!-- .comment-container -->
			</article><!-- .comment-body -->
		<?php /* No closing </li> is needed.  WordPress will know where to add it. */ ?>

		<?php
		endif;
	}
endif; // ends check for simclick_comment()

if ( ! function_exists( 'simclick_entry_author' ) ) :
/**
 * Prints HTML with category and tags for current post.
 *
 * Create your own simclick_entry_author() function to override in a child theme.
 *
 * @since SimClick 0.1
 */
function simclick_entry_author( $date = true, $author = true ) {
	if ( ! $author ) {
		return;
	}

	if ( $author ) {

		// Get the author name; wrap it in a link.
		$byline = printf(
			/* translators: %s: post author */
			'<span class="author vcard"><span class="author-label">By </span>%s<a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . get_the_author() . '</a></span>', ''
		);
	}
}
endif;
