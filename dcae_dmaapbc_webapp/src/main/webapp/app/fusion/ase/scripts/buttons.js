

// Contains functions for the buttons

var steps = [];

window.rows = 0, window.initialRows = 14, window.cols = window.initialCols = 8; //Define initial rows and cols
var presets = [["None"],["Demo",["UE A","com.ecomp.ue3"],["vA-SBG","com.ecomp.dc1.a_sbg"],["vNS","com.ecomp.dc1.ns"],["vAS","com.ecomp.dc1.as"],["TF/BGCF","com.ecomp.usp.tf_bgcf"],["ENUM","com.ecomp.usp.enum"],["n-SBG","com.ecomp.dc1.n_sbg"],["SIP PSX","com.ecomp.vni.sip_psx"],["BVoIP AS","com.ecomp.vni.bvoip_as"],["IPBE","com.ecomp.vni.ipbe"],["IPFR UE B","com.ecomp.ue5"]],["Layer3Access",["Order Trigger System"],["MSO"],["SDN-C"],["A&AI"],["PO"]]];
var presetNames = [];
for(var i = 0; i<presets.length; i++){
	presetNames.push(presets[i][0]);
	this[presets[i][0]+"Systems"]=[];
	this[presets[i][0]+"Tosca"]=[];
	for (var j=1;j<presets[i].length; j++){
		this[presets[i][0]+"Systems"].push(presets[i][j][0]);
		this[presets[i][0]+"Tosca"].push(presets[i][j][1]);
	}
}


//Create new project and sets up grid lines
function newButton(){
	var availablePresetHTML = '';
	for (var i=0; i<presets.length;i++){
		availablePresetHTML += '<button style="margin-left:20px;" onclick="newProjectFromPreset(\''+presets[i][0]+'\');">'+presets[i][0]+'</button><br>'
	}
	bootbox.dialog({
		backdrop:true,
		animate:false,
		onEscape: function() {},
		title: 'Create New Project',
		size: 'large',		
		message: 'Project from preset : <br>'+availablePresetHTML+'<br><br><hr><hr><button onclick="confirm();">New Blank Project</button>'
	});
	function confirm () {
		bootbox.confirm({
			size:'small',
			message:"<img src='triangle.png' height=15 width=15 style='margin-right:10px'>***This will erase everything***",
			callback: function(result){
				if (result == true){
					bootbox.hideAll();
					newProject(null,null,14);
				}
			}
		});
	}
}

function newProjectFromPreset(type){
	newProject(null,null,14);
	if (type!=null) window.selectedPreset = type;
	for (var i=0; i<presets.length; i++){
		if (presets[i][0]==type) {
			var presetIndex = i;
			break;
		}
	}
	
	var lX=250;
	var lY=22;
	
	for (var i=1; i<presets[presetIndex].length;i++){
		console.log("hello");
		storeArray("nodeArr", i, guid(), presets[presetIndex][i][0], lX+160*(i-1), lY, 100,null, null,null,presets[presetIndex][i][1]);
	}
	adjustWidth();
	bootbox.hideAll();
	//METHOD TO READ FROM FILE
	//var myjson = new Object();
	//$.getJSON("myJSON.json", function(json) {
	//  myjson = JSON.stringify(json);
	//  console.log(myjson);
	//});
	
}

function newProject(linesToMakeDouble,doubleLineText,rowsToMake,doubleLineType) {
	window.selectedPreset = "None";
	resetTitleBar();
	$( "#start" ).removeClass( "glow" );
	document.getElementById("numbers").innerHTML ='';
	document.getElementById("lines").innerHTML ='';
	document.getElementById("nodeChildrenDroppedOffHere").innerHTML ='';
	document.getElementById("arrowChildrenDroppedOffHere").innerHTML ='';
	document.getElementById("noteChildrenDroppedOffHere").innerHTML ='';
	deletedNodes.length = 0;
	deletedArrows.length = 0;
	deletedNotes.length = 0;
	document.getElementById("trash").src = "../images/trashCan.gif";
	nodeArr=[];
	arrowArr=[];
	noteArr=[];
	rows=0;
	if ( linesToMakeDouble != undefined && linesToMakeDouble.length >= 1 ) { step = 0; }
	for (i = 0; i<rowsToMake; i++) {
		addRow(linesToMakeDouble,doubleLineText,doubleLineType);
	}	
}

