<?php
/**
 * Primary Menu Template
 *
 * @package SimClick
 */
?>
<div id="site-header-menu" class="site-header-menu">
	<div id="primary-menu-wrapper" class="menu-wrapper">

		<div class="header-overlay"></div>

		<div class="menu-toggle-wrapper">
			<button id="menu-toggle" class="menu-toggle" aria-controls="top-menu" aria-expanded="false">
				<div class="menu-bars">
					<div class="bars bar1"></div>
	  				<div class="bars bar2"></div>
	  				<div class="bars bar3"></div>
  				</div>
				<span class="menu-label"><?php echo esc_html_e( 'Menu', 'simclick'  ); ?></span>
			</button>
		</div><!-- .menu-toggle-wrapper -->

		<div class="menu-inside-wrapper">
			<?php get_template_part( 'template-parts/header/header', 'navigation' ); ?>
			<div class="mobile-social-search">
				<div class="search-container">
					<?php get_search_form(); ?>
				</div>
				<?php if ( has_nav_menu( 'social' ) ) : ?>
					<nav class="social-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Social Links Menu', 'simclick'  ); ?>">
						<?php
							wp_nav_menu( array(
								'theme_location' => 'social',
								'container'       => 'div',
								'container_class' => 'menu-social-container',
								'link_before'    => '<span class="screen-reader-text">',
								'link_after'     => '</span>',
								'depth'          => 1,
							) );
						?>
					</nav><!-- .social-navigation -->
				<?php endif; ?>
			</div><!-- .mobile-social-search -->
		</div><!-- .menu-inside-wrapper -->
	</div><!-- #primary-menu-wrapper.menu-wrapper -->
</div><!-- .site-header-menu -->


<div class="social-search-wrapper">

	<?php get_template_part( 'template-parts/header/social', 'header' ); ?>

	<div class="search-social-container">
		<div id="primary-search-wrapper" class="menu-wrapper">
			<div class="menu-toggle-wrapper">
				<button id="social-search-toggle" class="menu-toggle">
					<span class="menu-label screen-reader-text"><?php echo esc_html_e( 'Search', 'simclick'  ); ?></span>
				</button>
			</div><!-- .menu-toggle-wrapper -->

			<div class="menu-inside-wrapper">
				<div class="search-container">
					<?php get_search_form(); ?>
				</div>
			</div><!-- .menu-inside-wrapper -->
		</div><!-- #social-search-wrapper.menu-wrapper -->


	</div> <!-- .search-social-container -->
</div>
