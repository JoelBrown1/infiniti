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
	global $post;
	$imageSrc;
	if(has_post_thumbnail()){
		// $postThumb = get_the_post_thumbnail();		
		$imageSrc = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'single-post-thumbnail' );
	}
	$footer_image = get_post_meta($post->ID, 'footer_image');
	$footer_cta = get_post_meta($post->ID, 'footer_cta');
	// var_dump( get_post_meta($post->ID) );

get_header(); ?>
<?php get_sidebar(); ?>
	<!-- <div id="test-popup" class="white-popup mfp-hide">
		Popup content
	</div> -->
		<div id="primary" class="content-area">
			<main id="main" class="site-main" role="main">
				<?php 
					if(has_post_thumbnail()){ ?>
						<div id="post_banner">
							<img src="<?php echo $imageSrc[0]; ?>" alt="<?php echo $post->post_title ;?>">
							<?php //the_post_thumbnail( 'full' ); ?> 
						</div>
				<?php	}
					while ( have_posts() ) : the_post(); 

					 get_template_part( 'content', 'page' ); 

					endwhile; 
				?>
				<div id="bottom_cta" style="background-image: url(<?php echo $footer_image[0];?>)">
					<a href="#">
						<div class="cta">
							<span><?php echo $footer_cta[0]; ?> </span>
						</div>
						<img src="<?php echo $footer_image[0];?>" alt="<?php echo $footer_cta[0]; ?>">
					</a>
				</div>
			</main>
			<?php get_footer(); ?>
		</div>

<?php //get_footer(); ?>
