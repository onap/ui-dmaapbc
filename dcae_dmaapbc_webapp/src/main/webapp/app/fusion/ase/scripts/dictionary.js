/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Contains dictionary (in form of arrays, implementing databases in the future) and functions to append new terms to them
var nodeTags = [
                 "Order Trigger System",
                 "MSO",
                 "SDN-C",
                 "A&AI",
                 "PO",
                 "Customer Request"
		];	
var arrowTags = [
				"SIP Invite",
				"Unauthorized 401",
				"SIP Invite with credentials",
				"Validates Invite, Different Tenant",
				"Invite",
				"3XX redirect to Transit function",
				"Route call",
				"Perform SMM Rules",
				"Convert IPv6 to IPv4",
				"proxy INVITE",
				"vAS validates Invite message",
				"100 TRYING",
				"200 OK",
				"ACK",
				"[Call completion] BYE [release media]",
				"200 OK [release media]",
				"SIP Register",
				"Inserts via header",
				"Removes via header",
				"SIP Register with credentials",
				"REGISTRATION was successful and Trinity UE-A is now registered with the vAS",
				"200 OK Registration successful",
				"Stores in cache - UE A IP & Registered vAS",
				"302+UE B contact",
				"CNAM query:SUBSCRIBE",
				"NOTIFY",
				"180 Ringing",
				"200",
				"ACK",
				"[Call completion] BYE [release media]",
				"200 OK [release media]",
				"VoLTE UE A iFC checked for originating processing. Determines SCC-AS processing needed first and then TAS",
				"Callback",
				"Query",
				"Trinity UE-B domain name (hcomm.openecomp.net)",
				"INVITE with R-URI telephone_nbr@hcomm.openecomp.net",
				"Call routed for hcomm.openecomp.net",
				"302 + UE B contact",
				"No Match",
				"Perform SMM rules & IP v6 to IPv4 conversion",
				"Perform Routing Function",
				"Query Response",
				"Map SIP headers to IAM",
				"Terminate Call",
				"Process call",
				"Standard Ringing Message",
				"ISUP ACM",
				"18X message – Ringing",
				"Answer",
				"ISUP ACM",
				"200 OK",
				"Dial E.164 Number",
				"Q.931 SETUP",
				"Diameter + Query",
				"CNAM info",
				"Diamater + response",
				"Perform SMM rules & IP v4 to IPv6 conversion",
				"Validates & executes terminating call processing",
				"3XX redirect to Transit function",
				"IPV6 to IPV4 conversion",
				"execute service logic",
				"determine route",
				"delete 9-digit RIC",
				"determine custom site",
				"18X ringing",
				"Media Path",
				"Dial POTS TN",
				"proxy INVITE",
				"proxy 401 Unauthorized",
				"401 Unauthorized",
				"3XX",
				"NXDOMAIN",
				"Emergency call defected",
				"Recognizes: Not an intra-AS call",
				"Identifies 911 call",
				"3XX redirect to Transit function",
				"PEI reconstructed conditionally",
				"Retrieve Caller Info",
				"Identifies PSAP and makes an entry in dALI",
				"PSAP queries ALI using the calling number",
				"Determine cller is CALEA surveillance subject",
				"replicate required",
				"include 2 repeaters",
				"INFO",
				"Receive RTP",
				"create T1.678",
				"send T1.678",
				"Origination Message",
				"create T1.678 MediaAndAddressReporting",
				"send T1.678",
				"Origination Message",
				"CNAM query:SUBSCRIBE",
				"NOTIFY",
				"80-Ringing/183-Progress",
				"create T1.678 / MediaAndAddressReporting",
				"send T1.678 / MediaAndAddressReporting",
				"CCOpen",
				"modify SDP",
				"BYE",
				"CCClose"
];
var noteTags = [
                "alpha",
                "bravo",
                "charlie",
                "delta",
                "echo",
                "fox",
                "golf",
                "hotel",
                "item",
                "jump",
                "kappa",
                "lion",
                "man"
];
var separatorTags = [
                "alpha",
                "bravo",
                "charlie",
                "delta",
                "echo",
                "fox",
                "golf",
                "hotel",
                "item",
                "jump",
                "kappa",
                "lion",
                "man"
];
var messageTags = [
                     "signal",
                     "media"

     ];

