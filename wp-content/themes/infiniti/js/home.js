var $ = jQuery;
var _mob = WURFL.is_mobile;
// var _mob = true;
	var availablePlayer;
$(document).ready( function(window){
	var aniTime = .25;
	var aniNav = 1.5;
	var origPos;

	var navVis = true;
	var mouseOver = false;

	var currentlyPlaying;

	var availableToPlay = false;

	var opHide = .1;
	var sound = false;

	var vidIndex = 1;
	var tripNavContainer;
	var playerStates = [0, 0];

	var lvisible = false;

	// condition for mobile devices
	var mPlayer;

	var videoBox;
	var vidIframe;

	$.urlParam = function(name){
		var IDBeginPos = document.URL.search("=")+1;
		if(IDBeginPos > 0){
			results = document.URL.slice(IDBeginPos, document.URL.length);
			return results;
		}
	}
	if($.urlParam('pList') == undefined){
		var tripPreload ="";
	} else {
		var tripPreload = $.urlParam('pList');
	}

	var vidList;
	var isPlaying;
	var trip;

	var vidDrawerPaddingL = parseInt($(".trip_container").css("padding-left"))*2;
	var pTitle = $("title").html();
	var vPercent;
	var vDuration;
	var dFlag = false;
	var vidLoop = true;

	var introVid = true;
	var introPlayed = false;
	var introVidID = "zbRWeCiji9E";
	var replay = false;

	var reportedVid = {};

	var footerContainer = $("footer");
	var cEnabled = false;

	var finalVidTitle;
	var finalVidIndex;

	sendTagData(1, "none", 0);

	if(_mob){
		$('body').addClass("mobile");
	}

	init();

	function init(){
		if(!_mob){
			availableToPlay = true;
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
				TweenMax.to($(this), aniTime, {css:{marginLeft:0}, ease:Circ.easeOut, delay:5, onComplete: hideDrawers, onCompleteParams:[$(this)]});
			});
		
		}

		$('#sndControls').on("mouseenter", triggerMouseOver);
		$('#sndControls').on("click", soundState);
		$('.social_share li').on("click", socialTrack);
		if(!_mob){
			$(".trip").on("mouseenter", openBtn);
			$(".trip").on("mouseleave", closeBtn);	
			$(".vid_controls").on("mouseenter", triggerMouseOver);
			$(".vid_controls").on("mouseleave", triggerMouseLeave);
			$("#vid_bottom_nav").on("mouseenter", triggerMouseOver);
			$("#vid_bottom_nav").on("mouseleave", triggerMouseLeave);
		}
		if(availableToPlay){
			addPlayability();
		}
	}
	function addPlayability(){
		$(".trip_container").removeClass("trip_inactive");
		$(".trip").on("click", "span", switchVids);
		$(".trip").on("click", vidBtnClick);
	}
	function hideDrawers(container){
		TweenMax.to(container, aniTime, {delay: 2, css:{marginLeft:-origPos}, ease:Circ.easeOut});
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
					playNewVid(playlist, count);
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
		TweenMax.to($('footer'), aniTime, {css:{alpha: opHide}, ease:Circ.easeOut, delay:1, onComplete: switchExpanded});
		TweenMax.to($('#sndControls'), aniTime, {css:{alpha: opHide}, ease:Circ.easeOut, delay:1, onComplete: switchExpanded});
		
		setMouseTracking();
		navVis = true;
	}

	function showHideNav (op){
		TweenMax.to($('ul'), aniTime, {css:{alpha: op}, ease:Circ.easeOut});
		TweenMax.to($('#sndControls'), aniTime, {css:{alpha: op}, ease:Circ.easeOut});
		TweenMax.to($('footer'), aniTime, {css:{alpha: op}, ease:Circ.easeOut});
	}

	function setMouseTracking(){
		$(document).on("mousemove", 
			$.debounce( 
				50, 
				true, 
				function(e){
					showHideNav (1);
		    })
		).on("mousemove", $.debounce( 
			250, 
			false, 
			function(e){
				setTimeout( function(){
					if(!mouseOver){
						showHideNav (opHide);
					};
				}, 2000);
		    })
		);
	}

	function toggleBranding(){
			TweenMax.to($(".main_logo"), aniTime, {css:{alpha: 0}, ease:Circ.easeOut});
	}

	function vidBtnClick( evt ){
		evt.stopPropagation();
		evt.preventDefault();
		introVid = false;
		introPlayed = true;

		vidList = $(this).attr("data-trip");
		isPlaying = $(this).attr("data-state");	
		trip = this;	
		queVidPlaylist();
	}

	function queVidPlaylist(){
		if( tripPreload !=""){
			introVid = false;
		}

		if(!_mob){
			
			if(!introVid){
				toggleNav();
				toggleBranding();
			}
		}

		if(tripPreload){
			vidList = tripPreload;

			$(".trip").each(function(){
				if($(this).attr("data-trip") == tripPreload){
					isPlaying = $(this).attr("data-state");
					trip = this;
				}
			});
		}

		if(isPlaying == "false"){
			if(availablePlayer.isMuted()){
				availablePlayer.unMute();
				$("#sndControls").removeClass("off").addClass("on");
			}
			
			availablePlayer.loadPlaylist({
				list: vidList,
				listType:"playlist", 
				index: 0
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
		if(cEnabled){
			$("#content").css({display: "block"});
			$("#tubular-shield").css({display: "block"});
			cEnabled = false;
		}

		if(!introVid){
			var v = getVidData(availablePlayer);
			$(tripNavContainer).find("div").html("now playing<br><span class='prevVid'>prev</span> "+v.Ivid+"/"+v.len+" <span class='nextVid'>next</span>");
		} 

		if( availablePlayer.getVideoData().video_id == introVidID && introPlayed == false){
			sendTagData(101, availablePlayer.getVideoData().title, vidIndex);
		} 

		vDuration = availablePlayer.getDuration();
		vPercent = setInterval( function(){calDuration()},500);
	}

	function calDuration(){
		var vidPoint = availablePlayer.getCurrentTime();
		var _duration = vidPoint/vDuration;
		if(!dFlag && _duration > .75){
			if( availablePlayer.getVideoData().video_id == introVidID && introPlayed == false){
				sendTagData(104, availablePlayer.getVideoData().title, vidIndex);
			} else if(availablePlayer.getVideoData().video_id != introVidID){
				sendTagData(104, availablePlayer.getVideoData().title, vidIndex);
				finalVidTitle = availablePlayer.getVideoData().title;
				finalVidIndex = vidIndex;
			}
			dFlag = true;
		}
		if( !introVid && _duration> .9){
			if(!_mob){
				$("#content").css({display: "none"});
				$("#tubular-shield").css({display: "none"});
				cEnabled = true;
				stopInterval();				
			}
		}
	}

	function stopInterval(){
		clearInterval(vPercent);
	}

	function socialTrack( evt ){
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

	$('#content').tubular({
		videoId: introVidID,
		mute: true
	});

	function on_resize(c, t) {
	    onresize = function() {
	      clearTimeout(t);
	      t = setTimeout(c, 100)
	    };
	    return c
	}

	setReady = function (player){
		setInterval( function(){
			if(!lvisible){
				$("#loader").css({display: "none"});
				lvisible = true;
			}
		}, 1500);

		if(_mob){
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
		    setMobilePlayer(introVidID);
		} else {
			player.setPlaybackQuality("default");
			player.addEventListener("onStateChange", function(evt){
				playerStates[1] = playerStates[0];
				playerStates[0] = evt.data;

				var reload = false;

				if(introPlayed && player.getVideoData().video_id != introVidID){

					if(playerStates[0] == 1 && playerStates[1] == -1){
						var v = getVidData(player);
						reportedVid = {
							title : v.title,
							vidID : v.Ivid
						};
						sendTagData(101, reportedVid.title, reportedVid.vidID);
						playerStates = [0, 0];
					} else if(playerStates[0] == 0 && playerStates[1] == 3){
						sendTagData(105, reportedVid.title, reportedVid.vidID);
						playerStates = [0, 0];
					}

				}


				switch(evt.data){
					case 1:
						updatePlayDisplay();						
						player.setLoop(true);
						break;
					case 0:
						if( player.getVideoData().video_id == introVidID && introPlayed == false){
							introPlayed = true;
							sendTagData(105, player.getVideoData().title, vidIndex);
							if(tripPreload !=""){
								queVidPlaylist();
							}
						} else if(player.getVideoData().video_id != introVidID){
							if(vidIndex == player.getPlaylist().length){
								reload = true;
							}
						}
						// break;
				}
				if(reload){
					replay = true;
					player.clearVideo();
					player.setLoop(true);
					player.loadVideoById(introVidID);
					player.playVideo();
					resetVids(currentlyPlaying);
					introVid = true;
				}
			});

			availablePlayer = player;
		}
	}

	function getVidData( obj ){
		var playlist = obj.getPlaylist();
		if(playlist) {
			var cVid = obj.getVideoData();
			for(var i = 0; i< playlist.length; i++){
				if(playlist[i] == cVid.video_id){
					vidIndex = i+1;
				}
				dFlag = false;
			}
		}

		return {
			title: cVid.title,
			Ivid: vidIndex,
			len: playlist.length
		}
	}

	function showPlayer( evt ){
		$(evt.target).addClass("invisible");
		$(videoBox).removeClass("vid_hidden");
		availableToPlay = true;
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
		player.unMute();
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