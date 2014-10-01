<?php
/**
 * The sidebar containing the main widget area.
 *
 * @package infiniti
 */

/*if ( ! is_active_sidebar( 'sidebar-1' ) ) {
	return;
}*/
?>
<div class="navigation">
	<div id="branding">
		<a href="<?php echo  get_home_url(); ?>"><img src="<?php echo get_template_directory_uri().'/images/content_logo.png'?>" alt="Infiniti and Oasis present Canada Undescovered!"></a>
		
	</div>
	<?php wp_nav_menu( array( 'theme_location' => 'main-menu' ) ); ?>
	<div id="infiniti_link">
		<div class="top_level">
			<a href="http://www.infiniti.ca/en/?next=canada_undiscovered_behind_scenes.infiniti_home" target="_blank">Explore the infiniti model range</a>
		</div>
	</div>
	<?php get_template_part( "navigation", "social_channels" ); ?>

</div>
