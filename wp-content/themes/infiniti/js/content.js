var $ = jQuery;
$(document).ready(function(){
	console.log("this is the document location: ", document.location.pathname);
	if(document.location.pathname.indexOf("contest")){
		if($("#thanks").length == 0){
			sendTagData(180, "none", 0);
		}
	} else {
		sendTagData(1, "none", 0);
	}

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
	var _mob = WURFL._mob;
	var aniTime = .25;
	var imageIndex = 0;

	setTimeout( function(){ checkOffset(); }, 1000);

	$(".social_connections").on("mouseenter", openSocial);
	$(".social_connections").on("mouseleave", openSocial);
	$('.social_share li').on("click", socialTrack);
	// $(".panorama_img").on("click", doPopup);
	// $(".geo").on("click", doPopup);
	$(".ham_nav").on('click', mobMenu);
	$(".gallery-item img").on('click', getImageData);
	$('#cboxNext').on("click", changeImageCount);
	$('#cboxPrevious').on("click", changeImageCount);
	$('#cboxContent').on("click", changeImageCount);
	$('.map_link').on("click", openMap);
	$(document).on("scroll", checkPos);
	$(window).on("resize", $.debounce( 
			50, 
			true, 
			function(e){
				checkOffset(); 
				getPos();
	    })
	);
	function openMap( evt ){
		console.log("this is the evt.target: ",evt.target);
		sendTagData(360, "", 0);
	}

	function getImageData( evt ){
		console.log("this is from getImageData");
		imageIndex = $(".gallery-item img").index( evt.target) + 1;
		console.log("this is the original image index: ", imageIndex);
		sendTagData(38, '', imageIndex);
	}
	function changeImageCount( evt ){
		evt.preventDefault();
		evt.stopPropagation();
		var btnID = $(evt.target).attr('id');
		if(!$(evt.target).attr('id')){
			btnID = $(evt.target).attr("class");
		}
		switch(btnID){
			case "cboxNext":
				imageIndex ++;
				break;
			case "cboxPrevious":
				imageIndex --;
				break;
			case "cboxPhoto":
				imageIndex ++;
				break;
		}
		console.log("this is the index of the image that we clicked on: ", imageIndex);
		sendTagData(38, "", imageIndex);
	}
	function socialTrack( evt ){
		console.log("we clicked on the social buttons");
		sendTagData(106, $(evt.target).attr("id"), "_Click");
	}

	function mobMenu( evt ){
		var totalHeight = $("#mobile_nav").outerHeight(true) + $(".menu-main-menu-container").outerHeight(true) + $('#infiniti_link').outerHeight(true) + $(".social_connections").outerHeight(true);
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

	function openSocial( evt ){
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