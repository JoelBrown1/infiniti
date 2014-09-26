// $Id: engine.js 45610 2008-10-09 20:16:30Z thaxtonm $
// ####################### CONSTANTS & GLOBAL VARS #############################

// SR 15705
var crmZipCode = 'czc';			     // Cookie name for zipcode
// END OF SR 15705

var crmSupportedRegions = {ca: ['en', 'fr'], us: ['en', 'es']}; // available languages for each enabled country
var crmLeadId = 'crmLeadId';		// Cookie name for Lead Id
var crmReferralSite="Site";			// Cookie and query param name for referral site
var crmReferralArea="Area";			// Cookie and query param name for referral area
var crmReferralCreative="Creative";	// Cookie and query param name for referral creative
var crmDoubleClickCampain="dcc";	// query param name for the DoubleClick campaign value
var crmDoubleClickPlacement="dcp";	// query param name for the DoubleClick campaign value
var crmUnknownSite = "UnknownSite";	// query param value for no referral site
var crmUnknownArea = "UnknownArea";	// query param value for no referral area
var crmUnknownCreative = "UnknownCreative";	// query param value for no referral creative
var crmVidCookieName = 'visitorID';	// Cookie name for visitor id
var crmPageRegion = window.location.href.search(/infinitica|infiniti.ca/gi) > 0 ? 'ca' : 'us';
var crmPageLocale;					// pagelocale value from script tag attribute
var crmPageSite;					// pagesite value from script tag attribute
var crmPageId						// pageid value from the script tag attribute
///var crmDebugIsOn;					// crmdebug state from the query string
var crmDebugState=0;				// crmdebug state: 0=off, 1=alerts, 2=firebug with expanded function, 3=firebug with small function
var crmDebugCookie='crmDebugState';	// cookie name to track crmDebug state
var crmCondCallList=[];				// used to track conditional calls in the crmCondCall function
var crmUrl = location.pathname+location.search; // stores the the current page path + any querystring info
var crmJsURLPrefix;					// will store the full URL of engine.js (url up to, but not including the engine.js filename)
var crmTagBucketId="pageTags";		// id value of the div in which to place dynamic tags (ie images)
var crmCollageHost="collage.designory.com"	// Collage hostname/ip (used for preview trapping)
var crmCollageContribPage="as_contrib_edit.jsp" // Collage contribution page (used for preview trapping)
var crmOffer;						// Will contain an instance of CrmOfferClass on init
var crmCheckOfferFreq=250;			// frequency at which crmGetOffers checks the crmOffer obj (in ms)
var crmCheckOfferTimeOut=5000;		// how long to wait befor crmGetOffers gives up on crmOffer obj and shows defaults (in ms)
var crmPFALinkId='rtoPfaLink';		// id value for pfa link
var crmSMB1HeaderId='rtoSMB1Head';	// id value for smb1 link
var crmSMB1LinkId='rtoSMB1Link';	// id value for smb1 link
var crmSMB2LinkId='rtoSMB2Link';	// id value for smb2 link
var crmBuildNum;					// Will hold the build number for which the current page tag file was created
var crmBuildDate;					// Will hold the date (date object) for which the current page tag file was created
var crmClient;						// Will hold the object based on the CrmClientDetectClass
var genTag = {};					// Create generic tagging object

if (typeof crmAllowCreateVidCookie == 'undefined')
  var crmAllowCreateVidCookie = true;					// Gives external files the ability to prevent the VisitorID cookie from being created

// ############################### CLASSES #####################################

// ###	CRM Client Detect Class
//		Creates an object that holds client detail information
//		Properties:
//			.OS - Operating system name
//			.browser - Web Browser name
//			.version - Web Browser Version
function CrmClientDetectClass () {
	var detect = navigator.userAgent.toLowerCase();
	var thestring;
	this.OS;
	this.browser;
	this.version;

	if (checkIt('konqueror'))
	{
		this.browser = "Konqueror";
		this.OS = "Linux";
	}
	else if (checkIt('safari')) this.browser = "Safari"
	else if (checkIt('omniweb')) this.browser = "OmniWeb"
	else if (checkIt('opera')) this.browser = "Opera"
	else if (checkIt('webtv')) this.browser = "WebTV";
	else if (checkIt('icab')) this.browser = "iCab"
	else if (checkIt('msie')) this.browser = "Internet Explorer"
	else if (!checkIt('compatible'))
	{
		this.browser = "Netscape Navigator"
		this.version = detect.charAt(8);
	}
	else this.browser = "An unknown browser";

	if (!this.version) this.version = detect.charAt(place + thestring.length);

	if (!this.OS)
	{
		if (checkIt('linux')) this.OS = "Linux";
		else if (checkIt('x11')) this.OS = "Unix";
		else if (checkIt('mac')) this.OS = "Mac"
		else if (checkIt('win')) this.OS = "Windows"
		else this.OS = "an unknown operating system";
	}

	function checkIt(string)
	{
		place = detect.indexOf(string) + 1;
		thestring = string;
		return place;
	}
}