//Adds height
function addHeight() {
	document.getElementById('grid').style.height = 91.5 + (rows-initialRows)*6.2 + '%'; //Increases height by 6%
	currentHeight = $('.verticalLine').height();
	newHeight = currentHeight + gridPitchy;
	$('.verticalLine').height(newHeight);
	addRow();
}
function addRow(linesToMakeDouble,doubleLineText,doubleLineType){ //Adds row lines
	rows++; //adds one row per button press
	document.getElementById("numbers").innerHTML +='<li style = "margin-left:4em; height:18px;" type="1"></li><br style="line-height:' + Math.ceil((gridPitchy+6)/2) + 'px;">';
	
//	document.getElementById("numbers").innerHTML +='<li style = "margin-left:4em;" type="1"></li><br style="line-height:' + Math.ceil((gridPitchy+6)/2) + 'px;">';
	//var lineHTML='<hr id="row'+rows+'" ondblclick="toggleDoubleLine(event.target)" class = "dottedLine" /><br><br style="line-height:' + Math.ceil((gridPitchy)/2) + 'px;">';
	if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
		templineheight = 17
	} else {
		templineheight = Math.ceil((gridPitchy)/2)
	}
	var lineHTML='<hr id="row'+rows+'" class = "dottedLine" /><br><br style="line-height:' + templineheight + 'px;">';
	$("#lines").append(lineHTML);
	if (linesToMakeDouble!=null && linesToMakeDouble.indexOf(rows.toString())!=-1){
		toggleDoubleLine(document.getElementById("row"+rows),linesToMakeDouble,doubleLineText,doubleLineType);
		step++;
		console.log(step);
	}		
}

function toggleDoubleLine (target,lines,text,type) {
	while (target.id.substring(0,3)!="row"){
		target = target.parentNode;
	}
	//console.log(target.style);
	if ($(target).hasClass('dottedLine')){
		$(target).removeClass('dottedLine');
		$(target).addClass('doubleLine');
		if (text==null){
			bootbox.confirm({
				closeButton:false,backdrop:true,animate:false,
				size:'small',
				title: "Add Separator Text",
				onEscape: function() {},
				message: '<input id="separatorInnerText" style="width:100%;" type="text" placeholder="Add text here" value="Add text here">'+
					'<div style="color:grey;font-size:12px;"><br>Message type : <input id="messageType" style="width:100%;" type="text" placeholder="(optional)" value=""></div>',
				callback: function(result){
					if (result == true){		
						//EXECUTE THIS ON OKAY///
						var innerText = $('#separatorInnerText').val();
						document.getElementById(target.id).setAttribute('messageType',$('#messageType').val())
						pushToDict(innerText, "separator");
						locationOfTag = parseInt($(target).position().top)-4;
						target.innerHTML = '<div style="position:absolute;top:'+locationOfTag+'px;font-style:italic;font-size:12px;width:100%;text-align:center;">'+innerText+'</div>';
						/////////////////////////
					}
				}
			});
			$("#separatorInnerText").autocomplete({
				source: separatorTags,
				autoFocus: true,
				delay: 0
			});
			$("#messageType").autocomplete({
				source: messageTags,
				autoFocus: true,
				delay: 0
			});
			
			var currentInput = $("#separatorInnerText").val();
			$("#separatorInnerText").selectRange(0,currentInput.length);
			$("#separatorInnerText").click(function(){
				var currentInput = $("#separatorInnerText").val();
				$("#separatorInnerText").selectRange(0,currentInput.length);
			});
			$("#separatorInnerText").keyup( function(e) {
				if (e.keyCode == 13){
					$(document.getElementsByClassName('btn-primary')[0]).click();
				}
			});
			$("#messageType").keyup( function(e) {
				if (e.keyCode == 13){
					$(document.getElementsByClassName('btn-primary')[0]).click();
				}
			});	
		}
		else if (text!=null && lines==null){
			locationOfTag = parseInt($(target).position().top)-4;
			document.getElementById(target.id).setAttribute('messageType',type)
			target.innerHTML = '<div style="position:absolute;top:'+locationOfTag+'px;font-style:italic;font-size:12px;width:100%;text-align:center;">'+text+'</div>';
		}
		else{
			locationOfTag = parseInt($(target).position().top)-4;
			document.getElementById(target.id).setAttribute('messageType',type[lines.indexOf(target.id.substring(3))])
			target.innerHTML = '<div style="position:absolute;top:'+locationOfTag+'px;font-style:italic;font-size:12px;width:100%;text-align:center;">'+text[lines.indexOf(target.id.substring(3))]+'</div>';
		}
	}
	else {
		target.innerHTML = '';
		$(target).removeClass('doubleLine');
		$(target).addClass('dottedLine');
	}
}

