// **** PAGE 33339 START **** 

crmBuildInfo(1,1410584482211);
function crmEvent106() { coreEvent106.apply(null, crmMarshallEventParams(crmEvent106, coreEvent106) ); }
function coreEvent106(social) {
try {
crmDebug(coreEvent106);

// Tag for OMNITURE
omnFlushObj();
s.channel="Canada_Undiscovered_Micro";
s.prop10="Canada_Undiscovered_Micro_Great_Bear_Rainforest_Behind_Scenes_" + social + "_Click";
s.prop13="Microsite";
s.prop14="Canada_Undiscovered.Great_Bear_Rainforest";
s.prop15="Canada_Undiscovered.Great_Bear_Rainforest.Behind_Scenes";
s.prop16="Canada_Undiscovered.Great_Bear_Rainforest.Behind_Scenes." + social + "_Click";
s.prop18="HTML";
s.prop19="Microsite";
s.prop24="Canada_Undiscovered_Micro";
s.prop28=crmGetVID();
s.prop30="30295";
s.prop31="French";
s.prop48="Microsite_Behind_Scenes";
s.prop49=(crmGetCookie(crmZipCode) != null);
s.hier2="Generic_(No_Specific_Model).Microsite.Canada_Undiscovered.Great_Bear_Rainforest.Behind_Scenes." + social + "_Click";
s.hier3="Microsite.Canada_Undiscovered.Great_Bear_Rainforest.Behind_Scenes." + social + "_Click.Generic_(No_Specific_Model)";
eventArray = [];
s.events=eventArray.join(',');
s.pageName="Canada_Undiscovered_Micro_Great_Bear_Rainforest_Behind_Scenes_" + social + "_Click";
pingOmn();

} catch (err) { crmDebug('crmEvent106 Failed: \n\n' + err);}
}

// **** PAGE 33339 END ****
