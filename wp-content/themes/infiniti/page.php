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
	if($post->post_parent){
		$imageSrc = wp_get_attachment_image_src( get_post_thumbnail_id( $post->post_parent ), 'single-post-thumbnail' );
		$footer_image = get_post_meta($post->post_parent, 'footer_image');
		$footer_cta = get_post_meta($post->post_parent, 'footer_cta');
		$trip = get_post_meta($post->post_parent, 'vid_trip');
	} else if(has_post_thumbnail()){
		$imageSrc = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'single-post-thumbnail' );
		$footer_image = get_post_meta($post->ID, 'footer_image');
		$footer_cta = get_post_meta($post->ID, 'footer_cta');
		$trip = get_post_meta($post->ID, 'vid_trip');
	}
	
	$crmID = get_post_meta($post->ID, 'crmPageID');

get_header(); ?>
<?php get_sidebar(); ?>
		<div id="primary" class="content-area">
			<main id="main" class="site-main" role="main">
				<?php 
					if($imageSrc){ ?>
						<div id="post_banner">
							<img src="<?php echo $imageSrc[0]; ?>" alt="<?php echo $post->post_title ;?>">
						</div>
				<?php	}
					while ( have_posts() ) : the_post(); 

					 get_template_part( 'content', 'page' ); 

					endwhile; 
				
				if($footer_image){ ?>
					<div id="bottom_cta">
						<a href="<?php echo  get_home_url().'?pList='. $trip[0]; ?>">
							<div class="cta">
								<span><?php echo $footer_cta[0]; ?> </span>
							</div>
							<img src="<?php echo $footer_image[0];?>" alt="<?php echo $footer_cta[0]; ?>">
						</a>
					</div>
			<?php	} ?>
			</main>
			<?php get_footer(); ?>
