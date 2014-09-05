<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package infiniti
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

	<?php wp_head(); ?>

	<script>
		window.fbAsyncInit = function() {
			FB.init({
				appId: '412464415457650',
				status: true,
				xfbml: true
			});
		};
	</script>
</head>

<body <?php body_class(); ?>>
	<div id="fb-root"></div>
	<script>(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	</script>
	<div id="page" class="hfeed site">
		<ul class="vid_controls">
	      <li id="facebook" class="socialBtns"></li>
	      <li class="socialBtns twitter"><a id="twitter" target="_blank" href="https://twitter.com/intent/tweet?url=http://ford.cottagelife.com/&text=INFINITI and OASIS Present Canada Undiscovered"><!-- <img src="<?php echo get_template_directory_uri().'/images/socialIcons-twitter.jpg'; ?>" alt="twitter social link"> --></a></li>
	    </ul>

		<header id="masthead" class="site-header" role="banner">

			<nav id="site-navigation" class="main-navigation" role="navigation">
				<?php // wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
			</nav><!-- #site-navigation -->
		</header><!-- #masthead -->

		<div id="content" class="site-content">
