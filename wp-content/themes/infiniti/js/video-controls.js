var $ = jQuery;

var aniTime = .25;
var aniNav = 1.5;
var origPos;
var vidDrawerPaddingL = parseInt($(".trip").css("padding-left"))*2;
var navVis = true;
var mouseOver = false;
var currentlyPlaying;
var opHide = .1;
var sound = false;
// might remove this variable
var vidIndex = 1;
var tripNavContainer;
var availablePlayer;

// condition for mobile devices
var isMobile = false;
var jbPlayer;
var mPlayer;

var videoBox;
var vidIframe;

if(Modernizr.touch){
	isMobile = true;
}

function init(){
	$(".trip").each( function(){
		var container = this;
		TweenMax.to(container, aniTime, {css:{marginLeft:0}, ease:Circ.easeOut, onComplete: hideDrawers, onCompleteParams:[container]});
	})
}
function hideDrawers(container){
	TweenMax.to(container, aniTime, {delay: 2, css:{marginLeft:-origPos}, ease:Circ.easeOut});
}
if(!isMobile){
	init();
}

$('#sndControls').on("mouseenter", triggerMouseOver);
/*$('#sndControls').on("mouseenter", triggerMouseLeave);*/
$('#sndControls').on("click", soundState);
$(".trip").on("mouseenter", openBtn);
$(".trip").on("mouseleave", closeBtn);
$(".vid_controls").on("mouseenter", triggerMouseOver);
$(".vid_controls").on("mouseleave", triggerMouseLeave);
$("#vid_bottom_nav").on("mouseenter", triggerMouseOver);
$("#vid_bottom_nav").on("mouseleave", triggerMouseLeave);
$(".trip").on("click", "span", switchVids);
$(".trip").on("click", queVidPlaylist);

function soundState( evt ){
	console.log("checking into the sound state of the player: ", availablePlayer.isMuted());
	console.log("this is the player object that is being used: ", availablePlayer);
	if(availablePlayer.isMuted()){
		console.log("all is quiet...");
		availablePlayer.unMute();
		$(evt.target).removeClass("off").addClass("on");
	} else {
		console.log("the voices are back");
		availablePlayer.mute();
		$(evt.target).removeClass("on").addClass("off");
	}
}

function setControls(){
	var textWidth = 0;
	var bgndImgmargin = parseInt($(".trip1").css("background-position-y"));
	$(".trip").each( function(){
		var tw = $(this).find("div").width();
		if( tw > textWidth ){
			textWidth = tw;
		}
	});
	var drawerBgndImageWidth = $(".trip").height();
	var drawerW = textWidth+drawerBgndImageWidth+vidDrawerPaddingL;
	var bgndImgPos = textWidth+vidDrawerPaddingL;
	origPos = textWidth+vidDrawerPaddingL;
	$(".trip").each( function(){
		$(this).css({
			'width': drawerW+"px",
			'margin-left': -origPos+"px",
			'background-position-x': bgndImgPos+bgndImgmargin+"px"
		});
	});

}
setControls();

function switchVids( evt ){
	evt.stopPropagation();
	evt.preventDefault();
	var playlist = availablePlayer.getPlaylist();
	console.log("this is the playlist: ", playlist);
	var playlistLength = availablePlayer.getPlaylist().length;
	var individualVid = availablePlayer.getVideoData().video_id;
	console.log("this is the individual vid being played: ", individualVid);
	var count = playlist.indexOf(availablePlayer.getVideoData().video_id);
	console.log("the current video id index before switch: ", count);

	switch($(evt.target).attr("class")){
		case "nextVid":
			count++;
			if(count < playlistLength){
				vidIndex = count + 1;
				console.log("this is the new vid Index: ", count);
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
	console.log("this is the vidIndex: ", vidIndex);
	tripNavContainer = $(this).closest('li');
	updatePlayDisplay();
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
				console.log("all menues should be visible now: ");
				TweenMax.to($('ul'), aniTime, {css:{alpha: 1}, ease:Circ.easeOut});
				TweenMax.to($('#sndControls'), aniTime, {css:{alpha: 1}, ease:Circ.easeOut});
	    })
	).on("mousemove", $.debounce( 
		250, 
		false, 
		function(e){
			setTimeout( function(){
				if(!mouseOver){
					console.log("fading out the menue now...");
					TweenMax.to($('ul'), aniTime, {css:{alpha: opHide}, ease:Circ.easeOut});
					TweenMax.to($('#sndControls'), aniTime, {css:{alpha: opHide}, ease:Circ.easeOut});
				};
			}, 2000);
	    })
	);
}
function hideNav(){
	console.log("mouse is moving lots");
	TweenMax.to($('ul'), aniNav, {css:{alpha: 1}, ease:Circ.easeOut, onComplete: hideNav});
	TweenMax.to($('#sndControls'), aniTime, {css:{alpha: 1}, ease:Circ.easeOut});				
	// set interval to trigger hide nav
	setTimeout(function(){alert("Hello")}, 3000);
}
function toggleBranding(){
		TweenMax.to($(".main_logo"), aniTime, {css:{alpha: 0}, ease:Circ.easeOut});
}
function queVidPlaylist( evt ){
	evt.stopPropagation();
	evt.preventDefault();
	navVis = false;
	toggleNav();
	toggleBranding();

	var vidList = $(this).attr("data-trip");
	var isPlaying = $(this).attr("data-state");

	if(isMobile){
		availablePlayer.cuePlaylist({
			listType: "list",
			list: vidList
		});
	} else {
		if(isPlaying == "false"){
			if(currentlyPlaying){
				resetVids(currentlyPlaying);
			}
			$(".trip").each( function(){ $(this).attr("data-state", "false"); });
			availablePlayer.loadPlaylist({
				list: vidList,
				listType:"playlist"
			});
			$(this).attr("data-state", "play");
			$(this).addClass("trip_pause");
			currentlyPlaying = [ $(".trip").index($(this)), $(this).find("div").html() ];
			tripNavContainer = this;
			updatePlayDisplay();
		} else {
			stateSwitch( this );
		}
	}
}
function updatePlayDisplay(){
	var playlist = availablePlayer.getPlaylist();
	if(playlist) {
		var cVid = availablePlayer.getVideoData();
		for(var i = 0; i< playlist.length; i++){
			if(playlist[i] == cVid.video_id){
				vidIndex = i+1;
			}
		}
		$(tripNavContainer).find("div").html("now playing<br><span class='prevVid'>prev</span> "+vidIndex+"/"+playlist.length+" <span class='nextVid'>next</span>");}
}

