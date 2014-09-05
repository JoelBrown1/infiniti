var $ = jQuery;
$(document).ready(function(){

	
	var socialVis = false;

	var socialOrigPos = parseInt($("#social_connections").css("bottom"));
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

	setTimeout( function(){
		checkOffset();
	}, 1000);

	$("#social_connections").on("click", doSocial);
	$(".panorama_img").on("click", doPopup);
	$(".geo").on("click", doPopup);
	$(window).on("scroll", checkPos);

	$(window).on("resize", $.debounce( 
			50, 
			true, 
			function(e){
				checkOffset(); 
	    })
	);

	function checkPos( evt ){
		console.log("check pos is happening");
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

	function checkOffset(){
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
		console.log("this is the navHeight value: ", navHeight);
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
		evt.stopPropagation();
		evt.preventDefault();
		if(!socialVis){
			TweenMax.to(this, aniTime, {css:{bottom:0}, ease:Circ.easeOut});
			socialVis = true;
		} else {
			TweenMax.to(this, aniTime, {css:{bottom:socialOrigPos}, ease:Circ.easeOut});
			socialVis = false;
		}
	}
})