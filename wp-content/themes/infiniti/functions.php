<?php
/**
 * Infiniti functions and definitions
 *
 * @package Infiniti
 */

add_action('after_setup_theme', 'infiniti_setup');
function infiniti_setup(){
	add_action('wp_enqueue_scripts', 'infiniti_scripts');
}

function infiniti_scripts(){
	wp_enqueue_style('robotoCSS', '//fonts.googleapis.com/css?family=Roboto:400,500,700');
	wp_enqueue_style('infinity-reset', get_bloginfo('template_url').'/style.css');
	// wp_register_script('jquery', get_bloginfo('template_url').'/js/jquery_min.js', array(), "", true);

	if(is_front_page()){
		wp_enqueue_style('home-page', get_bloginfo('template_url').'/css/stylesheets/homepage.css');
		wp_enqueue_script('modernizr', get_bloginfo('template_url').'/js/modernizr.js', array(), "", true);
		wp_enqueue_script('greensock', 'http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js', array(), "", true);
		wp_enqueue_script('tubular', get_bloginfo('template_url').'/js/jquery.tubular.1.0.js', array(), "", true);
		wp_enqueue_script('debounce_throttle', get_bloginfo('template_url').'/js/debounce_throttle.js', array(), "", true);
		wp_enqueue_script('video-controls', get_bloginfo('template_url').'/js/video-controls.js', array('jquery'), "", true);
	}
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