function resetVids(oldVid){
	var video = $(".trip").get(oldVid[0]);
	$(video).removeClass("trip_pause");
	$(video).html("<div>"+oldVid[1]+"</div>");
}
function stateSwitch( tripContainer ){
	// reset all the trip playlists
	if($(tripContainer).attr("data-state") != "false"){
		switch($(tripContainer).attr("data-state")){
			case "play":
				availablePlayer.pauseVideo();
				$(tripContainer).attr("data-state", "pause");
				$(tripContainer).removeClass("trip_pause");
				break;
			case "pause":
				availablePlayer.playVideo();
				$(tripContainer).attr("data-state", "play");
				$(tripContainer).addClass("trip_pause");
				break;
		}
	}
}
$('.video_container').tubular({
	videoId: 'PhSanuvCrOA',
	mute: true
});

function on_resize(c, t) {
    onresize = function() {
      clearTimeout(t);
      t = setTimeout(c, 100)
    };
    return c
  };
function setReady(){
	/*if(isMobile){
		console.log("we should be here because it is a mobile unit...");
		var mobVidCont = document.createElement("div");
		mobVidCont.className = "mobVidCont";
		videoBox = document.createElement("div");
	    vidIframe = document.createElement("div");
	    videoBox.id="jbPlayer";
	    videoBox.className = "mobile_video";
	    document.body.appendChild(mobVidCont);
	    mobVidCont.appendChild(videoBox);
	    videoBox.appendChild(vidIframe);
	    setMobilePlayer('kXDiGtgPL6E');
	} else {
		window.player.addEventListener("onStateChange", function(evt){
			if(evt.data === 1){
				updatePlayDisplay();
			}
		});

		availablePlayer = window.player;
	}*/

	/* remove this once everything is styled */
	console.log("mobile player temporarily overwritten for testing");
		var mobVidCont = document.createElement("div");
		mobVidCont.className = "mobVidCont";
		videoBox = document.createElement("div");
	    vidIframe = document.createElement("div");
	    videoBox.id="jbPlayer";
	    videoBox.className = "mobile_video";
	    document.body.appendChild(mobVidCont);
	    mobVidCont.appendChild(videoBox);
	    videoBox.appendChild(vidIframe);
	    setMobilePlayer('kXDiGtgPL6E');

}
$(window).on("resize", 
	$.debounce( 
		250, 
		false, 
		function(e){
			setControls();
    })
);
function setMobilePlayer(vList){
	mPlayer = new YT.Player(vidIframe, {
        videoId: vList,
        playerVars: {
            controls: 1,
            autohide: 0,
            autoplay: 1,
            enablejsapi: 1
        },
        height: '200',
        width: '320',
        events: {
            'onReady': testPlayerReady,
            'onStateChange': testPlayerStateChange
		}	
	});
	availablePlayer = mPlayer;
	console.log("the youtube API player was made, not shown on screen.");
	console.log("the data inside the player is: ", availablePlayer);
	
}
function makeResponsive(vidPlayer){
	console.log(vidPlayer.a);
	vidRatio = (vidPlayer.a.height/vidPlayer.a.width)*100;
	console.log("this is the vid ratio: ", vidRatio);

}
function testPlayerReady( evt ){
	availablePlayer.mute();
	console.log("the jbPlayer is ready: ", evt.target);
	console.log("looking for the mobile video player object: ", availablePlayer.getVideoData());
	// availablePlayer.playVideo();
	makeResponsive(evt.target);
}
function testPlayerStateChange( evt ){
	// getting the mobile player to show in fullscreen mode...
	var elm = document.getElementById("jbPlayer");
	console.log("the state has changed on jbPlayer: ", evt.target);
	console.log("this is the new event: ", evt.data);
	if(evt.data == 1){
		if(elm.requestFullscreen){
			elm.requestFullscreen();
		} else if(elm.msRequestFullscreen){
			elm.msRequestFullscreen();
		} else if(elm.mozRequestFullScreen){
			elm.mozRequestFullScreen();
		} else if(elm.webkitRequestFullscreen){
			elm.webkitRequestFullscreen();
		}
	}
	/*if(evt.data == 1 || evt.data == 2){
		console.log("the player has automatically started");
		availablePlayer.playVideo();
	}*/
}