// ###	CRM Offer Class
//		Holds dynamic offer information which is returned from providers
function CrmOfferClass () {
	var pfaSwf='', pfaSwfDefault='', pfaImg='', pfaImgDefault='', pfaText='', pfaTextDefault='', pfaLink='', pfaLinkDefault='', isLoaded=false;

	this.getPfaSwf = function () { return pfaSwf; }
	this.getPfaSwfDefault = function () { return pfaSwfDefault; }
	this.getPfaImg = function () { return pfaImg; }
	this.getPfaImgDefault = function () { return pfaImgDefault; }
	this.getPfaText = function () { return pfaText; }
	this.getPfaTextDefault = function () { return pfaTextDefault; }
	this.getPfaLink = function () { return pfaLink; }
	this.getPfaLinkDefault = function () { return pfaLinkDefault; }
	this.getLoaded = function () { return isLoaded; }

	this.setPfaSwf = function (value) { pfaSwf = value; }
	this.setPfaSwfDefault = function (value) { pfaSwfDefault = value; }
	this.setPfaImg = function (value) { pfaImg = value; }
	this.setPfaImgDefault = function (value) { pfaImgDefault = value; }
	this.setPfaText = function (value) { pfaText = value; }
	this.setPfaTextDefault = function (value) { pfaTextDefault = value; }
	this.setPfaLink = function (value) { pfaLink = value; }
	this.setPfaLinkDefault = function (value) { pfaLinkDefault = value; }
	this.setLoaded = function (value) { isLoaded = value; }
}

// ###	CRM Site Class
//		Associates nissan or infiniti with provider specific strings
//		Example: var localEnvObj = new CrmEnvironmentClass({
//					nissan:		'NissanUSA_',
//					infiniti:	'Infiniti_'});
function CrmSiteClass ( locSiteObj ) {
	var siteLocalObj = locSiteObj;
	this.isNissan = (crmPageSite=='nissan') ? true : false;
	this.isInfiniti = !this.isNissan;
	this.getSite = function () {
		if (crmPageSite=='nissan') return siteLocalObj.nissan;
		if (crmPageSite=='infiniti') return siteLocalObj.infiniti;
		return null;
	}
	this.getSiteName = function () { return crmPageSite }
}

// ###	CRM Environment Class
//		Associates dev, qa, stage & prod with provider specific host and path names
//		Protocol should NOT be provided as it derived from the current page location
//		Example: var localEnvObj = new CrmEnvironmentClass({
//					dev:	  'some.dev.domain.com/path/to/file.html',
//					qa:		  'some.qa.domain.nna/path/to/file.html',
//					stage:	'some.stage.domain.com/path/to/file.html',
//					prod:	  'some.prod.domain.com/path/to/file.html'});
function CrmEnvironmentClass ( locEnvObj ) {
    var envHostName = location.hostname.toLowerCase();
	var envPort = location.port;
	var envLocalEnvObj = locEnvObj;
	var envProtocol = location.protocol + '//';
	this.getProtocol = function () { return envProtocol; }
	this.getEnv = function () {

		if (/(9080|8080|9000|9091|1160|92|209|210)/.test(envPort) || /(collage.|integ.|designory|localhost|author|publish|vangogh|criticalmass)/.test(envHostName)) return envLocalEnvObj.dev;
		if (/(www.qa|prod.)/.test(envHostName) || envPort == 9090) return envLocalEnvObj.qa;
		if (/(stage)/.test(envHostName))	return envLocalEnvObj.stage;
		if (/(.nissanusa.com|.infiniti.com|.nissan.ca|.infiniti.ca)/.test(envHostName)) return envLocalEnvObj.dev;  //TODO: set to envLocalEnvObj.prod when ready to go live
		return envLocalEnvObj.qa;
	}
}

// ###	CRM Language Local Class
//		Associates en (english) & es (spanish) with provider specific strings
//		Example: var locLocalObj = new CrmLocalClass ({
//					es:		'parameter_string_for_spanish',
//					en:		'parameter_string_for_english'});
function CrmLocaleClass ( localObj ) {
    var locLocalObj = localObj;
    this.getLocale = function () {
        if(crmPageLocale && locLocalObj[crmPageLocale] !== undefined) return locLocalObj[crmPageLocale];
        return null;
    }
}

// ########################## GENERAL FUNCTIONS ################################

