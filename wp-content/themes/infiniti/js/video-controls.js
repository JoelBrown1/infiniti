var $ = jQuery;

var aniTime = .25;
var aniNav = 1.5;
var origPos;
var vidDrawerPaddingL = parseInt($(".trip").css("padding-left"))*2;
var navVis = true;
var mouseOver = false;
var currentlyPlaying;
var count = 0;
var opHide = .1;
// might remove this variable
var vidIndex = count+1;
var tripNavContainer;

console.log("looking at modernizr: ", Modernizr);
if(Modernizr.touch){
	console.log("touch events are supported");
} else {
	console.log("no touch events available");
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
init();

$(".trip").on("mouseenter", openBtn);
$(".trip").on("mouseleave", closeBtn);
$(".vid_controls").on("mouseenter", triggerMouseOver);
$(".vid_controls").on("mouseleave", triggerMouseLeave);
$("#vid_bottom_nav").on("mouseenter", triggerMouseOver);
$("#vid_bottom_nav").on("mouseleave", triggerMouseLeave);
$(".trip").on("click", "span", switchVids);
$(".trip").on("click", queVidPlaylist);

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
	var playlist = window.player.getPlaylist();
	var playlistLength = window.player.getPlaylist().length;
	console.log("this is the playlist: ", playlistLength);

	switch($(evt.target).attr("class")){
		case "nextVid":
			count++;
			if(count < playlistLength){
				vidIndex = count + 1;
				window.player.cueVideoById(playlist[count]);
				playNewVid();
			}
			break;

		case "prevVid":
			count--;
			if(count >= 0){
				vidIndex = count + 1;
				window.player.cueVideoById(playlist[count]);
				playNewVid();
			}
			break;
	}
	console.log("this is the vidIndex: ", vidIndex);
	tripNavContainer = $(this).closest('li');
	updatePlayDisplay();
}
function playNewVid(){
	window.player.playVideo();
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
	    })
	).on("mousemove", $.debounce( 
		250, 
		false, 
		function(e){
				if(!mouseOver){
					TweenMax.to($('ul'), aniTime, {css:{alpha: opHide}, ease:Circ.easeOut, delay: 1});				
				}
	    })
	);
}
function hideNav(){
	console.log("mouse is moving lots");
	TweenMax.to($('ul'), aniNav, {css:{alpha: 1}, ease:Circ.easeOut, onComplete: hideNav});
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
	if(isPlaying == "false"){
		if(currentlyPlaying){
			resetVids(currentlyPlaying);
		}
		$(".trip").each( function(){
			$(this).attr("data-state", "false");
		})
		window.player.loadPlaylist({
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
function updatePlayDisplay(){
	var playlist = window.player.getPlaylist();
	if(playlist) {
		var cVid = window.player.getVideoData();
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
				window.player.pauseVideo();
				$(tripContainer).attr("data-state", "pause");
				$(tripContainer).removeClass("trip_pause");
				break;
			case "pause":
				window.player.playVideo();
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
	window.player.addEventListener("onStateChange", function(evt){
		if(evt.data === 1){
			updatePlayDisplay();
		}
	})
}
$(window).on("resize", 
		$.debounce( 
			250, 
			false, 
			function(e){
				setControls();
	    })
	)
