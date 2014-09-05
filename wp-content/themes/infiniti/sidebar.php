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
<nav class="navigation">
	<div id="branding">
		<a href="<?php echo  get_home_url(); ?>"><img src="<?php echo get_template_directory_uri().'/images/content_logo.png'?>" alt="Infiniti and Oasis present Canada Undescovered!"></a>
		
	</div>
	<?php wp_nav_menu( array( 'theme_location' => 'main-menu' ) ); ?>
	<div id="infiniti_link">
		<div class="top_level">
			<a href="#" target="_blank">Explore the infiniti model range</a>
		</div>
	</div>
	<div id="social_connections" class="clearfix">
		<div class="social_container clearfix">
			<div id="infiniti_social">
				<span>Connect with Infiniti</span>
				<ul>
					<li class="ifb"></li>
					<li class="itw"></li>
					<li class="iyt"></li>
					<li class="iig"></li>
					<li class="ipt"></li>
					<li class="ica"></li>
				</ul>
			</div>
			<div id="oasis_social">
				<span>Connect with Oasis</span>
				<ul>
					<li class="ofb"></li>
					<li class="otw"></li>
					<li class="oyt"></li>
					<li class="oca"></li>
				</ul>
			</div>
		</div>
	</div>
</nav>