//Adds width
function addWidth() {
	cols++; //adds 2 cols per button press
	document.getElementById('grid').style.width = 98 + (cols-initialCols)*12 + '%'; //Increases grid width % by 5% right
	document.getElementById('horRows').style.width = 81 + (cols-initialCols)*12 + '%'; //Increases line width % by 5% right
}

function fitToDoc () {
	doubleLineNumbers.length=0;
	doubleLineText.length=0;
	doubleLineType.length=0;
	var doubleElements = document.getElementsByClassName("doubleLine");
	$.each(doubleElements,function(index, value){
		doubleLineNumbers.push(($(value).attr('id')).substring(3));
		doubleLineText.push(value.children[0].innerHTML);
		doubleLineType.push($(value).attr('messageType'));
	});
	if (nodeArr.length==0 && arrowArr.length==0) return;
	var maxX = 0;
	for (var i=0; i<nodeArr.length; i++){
		if (nodeArr[i][6]>maxX){
			maxX = nodeArr[i][6];
		}		
	}
	var maxY = 0;
	for (var i=0; i<arrowArr.length; i++){
		if (parseInt(arrowArr[i][4])>maxY){
			maxY = parseInt(arrowArr[i][4]);
		}		
	}
	var rowsNeeded = Math.ceil((maxY-60)/42);
	document.getElementById("numbers").innerHTML ='';
	document.getElementById("lines").innerHTML ='';
	if(maxX<$("#grid").width() - $("#sideBar").width()){
		do{
			cols--; //adds 2 cols per button press
			document.getElementById('grid').style.width = 98 + (cols-initialCols)*12 + '%'; //Increases grid width % by 5% right
			document.getElementById('horRows').style.width = 81 + (cols-initialCols)*12 + '%'; //Increases line width % by 5% right
		}while (maxX<$("#grid").width() - $("#sideBar").width())
	}
	rows=0;
	for(var i=0; i<rowsNeeded;i++){
		addRow();
		if (doubleLineNumbers.indexOf(rows.toString())!=-1) toggleDoubleLine(document.getElementById('row'+rows),null,doubleLineText[doubleLineNumbers.indexOf(rows.toString())],doubleLineType[doubleLineNumbers.indexOf(rows.toString())])
	}
	
}

$(document).on("mouseenter", '.arrowText',function(event){
	if (event.target.parentElement.parentElement.getAttribute('direction') != 'self') $(event.target).removeClass('makeEllipsis');
	else $(event.target).removeClass('makeEllipsisSelf');
})
$(document).on("mouseleave", '.arrowText',function(event){
	if (event.target.parentElement.parentElement.getAttribute('direction') != 'self') $(event.target).addClass('makeEllipsis');
	else $(event.target).addClass('makeEllipsisSelf');
})
$(document).on("mouseenter", '.nodeText',function(event){
	$(event.target).removeClass('nodeEllipsis');
})
$(document).on("mouseleave", '.nodeText',function(event){
	$(event.target).addClass('nodeEllipsis');
})
$( "#toggleEllipsis" ).click(function() {
	var allArrows = document.getElementsByClassName('arrowText')
	for (var i=0; i<allArrows.length; i++){
		$( allArrows[i] ).toggleClass( "makeEllipsis" );
	}   
	var allNodes = document.getElementsByClassName('nodeText')
	for (var i=0; i<allNodes.length; i++){
		$( allNodes[i] ).toggleClass( "nodeEllipsis" );
	}  
	if (document.getElementById("toggleEllipsis").textContent == "Ellipsis : on") {
		document.getElementById("toggleEllipsis").textContent = "Ellipsis : off";
	}
	else {
		document.getElementById("toggleEllipsis").textContent = "Ellipsis : on";
	}
});

