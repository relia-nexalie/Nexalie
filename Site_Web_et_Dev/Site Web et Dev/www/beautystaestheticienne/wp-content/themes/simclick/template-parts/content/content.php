<?php
/**
 * Template part for displaying posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package SimClick
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<div class="hentry-inner">
		<?php if ( has_post_thumbnail() ) : ?>
		<div class="post-thumbnail">
			<a href="<?php the_permalink(); ?>" rel="bookmark">
				<?php 
				$thumbnail = 'post-thumbnail';
				$layout  = simclick_get_theme_layout();
				
				if ( 'no-sidebar-full-width' === $layout ) {
					$thumbnail = 'simclick-slider';
				}

				the_post_thumbnail( $thumbnail ); 
				?>
			</a>
		</div>
		<?php endif; ?>

		<div class="entry-container">
			<?php if ( is_sticky() ) : ?>
			<span class="sticky-label"><?php esc_html_e( 'Featured', 'simclick'  ); ?></span>
			<?php endif; ?>
				<div class="entry-meta">
					<?php simclick_blog_entry_meta_right(); ?>
				</div><!-- .entry-meta -->
			<div class="entry-header-wrapper">
				<header class="entry-header">
					<?php if ( 'post' === get_post_type() ) : ?>
						<div class="entry-meta">
							<?php simclick_blog_entry_meta_left(); ?>
						</div><!-- .entry-meta -->
					<?php endif; ?>
					<?php
					if ( is_singular() ) :
						the_title( '<h1 class="entry-title">', '</h1>' );
					else :
						the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
					endif;
					?>
					<?php if ( 'post' === get_post_type() ) : ?>
						<div class="entry-meta">
							<?php simclick_entry_author(); ?>
						</div><!-- .entry-meta -->
					<?php endif; ?>
				</header><!-- .entry-header -->

				<div class="entry-summary"><?php the_excerpt(); ?></div><!-- .entry-summary -->
			</div>
		</div> <!-- .entry-container -->
	</div> <!-- .hentry-inner -->
</article><!-- #post-<?php the_ID(); ?> -->
