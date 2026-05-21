<?php
/**
 * The template for displaying testimonial items
 *
 * @package SimClick
 */
?>

<?php
$enable = get_theme_mod( 'simclick_testimonial_option', 'disabled' );

if ( ! simclick_check_section( $enable ) ) {
	// Bail if featured content is disabled
	return;
}

// Get Jetpack options for testimonial.
$jetpack_defaults = array(
	'page-title' => esc_html__( 'Testimonials', 'simclick'  ),
);

// Get Jetpack options for testimonial.
$headline    = get_option( 'jetpack_testimonial_title' );
$subheadline = get_option( 'jetpack_testimonial_content' );
	
if ( ! $headline && ! $subheadline ) {
	$classes[] = 'no-section-heading';
}

$classes[] = 'section testimonial-wrapper';

$background = get_theme_mod( 'simclick_testimonial_bg_image' );

if ( $background ) {
	$classes[] = 'has-background-image';
}

?>

<?php if ( $background ) : ?>
<div class="testimonials-content-wrapper <?php echo esc_attr( implode( ' ', $classes ) ); ?>" style="background-image: url( <?php echo esc_url( $background ); ?> )">
<?php else : ?>
<div class="testimonials-content-wrapper <?php echo esc_attr( implode( ' ', $classes ) ); ?>">
<?php endif; ?>
	<div class="wrapper">
		<?php if ( $headline || $subheadline ) : ?>
			<div class="section-heading-wrapper">
				<?php if ( $subheadline ) : ?>
				<div class="section-description">
					<?php
					$subheadline = apply_filters( 'the_content', $subheadline );
					echo str_replace( ']]>', ']]&gt;', $subheadline );
					?>
				</div><!-- .section-description -->
			<?php endif; ?>
			
			<?php if ( $headline ) : ?>
				<div class="section-title-wrapper">
					<h2 class="section-title"><?php echo wp_kses_post( $headline ); ?></h2>
				</div>
			<?php endif; ?>
			</div><!-- .section-heading-wrap -->
		<?php endif; ?>

		<?php
			get_template_part( 'template-parts/testimonials/post-types', 'testimonial' );
		?>
	</div><!-- .wrapper -->
</div><!-- .testimonials-content-wrapper -->
