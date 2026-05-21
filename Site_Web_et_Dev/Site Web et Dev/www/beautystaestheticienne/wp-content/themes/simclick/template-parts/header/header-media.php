<?php
/**
 * Display Header Media
 *
 * @package SimClick
 */
?>

<?php
	$header_image = simclick_featured_overall_image();

	if ( '' == $header_image && ! simclick_has_header_media_text() ) {
		// Bail if all header media are disabled.
		return;
	}
?>
<div class="custom-header">
	<?php if ( ( is_header_video_active() && has_header_video() ) || $header_image ) : ?>
	<div class="custom-header-media">
		<?php
		if ( is_header_video_active() && has_header_video() ) {
			the_custom_header_markup();
		} elseif ( $header_image ) {
			echo '<img src="' . esc_url( $header_image ) . '"/>';
		}
		?>
	</div>
	<?php endif; ?>

	<?php simclick_header_media_text(); ?>
	<?php if ( get_theme_mod( 'simclick_header_scroll_down', 1 ) ) : ?>
		<div class="scroll-down">
			<span><?php esc_html_e( 'Scroll', 'simclick'  ); ?></span>
			<span class="scroll-here" aria-hidden="true"><i class="fas fa-angle-down"></i></span>
		</div><!-- .scroll-down -->
	<?php endif; ?>
</div><!-- .custom-header -->