function pushToDict(innerText,type){
	if (type=="node" && nodeTags.indexOf(innerText) == -1){
		nodeTags.push(innerText);
	}
	else if (type=="arrow" && arrowTags.indexOf(innerText) == -1){
		arrowTags.push(innerText);
	}
	else if (type=="note" && noteTags.indexOf(innerText) == -1){
		noteTags.push(innerText);
	}
	else if (type=="separator" && separatorTags.indexOf(innerText) == -1){
		noteTags.push(innerText);
	}
}


var elementsYml = "elementsList:\n" +
"- {displayShortname: eNB, enclosingDomain: RAN, tosca_id: com.trinity.ran.enodeb}\n" +
"- {displayShortname: SIAD, enclosingDomain: RAN, tosca_id: com.trinity.ran.siad}\n" +
"- {displayShortname: NodeB, enclosingDomain: RAN, tosca_id: com.trinity.ran.nb}\n" +
"- {displayShortname: eMSC, enclosingDomain: RAN, tosca_id: com.trinity.ran.emsc}\n" +
"- {displayShortname: RNC, enclosingDomain: RAN, tosca_id: com.trinity.ran.rnc}\n" +
"- {displayShortname: MGW, enclosingDomain: RAN, tosca_id: com.trinity.ran.mgw}\n" +
"- {displayShortname: SS7 GPORT, enclosingDomain: RAN, tosca_id: com.trinity.ran.ss7_gport}\n" +
"- {displayShortname: MSN, enclosingDomain: RAN, tosca_id: com.trinity.ran.msn}\n" +
"- {displayShortname: E-SMLC, enclosingDomain: RAN, tosca_id: com.trinity.ran.e_smlc}\n" +
"- {displayShortname: SGSN-S4, enclosingDomain: EPC, tosca_id: com.trinity.epc.sgsn_s4}\n" +
"- {displayShortname: MME, enclosingDomain: EPC, tosca_id: com.trinity.epc.mme}\n" +
"- {displayShortname: P_LRF (RDF), enclosingDomain: EPC, tosca_id: com.trinity.epc.p_lrf}\n" +
"- {displayShortname: GMLC, enclosingDomain: EPC, tosca_id: com.trinity.epc.gmlc}\n" +
"- {displayShortname: PCEF, enclosingDomain: EPC, tosca_id: com.trinity.epc.pcef}\n" +
"- {displayShortname: SDG, enclosingDomain: EPC, tosca_id: com.trinity.epc.sdg}\n" +
"- {displayShortname: P-GW, enclosingDomain: EPC, tosca_id: com.trinity.epc.p_gw}\n" +
"- {displayShortname: S-GW, enclosingDomain: EPC, tosca_id: com.trinity.epc.s_gw}\n" +
"- {displayShortname: PAS, enclosingDomain: EPC, tosca_id: com.trinity.epc.pas}\n" +
"- {displayShortname: PCRF, enclosingDomain: EPC, tosca_id: com.trinity.epc.pcrf}\n" +
"- {displayShortname: MIND, enclosingDomain: EPC, tosca_id: com.trinity.epc.mind}\n" +
"- {displayShortname: APN DNS, enclosingDomain: EPC, tosca_id: com.trinity.epc.apn_dns}\n" +
"- {displayShortname: DRA EPC, enclosingDomain: EPC, tosca_id: com.trinity.epc.dra_epc}\n" +
"- {displayShortname: HSS EPC, enclosingDomain: EPC, tosca_id: com.trinity.epc.hss_epc}\n" +
"- {displayShortname: HLR, enclosingDomain: EPC, tosca_id: com.trinity.epc.hlr}\n" +
"- {displayShortname: CPM, enclosingDomain: EPC, tosca_id: com.trinity.epc.cpm}\n" +
"- {displayShortname: P-LRF/RDF, enclosingDomain: EPC, tosca_id: com.trinity.epc.p_lrf_sup}\n" +
"- {displayShortname: SBC, enclosingDomain: USP, tosca_id: com.trinity.usp.sbc}\n" +
"- {displayShortname: ATGW, enclosingDomain: USP, tosca_id: com.trinity.usp.atgw}\n" +
"- {displayShortname: IWF, enclosingDomain: USP, tosca_id: com.trinity.usp.iwf}\n" +
"- {displayShortname: ATCF, enclosingDomain: USP, tosca_id: com.trinity.usp.atcf}\n" +
"- {displayShortname: P-CSCF, enclosingDomain: USP, tosca_id: com.trinity.usp.p_cscf}\n" +
"- {displayShortname: Transcoder, enclosingDomain: USP, tosca_id: com.trinity.usp.transcoder}\n" +
"- {displayShortname: I-SBC, enclosingDomain: USP, tosca_id: com.trinity.usp.i_sbc}\n" +
"- {displayShortname: SCC-AS, enclosingDomain: USP, tosca_id: com.trinity.usp.scc_as}\n" +
"- {displayShortname: EATF, enclosingDomain: USP, tosca_id: com.trinity.usp.eatf}\n" +
"- {displayShortname: TAS, enclosingDomain: USP, tosca_id: com.trinity.usp.tas_cts}\n" +
"- {displayShortname: S-CSCF, enclosingDomain: USP, tosca_id: com.trinity.usp.s_cscf}\n" +
"- {displayShortname: E-CSCF (911), enclosingDomain: USP, tosca_id: com.trinity.usp.e_cscf}\n" +
"- {displayShortname: I-CSCF, enclosingDomain: USP, tosca_id: com.trinity.usp.i_cscf}\n" +
"- {displayShortname: TF / BGCF, enclosingDomain: USP, tosca_id: com.trinity.usp.tf_bgcf}\n" +
"- {displayShortname: MGC-8, enclosingDomain: USP, tosca_id: com.trinity.usp.mgc8}\n" +
"- {displayShortname: MRF, enclosingDomain: USP, tosca_id: com.trinity.usp.mrf}\n" +
"- {displayShortname: USP DNS, enclosingDomain: USP, tosca_id: com.trinity.usp.dns}\n" +
"- {displayShortname: DRA IMS, enclosingDomain: USP, tosca_id: com.trinity.usp.dra_ims}\n" +
"- {displayShortname: ENUM, enclosingDomain: USP, tosca_id: com.trinity.usp.enum}\n" +
"- {displayShortname: HSS IMS, enclosingDomain: USP, tosca_id: com.trinity.usp.hss_ims}\n" +
"- {displayShortname: CCF, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc1.ccf}\n" +
"- {displayShortname: BGF, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc1.bgf}\n" +
"- {displayShortname: vMS, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc1.ms}\n" +
"- {displayShortname: vNS, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc1.ns}\n" +
"- {displayShortname: vAS, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc1.as}\n" +
"- {displayShortname: vA-SBG, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc1.a_sbg}\n" +
"- {displayShortname: vDBE, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc1.dbe}\n" +
"- {displayShortname: vN-SBG, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc1.n_sbg}\n" +
"- {displayShortname: CCF, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc2.ccf}\n" +
"- {displayShortname: BGF, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc2.bgf}\n" +
"- {displayShortname: vMS, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc2.ms}\n" +
"- {displayShortname: vNS, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc2.ns}\n" +
"- {displayShortname: vAS, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc2.as}\n" +
"- {displayShortname: vA-SBG, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc2.a_sbg}\n" +
"- {displayShortname: vDBE, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc2.dbe}\n" +
"- {displayShortname: vN-SBG, enclosingDomain: 'Datacenter', tosca_id: com.trinity.dc2.n_sbg}\n" +
"- {displayShortname: PSX SIP, enclosingDomain: VNI, tosca_id: com.trinity.vni.sip_psx}\n" +
"- {displayShortname: PSX Policy, enclosingDomain: VNI, tosca_id: com.trinity.vni.policy_psx}\n" +
"- {displayShortname: IPBE, enclosingDomain: VNI, tosca_id: com.trinity.vni.ipbe}\n" +
"- {displayShortname: GSX, enclosingDomain: VNI, tosca_id: com.trinity.vni.gsx}\n" +
"- {displayShortname: BVoIP AS, enclosingDomain: VNI, tosca_id: com.trinity.vni.bvoip_as}\n" +
"- {displayShortname: NGBE, enclosingDomain: VNI, tosca_id: com.trinity.vni.ngbe}\n" +
"- {displayShortname: VoLTE UE, enclosingDomain: RAN, tosca_id: com.trinity.ue}\n" +
"- {displayShortname: 3G UE, enclosingDomain: RAN, tosca_id: com.trinity.ue}\n" +
"- {displayShortname: Trinity UE-A, enclosingDomain: 'Datacenter', tosca_id: com.trinity.ue}\n" +
"- {displayShortname: Trinity UE-B, enclosingDomain: 'Datacenter', tosca_id: com.trinity.ue}\n" +
"- {displayShortname: VNI UE, enclosingDomain: VNI, tosca_id: com.trinity.ue}\n" +
"- {displayShortname: PSTN, enclosingDomain: VNI, tosca_id: com.trinity.ue}\n";


