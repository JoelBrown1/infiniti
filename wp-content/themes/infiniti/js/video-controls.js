var $ = jQuery;

var aniTime = .25;
var aniNav = 1.5;
var origPos;
var vidDrawerPaddingL = parseInt($(".vid_container").css("padding-left"))*2;
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
	$('body').addClass("mobile");
}

function init(){
	if(!isMobile){
		$(".trip").each( function(){
			var container = this;
			TweenMax.to(container, aniTime, {css:{marginLeft:0}, ease:Circ.easeOut, onComplete: hideDrawers, onCompleteParams:[container]});
		});
	}

	$('#sndControls').on("mouseenter", triggerMouseOver);
	$('#sndControls').on("click", soundState);
	if(!isMobile){
		$(".trip").on("mouseenter", openBtn);
		$(".trip").on("mouseleave", closeBtn);	
		$(".vid_controls").on("mouseenter", triggerMouseOver);
		$(".vid_controls").on("mouseleave", triggerMouseLeave);
		$("#vid_bottom_nav").on("mouseenter", triggerMouseOver);
		$("#vid_bottom_nav").on("mouseleave", triggerMouseLeave);
	}

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

function setControls(){
	var textWidth = 0;
	var bgndImgmargin = parseInt($(".vid_container").css("background-position-y"));
	var requiredPadding = parseInt($(".vid_container").css("padding-left"));
	// $(".trip").each( function(){
	$(".vid_container").each( function(){
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
		$(this).find(".vid_container").css({
			'width': drawerW+"px",
			'background-position-x': bgndImgPos+bgndImgmargin+requiredPadding+"px"
		});
	});

	init();
}
setControls();

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
	evt.stopPropagation();
	evt.preventDefault();
	navVis = false;
	if(!isMobile){
		toggleNav();
		toggleBranding();		
	}

	var vidList = $(this).attr("data-trip");
	var isPlaying = $(this).attr("data-state");

	
	if(isPlaying == "false"){
		
		availablePlayer.loadPlaylist({
			list: vidList,
			listType:"playlist"
		});

		if(currentlyPlaying){
			console.log("this is curretnlyPlaying: ", currentlyPlaying);
			resetVids(currentlyPlaying);
		}
		$(".vid_container").each( function(){ $(this).attr("data-state", "false"); });
		
		$(this).attr("data-state", "play");
		$(this).find(".vid_container").addClass("trip_pause");
		currentlyPlaying = [ $(".trip").index($(this)), $(this).find("div").html() ];
		tripNavContainer = this;
	} else {
		stateSwitch( this );
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
		$(tripNavContainer).find("div").html("now playing<br><span class='prevVid'>prev</span> "+vidIndex+"/"+playlist.length+" <span class='nextVid'>next</span>");
	}
}

function resetVids(oldVid){
	var video = $(".vid_container").get(oldVid[0]);
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
				$(tripContainer).find(".vid_container").removeClass("trip_pause");
				break;
			case "pause":
				availablePlayer.playVideo();
				$(tripContainer).attr("data-state", "play");
				$(tripContainer).find(".vid_container").addClass("trip_pause");
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
	if(isMobile){
		var mobVidCont = document.createElement("div");
		mobVidCont.className = "mobVidCont";
		videoBox = document.createElement("div");
	    vidIframe = document.createElement("div");
	    videoBox.id="jbPlayer";
	    videoBox.className = "mobile_video";
	    document.body.appendChild(mobVidCont);
	    mobVidCont.appendChild(videoBox);
	    videoBox.appendChild(vidIframe);
	    setMobilePlayer('IqaSSmx2o38');
	} else {
		window.player.addEventListener("onStateChange", function(evt){
			if(evt.data === 1){
				updatePlayDisplay();
			}
		});

		availablePlayer = window.player;
	}
}

function setMobilePlayer(vList){
	mPlayer = new YT.Player(vidIframe, {
        videoId: vList,
        /*playerVars: {
            controls: 0,
            autohide: 0,
            autoplay: 1,
            enablejsapi: 1
        },*/
        height: '480',
        width: '270',
        events: {
            'onReady': testPlayerReady,
            'onStateChange': testPlayerStateChange
		}	
	});
	availablePlayer = mPlayer;
}
function testPlayerReady( evt ){
}
function testPlayerStateChange( evt ){
	switch( evt.data ){
		case 1:
			updatePlayDisplay();
			break;

/*		case 3:
			console.log("trying to get the player to give the play icon");
			console.log("this is the available player: ", availablePlayer);
			availablePlayer.playVideo();
			break;*/
	}
}
