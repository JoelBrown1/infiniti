// **** PAGE 33331 START **** 

crmBuildInfo(1,1412093210955);
// Tag for GENERICTAGGING
if(typeof(jQuery)!="undefined") {jQuery.extend(genTag,{"siteSection":"Microsite"});
jQuery.extend(genTag,{"pageName":"Canada_Undiscovered"});
}
function crmEvent106() { coreEvent106.apply(null, crmMarshallEventParams(crmEvent106, coreEvent106) ); }
function coreEvent106(social) {
try {
crmDebug(coreEvent106);

// Tag for OMNITURE
omnFlushObj();
s.channel="Canada_Undiscovered_Micro";
s.prop10="Canada_Undiscovered_Micro_Contest_Entry_" + social + "_Click";
s.prop13="Microsite";
s.prop14="Canada_Undiscovered.Contest_Entry";
s.prop15="Canada_Undiscovered.Contest_Entry." + social + "_Click";
s.prop16="Canada_Undiscovered.Contest_Entry." + social + "_Click";
s.prop18="HTML";
s.prop19="Microsite";
s.prop24="Canada_Undiscovered_Micro";
s.prop28=crmGetVID();
s.prop30="30288";
s.prop31="English";
s.prop48="Microsite_Contest_Entry";
s.prop49=(crmGetCookie(crmZipCode) != null);
s.hier2="Generic_(No_Specific_Model).Microsite.Canada_Undiscovered.Contest_Entry." + social + "_Click";
s.hier3="Microsite.Canada_Undiscovered.Contest_Entry." + social + "_Click.Generic_(No_Specific_Model)";
eventArray = [];
s.events=eventArray.join(',');
s.pageName="Canada_Undiscovered_Micro_Contest_Entry_" + social + "_Click";
pingOmn();

} catch (err) { crmDebug('crmEvent106 Failed: \n\n' + err);}
}

function crmEvent180() { coreEvent180.apply(null, crmMarshallEventParams(crmEvent180, coreEvent180) ); }
function coreEvent180() {
try {
crmDebug(coreEvent180);

// Tag for OMNITURE
omnFlushObj();
s.channel="Canada_Undiscovered_Micro";
s.prop10="Canada_Undiscovered_Micro_Contest_Entry_Form";
s.prop13="Microsite";
s.prop14="Canada_Undiscovered.Contest_Entry";
s.prop15="Canada_Undiscovered.Contest_Entry.Form";
s.prop16="Canada_Undiscovered.Contest_Entry.Form";
s.prop18="HTML";
s.prop19="Microsite";
s.prop24="Canada_Undiscovered_Micro";
s.prop28=crmGetVID();
s.prop30="30284";
s.prop31="English";
s.prop35="Canada_Undiscovered_Micro_Contest_Entry_Form.";
s.prop48="Microsite_Contest_Entry";
s.prop49=(crmGetCookie(crmZipCode) != null);
s.eVar34="Canada_Undiscovered_Micro_Contest_Entry";
s.hier2="Generic_(No_Specific_Model).Microsite.Canada_Undiscovered.Contest_Entry.Form";
s.hier3="Microsite.Canada_Undiscovered.Contest_Entry.Form.Generic_(No_Specific_Model)";
eventArray = [];
eventArray.push("scAdd");
s.events=eventArray.join(',');
s.pageName="Canada_Undiscovered_Micro_Contest_Entry_Form";
pingOmn();

} catch (err) { crmDebug('crmEvent180 Failed: \n\n' + err);}
}

function crmEvent181() { coreEvent181.apply(null, crmMarshallEventParams(crmEvent181, coreEvent181) ); }
function coreEvent181(formError) {
try {
crmDebug(coreEvent181);

// Tag for OMNITURE
omnFlushObj();
s.channel="Canada_Undiscovered_Micro";
s.prop10="Canada_Undiscovered_Micro_Contest_Entry_Error";
s.prop13="Microsite";
s.prop14="Canada_Undiscovered.Contest_Entry";
s.prop15="Canada_Undiscovered.Contest_Entry.Error";
s.prop16="Canada_Undiscovered.Contest_Entry.Error";
s.prop18="HTML";
s.prop19="Microsite";
s.prop24="Canada_Undiscovered_Micro";
s.prop28=crmGetVID();
s.prop30="30285";
s.prop31="English";
s.prop35="Canada_Undiscovered_Micro_Contest_Entry_Error." + formError;
s.prop48="Microsite_Contest_Entry";
s.prop49=(crmGetCookie(crmZipCode) != null);
s.eVar34="Canada_Undiscovered_Micro_Contest_Entry";
s.hier2="Generic_(No_Specific_Model).Microsite.Canada_Undiscovered.Contest_Entry.Error";
s.hier3="Microsite.Canada_Undiscovered.Contest_Entry.Error.Generic_(No_Specific_Model)";
eventArray = [];
eventArray.push("scRemove");
s.events=eventArray.join(',');
s.pageName="Canada_Undiscovered_Micro_Contest_Entry_Error";
pingOmn();

} catch (err) { crmDebug('crmEvent181 Failed: \n\n' + err);}
}

function crmEvent182() { coreEvent182.apply(null, crmMarshallEventParams(crmEvent182, coreEvent182) ); }
function coreEvent182(optin) {
try {
crmDebug(coreEvent182);

// Tag for OMNITURE
omnFlushObj();
s.channel="Canada_Undiscovered_Micro";
s.zip=crmGetZipCode();
s.prop10="Canada_Undiscovered_Micro_Contest_Entry_Confirm";
s.prop13="Microsite";
s.prop14="Canada_Undiscovered.Contest_Entry";
s.prop15="Canada_Undiscovered.Contest_Entry.Confirm";
s.prop16="Canada_Undiscovered.Contest_Entry.Confirm";
s.prop18="HTML";
s.prop19="Microsite";
s.prop24="Canada_Undiscovered_Micro";
s.prop28=crmGetVID();
s.prop29=crmGetSafeValue(crmGetCookie(crmLeadId), 'cookies_disabled');
s.prop30="30286";
s.prop31="English";
s.prop35="Canada_Undiscovered_Micro_Contest_Entry_Confirm.";
s.prop48="Microsite_Contest_Entry";
s.prop49=(crmGetCookie(crmZipCode) != null);
s.eVar20=crmGetZipCode();
s.eVar34="Canada_Undiscovered_Micro_Contest_Entry";
s.hier2="Generic_(No_Specific_Model).Microsite.Canada_Undiscovered.Contest_Entry.Confirm";
s.hier3="Microsite.Canada_Undiscovered.Contest_Entry.Confirm.Generic_(No_Specific_Model)";
eventArray = [];
if (optin) eventArray.push("event6");
eventArray.push("scCheckout");
s.events=eventArray.join(',');
s.pageName="Canada_Undiscovered_Micro_Contest_Entry_Confirm";
pingOmn();

} catch (err) { crmDebug('crmEvent182 Failed: \n\n' + err);}
}

// **** PAGE 33331 END ****