var trinity_3g_jsonOld = "{" +
	"\"diagram\": {" +
	"\"created\": \"1453392975976\"," +
	"\"rows\": \"18\"," +
	"\"cols\": \"7\"," +
	"\"gridPitchy\": \"42\"," +
	"\"canvasHeight\": \"826\"," +
	"\"canvasWidth\": \"1149\"," +
	"\"encoding\": \"base64\"," +
	"\"elements\": {" +
	"\"nodes\": [" +
    "{" +
     "\"id\": \"32c3d197-3174-479b-07b1-073d07a0eea7\"," +
     "\"data_x\": \"250\"," +
     "\"data_y\": \"22\"," +
     "\"width\": \"100\"," +
     "\"innerText\": \"VUUz\"," +
     "\"bpmn\": \"\"," +
     "\"taska_id\": \"Y29tLmF0dC50cmluaXR5LnVlMw==\"," +
     "\"role\": \"\"" +
    "}," +
    "{" +
     "\"id\": \"204d7374-cd5b-9bdd-25bf-0dcaec3d9a73\"," +
     "\"data_x\": \"570\"," +
     "\"data_y\": \"22\"," +
     "\"width\": \"100\"," +
     "\"innerText\": \"VkEtU0JH\"," +
     "\"bpmn\": \"\"," +
     "\"taska_id\": \"Y29tLmF0dC50cmluaXR5LmFpYy5kYzEuYV9zYmc=\"," +
     "\"role\": \"\"" +
    "}," +
    "{" +
     "\"id\": \"61b531d6-a56c-ddb9-616d-f1524475fe99\"," +
     "\"data_x\": \"730\"," +
     "\"data_y\": \"22\"," +
     "\"width\": \"100\"," +
     "\"innerText\": \"dkFT\"," +
     "\"bpmn\": \"\"," +
     "\"taska_id\": \"Y29tLmF0dC50cmluaXR5LmFpYy5kYzEuYXM=\"," +
     "\"role\": \"\"" +
    "}," +
    "{" +
     "\"id\": \"be7bed7f-ac4b-29b4-2106-b9af84e50381\"," +
     "\"data_x\": \"890\"," +
     "\"data_y\": \"22\"," +
     "\"width\": \"100\"," +
     "\"innerText\": \"dk5T\"," +
     "\"bpmn\": \"\"," +
     "\"taska_id\": \"Y29tLmF0dC50cmluaXR5LmFpYy5kYzEubnM=\"," +
     "\"role\": \"\"" +
    "}" +
   "]," +
   "\"arrows\": [" +
    "{" +
     "\"id\": \"7e926a0a-f32a-fd2f-2f9f-7aeb90027243\"," +
     "\"data_x\": \"300\"," +
     "\"data_y\": \"186\"," +
     "\"width\": \"308\"," +
     "\"fromNodeID\": \"32c3d197-3174-479b-07b1-073d07a0eea7\"," +
     "\"toNodeID\": \"204d7374-cd5b-9bdd-25bf-0dcaec3d9a73\"," +
     "\"direction\": \"right\"," +
     "\"innerText\": \"VW5hdXRob3JpemVkIDQwMQ==\"," +
     "\"arrowDescription\": \"VHJpbml0eSBVRS1BIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCB3aXRoIHZBLVNCRyBhbmQgdkFTLg==\"," +
     "\"messageType\": \"dW5kZWZpbmVk\"" +
    "}," +
    "{" +
     "\"id\": \"b59fae70-46c4-2c2a-f216-d70fde6e9645\"," +
     "\"data_x\": \"620\"," +
     "\"data_y\": \"270\"," +
     "\"width\": \"308\"," +
     "\"fromNodeID\": \"204d7374-cd5b-9bdd-25bf-0dcaec3d9a73\"," +
     "\"toNodeID\": \"be7bed7f-ac4b-29b4-2106-b9af84e50381\"," +
     "\"direction\": \"right\"," +
     "\"innerText\": \"\"," +
     "\"arrowDescription\": \"dkEtU0JHIGZvcndhcmRzIHRoZSBpbnZpdGUgdG8gdk5TIGJhc2VkIG9uIEZRRE4gcmVzb2x1dGlvbi4gdk5TIGFjdHMgaW4gU0lQIHByb3h5IG1vZGUu\"," +
    "\"messageType\": \"dW5kZWZpbmVk\"" +
    "}," +
    "{" +
     "\"id\": \"1eefc75c-3441-0211-0f3f-c84099bcd87f\"," +
     "\"data_x\": \"780\"," +
     "\"data_y\": \"354\"," +
     "\"width\": \"148\"," +
     "\"fromNodeID\": \"be7bed7f-ac4b-29b4-2106-b9af84e50381\"," +
     "\"toNodeID\": \"61b531d6-a56c-ddb9-616d-f1524475fe99\"," +
     "\"direction\": \"left\"," +
     "\"innerText\": \"VW5hdXRob3JpemVkIDQwMQ==\"," +
     "\"arrowDescription\": \"\"," +
     "\"messageType\": \"dW5kZWZpbmVk\"" +
    "}," +
    "{" +
     "\"id\": \"1f1f0856-5b15-7aa4-c043-70312ea2e145\"," +
     "\"data_x\": \"780\"," +
     "\"data_y\": \"438\"," +
     "\"width\": \"148\"," +
     "\"fromNodeID\": \"61b531d6-a56c-ddb9-616d-f1524475fe99\"," +
     "\"toNodeID\": \"be7bed7f-ac4b-29b4-2106-b9af84e50381\"," +
     "\"direction\": \"right\"," +
     "\"innerText\": \"\"," +
     "\"arrowDescription\": \"\"," +
     "\"messageType\": \"dW5kZWZpbmVk\"" +
    "}," +
    "{" +
     "\"id\": \"c07828b9-30d1-bff2-3e39-e9e81ba80db0\"," +
     "\"data_x\": \"620\"," +
     "\"data_y\": \"522\"," +
     "\"width\": \"308\"," +
     "\"fromNodeID\": \"be7bed7f-ac4b-29b4-2106-b9af84e50381\"," +
     "\"toNodeID\": \"204d7374-cd5b-9bdd-25bf-0dcaec3d9a73\"," +
     "\"direction\": \"left\"," +
     "\"innerText\": \"\"," +
     "\"arrowDescription\": \"\"," +
     "\"messageType\": \"dW5kZWZpbmVk\"" +
    "}," +
    "{" +
     "\"id\": \"befed98b-9be8-5a65-01f2-5adf0147458f\"," +
     "\"data_x\": \"620\"," +
     "\"data_y\": \"690\"," +
     "\"width\": \"148\"," +
     "\"fromNodeID\": \"204d7374-cd5b-9bdd-25bf-0dcaec3d9a73\"," +
     "\"toNodeID\": \"61b531d6-a56c-ddb9-616d-f1524475fe99\"," +
     "\"direction\": \"right\"," +
     "\"innerText\": \"\"," +
     "\"arrowDescription\": \"\"," +
     "\"messageType\": \"dW5kZWZpbmVk\"" +
    "}," +
    "{" +
     "\"id\": \"f938b120-0a6a-bfe5-caf3-c06d387e7efb\"," +
     "\"data_x\": \"300\"," +
     "\"data_y\": \"774\"," +
     "\"width\": \"468\"," +
     "\"fromNodeID\": \"61b531d6-a56c-ddb9-616d-f1524475fe99\"," +
     "\"toNodeID\": \"32c3d197-3174-479b-07b1-073d07a0eea7\"," +
     "\"direction\": \"left\"," +
     "\"innerText\": \"\"," +
     "\"arrowDescription\": \"\"," +
     "\"messageType\": \"dW5kZWZpbmVk\"" +
    "}" +
   "]," +
   "\"notes\": []," +
   "\"separators\": [" +
    "{" +
     "\"lineNumber\": \"1\"," +
     "\"text\": \"U3RlcDE6IGNhbGwgc2V0dXA=\"," +
     "\"messageType\": \"\"" +
    "}," +
    "{" +
     "\"lineNumber\": \"13\"," +
     "\"text\": \"U3RlcCAyOiBDYWxs\"," +
     "\"messageType\": \"\"" +
    "}" +
   "]" +
  "}," +
  "\"description\": \"Trinity to 3G\"" +
 "}" +
