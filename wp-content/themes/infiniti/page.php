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
	} else if(has_post_thumbnail()){
		$imageSrc = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'single-post-thumbnail' );
		$footer_image = get_post_meta($post->ID, 'footer_image');
		$footer_cta = get_post_meta($post->ID, 'footer_cta');
	}
	
	$crmID = get_post_meta($post->ID, 'crmPageID');
	// var_dump( get_post_meta($post->ID) );

get_header(); ?>
<?php get_sidebar(); ?>
	<!-- <div id="test-popup" class="white-popup mfp-hide">
		Popup content
	</div> -->
		<div id="primary" class="content-area">
			<main id="main" class="site-main" role="main">
				<?php 
					if($imageSrc){ ?>
						<div id="post_banner">
							<img src="<?php echo $imageSrc[0]; ?>" alt="<?php echo $post->post_title ;?>">
							<?php //the_post_thumbnail( 'full' ); ?> 
						</div>
				<?php	}
					while ( have_posts() ) : the_post(); 

					 get_template_part( 'content', 'page' ); 

					endwhile; 
				
				if($footer_image){ ?>
					<div id="bottom_cta">
						<a href="<?php echo  get_home_url().'?pList=PLlGPzfcuhqdtUB1WJzfqpkAManPI6k_E2'; ?>">
							<div class="cta">
								<span><?php echo $footer_cta[0]; ?> </span>
							</div>
							<img src="<?php echo $footer_image[0];?>" alt="<?php echo $footer_cta[0]; ?>">
						</a>
					</div>
			<?php	} ?>
			</main>
			<?php get_footer(); ?>
		</div>
		<div id="pageTags" style="display:none;"></div>
		<!-- <script src="<?php echo get_stylesheet_directory().'/js/Undiscovered_Micro_Tags/engine.js' ?>" id="crmEngine" pageid="<?php echo $crmID[0]; ?>" pagelocale="en" pagesite="infiniti-Canada_Undiscovered" language="JavaScript" type="text/javascript"></script> -->

<?php //get_footer(); ?>
