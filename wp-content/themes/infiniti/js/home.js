var $ = jQuery;

	var aniTime = .25;
	var aniNav = 1.5;
	var origPos;
	var navVis = true;
	var mouseOver = false;
	var currentlyPlaying;
	var availbleToPlay = false;
	var opHide = .1;
	var sound = false;
	var vidIndex = 1;
	var tripNavContainer;
	var availablePlayer;

	// condition for mobile devices
	var mPlayer;

	var videoBox;
	var vidIframe;

	var is_mobile = WURFL.is_mobile;

	// var is_mobile = true;
$(document).ready( function(window){
	console.log("this is the location url: ",document.URL);
	$.urlParam = function(name){
		console.log("this is the name value: ", name);
		// var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(document.URL);
		var IDBeginPos = document.URL.search("=")+1;
		results = document.URL.slice(IDBeginPos, document.URL.length);
		console.log("this is results: ", results);
		if(results){
		    return results;
		}
	}
	
	var tripPreload = $.urlParam('pList');
	console.log("this the trip that should load right after the intro video: ", tripPreload);
	var vidDrawerPaddingL = parseInt($(".trip_container").css("padding-left"))*2;
	var pTitle = $("title").html();
	var vPercent;
	var vDuration;
	var dFlag = false;
	var vidLoop = true;

	if( tripPreload !=""){
		vidLoop = false;
	}

	sendTagData(1, "none", 0);

	if(is_mobile){
		$('body').addClass("mobile");
	}

	init();

	function init(){
		if(!is_mobile){
			availbleToPlay = true;
			var textWidth = 0;
			var bgndImgmargin = parseInt($(".trip_container").css("background-position-y"));
			var requiredPadding = parseInt($(".trip_container").css("padding-left"));
			$(".trip_container").each( function(){
				var tw = $(this).find("div").width();
				if( tw > textWidth ){
					textWidth = tw;
				}
			});
			var drawerBgndImageWidth = $(".trip").height();
			var drawerW = textWidth+drawerBgndImageWidth+vidDrawerPaddingL+requiredPadding;
			var bgndImgPos = textWidth+vidDrawerPaddingL;
			origPos = textWidth+vidDrawerPaddingL+requiredPadding;	

			$(".trip").each( function(){
				$(this).find(".trip_container").css({
					'width': drawerW+"px",
					'background-position-x': bgndImgPos+bgndImgmargin+requiredPadding+"px"
				});
			});
		
			$(".trip").each( function(){
				var container = this;
				TweenMax.to(container, aniTime, {css:{marginLeft:0}, ease:Circ.easeOut, onComplete: hideDrawers, onCompleteParams:[container]});
			});
		}

		$('#sndControls').on("mouseenter", triggerMouseOver);
		$('#sndControls').on("click", soundState);
		$('.social_share li').on("click", socialTrack);
		if(!is_mobile){
			$(".trip").on("mouseenter", openBtn);
			$(".trip").on("mouseleave", closeBtn);	
			$(".vid_controls").on("mouseenter", triggerMouseOver);
			$(".vid_controls").on("mouseleave", triggerMouseLeave);
			$("#vid_bottom_nav").on("mouseenter", triggerMouseOver);
			$("#vid_bottom_nav").on("mouseleave", triggerMouseLeave);
		}
		if(availbleToPlay){
			addPlayability();
		}
	}
	function addPlayability(){
		$(".trip_container").removeClass("trip_inactive");
		$(".trip").on("click", "span", switchVids);
		$(".trip").on("click", queVidPlaylist);
	}
	function hideDrawers(container){
		TweenMax.to(container, aniTime, {delay: 2, css:{marginLeft:-origPos}, ease:Circ.easeOut});
	}


	function soundState( evt ){
		if(availablePlayer.isMuted()){
			availablePlayer.unMute();
			$(evt.target).removeClass("off").addClass("on");
		} else {
			availablePlayer.mute();
			$(evt.target).removeClass("on").addClass("off");
		}
	}


	function switchVids( evt ){
		evt.stopPropagation();
		evt.preventDefault();
		var playlist = availablePlayer.getPlaylist();
		var playlistLength = availablePlayer.getPlaylist().length;
		var individualVid = availablePlayer.getVideoData().video_id;
		var count = playlist.indexOf(availablePlayer.getVideoData().video_id);

		switch($(evt.target).attr("class")){
			case "nextVid":
				count++;
				if(count < playlistLength){
					vidIndex = count + 1;
					availablePlayer.cueVideoById(playlist[count]);
					playNewVid();
				}
				break;

			case "prevVid":
				count--;
				if(count >= 0){
					vidIndex = count - 1;
					availablePlayer.cueVideoById(playlist[count]);
					playNewVid();
				}
				break;
		}
		tripNavContainer = $(this).closest('li');
	}
	function playNewVid(){
		availablePlayer.playVideo();
	}
	function openBtn( evt ){
		evt.stopPropagation();
		evt.preventDefault();
		TweenMax.to(this, aniTime, {css:{marginLeft:0}, ease:Circ.easeOut});
		mouseOver = true;
	}
	function closeBtn( evt ){
		evt.stopPropagation();
		evt.preventDefault();
		mouseOver = false;
		TweenMax.to(this, aniTime, {css:{marginLeft: -origPos}, ease:Circ.easeOut});
	}
	function triggerMouseOver(){
		mouseOver = true;
	}
	function triggerMouseLeave(){
		mouseOver = false;
	}
	function switchExpanded(){
		mouseOver = false;
	}
	function toggleNav(){	
		TweenMax.to($('ul'), aniTime, {css:{alpha: opHide}, ease:Circ.easeOut, delay:1, onComplete: switchExpanded});
		
		setMouseTracking();
		navVis = true;
	}
	function setMouseTracking(){
		$(document).on("mousemove", 
			$.debounce( 
				50, 
				true, 
				function(e){
					TweenMax.to($('ul'), aniTime, {css:{alpha: 1}, ease:Circ.easeOut});
					TweenMax.to($('#sndControls'), aniTime, {css:{alpha: 1}, ease:Circ.easeOut});
		    })
		).on("mousemove", $.debounce( 
			250, 
			false, 
			function(e){
				setTimeout( function(){
					if(!mouseOver){
						TweenMax.to($('ul'), aniTime, {css:{alpha: opHide}, ease:Circ.easeOut});
						TweenMax.to($('#sndControls'), aniTime, {css:{alpha: opHide}, ease:Circ.easeOut});
					};
				}, 2000);
		    })
		);
	}
	function toggleBranding(){
			TweenMax.to($(".main_logo"), aniTime, {css:{alpha: 0}, ease:Circ.easeOut});
	}
	function queVidPlaylist( evt ){
		var vidList;
		var isPlaying;
		var trip;
		if(evt != undefined){
			evt.stopPropagation();
			evt.preventDefault();
		}
		navVis = false;
		if(!is_mobile){
			toggleNav();
			toggleBranding();		
		}

		if(tripPreload){
			console.log("there was a video cued to play after intro video: ",tripPreload);
			vidList = tripPreload;
			// getting the li element with that trip playlist id:
			$(".trip").each(function(){
				console.log("this is the trip id: ",$(this).attr("data-trip"));
				if($(this).attr("data-trip") == tripPreload){
					console.log("did we get a match?");
					isPlaying = $(this).attr("data-state");
					trip = this;
				}
			});
		} else {
			vidList = $(this).attr("data-trip");
			isPlaying = $(this).attr("data-state");	
			trip = this;		
		}

		
		if(isPlaying == "false"){
			if(availablePlayer.isMuted()){
				availablePlayer.unMute();
				$("#sndControls").removeClass("off").addClass("on");
			}
			availablePlayer.loadPlaylist({
				list: vidList,
				listType:"playlist"
			});
			

			if(currentlyPlaying){
				resetVids(currentlyPlaying);
			}
			$(".trip").each( function(){ $(this).attr("data-state", "false"); });
			
			$(trip).attr("data-state", "play");
			$(trip).children().addClass("trip_pause");
			currentlyPlaying = [ $(".trip").index($(trip)), $(trip).find("div").html() ];
			tripNavContainer = trip;
		} else {
			stateSwitch( trip );
		}
	}
	function updatePlayDisplay(){
		if(vPercent){
			stopInterval();
		}
		var playlist = availablePlayer.getPlaylist();
		if(playlist) {
			var cVid = availablePlayer.getVideoData();
			for(var i = 0; i< playlist.length; i++){
				if(playlist[i] == cVid.video_id){
					vidIndex = i+1;
				}
				dFlag = false;
			}
			$(tripNavContainer).find("div").html("now playing<br><span class='prevVid'>prev</span> "+vidIndex+"/"+playlist.length+" <span class='nextVid'>next</span>");
			
			// set required variables for the CM tagging request:
		}
		sendTagData(101, availablePlayer.getVideoData().title, vidIndex);
		vDuration = availablePlayer.getDuration();
		vPercent = setInterval( function(){calDuration()},500);
	}

	function calDuration(){
		var vidPoint = availablePlayer.getCurrentTime();
		var _duration = vidPoint/vDuration;
		if(!dFlag && _duration > .75){
		sendTagData(104, availablePlayer.getVideoData().title, vidIndex);
			dFlag = true;
		}
	}
	function stopInterval(){
		clearInterval(vPercent);
	}
	function socialTrack( evt ){
		console.log($(evt.target).attr("id"));
		sendTagData(106, $(evt.target).attr("id"), "_Click");
	}

	function resetVids(oldVid){
		var video = $(".trip_container").get(oldVid[0]);
		var oldTrip = video.parentNode;
		$(video).removeClass("trip_pause");
		$(video).html("<div>"+oldVid[1]+"</div>");
		$(oldTrip).attr("data-state", "false");
	}
	function stateSwitch( tripContainer ){
		if($(tripContainer).attr("data-state") != "false"){
			switch($(tripContainer).attr("data-state")){
				case "play":
					availablePlayer.pauseVideo();
					$(tripContainer).attr("data-state", "pause");
					$(tripContainer).children().removeClass("trip_pause");
					break;
				case "pause":
					availablePlayer.playVideo();
					$(tripContainer).attr("data-state", "play");
					$(tripContainer).children().addClass("trip_pause");
					break;
			}
		}
	}
	$('.video_container').tubular({
		videoId: 'jvuBe6b2iVk',
		mute: true,
		repeat: vidLoop
	});

	function on_resize(c, t) {
	    onresize = function() {
	      clearTimeout(t);
	      t = setTimeout(c, 100)
	    };
	    return c
	};
	setReady = function (player){
		if(is_mobile){
			var mobVidCont = document.getElementById("mob_vid_container");
			mobVidCont.className = "mobVidCont";
			var big_player = document.createElement("div");
		    big_player.className = "big_player";
		    big_player.addEventListener("click", showPlayer);
			videoBox = document.createElement("div");
		    vidIframe = document.createElement("div");
		    videoBox.id="mob_Player";
		    videoBox.className = "mobile_video vid_hidden";
		    mobVidCont.appendChild(big_player);
		    mobVidCont.appendChild(videoBox);
		    videoBox.appendChild(vidIframe);
		    setMobilePlayer('jvuBe6b2iVk');

		} else {
			player.addEventListener("onStateChange", function(evt){
				switch(evt.data){
					case 1:
						updatePlayDisplay();
						break;
					case 0:
						sendTagData(105, pTitle, "Video_End", availablePlayer.getVideoData().title, vidIndex);
						queVidPlaylist();
						break;
				}
				/*if(evt.data === 1){
					updatePlayDisplay();
				}*/
			});

			availablePlayer = player;
		}
	}

/*	function setReady(){
		if(is_mobile){
			var mobVidCont = document.getElementById("mob_vid_container");
			mobVidCont.className = "mobVidCont";
			var big_player = document.createElement("div");
		    big_player.className = "big_player";
		    big_player.addEventListener("click", showPlayer);
			videoBox = document.createElement("div");
		    vidIframe = document.createElement("div");
		    videoBox.id="mob_Player";
		    videoBox.className = "mobile_video vid_hidden";
		    mobVidCont.appendChild(big_player);
		    mobVidCont.appendChild(videoBox);
		    videoBox.appendChild(vidIframe);
		    setMobilePlayer('jvuBe6b2iVk');

		} else {
			window.player.addEventListener("onStateChange", function(evt){
				if(evt.data === 1){
					updatePlayDisplay();
				}
			});

			availablePlayer = window.player;
		}
	}
*/
	function showPlayer( evt ){
		$(evt.target).addClass("invisible");
		$(videoBox).removeClass("vid_hidden");
		availbleToPlay = true;
		addPlayability();
	}

	function setMobilePlayer(vList){
		mPlayer = new YT.Player(vidIframe, {
	        videoId: vList,
	        height: '480',
	        width: '270',
	        playerVars:{'forceSSL':true},
	        events: {
	            'onReady': mobPlayerReady,
	            'onStateChange': mobPlayerStateChange
			}	
		});
		availablePlayer = mPlayer;
	}
	function mobPlayerReady( evt ){
	}
	function mobPlayerStateChange( evt ){
		switch( evt.data ){
			case 1:
				updatePlayDisplay();
				$(tripNavContainer).attr("datae-state", "pause");
				$(tripNavContainer).children().addClass("trip_pause");
				break;
			case 2:
				$(tripNavContainer).attr("datae-state", "play");
				$(tripNavContainer).children().removeClass("trip_pause");
				break;
		}
	}
	return {setReady : setReady};
});