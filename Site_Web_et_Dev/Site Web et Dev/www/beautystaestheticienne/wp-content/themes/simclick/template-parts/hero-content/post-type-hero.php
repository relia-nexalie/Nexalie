<?php
/**
 * The template used for displaying hero content
 *
 * @package SimClick
 */
?>

<?php

if ( $simclick_id = get_theme_mod( 'simclick_hero_content' ) ) {
	$args['page_id'] = absint( $simclick_id );
}

// If $args is empty return false
if ( empty( $args ) ) {
	return;
}

// Create a new WP_Query using the argument previously created
$hero_query = new WP_Query( $args );
if ( $hero_query->have_posts() ) :
	while ( $hero_query->have_posts() ) :
		$hero_query->the_post();

		?>
		<div id="hero-content" class="hero-content-wrapper section content-aligned-right text-aligned-center">
			<div class="wrapper">
				<div class="section-content-wrap">
					<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
						<?php if ( has_post_thumbnail() ) : ?>
							<div class="featured-content-image" style="background-image: url( <?php the_post_thumbnail_url( 'simclick-hero-content' ); ?> );">
								<a class="cover-link" href="<?php the_permalink(); ?>"></a>
							</div>
							<div class="entry-container">
						<?php else : ?>
							<div class="entry-container full-width">
						<?php endif; ?>

							<?php
								$simclick_title = '';

								$subtitle = get_theme_mod( 'simclick_hero_content_subtitle', esc_html__( 'About us', 'simclick'  ) );
							?>

							<?php if ( $simclick_title || $subtitle ) : ?>
								<header class="entry-header">
									<h2 class="entry-title ">
										<?php if ( $subtitle ) : ?>
											<span><?php echo esc_html( $subtitle ); ?></span>
										<?php endif; ?>
										
										<?php if ( $simclick_title ) : ?>
											<?php echo esc_html( $simclick_title ); ?>
										<?php endif; ?>
									</h2>
								</header><!-- .entry-header -->
							<?php endif; ?>

							<div class="entry-content">
								<?php

									the_content();									

									wp_link_pages( array(
										'before'      => '<div class="page-links"><span class="page-links-title">' . esc_html__( 'Pages:', 'simclick'  ) . '</span>',
										'after'       => '</div>',
										'link_before' => '<span class="page-number">',
										'link_after'  => '</span>',
										'pagelink'    => '<span class="screen-reader-text">' . esc_html__( 'Page', 'simclick'  ) . ' </span>%',
										'separator'   => '<span class="screen-reader-text">, </span>',
									) );
								?>
							</div><!-- .entry-content -->

							<?php if ( get_edit_post_link() ) : ?>
								<footer class="entry-footer">
									<?php
										edit_post_link(
											sprintf(
												/* translators: %s: Name of current post */
												esc_html__( 'Edit %s', 'simclick'  ),
												the_title( '<span class="screen-reader-text">"', '"</span>', false )
											),
											'<span class="edit-link">',
											'</span>'
										);
									?>
								</footer><!-- .entry-footer -->
							<?php endif; ?>
						</div><!-- .entry-container -->
					</article><!-- #post-## -->
				</div><!-- .section-content-wrap -->
			</div> <!-- Wrapper -->
		</div> <!-- hero-content-wrapper -->
	<?php
	endwhile;

	wp_reset_postdata();
endif;
