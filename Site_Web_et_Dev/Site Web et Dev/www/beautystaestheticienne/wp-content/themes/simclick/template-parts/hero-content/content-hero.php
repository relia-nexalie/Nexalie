<?php
/**
 * The template used for displaying hero content
 *
 * @package SimClick
 */
?>

<?php
$enable_section = get_theme_mod( 'simclick_hero_content_visibility', 'homepage' );

if ( ! simclick_check_section( $enable_section ) ) {
	// Bail if hero content is not enabled
	return;
}

get_template_part( 'template-parts/hero-content/post-type', 'hero' );
