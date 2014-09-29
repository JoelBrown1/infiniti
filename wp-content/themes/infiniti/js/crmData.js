function sendTagData(crmEvent, param1, param2){
	switch(crmEvent){
		case 1:
		// this is for page load
			try {
				crmEvent1();
			} catch(e){}
			break;

		case 38:
		// viewed image in gallery
			try {
				crmEvent38({
						'num' : param2
					});
			} catch(e){}
			break;

		case 101:
		// video start - called 1 second after video has started to throw a single event
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
					'social': param1
				});
			} catch(e){}
			break;

		case 180:
		// form submitted
			try {
				crmEvent180();
			} catch(e){}
			break;

		case 181:
		// form error
			try {
				crmEvent181();
			} catch(e){}
			break;

		case 182:
		// form confirmed
			try {
				crmEvent182();
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