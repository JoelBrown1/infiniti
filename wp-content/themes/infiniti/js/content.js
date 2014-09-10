var $ = jQuery;
$(document).ready(function(){

	
	var socialVis = false;

	var socialOrigPos = parseInt($(".social_connections").css("bottom"));
	var greatBear = "7HKoqNJtMTQ";
	var aniTime = .3;
	var sTitle = $(".entry-title").html();
	var sIframe;
	var primaryContainer = $("#primary");
	var navHeight = parseInt($(".navigation").css("height"));
	var navContainer = $(".navigation");
	var currentOffset = navContainer.offset();
	var currentTop = currentOffset.top;
	var yPosition = 0;
	var offsetH;
	var is_mobile = WURFL.is_mobile;
	var aniTime = .25;


	setTimeout( function(){ checkOffset(); }, 1000);

	$(".social_connections").on("click", doSocial);
	$(window).on("click", doClickCheck);
	$(".panorama_img").on("click", doPopup);
	$(".geo").on("click", doPopup);
	$(".ham_nav").on('click', mobMenu);
	$(document).on("scroll", checkPos);

	$(window).on("resize", $.debounce( 
			50, 
			true, 
			function(e){
				checkOffset(); 
				getPos();
	    })
	);

	function doClickCheck( evt ){
		console.log( evt.target);
	}

	function mobMenu( evt ){
		var totalHeight = $("#mobile_nav").outerHeight(true) + $(".menu-main-menu-container").outerHeight(true) + $('#infiniti_link').outerHeight(true) + $(".social_connections").outerHeight(true);
		console.log("total outer height of nav: ", totalHeight);
		console.log("total outer height of mobile_nav: ", $("#mobile_nav").outerHeight(true));
		console.log("total outer height of menu-main-menu-container: ", $(".menu-main-menu-container").outerHeight(true));
		console.log("total outer height of infiniti_link: ", $('#infiniti_link').outerHeight(true));
		console.log("total outer height of social_connections: ", $(".social_connections").outerHeight(true));
		if($("#mobile_nav").outerHeight() == 0){
			console.log("should open the nav...");
			$("#mobile_nav").css({height : totalHeight});
		} else {
			console.log("should close the nav");
			$("#mobile_nav").css({height : 0});
		}
	}

	function checkPos( evt ){
        var scroll = ($(window).scrollTop() + $(window).height());
        if(parseInt($(".navigation").css("height"))> $(window).height()){
            if (scroll >= navHeight) {
            $(".navigation").css({position: "fixed",
        						  top: "initial",
        						  bottom: "0px"});
	        } else {
	            $(".navigation").css({position: "absolute",
	        						  top: "0px",
	        						  bottom: "initial"	});
	        }    	
        }
	}

	function getPos(){
		socialOrigPos = parseInt($(".social_connections").css("bottom"));
	}

	function checkOffset(){
		console.log("looking at emulation of devices and chcking for screen size change...");
		offsetH = primaryContainer.outerHeight() - navHeight;
		if( navHeight < $(window).height()){
			$(".navigation").css({	position : "fixed",
									height : "100%"
									})
		} else {
			$(".navigation").css({	position : "absolutle",
									height : "initial"
									})
		}
	}

	if(sTitle.search(/bear/i)>= 0){
		sIframe = '<iframe src="http://www.360cities.net/embed_iframe/machu-picchu-peru-2011" width="425" height="315" frameborder="0" bgcolor="#000000" target="_blank" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
	} else if(sTitle.search(/island/i)>= 0){
		sIframe = '<iframe src="http://www.360cities.net/embed_iframe/machu-picchu-peru-2011" width="425" height="315" frameborder="0" bgcolor="#000000" target="_blank" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
	} else {
		sIframe = '<iframe src="http://www.360cities.net/embed_iframe/machu-picchu-peru-2011" width="425" height="315" frameborder="0" bgcolor="#000000" target="_blank" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
	}
	var structure = '<div class="white-popup">'+sIframe+'</div>';

	function doPopup( evt ){
		$.magnificPopup.open({
			items: sTitle,
			type: 	'inline',
			inline: {
						markup : structure 
					},
			callbacks: {
					    markupParse: function(template, values, item) {}
					}
		});
	}
	function doSocial( evt ){
		var openPos = -(parseInt($(this).css("margin-bottom")));
		evt.stopPropagation();
		evt.preventDefault();
		if( $(evt.target).parent().attr("id") != "mobile_nav" ){
			if(!socialVis){
				TweenMax.to(this, aniTime, {css:{bottom:openPos}, ease:Circ.easeOut});
				socialVis = true;
			} else {
				TweenMax.to(this, aniTime, {css:{bottom:socialOrigPos}, ease:Circ.easeOut});
				socialVis = false;
			}
		}
		
	}
})