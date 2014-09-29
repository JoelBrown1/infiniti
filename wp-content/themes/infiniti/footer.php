<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package infiniti
 */
global $post;
$crmID = get_post_meta($post->ID, 'crmPageID');
?>


		<footer id="colophon" class="site-footer clearfix" role="contentinfo">
			<a href="http://www.infiniti.ca" target="_blank" id="infinitiLink">infiniti.ca</a>
			<div id="trademark">INFINITI names, logos, product names, feature names and slogans are trademarks owned by or licensed to Nissan Motor Co. Ltd., and/or its North American subsidiaries. <br> ©2014 INFINITI. All rights reserved.</div>
		</footer>
	</div>
	<script>
	var $ = jQuery;
	$(document).ready(function(){
		$(".social_share").on("click", gaSocial);

		function gaSocial( evt ){
			var socialChannel = $(evt.target).attr("id");
			if( socialChannel == "facebook"){
				FB.ui( {
			        method: 'share',
			        href: "http://canadaundiscovered.infiniti.ca/"
			    }, function( response ) {} );
			}
			ga('send', socialChannel, 'Share', 'http://canadaundiscovered.infiniti.ca/');
		}
	});
		
	</script>
	<div id="pageTags" style="display:none;"></div>
<?php 
	wp_footer(); 
	if(!is_front_page()){?>
		
		<script src="<?php echo get_bloginfo('template_url').'/js/crm/engine.js' ?>" id="crmEngine" pageid="<?php echo $crmID[0]; ?>" pagelocale="en" pagesite="infiniti-Canada_Undiscovered" language="JavaScript" type="text/javascript"></script>
<?php	
	} else { ?>
		<script src="<?php echo get_bloginfo('template_url').'/js/crm/engine.js' ?>" id="crmEngine" pageid="33329" pagelocale="en" pagesite="infiniti-Canada_Undiscovered" language="JavaScript" type="text/javascript"></script>
<?php		
	}
?>


</body>
</html>