// ###	Debugging alert box
function crmDebug ( msgObj ) {
	if( !crmDebugState ) return;
	if( ('console' in window) && crmDebugState>1 ) return crmDebugFirebug(msgObj);
	var buildInfo = "BUILD: Not specified in page tag file\n\n";
	if (typeof crmBuildDate != 'undefined')
		buildInfo = "BUILD: " + crmBuildNum + " (" + crmBuildDate.toLocaleString() + ")\n\n";
	var msgHeader = "___CRM DEBUG________________________________\n\n";
	if (typeof msgObj == 'function') { //assumes a crmEvent function object
		var funcName = "coreevent";
		var funcLine = msgObj.toString().substring(0,(msgObj.toString().indexOf('{')+1));
		var funcNameIndex = funcLine.toLowerCase().indexOf(funcName.toLowerCase());
		var funcOpenParensIndex = funcLine.indexOf('(');
		var funcCloseParensIndex = funcLine.indexOf(')');
		var eventID = funcLine.substring( (funcNameIndex + funcName.length),funcOpenParensIndex );
		var argsNameList = crmGetParamNames(msgObj);
		var argsDisplayText ='';
		for (n=0; n<argsNameList.length; n++)
			if (argsNameList[n].length > 0)
				argsDisplayText += (typeof msgObj.arguments[n] != 'undefined' ) ? argsNameList[n]+': '+msgObj.arguments[n]+'\n' : argsNameList[n]+': [no value passed in]\n';
		if ( !confirm( msgHeader + 'EVENT ID: ' + eventID + ' ................................. PAGE ID: '+crmPageId+'\n' + buildInfo + argsDisplayText ) )
			if( !confirm(msgHeader + msgObj,'Visitor ID: '+crmGetVID()) )
				prompt(msgHeader + 'Visitor ID:',crmGetVID());
	} else { // assumes a string
		if ( !confirm(msgHeader + msgObj) )
			prompt(msgHeader + 'Visitor ID:',crmGetVID());
	}
}
function crmDebugFirebug ( msgObj ) {
	if ( !crmDebugState ) return;

	var buildInfo="BUILD: "+((typeof crmBuildDate == 'undefined') ? "Not specified in page tag file" : "{0} ({1})".format(crmBuildNum,crmBuildDate.toLocaleString()));

	if (typeof msgObj == 'function') { //assumes a crmEvent function object
		var funcName = "coreEvent";
		var funcLine = msgObj.toString().substring(0,(msgObj.toString().indexOf('{')+1));
		var funcNameIndex = funcLine.toLowerCase().indexOf(funcName.toLowerCase());
		var funcOpenParensIndex = funcLine.indexOf('(');
		var funcCloseParensIndex = funcLine.indexOf(')');
		var eventID = funcLine.substring( (funcNameIndex + funcName.length),funcOpenParensIndex );
		var argsNameList = crmGetParamNames(msgObj);
		var argsDisplayText ='';

		console.group("CRM Page: "+crmPageId+"\tevent: "+eventID+"\t"+buildInfo)

		if(crmDebugState==3){ console.log(msgObj,"\t\t",'Visitor ID:\t' + crmGetVID()) }

		for (n=0; n<argsNameList.length; n++){
			if (argsNameList[n].length > 0){
				switch(typeof msgObj.arguments[n]){
					case 'undefined':	console.warn(argsNameList[n]+':\t[no value passed in]');break;
					case 'number':	console.info(argsNameList[n]+':\t%f',msgObj.arguments[n]);break;
					case 'string':	console.info(argsNameList[n]+':\t%a',msgObj.arguments[n]);break;
					default:	console.info(argsNameList[n]+':\t',msgObj.arguments[n]);
				}
			}
		}

		var myArgs=[];
		for(var i=0;i<argsNameList.length;i++){
			var mAi=msgObj.arguments[i];
			myArgs.push( (typeof mAi == 'string')?'"'+mAi+'"': mAi );
		}
		var myFuncCall="// {0}{1}({2})".format(funcName,eventID,myArgs.join(','));

		if(crmDebugState==2){
			setTimeout( function(){
				console.log(myFuncCall);
				var _fnc= String(msgObj).replace(/(s\.(\w+)) = (.+?);/g,function(){ //this will swap in computed values.
				        	var A=arguments;
				        	return ((/^"[^"]+"$/.test(A[3]))? A[0] : A[1]+' = "'+s[A[2]]+'"');//   // '+A[3]);
				    	});
				//console.log(_fnc);
				var _ss=['','','',''];//save the first 4 for some vals
				var _fl=_fnc.replace(/= /g,'=\t').split(/\n\s*/);

				for(var i=0;i<_fl.length;i++){
					if(/^s\.(pagename|prop10|channel|events)\b/i.test(_fl[i])){
						switch(RegExp.$1.toLowerCase()){
							case 'pagename'	: _ss[0]=_fl[i];break;
							case 'prop10'	: _ss[1]=_fl[i];break;
							case 'channel'	: _ss[2]=_fl[i];break;
							case 'events'	: _ss[3]=_fl[i];
						}
					}else if(/^(s\.\w+\b|olUpdateState|ping[^O])/.test(_fl[i])){
						_ss.push(_fl[i]);
					}
				}
				console.log(_ss.slice(0,4).join('\n'))
				console.log(_ss.slice(4).join('\n'))
				console.groupEnd();
			},5);
		}else{
			console.groupEnd();
		}

	} else { // assumes a string
		console.group("CRM\tPage: "+crmPageId+"\t"+buildInfo)
		console.info(msgObj);
		console.log('Visitor ID:\t'+crmGetVID());
		console.groupEnd();
	}
}


// ###	CRM cookie related functions
function crmSetCookie(name, value, expires, path, domain, secure) {
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  document.cookie = curCookie;
}
function crmGetCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}
function crmDeleteCookie(name, path, domain) {
  if (crmGetCookie(name)) {
    document.cookie = name + "=" +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}
function crmMakeExpDate(days, hours, minutes) {
    var expDate = new Date( );
    if (typeof days == "number" && typeof hours == "number" &&
        typeof hours == "number") {
        expDate.setDate(expDate.getDate( ) + parseInt(days));
        expDate.setHours(expDate.getHours( ) + parseInt(hours));
        expDate.setMinutes(expDate.getMinutes( ) + parseInt(minutes));
		return expDate;
    }
}
function crmGetZipCode(){
	var zipParam=s.getQueryParam('zipCode','');
	var zipCookie=crmGetCookie(crmZipCode);
	return (zipParam) ? zipParam : zipCookie;
}// END CRM Cookie functions

// ###	Returns the string value of the param from the search/query string (location.search)
//		Returns empty string if null if no value is found
function crmGetQueryParam(paramName) {
	var qString = location.search.substring(1);
	if (qString.indexOf(paramName) == -1) return '';
	var pValueStart = qString.indexOf(paramName) + paramName.length + 1;
	var pValueEnd = qString.indexOf('&', pValueStart);
	if ( pValueEnd==-1 ) pValueEnd = qString.length;
	return unescape( qString.substring( pValueStart,pValueEnd ) );
}

// ###	Returns an array of name/value params from the query string (location.search)
//		Array is bothed named and index based. So values can be pulled by:
//			queryArray['paramName']
//		and
//			queryArray[n].name, queryArray[n].value
function crmGetQueryStringArray () {
	var qArray = new Array();
	var qString = location.search.substring(1);
	var nameValues = qString.split('&');
	for (n=0; n<nameValues.length; n++) {
		nameValue = nameValues[n].split('=');
		qArray[ unescape(nameValue[0]) ] = unescape(nameValue[1]);
		qArray[n] = { name:unescape(nameValue[0]), value:unescape(nameValue[1])};
	}
	return qArray;
}

// ###	Dynamic HTML tag creation function
//		tagName:			type of tag to create
//		tagInsertPoint:		tag name to insert this tag inside of (ie html, head, body).
//							Will always insert new tag as the last item within the
//							Insert Point container. OR a tag element object can be
//							supplied (ie getElementById value can be passed in)
//		further arguments:	This function can be overloaded with further arguments.
//							They represent the attributes of the tag and should be
//							passed in as objects:
//							crmCreateTag( 'img', 'body', {attrName: 'attribute name',attrValue: 'attribute value'}, ... , ...);
function crmCreateTag ( tagName, tagInsertPoint ) {
	try {
		insertElm = (typeof tagInsertPoint == 'string') ? document.getElementsByTagName( tagInsertPoint ).item(0) : tagInsertPoint;
		attrObjs = crmCreateTag.arguments;
		newElm = document.createElement( tagName.toLowerCase() );
		for( n=2; n < attrObjs.length; n++ )
			newElm.setAttribute( attrObjs[n].attrName.toLowerCase(), attrObjs[n].attrValue );
		insertElm.appendChild( newElm );
		return true;
	} catch (err) {
		crmDebug('crmCreateTag failed with:\n\n' + err);
		return false;
	}
}

// ###	CRM Conditional Call
//		key:						A unique value that associates together all the calls to this function so that it can determine if its the first call or not
//		initialValue: 				The value to be returned on the first call
//		subsequentValue (optional): The value to be returned on all subsequent calls
//									Will return an empty string if no value is provided
function crmCondCall (key, initialValue, subsequentValue) {
	if(crmCondCallList[key]) {
		return (typeof subsequentValue=='undefined') ? '' : subsequentValue;
	} else {
		crmCondCallList[key]=true;
		return initialValue
	}
}

// ###	Generates new random visitorIDs
//		calls: crmSha1Hash
function crmMakeNewVID() {
	var seed = navigator.userAgent;
	if (typeof screenX != 'undefined')
		seed += (screenX/screenY).toString();
	else if (typeof screenLeft != 'undefined')
		seed += (screenLeft/screenTop).toString();
	if (typeof document.body.clientHeight != 'undefined')
		seed += (document.body.clientHeight/document.body.clientWidth).toString();
	seed += (new Date()).getTime().toString();
	seed += Math.random().toString();
	substrIndex = Math.floor(Math.random()*21);
	newVid = crmSha1Hash(seed).substr(substrIndex,20);
	finalVid = '';
	for (n=0; n<newVid.length; n++)
		finalVid += (Math.floor(Math.random()*2)) ? newVid.charAt(n).toUpperCase() : newVid.charAt(n);
	return finalVid;
}

function crmGetHostName() {
	var h;
	var arrHostName=document.location.hostname.split(".");
	if (arrHostName[arrHostName.length-1] == "com" || arrHostName[arrHostName.length-1] == "nna")
    h="."+arrHostName[arrHostName.length-2]+"."+arrHostName[arrHostName.length-1];
  else
		h=document.location.hostname;

  return h;
}

// ###	Gets new VID and sets cookie
//		uses: crmVidCookieName
//		calls: crmGetCookie, crmMakeNewVID, crmDeleteCookie, crmSetCookie, crmMakeExpDate
function crmGetVID() {
	var vid = crmGetCookie(crmVidCookieName);
	if (vid==null) vid = crmMakeNewVID();
	var hostName = crmGetHostName();
  if (crmAllowCreateVidCookie) {
  	crmDeleteCookie(crmVidCookieName,"/",hostName);
	  crmSetCookie( crmVidCookieName, vid, crmMakeExpDate(365,0,0), "/", hostName);
  }
	return vid;
}

// ###	Sets Referral Cookies (session) if they are found in the query string
function crmSetReferralCookies () {
	var hostName = crmGetHostName();
	var queryList = crmGetQueryStringArray();
  var site="";
  var area="";
  var creative="";
  var dcc="";
  var dcp="";
  var cmp="";

  for(n=0; n<queryList.length; n++) {
		if ( queryList[n].name.toLowerCase() == crmReferralSite.toLowerCase() ) {
      site=queryList[n].value;
    } else if ( queryList[n].name.toLowerCase() == crmReferralArea.toLowerCase() ) {
      area=queryList[n].value
    } else if ( queryList[n].name.toLowerCase() == crmReferralCreative.toLowerCase() ) {
      creative=queryList[n].value
    } else if ( queryList[n].name.toLowerCase() == crmDoubleClickCampain.toLowerCase() ) {
      dcc=queryList[n].value
    } else if ( queryList[n].name.toLowerCase() == crmDoubleClickPlacement.toLowerCase() ) {
      dcp=queryList[n].value
    } else if ( queryList[n].name.toLowerCase() == "cmp" ) {
      cmp=queryList[n].value
    }
	}

  if ( dcc!="" || dcp!="" ) {
        crmDeleteCookie(crmDoubleClickCampain, '/', hostName);
        crmDeleteCookie(crmDoubleClickPlacement, '/', hostName);
        crmDeleteCookie(crmReferralSite, '/', hostName);
        crmDeleteCookie(crmReferralArea, '/', hostName);
        crmDeleteCookie(crmReferralCreative, '/', hostName);

        crmSetCookie(crmDoubleClickCampain, dcc, crmMakeExpDate(7,0,0), '/', hostName);
        crmSetCookie(crmDoubleClickPlacement, dcp, crmMakeExpDate(7,0,0), '/', hostName);
  } else if ( site!="" || area!="" || creative!="" ) {
        crmDeleteCookie(crmDoubleClickCampain, '/', hostName);
        crmDeleteCookie(crmDoubleClickPlacement, '/', hostName);
        crmDeleteCookie(crmReferralSite, '/', hostName);
        crmDeleteCookie(crmReferralArea, '/', hostName);
        crmDeleteCookie(crmReferralCreative, '/', hostName);

        crmSetCookie(crmReferralSite, site + ";", crmMakeExpDate(7,0,0), '/', hostName);
        crmSetCookie(crmReferralArea, area + ";", crmMakeExpDate(7,0,0), '/', hostName);
        crmSetCookie(crmReferralCreative, creative, crmMakeExpDate(7,0,0), '/', hostName);
  } else if (cmp != "") {
        crmDeleteCookie(crmDoubleClickCampain, '/', hostName);
        crmDeleteCookie(crmDoubleClickPlacement, '/', hostName);
        crmDeleteCookie(crmReferralSite, '/', hostName);
        crmDeleteCookie(crmReferralArea, '/', hostName);
        crmDeleteCookie(crmReferralCreative, '/', hostName);

        crmSetCookie(crmReferralSite, cmp + ";;", crmMakeExpDate(7,0,0), '/', hostName);
  }
}

// ###	Checks query string and cookie info to see how crmDebugState should be set
function crmSetDebug() {
	if(/crmdebug=(on|[1-3])/i.test(location.search)){
		crmDebugState=(RegExp.$1=='on')? 1 : +RegExp.$1 ;
		crmDeleteCookie(crmDebugCookie,'/',location.hostname);
		crmSetCookie(crmDebugCookie,crmDebugState,'','/',location.hostname);
	}else if(/crmdebug=(off|0)/i.test(location.search)){
		crmDebugState=0;
		crmDeleteCookie(crmDebugCookie,'/',location.hostname);
	}else{
		crmDebugState=crmGetCookie(crmDebugCookie);
	}
}

// ###	Checks to see if the page is loaded in collage contribution
//		uses: crmCollageHost, crmCollageContribPage
function crmInContribMode() {
	if ( location.hostname.indexOf(crmCollageHost) != -1 && location.pathname.indexOf(crmCollageContribPage) != -1 )
		return true;
	return false;
}

// ###	Returns a named array of offer values. Will wait until crmOffer is loaded
//		and return the results. If crmOffer dosent return within a given amount
//		of time, function will timeout and return defaults
//		uses: crmOffer
function crmGetOffers(callBackFunc,callBackStartTime) {
	//if this is the first time called, time stamp this
	callBackStartTime = (typeof callBackStartTime == 'undefined') ? (new Date()).getTime() : callBackStartTime;

	//setup restults var in case we have results to return
	var result = [];

	// Check to see if offers have loaded
	if ( crmOffer.getLoaded() ) {
		//got offers back, return the values and fire the callback
		result['pfaSwf'] = crmOffer.getPfaSwf();
		result['pfaText'] = crmOffer.getPfaText();
		result['pfaImg'] = crmOffer.getPfaImg();
		result['pfaLink'] = crmOffer.getPfaLink();
		eval(callBackFunc+'(result)');
	} else {
		//check to see if we still have time to try again
		if ( ((new Date()).getTime() - callBackStartTime) < crmCheckOfferTimeOut ) {
			//still have time, try again
			setTimeout('crmGetOffers(\'' + callBackFunc + '\','+callBackStartTime+')',crmCheckOfferFreq);
		} else {
			//out of time, return default values and fire the callback;
			result['pfaSwf'] = crmOffer.getPfaSwfDefault();
			result['pfaText'] = crmOffer.getPfaTextDefault();
			result['pfaImg'] = crmOffer.getPfaImgDefault();
			result['pfaLink'] = crmOffer.getPfaLinkDefault();
			eval(callBackFunc+'(result)');
		}
	}
}

// ###	Updates an RTO link by changing the link url and swapping the img source
//		Optionally an image source for the rto header can be passed. If its passed
//		and the header id exists in the page, it will be swapped as well
//		Assumes the following HTML structure for links: <a href="" id='[linkId]'><img .../></a>
//		Assumes the following HTML structure for header: <div id="[crmSMB1HeaderId]"><img .../></div>
function crmUpdateRtoLink(linkId, linkUrl, imgSrc, imgHeadSrc) {
	var linkElm = $(linkId);
	if ( linkElm ) {
		linkElm.setAttribute('href',linkUrl,0);
		linkElm.getElementsByTagName('img').item(0).src = imgSrc;
	}
	if ( imgHeadSrc && $(crmSMB1HeaderId) )
		$(crmSMB1HeaderId).getElementsByTagName('img').item(0).src = imgHeadSrc;
}

// ###	Checks to see if the value is null, undefined or empty string. If any of
//		these are true, it returns the safe value. Otherwise passes the value
//		back.
function crmGetSafeValue(initValue, safeValue) {
	if (typeof initValue == 'undefined' || initValue == null || initValue == '')
		return safeValue;
	return initValue;
}

// ###	Sets the the global vars crmBuildNum and crmBuildDate with provided values
function crmBuildInfo (buildNum, buildTime) {
	crmBuildNum = buildNum;
	crmBuildDate = new Date(buildTime);
}

// ###	Aggregates parameter values in the order required for the core event fucntion and returns them in an array
// 		Determines if call is orderless or not and handles each case accordingly
function crmMarshallEventParams (evtFunc, coreFunc) {
	var args = evtFunc.arguments;
	var finalParams = [];
	if (typeof args[0] == 'object') { // assume orderless
		var paramsObj = args[0];
		var paramNames = crmGetParamNames(coreFunc);
		for(var n=0; n<paramNames.length; n++){
			if(typeof paramsObj[ paramNames[n] ] == 'string'){
				finalParams[n] = crmConvertParam(paramsObj[ paramNames[n] ]);
			}else{
				finalParams[n] = paramsObj[ paramNames[n] ];
			}
		}
	} else { // assume ordered
		for(var n=0; n<args.length; n++)
			if(typeof args[n] == 'string'){
				finalParams[n] = crmConvertParam(args[n]);
			}else{
				finalParams[n] = args[n];
			}
	}
	return finalParams;
}

// ###	Converts all space characters to underscores
//      This is used to make our parameters with spaces match BI's style
//      It also cleans up some of the various Z parameters to match BI's expectations
function crmConvertParam (str) {
	if (str.toLowerCase() == "z&#174;" || str.toLowerCase() == "z&reg;" || str.toLowerCase() == "z coupe" || str.toLowerCase() == "z roadster") {
		str = "350Z"
	}
	return str.replace(/ /g,"_");
}


// ###	Returns an array of function parameters names associated to their argument position
//		Array is both indexed (returning arg name by position) and named (returning arg position by name)
function crmGetParamNames (func) {
	var funcStr = func.toString();
	var paramsStart = funcStr.indexOf('(')+1;
	var paramsEnd = funcStr.lastIndexOf(')',funcStr.indexOf('{'));
	var params = funcStr.substring(paramsStart,paramsEnd).replace(/\s/g,'').split(',');
	for (var index in params)
		params[ params[index] ] = index;
	return params;
}

// ###	SHA1 hashing functions
function crmSha1Hash(msg) {
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    msg += String.fromCharCode(0x80);
    var l = Math.ceil(msg.length/4) + 2;
    var N = Math.ceil(l/16);
    var M = new Array(N);
    for (var i=0; i<N; i++) {
        M[i] = new Array(16);
        for (var j=0; j<16; j++) {
            M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
                      (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
        }
    }
    M[N-1][14] = ((msg.length-1) >>> 30) * 8;
    M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;
    var H0 = 0x67452301;
    var H1 = 0xefcdab89;
    var H2 = 0x98badcfe;
    var H3 = 0x10325476;
    var H4 = 0xc3d2e1f0;
    var W = new Array(80); var a, b, c, d, e;
    for (var i=0; i<N; i++) {
        for (var t=0;  t<16; t++) W[t] = M[i][t];
        for (var t=16; t<80; t++) W[t] = ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);
        a = H0; b = H1; c = H2; d = H3; e = H4;
        for (var t=0; t<80; t++) {
            var s = Math.floor(t/20);
            var T = (ROTL(a,5) + f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
            e = d;
            d = c;
            c = ROTL(b, 30);
            b = a;
            a = T;
        }
        H0 = (H0+a) & 0xffffffff;
        H1 = (H1+b) & 0xffffffff;
        H2 = (H2+c) & 0xffffffff;
        H3 = (H3+d) & 0xffffffff;
        H4 = (H4+e) & 0xffffffff;
    }
    return H0.toHexStr() + H1.toHexStr() + H2.toHexStr() + H3.toHexStr() + H4.toHexStr();
}
function f(s, x, y, z) {
    switch (s) {
    case 0: return (x & y) ^ (~x & z);
    case 1: return x ^ y ^ z;
    case 2: return (x & y) ^ (x & z) ^ (y & z);
    case 3: return x ^ y ^ z;
    }
}
function ROTL(x, n) {
    return (x<<n) | (x>>>(32-n));
}
Number.prototype.toHexStr = function() {
    var s="", v;
    for (var i=7; i>=0; i--) { v = (this>>>(i*4)) & 0xf; s += v.toString(16); }
    return s;
}// END SHA1

// Extending String prototype to include format functionality similar to printf
if(typeof String.prototype.format != 'function'){
    String.prototype.format=function(){
        var ar=arguments;
        return this.replace(/\{\d+\}/g,function(w){return ar[+w.replace(/[}{]/g,'')]});
    }
}

var iusaShowDebug = (/crmdebug=(on|[1-3])/i.test(location.search));

// load cookies
var localVisitorID = crmGetCookie(crmVidCookieName);
if(localVisitorID==null) {
  if(iusaShowDebug)
    alert('Local visitorID is null... attempting to read cookies from INTEG.');
  document.write('<scr'+'ipt src="http://www.infiniti.com/iapps/retailerlocator/cookieLayout" language="JavaScript" type="text/javascript"></scr'+'ipt>\n');
} else if(iusaShowDebug) {
  alert('Local visitorID = ' + localVisitorID + '.\n\nAlready have cookies... not reading in cookies from INTEG environment.');
}

if(typeof(secureNonSecurePath)=="undefined")
	var secureNonSecurePath = '';

// kick off propagateCookies() and InitializeCRMEngine() after cookies have been propagated
//changed this for testing
document.write('<scr'+'ipt src="/infinitihtml/js/crm/propagateCookies.js" language="JavaScript" type="text/javascript"></scr'+'ipt>\n');

// propagate cookies
function propagateCookies() {
  var cookieName = '';
  var cookieValue = '';
  var outputText = '';
  var bCookiesExist = false;

  if(typeof(cookieLayout)!='undefined') {
    for(var whichCookie in cookieLayout){
      bCookiesExist = true;
      //alert(cookieLayout[whichCookie][0].name + ' = ' + cookieLayout[whichCookie][0].value);
      if(typeof(cookieLayout[whichCookie][0]) != 'undefined') {
        cookieName = cookieLayout[whichCookie][0].name;
        cookieValue = cookieLayout[whichCookie][0].value;

        // write missing cookies
        if(crmGetCookie(cookieName) == null) {
          outputText += "\nWriting Missing Cookie '" + cookieName + "' = " + cookieValue;
      	  crmSetCookie(cookieName, cookieValue, crmMakeExpDate(365,0,0), "/");
        } else {
          outputText += "\nCookie already exists: '" + cookieName + "' = " + cookieValue;
        }
      }
    }
  }

  if(!bCookiesExist)
    outputText += "\nThere are no cookies to propagate.";

  if(iusaShowDebug)
    alert(outputText);
}

// this will be called AFTER propagateCookies() has executed
function InitializeCRMEngine() {
  if(iusaShowDebug)
    alert('InitializeCRMEngine()');

  // ############################## INITIALIZE ###################################
  var validCrmPageRegion = false;
	if($('crmEngine').getAttribute('pagelocale')) {
		for(var i=0;i<crmSupportedRegions[crmPageRegion].length;i++) {
			if(crmSupportedRegions[crmPageRegion][i] == $('crmEngine').getAttribute('pagelocale')) {
				validCrmPageRegion = true;
				break;
			}
		}
	}

  // ###	Validate script tag attributes. Check that the crmEngine
  if	(	$('crmEngine') &&									// ensure that the crmEngine ID exists
  		$('crmEngine').tagName.toLowerCase()=='script' && 	// ensure that crmEngine ID is assigned to a SCRIPT tag
  		$('crmEngine').getAttribute('pageid') &&			// ensures that the pageid attribute is set
  		($('crmEngine').getAttribute('pagelocale') && validCrmPageRegion) &&		// ensures that the pagelocal attribute is set
  		$('crmEngine').getAttribute('pagesite') &&			// ensures that the pagesite attribute is set
  		( $('crmEngine').getAttribute('pagesite')=='nissan' || $('crmEngine').getAttribute('pagesite')=='infiniti' )
  															// ensures that the pagesite attribute is set to either nissan or infiniti
  	) {

  	// Check crmDebug settings and set accordingly
  	crmSetDebug();

  	// Set global vars from tag attributes
  	crmPageLocale = $('crmEngine').getAttribute('pagelocale');	// en, es
  	crmPageSite = $('crmEngine').getAttribute('pagesite');		// nissan, infiniti
  	crmPageId = $('crmEngine').getAttribute('pageid');

  	// Setup base crmEvent# functions which will be redefined by tagging file
  	for (n = 1; n <=99; n++) eval('crmEvent'+n+'= function(){ crmDebug("Event '+n+' Failed.\\n\\nThere is either no crmEvent'+n+' function in the '+crmPageId+'.js tagging file, \\nor this tagging file failed to load."); }');

  	// verify that we are not loading in a collage contribution window
  	if ( !crmInContribMode() ) {
  		//Create our client detection object
  		crmClient = new CrmClientDetectClass();

  		//Create our offer object to hold real time offer info
  		crmOffer = new CrmOfferClass();

  		// Check for any referral params
  		crmSetReferralCookies();

  		// Determine URL prefix from current script
  		crmJsURLPrefix =  $('crmEngine').src.substring( 0,$('crmEngine').src.indexOf('/engine.js')+1 ); // the '/' in '/engine.js' seems to be required for collage preview to work

   		document.write('<scr'+'ipt src="' + crmJsURLPrefix +	'providers/omniture.js" language="JavaScript" type="text/javascript"></scr'+'ipt>\n');

  		// Include page specific tagging file ('page_tags\/' seems to be required for to make collage preview work)
  		var searchsection = location.href;
		
		searchsection.indexOf('http://search')== 0 ? document.write('<scr'+'ipt src="' + crmJsURLPrefix + 'tags/' + crmPageId + '.js" language="JavaScript" type="text/javascript"></scr'+'ipt>\n') : document.write('<scr'+'ipt src="' + crmJsURLPrefix + 'tags/' + crmPageId + '.js" language="JavaScript" type="text/javascript"></scr'+'ipt>\n');

  	} else { crmDebug('Loaded in Collage contribution window. Tagging has been disabled.'); }

  } else { // Create crmEngine failure debug message
  	crmErrorMsg = "crmEngine FAILED\n";
  	if ( !$('crmEngine') )
  		crmErrorMsg += '"crmEngine" ID not found';
  	else if ( $('crmEngine').tagName.toLowerCase() != 'script' )
  		crmErrorMsg += '"crmEngine" ID not assigned to SCRIPT tag';
  	else if ( !$('crmEngine').getAttribute('pageid') )
  		crmErrorMsg += '"pageid" attribute not found in the crmEngine SCRIPT tag';
  	else if ( !$('crmEngine').getAttribute('pagesite') )
  		crmErrorMsg += '"pagesite" attribute not found in the crmEngine SCRIPT tag';
  	else if ( $('crmEngine').getAttribute('pagesite')!='nissan' && $('crmEngine').getAttribute('pagesite')!='infiniti' )
  		crmErrorMsg += '"pagesite" attribute must be set to either "nissan" or "infiniti" in the crmEngine SCRIPT tag';
  	else if ( !$('crmEngine').getAttribute('pagelocale') )
  		crmErrorMsg += '"pagelocale" attribute not found in the crmEngine SCRIPT tag';
  	else if ( $('crmEngine').getAttribute('pagelocale')!='es' && $('crmEngine').getAttribute('pagelocale')!='en' && $('crmEngine').getAttribute('pagelocale')!='zh' )
  		crmErrorMsg += '"pagelocale" attribute must be set to either '+ crmSupportedRegions[crmPageRegion] +' in the crmEngine SCRIPT tag';
  	else
  		crmErrorMsg += 'unkown error with the CRM Engine script tag structure';
  	crmDebug(crmErrorMsg);
  }
}