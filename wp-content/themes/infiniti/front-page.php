<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width,user-scalable=no,maximum-scale=1.0" />
		<title><?php echo get_bloginfo( 'name' )." ".get_bloginfo('description'); ?></title>
		<link rel="profile" href="http://gmpg.org/xfn/11">
		<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
    <meta name="google-site-verification" content="oPjrIiO6Jxjc7z7CjObPGJRq96mrbuUmn1DuPuVO0jY" />

    <meta property="og:url" content="http://canadaundiscovered.infiniti.ca/"/> 
    <meta property="og:title" content="INFINITI & OASIS Present Canada Underscovered!"/>
    <meta property="og:site_name" content="INFINITI & OASIS Present Canada Underscovered!"/>
    <meta property="og:description" content="The Infiniti #CanadaUndiscovered gives you the chance to see awesome spots Canada offers, that aren’t on the postcards!"/>
    <meta property="og:type" content="website"/>
    <meta property="og:locale" content="en_us"/>

		<?php wp_head(); 
      
      if( $crmID == null){
        $crmID = array("33329");
      }
    ?>

    <script>
    window.fbAsyncInit = function() {
      FB.init({
        appId: '303862166472823',
        status: true,
        xfbml: true
      });
    };
  </script>

	</head>

	<body>
    <div id="fb-root"></div>
    <script>
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script>
    <div id="loader"></div>
    <div id="content" class="clear">
      <div id="sndControls" class="off"></div>
      <ul class="social_share">
        <li id="facebook" class="socialBtns"></li>
        <li class="socialBtns twitter"><a id="twitter" target="_blank" href="https://twitter.com/intent/tweet?url=http://canadaundiscovered.infiniti.ca/&amp;text=Canada’s+hidden+gems+are+some+of+the+most+spectacular+spots+in+the+world.&amp;hashtags=CanadaUndiscovered,CanadaUndiscovered"><!-- <img src="http://infiniti/wp-content/themes/infiniti/images/socialIcons-twitter.jpg" alt="twitter social link"> --></a></li>
      </ul>
      <div id="branding">
        <img class="main_logo" src="<?php echo get_template_directory_uri().'/images/logo_branding.png'; ?>" alt="Infiniti and Oasis Present Canada Undiscovered">
      </div>

      <div id="video_container" class="clearfix"></div>
      <div id="mob_vid_container"></div>
      <ul id="trip_controls">
        <li id="trip1" class="trip trip1" data-trip="PLYZ8jvuaFC6daN4n5ljItR1eJJKwDbF6f" data-state="false"><div class="trip_container trip_inactive"><div>Pacific Rim<br>National Park</div></div></li>
        <li id="trip2" class="trip trip2" data-trip="PLYZ8jvuaFC6cIRvCCA8vFPVDs2d_EZ7tW" data-state="false"><div class="trip_container trip_inactive"><div>Athabasca<br>Sand Dunes</div></div></li>
        <li id="trip3" class="trip trip3" data-trip="PLYZ8jvuaFC6dFqAXRJO-77HAAXEqjruP4" data-state="false"><div class="trip_container trip_inactive"><div>Sable<br>Island</div></div></li>
      </ul>
      <ul id="vid_bottom_nav" class="clear">
        <li id="scenes"><a href="<?php echo site_url().'/welcome'; ?>" />Go Behind The Scenes</a></li>
        <li id="contest"><a href="<?php echo site_url().'/contest'; ?>">Enter To Win</a></li>
      </ul>

    <?php get_footer(); ?>
	
  
	