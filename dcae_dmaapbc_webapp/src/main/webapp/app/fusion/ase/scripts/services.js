/* ---------------------------------------------------------------------------------------------- */
/*
*   This file is a work in progress, update this section when complete to give a better description. 
* Currently the functions here work with the services and will work with getting the information 
* from the AJAX Call which will provide JSON/YMAL object of the information required to build the service 
* selection.
*
*
*/

/*
* This Function currently builds the table for the accordian. 
* when complete this will create the complete section of how 
* a Domain, Serrvice and UE are selected from the ASE tool. 
* 
*/
var domains = [];
var elements = [];
var networkMap =[];
var isFirstRun = true;
var defaultDomain = "RAN";
var defaultElement = "com.ecomp.trinity.ran.enodeb";


function buildNetworkMap() {
	
	
	$.get(ase.elementsFile, {	
	//$.post('http://demeter.homer.ecomp.com:50180/d2sim/ase.htm?action=element', {
	//$.post('ase.htm?action=element', {
	}, function(data)  { 
		var yamlObject = jsyaml.load(data);
		networkMap = yamlObject.elementsList;
		buildDomain(networkMap);
	});
	
	
}


function buildDomain(networkMap){
	if ( domains.length == 0 ) {
		for ( var i = 0; i < networkMap.length; i++ ) {
			if ( domains.indexOf(networkMap[i].enclosingDomain) < 0 ) {
				domains.push(networkMap[i].enclosingDomain);
			} 
		}
	}
	for ( var d = 0; d < domains.length; d++ ) {
		$('#domains').append('<option value="' + domains[d] +'">' + domains[d] + '</option>');
	}
	$("#elements").prop('disabled', true);
	$('#domains').change(function(){
		if ( $('#domains').val() == 'na' ) { return false; }
		buildElements($('#domains').val());
	});
	$('#domains option[value|="'+ defaultDomain +'"]').prop("selected",true).change();
	
}

function buildElements(domain){
	elements = [];
	$('#elements').html('<option value="na">-- Select Element --</option>');
	for ( var i = 0; i < networkMap.length; i++ ) {
		if ( networkMap[i].enclosingDomain == domain ) {
			$('#elements').append('<option value="' + networkMap[i].tosca_id +'">' + networkMap[i].displayShortname + '</option>');
			elements.push(networkMap[i].displayShortname);
		}
	}
	$("#elements").prop('disabled', false);
	$('#elements').change(function(){
		if ( $('#elements').val() == 'na' ) { return false; }
		buildNode($('#elements').val(),$('#elements option:selected').text());
	});
	if ( isFirstRun ) {
		$('#elements option[value|="'+ defaultElement +'"]').prop("selected",true);
		isFirstRun = false;
	}
	
}

function buildNode(tosca_id,name){
	$('#element').attr('taska_id',tosca_id);
	$('#shortName').html(name);
}

