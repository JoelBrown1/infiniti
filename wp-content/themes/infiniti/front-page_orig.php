<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width,user-scalable=no,maximum-scale=1.0" />
		<title><?php wp_title( '|', true, 'right' ); ?></title>
		<link rel="profile" href="http://gmpg.org/xfn/11">
		<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

    <meta property="og:url" content="http://ford.cottagelife.com/"/> 
    <meta property="og:title" content="INFINITI & OASIS Present Canada Underscovered!"/>
    <meta property="og:site_name" content="INFINITI & OASIS Present Canada Underscovered!"/>
    <meta property="og:description" content="Trying something different to see if it will work..."/>
    <meta property="og:type" content="website"/>
    <meta property="og:locale" content="en_us"/>


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

	<body>
    <div id="fb-root"></div>
    <script>(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script>

		<div class="video_container"></div>
    <div id="branding">
      <img class="main_logo" src="<?php echo get_template_directory_uri().'/images/logo_branding.png'; ?>" alt="Infiniti and Oasis Present Canada Undiscovered">
    </div>
    <?php get_template_part( "navigation", "social_channels" ); ?>
    <ul id="trip_controls">
      <li id="trip1" class="trip trip1" data-trip="PLlGPzfcuhqdtjaEpIvGkA1RiKRRySTLyk" data-state="false"><div class="vid_container"><div>Great Bear<br>Rainforest</div></div></li>
      <li id="trip2" class="trip trip2" data-trip="PLlGPzfcuhqdtUB1WJzfqpkAManPI6k_E2" data-state="false"><div class="vid_container"><div>Athabasca<br>Sand Dunes</div></div></li>
      <li id="trip3" class="trip trip3" data-trip="PLlGPzfcuhqdvuxMGjAB8wXvIB2GnAKy6g" data-state="false"><div class="vid_container"><div>Sable<br>Island</div></div></li>
    </ul>
    <ul id="vid_bottom_nav" class="clearfix">
      <li><a href="<?php echo site_url().'/welcome'; ?>" />Go Behind The Scenes</a></li>
      <li><a href="#">Enter To Win</a></li>
    </ul>
    <div id="sndControls" class="off"></div>
		<?php get_footer(); ?>
	