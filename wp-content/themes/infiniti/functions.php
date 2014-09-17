<?php
/**
 * Infiniti functions and definitions
 *
 * @package Infiniti
 */

add_action('after_setup_theme', 'infiniti_setup');
function infiniti_setup(){
	add_action('wp_enqueue_scripts', 'infiniti_scripts');
	add_theme_support( 'post-thumbnails' );

	add_action('init', 'register_menu');
	add_action('after_setup_theme', 'infiniti_setup');

	add_filter('nav_menu_css_class', 'my_css_attributes_filter', 100, 1);
	add_filter('nav_menu_item_id', 'my_css_attributes_filter', 100, 1);
	add_filter('page_css_class', 'my_css_attributes_filter', 100, 1);
	add_filter( 'use_default_gallery_style', '__return_false' );
	// temp hide admin bar
	add_filter('show_admin_bar', '__return_false');

	// adding in the google analytics code
	add_action('wp_footer','googleAnalytics_code');

}
function register_menu(){
	register_nav_menu('main-menu', __('Main Menu'));
}
function googleAnalytics_code(){	?>
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-3921008-11', 'auto');
		ga('send', 'pageview');
	</script>
<?php }


function infiniti_scripts(){
	wp_enqueue_style('robotoCSS', '//fonts.googleapis.com/css?family=Roboto:400,500,700');
	wp_enqueue_style('infinity-reset', get_bloginfo('template_url').'/style.css');
	wp_enqueue_script('greensock', '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js', array(), "", true);
	wp_enqueue_script('debounce_throttle', get_bloginfo('template_url').'/js/debounce_throttle.js', array(), "", true);
	wp_enqueue_script('wurfl', '//wurfl.io/wurfl.js', array(), "", true);

	if(is_front_page()){
		wp_enqueue_style('home-page', get_bloginfo('template_url').'/css/stylesheets/homepage.css');
		wp_enqueue_script('modernizr', get_bloginfo('template_url').'/js/modernizr.js', array(), "", true);
		wp_enqueue_script('home', get_bloginfo('template_url').'/js/home.js', array('jquery'), "", true);
		wp_enqueue_script('tubular', get_bloginfo('template_url').'/js/jquery.tubular.1.0.js', array('home'), "", true);
	} else {
		wp_enqueue_style('content-page', get_bloginfo('template_url').'/css/stylesheets/content.css');
		wp_enqueue_style('mag_pop', get_bloginfo('template_url').'/css/stylesheets/magnific-popup.css');
  		wp_enqueue_script('pop_up', get_bloginfo('template_url').'/js/jquery.magnific-popup.min.js', array('jquery'), "", true);
		wp_enqueue_script('content', get_bloginfo('template_url').'/js/content.js', array('jquery'), "", true);
	}
	wp_enqueue_script('crmData', get_bloginfo('template_url').'/js/crmData.js', array(), "", true);
}

function my_css_attributes_filter($var) {
  return is_array($var) ? array_intersect($var, array('top_level', 'child_level')) : '';
}
/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
*/ 
// require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
// require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
// require get_template_directory() . '/inc/jetpack.php';
