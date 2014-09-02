var socialVis = false;
var $ = jQuery;
var socialOrigPos = parseInt($("#social_connections").css("bottom"));

var aniTime = .3;

$("#social_connections").on("click", doSocial);

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