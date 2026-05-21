<?php
/**
 * The template for displaying featured content
 *
 * @package SimClick
 */
?>

<?php
$enable_content = get_theme_mod( 'simclick_featured_content_option', 'disabled' );

if ( ! simclick_check_section( $enable_content ) ) {
	// Bail if featured content is disabled.
	return;
}

$featured_posts = simclick_get_featured_posts();

if ( empty( $featured_posts ) ) {
	return;
}


$simclick_title    = get_option( 'featured_content_title', esc_html__( 'Contents', 'simclick'  ) );
$subtitle = get_option( 'featured_content_content' );
?>

<div id="featured-content" class="featured-content-section section text-aligned-left">
	<div class="wrapper">
		<?php if ( '' !== $simclick_title || $subtitle ) : ?>
			<div class="section-heading-wrapper">
				<?php if ( $subtitle ) : ?>
					<div class="section-description">
						<?php
						$subtitle = apply_filters( 'the_content', $subtitle );
						echo wp_kses_post( str_replace( ']]>', ']]&gt;', $subtitle ) );
						?>
					</div><!-- .section-description -->
				<?php endif; ?>

				<?php if ( '' !== $simclick_title ) : ?>
					<div class="section-title-wrapper">
						<h2 class="section-title"><?php echo wp_kses_post( $simclick_title ); ?></h2>
					</div><!-- .page-title-wrapper -->
				<?php endif; ?>
			</div><!-- .section-heading-wrapper -->
		<?php endif; ?>

		<div class="section-content-wrapper layout-three">

			<?php get_template_part( 'template-parts/featured-content/content', 'featured' ); ?>
			
		</div><!-- .featured-content-wrapper -->
	</div><!-- .wrapper -->
</div><!-- #featured-content-section -->