//Shows the instructions dialog
function openHelp () {
	bootbox.dialog({
		backdrop:true,
		onEscape: function() {},
		message: '<h1 class="help" style="margin-top:0px;">Flow SDE</h1>' +
			'<p class="help">This program was designed to aid in the process of creating, editing, and sharing sequence diagrams by utilizing drag-n-drop javascript ' + 
			'frameworks.</p><br><p class="help" style="text-align:center;"><a href="https://github.com/kevingilboy/Advanced-Service-Editor">https://github.com/kevingilboy/Advanced-Service-Editor</a></p>'+
			'<hr><h2 class="help">Editing: Getting Started</h2><ol style="font-size:18px;"><li>Simply drag a module from the sidebar to the main grid on the screen.</li> ' + 
			'<li>Once you begin dragging, a grey dotted line will guide you to the appropriate dropzone area. The dropzone is highlighted ' +
			'blue upon dragging a appropriate module inside of it.</li> ' +
			'<li>You will be prompted to enter text to be displayed inside of the module. Height and width can be added using the buttons ' +
			'on the left side of the screen.</li><li>To delete a module, drag it to the trash can.</li></ol>'+
			
    			'<h3 class="help">Nodes</h3><p class="help indent">Nodes are designated by blue, rounded rectangles and ' +
    			'can be dragged to the dropzone above the horizontal grid lines. Nodes automatically generate "lifelines" that run to the ' +
    			'of the page. When arrows are resized, they snap to these lifelines. A node\'s dependent arrows (those that touch its ' +
    			'lifelines) remain stuck to it while the node is dragged and rearranged. Dragging a node on top of another node results ' +
    			'in the overlapped node and all nodes to its right to be shifted over one unit to the right.</p>' +
    			'<h3 class="help">Arrows</h3><p class="help indent">Arrows can be ' +
    			'dragged to the main dropzone that contains many horizontal lines. Arrows can be resized and snap to nearby lifelines at ' +
    			'the end of resizing.</p>' +
    			'<h3 class="help">Notes</h3><p class="help indent">Notes are designated by yellow rectangles and can be ' +
    			'dragged to the main dropzone that contains many horizontal lines.</p>' +
    			
			'<hr><h2 class="help">File Management</h2><p class="help" style="margin-left:12px;">There are many options to save your work and load it to either a ' +
			'new workspace or current one.</p>'+
    			
    			'<h3 class="help">Saving</h3>' +
    				
    				'<h4 class="help">Saving workspace</h4><p class="help indent">To save everything in the current workspace, click the save ' +
    				'button in the lower left hand corner. A menu will pop up with multiple save destinations: <ul class="help">'+
    				'<li><b>Locally:</b> Files are saved as text files with JSON formatting. They are downloaded to the users downloads folder. '+
    				'The filename dictates what the file is called but the description dictates what the workspace is called.</li>'+
    				'<li><b>Database:</b> Users must first log in to use database connection. When logged in, a text input field is available '+
    				'for the user to insert a workspace description. The description dictates what the workspace is called.</li>'+
    				'<li><b>BPMN:</b> The workspace is converted to a BPMN 2.0 filetype which is compatable with Camunda\'s <a href="bpmn.io">bpmn.io</a> and eclipse plugin.'+
    				'The file can either be downloaded for import to bpmn.io or a preview can be shown by clicking "show". This uses a '+
    				'Camunda released plugin that displays the file on an integrated canvas.</li>'+
    				'</ul></p>' +
    			
    				'<h4 class="help">Export node(s)</h4><p class="help indent">It is also possible to export a single node and its dependent ' +
    				'arrows. To do so, right click on any node and click export. Enter a file name and click "Export". Exporting is useful ' +
    				'for saving frequently used nodes as they can be imported and appended to any project with ease.</p>' +
    			
    			'<h3 class="help">Loading</h3>' +
	    			'<h4 class="help">Loading workspace</h4><p class="help indent">To load a previous workspace, click the load ' +
					'button in the lower left hand corner. A menu will pop up with multiple loading destinations: <ul class="help">'+
					'<li><b>Locally:</b> Files can be retrieved from a local filesystem and imported into the workspace.</li>'+
					'<li><b>Database:</b> Users must first log in to use database connection. When logged in, a table shows the files that are '+
					'on the database.</li></ul></p>'+
					'<h4 class="help">Load types</h4><p class="help indent">There are two ways to load a file into the current workspace: </p>'+
    				'<ul class="help"><li><b>Replace</b><p class="help indent">To load an entire, previously saved workspace and replace the current one, ' +
    				'click the load button in the lower left hand corner. You will be prompted to choose a file and then click "Replace".</p></li>' +
    			
    				'<li><b>Append</b><p class="help indent">To load an entire, previously saved workspace on top of a current one, ' +
    				'click the load button in the lower left hand corner. You will be prompted to choose a file and then click "Append". ' +
    				'An append location marker will show up and you can click anywhere on the designated dropzone to change the location where the ' +
    				'file will be appended. After choosing a spot, click "Okay". If you choose a location that intersects with another node, ' +
    				'that node and the nodes to its right will be shifted one unit to the right.</p></li></ul>' +
    			
    				'<h4 class="help">Import node(s)</h4><p class="help indent">To import a node that has previously been exported, right click ' +
    				'on the node dropzone and click "import". You will be prompted to choose a file and then click "Import". ' +
    				'An append location marker will show up and you can click anywhere on the designated dropzone to change the location where the ' +
    				'file will be appended. After choosing a spot, click "Okay". If you choose a location that intersects with another node, ' +
    				'that node and the nodes to its right will be shifted one unit to the right.</p></li>' +
	    	
    			'<h3 class="help">Renaming</h3>' +
    				'<h4 class="help">Rename workspace</h4><p class="help indent">To rename your workspace, double click on the title bar ' +
    				'and type a new title. This does not change the names of previously saved versions of the workspace.</p>' +
    			
    		'<hr><h2 class="help">Features</h2><p class="help" style="margin-left:12px;">There are many features in this program to allow for its ease of use.</p>'+
				
    			'<h3 class="help">Arrow endpoint detection</h3><p class="help"> When an arrow on the screen lacks a left or right  ' + 
				'endpoint, the arrow is colored (red = 0 connections, yellow = 1 connection) and <i>*Link missing lifeline</i> ' +
				'appears in the sidebar. Clicking this text flashes the invalid arrows. When a successful connection has been made, ' +
				'the arrow fades to green and then to transparent.</p>' +
    			'<h3 class="help">Autocomplete with technical dictionary</h3><p class="help"> When prompted to enter the inner text of a module, ' + 
				'the editor searches through its preloaded dictionary to offer suggestions for text. Entering a term that is not in the ' +
				'dictionary appends it to the dictionary for the entirity of the session.</p>' +	
				'<h3 class="help">Autofit</h3><p class="help"> Clicking the autofit button fits the screen size to the exact dimensions of the ' + 
				'diagram. Highly recommended before making a printable output as it will scale the diagram and allow for max print size.</p>' +	
    			'<h3 class="help">Context menus (right-clicking)</h3><p class="help">Right clicking on nodes and arrows deploys a custom context menu allowing ' + 
				'you to perform many operations on modules such as cut, copy, paste, delete, rename, import and export.</p>' +	
				'<h3 class="help">Multi-select (using Ctrl & Shift)</h3><p class="help">Holding the control key allows the user to select multiple' +
				'nodes in any order. Holding the shift key allows the user to select multiple nodes in a row. Selecting multiple nodes allows ' + 
				'you to perform an operation (such as drag, cut, copy, paste, delete, and export).</p>' +	
				'<h3 class="help">Printing</h3><p class="help">Clicking "print" allows you to export the current workspace to a ' + 
				'printable (saveable and email-able) pdf document. These docments are meant for presentation and cannot be ' +
				'reimported into the workspace.</p>' +	
				'<h3 class="help">Russian-Doll Nodes</h3><p class="help">Nodes can be nested inside of other nodes. This can be done by either 1) ' + 
				'right-clicking on a single node and selecting "make child inside" 2) selecting a group of nodes, right-clicking, and selecting ' +
				'"make group from selected". Blank slots can be added inside groups for nodes to be dragged into by right clicking and selecting '+
				'"make slot inside". Upon making a group, connected arrows are broken and shaded yellow forcing the user to reconnect the arrows '+
				'to the nodes inner components. Nested nodes can be expanded and collapsed by double clicking on them. Arrow connections are preserved through '+
				'this process</p>' +	
    			'<h3 class="help">Restore from trash</h3><p class="help">Clicking on the trash can brings up a menu that allows you ' + 
    			'to restore previously deleted modules and append them to the current workspace. Follow instructions on load:append for how to append.</p>'+
    			'<h3 class="help">Separators</h3><p class="help">Double-clicking on a horizontal grid line allows the user to make a double-lined ' + 
				'separator on the diagram.</p>'
	})
}