"}";



var trinity_3g_json = '{' + 
	'"diagram": {' + 
		'"created": "1455122726993",' + 
		'"rows": "21",' + 
		'"cols": "7",' + 
		'"gridPitchy": "42",' + 
		'"canvasHeight": "919",' + 
		'"canvasWidth": "1112",' + 
		'"encoding": "base64",' + 
		'"elements": {' + 
			'"nodes": [' + 
				'{' + 
					'"id": "674e9e4e-95ef-23da-8755-77317f128686",' + 
					'"data_x": "250",' + 
					'"data_y": "22",' + 
					'"width": "100",' + 
					'"innerText": "VUUz",' + 
					'"bpmn": "",' + 
					'"taska_id": "Y29tLmF0dC50cmluaXR5LnVlMw==",' + 
					'"role": ""' + 
				'},' + 
				'{' + 
					'"id": "9d57a196-ef59-eead-de2f-ff0917623578",' + 
					'"data_x": "410",' + 
					'"data_y": "22",' + 
					'"width": "100",' + 
					'"innerText": "VkEtU0JH",' + 
					'"bpmn": "",' + 
					'"taska_id": "Y29tLmF0dC50cmluaXR5LmFpYy5kYzEuYV9zYmc=",' + 
					'"role": ""' + 
				'},' + 
				'{' + 
					'"id": "4a680033-36cb-a21a-3576-aee3a9766a68",' + 
					'"data_x": "730",' + 
					'"data_y": "22",' + 
					'"width": "100",' + 
					'"innerText": "dkFT",' + 
					'"bpmn": "",' + 
					'"taska_id": "Y29tLmF0dC50cmluaXR5LmFpYy5kYzEuYXM=",' + 
					'"role": ""' + 
				'},' + 
				'{' + 
					'"id": "f4185dfa-8ef7-3e01-7a90-2fc1b574142d",' + 
					'"data_x": "890",' + 
					'"data_y": "22",' + 
					'"width": "100",' + 
					'"innerText": "dk5T",' + 
					'"bpmn": "",' + 
					'"taska_id": "Y29tLmF0dC50cmluaXR5LmFpYy5kYzEubnM=",' + 
					'"role": ""' + 
				'}' + 
			'],' + 
			'"arrows": [' + 
				'{' + 
					'"id": "4b41cd7f-c74b-a7f0-3ff4-9dd42f826a15",' + 
					'"data_x": "300",' + 
					'"data_y": "144",' + 
					'"width": "148",' + 
					'"fromNodeID": "674e9e4e-95ef-23da-8755-77317f128686",' + 
					'"toNodeID": "9d57a196-ef59-eead-de2f-ff0917623578",' + 
					'"direction": "right",' + 
					'"innerText": "SW52aXRl",' + 
					'"arrowDescription": "VHJpbml0eSBVRS1BIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCB3aXRoIHZBLVNCRyBhbmQgdkFTLg==",' + 
					'"messageType": "bWVkaWE="' + 
				'},' + 
				'{' + 
					'"id": "4c1c1c6e-91d0-af32-52cb-ee3a32ea5211",' + 
					'"data_x": "460",' + 
					'"data_y": "186",' + 
					'"width": "468",' + 
					'"fromNodeID": "9d57a196-ef59-eead-de2f-ff0917623578",' + 
					'"toNodeID": "f4185dfa-8ef7-3e01-7a90-2fc1b574142d",' + 
					'"direction": "right",' + 
					'"innerText": "SW52aXRl",' + 
					'"arrowDescription": "dkEtU0JHIGZvcndhcmRzIHRoZSBpbnZpdGUgdG8gdk5TIGJhc2VkIG9uIEZRRE4gcmVzb2x1dGlvbi4gdk5TIGFjdHMgaW4gU0lQIHByb3h5IG1vZGUu",' + 
					'"messageType": "bWVkaWE="' + 
				'},' + 
				'{' + 
					'"id": "ba866c2c-7f06-50bf-d23b-365eb3089533",' + 
					'"data_x": "780",' + 
					'"data_y": "228",' + 
					'"width": "148",' + 
					'"fromNodeID": "f4185dfa-8ef7-3e01-7a90-2fc1b574142d",' + 
					'"toNodeID": "4a680033-36cb-a21a-3576-aee3a9766a68",' + 
					'"direction": "left",' + 
					'"innerText": "cHJveHkgSU5WSVRF",' + 
					'"arrowDescription": "",' + 
					'"messageType": "bWVkaWE="' + 
				'},' + 
				'{' + 
					'"id": "3326de92-459c-223e-29cf-ebf9581aa345",' + 
					'"data_x": "780",' + 
					'"data_y": "270",' + 
					'"width": "148",' + 
					'"fromNodeID": "4a680033-36cb-a21a-3576-aee3a9766a68",' + 
					'"toNodeID": "f4185dfa-8ef7-3e01-7a90-2fc1b574142d",' + 
					'"direction": "right",' + 
					'"innerText": "VW5hdXRob3JpemVkIDQwMQ==",' + 
					'"arrowDescription": "",' + 
					'"messageType": "bWVkaWE="' + 
				'},' + 
				'{' + 
					'"id": "4c47d49f-8b4e-46cb-adf6-68c9ec3a2824",' + 
					'"data_x": "460",' + 
					'"data_y": "312",' + 
					'"width": "468",' + 
					'"fromNodeID": "f4185dfa-8ef7-3e01-7a90-2fc1b574142d",' + 
					'"toNodeID": "9d57a196-ef59-eead-de2f-ff0917623578",' + 
					'"direction": "left",' + 
					'"innerText": "cHJveHkgNDAxIFVuYXV0aG9yaXplZA==",' + 
					'"arrowDescription": "UHJveHkgdGhlIDQwMSBVbmF1dGhvcml6ZWQgbWVzc2FnZSB0byB0aGUgc3BlY2lmaWMgdkEtU0JHIHRoYXQgc2VudCB0aGUgSW52aXRlIG1lc3NhZ2Uu",' + 
					'"messageType": "bWVkaWE="' + 
				'},' + 
				'{' + 
					'"id": "47136318-f7dd-0d70-757e-ffdbc0d1abc8",' + 
					'"data_x": "300",' + 
					'"data_y": "354",' + 
					'"width": "148",' + 
					'"fromNodeID": "9d57a196-ef59-eead-de2f-ff0917623578",' + 
					'"toNodeID": "674e9e4e-95ef-23da-8755-77317f128686",' + 
					'"direction": "left",' + 
					'"innerText": "VW5hdXRob3JpemVkIDQwMQ==",' + 
					'"arrowDescription": "",' + 
					'"messageType": "c2lnbmFs"' + 
				'},' + 
				'{' + 
					'"id": "eb1cb207-cc10-bfda-8966-3437083c34f8",' + 
					'"data_x": "300",' + 
					'"data_y": "396",' + 
					'"width": "148",' + 
					'"fromNodeID": "674e9e4e-95ef-23da-8755-77317f128686",' + 
					'"toNodeID": "9d57a196-ef59-eead-de2f-ff0917623578",' + 
					'"direction": "right",' + 
					'"innerText": "SW52aXRl",' + 
					'"arrowDescription": "VGhlIFRyaW5pdHkgVUUgQSBzZW5kcyBhbiBJbnZpdGUgbWVzc2FnZSB3aXRoIGNyZWRlbnRpYWxzIHRvIHRoZSB2QS1TQkcgaXQgaXMgcmVnaXN0ZXJlZCB3aXRoLg==",' + 
					'"messageType": "c2lnbmFs"' + 
				'},' + 
				'{' + 
					'"id": "00e3a3ea-df9d-ad57-b14b-371ce6ce7bb2",' + 
					'"data_x": "460",' + 
					'"data_y": "438",' + 
					'"width": "468",' + 
					'"fromNodeID": "9d57a196-ef59-eead-de2f-ff0917623578",' + 
					'"toNodeID": "f4185dfa-8ef7-3e01-7a90-2fc1b574142d",' + 
					'"direction": "right",' + 
					'"innerText": "SW52aXRl",' + 
					'"arrowDescription": "",' + 
					'"messageType": "c2lnbmFs"' + 
				'},' + 
				'{' + 
					'"id": "831e9811-2fc5-ab45-b9fc-61669f63d223",' + 
					'"data_x": "780",' + 
					'"data_y": "480",' + 
					'"width": "148",' + 
					'"fromNodeID": "f4185dfa-8ef7-3e01-7a90-2fc1b574142d",' + 
					'"toNodeID": "4a680033-36cb-a21a-3576-aee3a9766a68",' + 
					'"direction": "left",' + 
					'"innerText": "cHJveHkgSU5WSVRF",' + 
					'"arrowDescription": "dk5TIHByb3hpZXMgdGhlIEludml0ZSBtZXNzYWdlIHdpdGggY3JlZGVudGlhbHMgdG8gdGhlIHByZXZpb3VzbHkgc2VsZWN0ZWQgdkFTLg==",' + 
					'"messageType": "c2lnbmFs"' + 
				'},' + 
				'{' + 
					'"id": "78fe7e58-497e-907d-6f20-55e418f38542",' + 
					'"data_x": "780",' + 
					'"data_y": "522",' + 
					'"width": "148",' + 
					'"fromNodeID": "f4185dfa-8ef7-3e01-7a90-2fc1b574142d",' + 
					'"toNodeID": "4a680033-36cb-a21a-3576-aee3a9766a68",' + 
					'"direction": "left",' + 
					'"innerText": "SW52aXRl",' + 
					'"arrowDescription": "VGhlIHZBUyBleGVjdXRlcyBvcmlnaW5hdGluZyBjYWxsIHByb2Nlc3NpbmcgZm9yIFVFIEEgYW5kIGRldGVybWluZXMgdGhlIGNhbGxlZCBwYXJ0eSBpcyBub3QgdGhlIHNhbWUgdGVuYW50LiBUaGUgdkFTIHNlbmRzIGFuIEludml0ZSBtZXNzYWdlIHRvIHRoZSB2TlMgdGhhdCBhY3RzIGluIHJlZGlyZWN0IG1vZGUgYW5kIHNlbmRzIGEgM1hYIHBvaW50aW5nIHRvIHRoZSBURi9CR0NGLg==",' + 
					'"messageType": "c2lnbmFs"' + 
				'},' + 
				'{' + 
					'"id": "17634140-0fef-3bd7-1996-5621db3c7f7e",' + 
					'"data_x": "780",' + 
					'"data_y": "564",' + 
					'"width": "148",' + 
					'"fromNodeID": "f4185dfa-8ef7-3e01-7a90-2fc1b574142d",' + 
					'"toNodeID": "4a680033-36cb-a21a-3576-aee3a9766a68",' + 
					'"direction": "left",' + 
					'"innerText": "M1hYIHJlZGlyZWN0IHRvIFRyYW5zaXQgZnVuY3Rpb24=",' + 
					'"arrowDescription": "VGhlIHZOUyBhY3RzIGluIHJlZGlyZWN0IG1vZGUgYW5kIHNlbmRzIGEgM1hYIHRvIHRoZSB2QVMgcG9pbnRpbmcgdG8gdGhlIFRGL0JHQ0Yu",' + 
					'"messageType": "c2lnbmFs"' + 
				'}' + 
			'],' + 
			'"notes": [],' + 
			'"separators": [' + 
				'{' + 
					'"lineNumber": "1",' + 
					'"text": "U3RlcDE6IGNhbGwgc2V0dXA=",' + 
					'"messageType": ""' + 
				'},' + 
				'{' + 
					'"lineNumber": "16",' + 
					'"text": "U3RlcCAyOiBDYWxs",' + 
					'"messageType": ""' + 
				'}' + 
			']' + 
		'},' + 
		'"description": "Trinity to 3G Sample"' + 
	'}' + 
'}';