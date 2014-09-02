<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package infiniti
 */

get_header(); ?>
<?php get_sidebar(); ?>
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<?php 
				if(has_post_thumbnail()){ ?>
					<div id="post_banner">
						<?php the_post_thumbnail( 'full' ); ?> 
					</div>
			<?php	}
				while ( have_posts() ) : the_post(); 

				 get_template_part( 'content', 'page' ); 

				endwhile; // end of the loop. 
			?>

		</main><!-- #main -->
		<?php get_footer(); ?>
	</div><!-- #primary -->


<?php //get_footer(); ?>
