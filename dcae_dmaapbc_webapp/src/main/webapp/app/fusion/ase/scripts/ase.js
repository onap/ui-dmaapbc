//window.filename = "";
//window.name = "My_Flow_1";
window.description = "My Sequence Diagram";
window.arrowTip = 12;
window.resized = false;
window.arrowConnections = true;
window.negativeWidth = false;
window.gridPitchx = 160;
window.gridPitchy = 42;
window.clipboard = [];
window.selection = [];
//var networkMap();
var step = 1;
var sessiontoken = '';
var uid= 'XX0000';
var username= '';
var toscaDetails = {
		'toscaID':'',
		'name':'',
		'domain':''
};
var ase = {
		'elementsFileName' : '',
		'description' : 'My Sequence Diagram',
		'name' : 'My_Flow_1',
		'filename' : '',
		'elementsFile' : '../mocks/networkElements.yml'
};

		

$(function() {

	newProject(null,null,initialRows);

    //buildTable();
    //buildDomain();    
        
    var loadSample = false;
    var showBpmn = false;
    
    
    $('#sampleEx').click(function(){
    	if (! loadSample ) {
    		loadSample = loadSampleData();
    	}
    });
    $('#bpmnEx').click(function(){
    	convertToBPMN(makeJSON(),window.description,'show');
    });
    $('#popupEx').click(function(){
    	showPopup();
    });
    
//    if ( getParameterByName("bpmn") === "1" ) {
//    	
//    } else if ( getParameterByName("sample") === "1" ) {
//    	$('#sampleDiv').show();
//    } else if ( getParameterByName("interact") === "1" ) {
//       
//    
//	}
    
    
    

    //Allows nodes to scroll with the page and adjusts transparencies
	$(window).scroll(function(event) {
		scroll();
    });

	toggleDoubleLine(document.getElementById('row1'),null,"Step 1:","");
	//buildDomain();    
	//addStep(document.getElementById('row1'),'row1',step,'');
	buildNetworkMap();
	$("#backHome").click(function(){ document.location = "../welcome.htm?showASE=true";});
});

function getParameterByName( name ){
  var regexS = "[\\?&]"+name+"=([^&#]*)"; 
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.search );
  if( results == null ){
    return "";
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

function loadSampleData() {
    try {
    	//loadFile(0,null,preloadedJSON);
    	loadFile(0,null,trinity_3g_json);
    } catch(err){
    	return false;
    } finally {
    	
    }
    return true;
}

function showPopup(){
	bootbox.dialog({
		backdrop:true,
		animate:false,
		onEscape: function() {},
		title: '<div style="float:left">Sample Dialog</div>',
		size: 'small',
		message: '<div id="saveWarning"></div><h4>Sample Dialog using Bootstraps bootbox.dialog components.</h4>'+
		'<br><hr>'
	});
}