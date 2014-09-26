function sendTagData(crmEvent, param1, param2){
	switch(crmEvent){
		case 1:
		// this is for page load
		console.log("this is the page loaded crm event");
			try {
				crmEvent1();
			} catch(e){}
			break;

		case 38:
		// viewed image in gallery
		console.log("this is the image gallery event to work with");
			try {
				crmEvent38({
						'num' : param2
					});
			} catch(e){}
			break;

		case 101:
		// video start - called 1 second after video has started to throw a single event
		console.log("this is the start of video: ", param1, param2);
			try {
				crmEvent101({
					'name' : param1,
					'num' : param2,
				});
			} catch(e){}
			break;

		case 104:
		// video played 75%
			try {
				crmEvent104({
					'name' : param1,
					'num' : param2,
				});
			} catch(e){}
			break;

		case 105:
		// video ended
			try {
				crmEvent105({
					'name' : param1,
					'num' : param2,
				});
			} catch(e){}
			break;

		case 106:
		// for social sharing tracking
			try {
				crmEvent106({
					'name' : param1,
					'social': param2
				});
			} catch(e){}
			break;

		case 180:
		// form submitted
			try {
				crmEvent180({
					'name' : param1,
				});
			} catch(e){}
			break;

		case 181:
		// form error
			try {
				crmEvent181({
					'name' : param1,
				});
			} catch(e){}
			break;

		case 182:
		// form confirmed
		console.log("this is the form confirmed...");
			try {
				crmEvent182({
					'name' : param1,
				});
			} catch(e){}
			break;

		case 360:
		// 360 opened
			try {
				crmEvent360({
//					'name' : param1,
				});
			} catch(e){}
			break;

		case 362:
		// 360 was used
			try {
				crmEvent362({
// 					'name' : param1,
				});
			} catch(e){}
			break;

	}
}