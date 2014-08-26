<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
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
    <ul class="vid_controls">
      <li id="facebook" class="socialBtns"></li>
      <li class="socialBtns twitter"><a id="twitter" target="_blank" href="https://twitter.com/intent/tweet?url=http://ford.cottagelife.com/&text=INFINITI and OASIS Present Canada Undiscovered"><!-- <img src="<?php echo get_template_directory_uri().'/images/socialIcons-twitter.jpg'; ?>" alt="twitter social link"> --></a></li>
      <li class="socialBtns g_plus" itemscope><a id="gPlus" target="_blank" href="https://plus.google.com/share?url=http://ford.cottagelife.com/"><!-- <img src="<?php echo get_template_directory_uri().'/images/socialIcons-gplus.jpg'; ?>" alt="gPlus social link"> --></a></li>
    </ul>
    <ul id="trip_controls">
      <li id="trip1" class="trip trip1" data-trip="PL9AA766E4B502CC48" data-state="false"><div>Great Bear<br>Rainforest</div></li>
      <li id="trip2" class="trip trip2" data-trip="PLVf811yyyVnMpInuhgQgI6cLi2iLEKubg" data-state="false"><div>Athabasca<br>Sand Dunes</div></li>
      <li id="trip3" class="trip trip3" data-trip="PL94B14C406493206F" data-state="false"><div>Sable<br>Islands</div></li>
    </ul>
    <ul id="vid_bottom_nav" class="clearfix">
      <li>Go Behind The Scenes</li>
      <li>Enter To Win</li>
    </ul>
    <div id="sndControls" class="off"></div>
		<?php get_footer(); ?>
	