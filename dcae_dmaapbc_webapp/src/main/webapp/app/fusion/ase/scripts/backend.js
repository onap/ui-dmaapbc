/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Contains functions to save/export information, load/import from files, and update the titlebar

var m;
var doc;
var linePosition;
var lineSpacing;
var doubleLineNumbers = [];
var doubleLineText=[]
var doubleLineType=[]

//Creates a JSON data structure
function makeJSON () {
	if (nodeArr.length>1){
		for (var k = nodeArr.length-1; k>=0; k--){
			for (var j = 1; j<=k; j++){
				if (parseInt(document.getElementById(nodeArr[j-1][1]).getAttribute("data_x"))>parseInt(document.getElementById(nodeArr[j][1]).getAttribute("data_x"))) {
					var swap = nodeArr[j-1];
					nodeArr[j-1] = nodeArr[j];
					nodeArr[j] = swap;
				}
			}
		}
	}
	if (arrowArr.length>1){
		for (var k = arrowArr.length-1; k>=0; k--){
			for (var j = 1; j<=k; j++){
				if (parseInt(document.getElementById(arrowArr[j-1][1]).getAttribute("data_y"))>parseInt(document.getElementById(arrowArr[j][1]).getAttribute("data_y"))) {
					var swap = arrowArr[j-1];
					arrowArr[j-1] = arrowArr[j];
					arrowArr[j] = swap;
				}
			}
		}
	}
	var now = new Date;
	var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
             now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
	var canvasWidth = $("#grid").width() - $("#sideBar").width();

	doubleLineNumbers.length=0;
	doubleLineText.length=0;
	doubleLineType.length=0;
	var doubleElements = document.getElementsByClassName("doubleLine");
	$.each(doubleElements,function(index, value){
		doubleLineNumbers.push(($(value).attr('id')).substring(3));
		doubleLineText.push(value.children[0].innerHTML);
		doubleLineType.push($(value).attr('messageType'))
	});
	m = "";
	m +=  '{ "diagram": \n';
	m += '{ "created": "' + utc_timestamp +   '",\n';
	m += '"rows": "' + rows + '",\n';
	m += '"cols": "' + cols + '",\n';
	m += '"gridPitchy": "' + gridPitchy + '",\n';
	m += '"canvasHeight": "' + $("#grid").height() + '",\n';
	m += '"canvasWidth": "' + canvasWidth + '",\n';
	m += '"encoding": "base64",\n';
	m += '"elements": {"nodes": [\n';
	nodeArr.forEach(saveNodeArrayElements);
	m +=  '],\n "arrows": [\n';
	arrowArr.forEach(saveArrowArrayElements);
	m +=  '],\n "notes": [\n';
	noteArr.forEach(saveNoteArrayElements);
	m +=  '],\n "separators": [\n';
	doubleLineNumbers.forEach(saveSeparatorArrayElements);
	m += ']}}}';

	var n = JSON.parse(m);
	return m
	
}
function saveNodeArrayElements(element, index, array) {
	var myElement = document.getElementById(element[1]);
    var roleName = '';
	var infobox = "{\n";
	infobox += '"id":"' + myElement.id + '",\n';
	infobox += '"data_x": "' + myElement.getAttribute('data_x') + '",\n';
	infobox += '"data_y": "' + myElement.getAttribute('data_y') + '",\n';
	infobox += '"width": "' + $(myElement).width() + '",\n';
	infobox += '"innerText": "' + Base64.encode(myElement.getAttribute('sname')) + '",\n';
	infobox += '"bpmn": "' + Base64.encode($.trim(nodeArr[index][10])) + '",\n';
	if (myElement.getAttribute('taska_id')==null) myElement.setAttribute('taska_id',"");
	infobox += '"taska_id": "' + Base64.encode(myElement.getAttribute('taska_id')) + '",\n';
    if (nodeArr[index][0].hasAttribute('role_id')) {
    	roleName = myElement.getAttribute('role_id');
     }
	infobox += '"role": "' + Base64.encode(roleName) + '"\n';

	infobox += "}";
	if(index<array.length-1) infobox += ",";
	m +=  infobox;
}

function saveArrowArrayElements(element, index, array) {
	var myElement = document.getElementById(element[1]);
	var infobox = "{\n";
	infobox += '"id": "' + myElement.id + '",\n';
	infobox += '"data_x": "' + myElement.getAttribute('data_x') + '",\n';
	infobox += '"data_y": "' + myElement.getAttribute('data_y') + '",\n';
	infobox += '"width": "' + $(myElement).width() + '",\n';
	infobox += '"fromNodeID": "' + determineNodeStart(myElement.id) + '",\n';
	infobox += '"toNodeID": "' + determineNodeEnd(myElement.id) + '",\n';
	infobox += '"direction": "' + myElement.getAttribute('direction') + '",\n';
	infobox += '"innerText": "' + Base64.encode($.trim(myElement.innerText)) + '",\n';
	if (arrowArr[index][10]==null) arrowArr[index][10] = "";
	infobox += '"arrowDescription": "' + Base64.encode(arrowArr[index][10]) + '",\n';
	//Added on Sep, 24, 2015: store arrow description into the 
	var MessageType='';
    if (arrowArr[index][0].hasAttribute('message_type')) {
    	MessageType = $.trim(arrowArr[index][0].attributes.message_type.value);
     }
	infobox += '"messageType": "' + Base64.encode(MessageType) + '"\n'
	infobox += "}";
	if(index<array.length-1) infobox += ",";
	m  += infobox;
}
function saveNoteArrayElements(element, index, array) {
	var myElement = document.getElementById(element[1]);
	var infobox = "{\n";
	infobox += '"id":"' + myElement.id + '",\n';
	infobox += '"data_x": "' + myElement.getAttribute('data_x') + '",\n';
	infobox += '"data_y": "' + myElement.getAttribute('data_y') + '",\n';
	infobox += '"width": "' + $(myElement).width() + '",\n';
	infobox += '"height": "' + $(myElement).height() + '",\n';
	infobox += '"innerText": "' + Base64.encode($.trim(myElement.innerText)) + '"\n';
	infobox += "}";
	if(index<array.length-1) infobox += ",";
	m +=  infobox;
}
function saveSeparatorArrayElements(element, index, array) {
	var infobox = "{\n";
	infobox += '"lineNumber":"' + element + '",\n';
	try{
		infobox += '"text":"' + Base64.encode(doubleLineText[index]) + '",\n';
	}
	catch (err){
		infobox += '"text":""\n';
	}
	try{
	infobox += '"messageType":"' + Base64.encode(doubleLineType[index]) + '"\n';
	}
	catch (err){
	infobox += '"messageType":""\n';
	}
	infobox += "}";
	if(index<array.length-1) infobox += ",";
	m +=  infobox;
}

//SAVING///////////////////////////////////////////////////////

//Prompts user for destination, filename, etc. then saves accordingly
function saveDialog (){
	
//make a JSON format string that can be JSON.parsed
	makeJSON();
	ase.description = $('#description').html();
/*
	if (uid==null || uid=="" || uid=='<? print trim($_REQUEST["uid"]); ?>'){
		databaseHTML = 'Sorry, you are not authenticated to any database at this time.<p><a href="login.htm">Log In</a></p>'
	}
	else{
		databaseHTML = '<p style="font-style:italic;margin-left:10%;margin-top:0;margin-bottom:0;">Description</p><input id="saveDBDescription" type="text" size=60; style="margin-left:10%;width:75%;" value="'+ase.description+'" placeholder="Add description"><button style = "display:inline;" onclick="saveDBFile($(\'#saveDBDescription\').val())">Save!</button></div>'
	}
*/
	bootbox.dialog({
		backdrop:true,
		animate:false,
		onEscape: function() {},
		title: '<div style="float:left">Save/Export</div>',
		size: 'small',
		message: '<div id="saveWarning"></div><h4>Save locally to hard drive : </h4>'+
//		message: '<div id="saveWarning"></div>'+
		'<p style="font-style:bold;margin-left:0%;margin-top:0;margin-bottom:0;">Call Flow Name</p>'+
		'<input id="saveLocalDescription" type="text" size=60; style="width:70%;" value="'+ase.description+'" placeholder="Add description">'+
		'</br></br>' +
		'<button id="downloadButton" style="display:inline" onclick="saveLocalFile($(\'#saveLocalDescription\').val())">Save</button>' +
		'&nbsp' +
		'<br><hr>'
	});
	/*
	 * Let enter (13) submit the text
	 * Key "Enter" has the key code 13
	*/ 
/*	
	  	$("#saveLocalFileName").keyup( function(e) {
			if (e.keyCode == 13){
				description = $("#saveLocalDescription").val();
				// replace space with underscore
				name = ase.description.trim().replace(/ /g,"_");				
				saveLocalFile(description);
			}
		}); 
*/
		$("#saveLocalDescription").keyup( function(e) {
			if (e.keyCode == 13){
				description = $("#saveLocalDescription").val();
				// replace space with underscore
				saveLocalFile(description);
			}
		});
/*
		$("#saveDBDescription").keyup( function(e) {
			if (e.keyCode == 13){
				description = $("#saveDBDescription").val();
				saveDBFile(description);
			}
		});
*/
		/*
		* Selects all text in text box on focus
		* Local File Name Box is removed
		*/
		/*		$("#saveLocalFileName").click(function(){
			var currentInput = $("#saveLocalFileName").val();
			$("#saveLocalFileName"e).selectRange(0,currentInput.length);
		}); */
		$("#saveLocalDescription").click(function(){
			var currentInput = $("#saveLocalDescription").val();
			$("#saveLocalDescription").selectRange(0,currentInput.length);
		});
		$("#saveDBDescription").click(function(){
			var currentInput = $("#saveDBDescription").val();
			$("#saveDBDescription").selectRange(0,currentInput.length);
		});

		$("input[name=fileType]:radio").change(function () {
			if (document.getElementById('json').checked) {
				document.getElementById("saveWarning").innerHTML='';
			} else {
				document.getElementById("saveWarning").innerHTML='<i>*This file type is not reloadable. Please export a json as well as your desired filetype to enable yourself to edit this document in the future</i>';
			}
		})
}

function viewSource() {
	if (document.getElementById('yaml').checked) { //YAML
		sourceCode = convertToYaml(m)
		if (sourceCode==false){
			alert("Node(s) missing tosca ID")
		} else {
			alert(sourceCode);
		}
	}

	if (document.getElementById('json').checked) {
		decodeJSON(m,'show')
	};
}

function saveLocalFile(description) {
	var data = JSON.parse(m);
	var name = description.trim().replace(/ /g,"_");				

	$.extend(data.diagram,{"description":description});
	m=JSON.stringify(data,null,' ');
	var textToWrite = m;
/*	
  	if (document.getElementById('yaml').checked) { //YAML
		m = convertToYaml(textToWrite)
		if (m==false){
			bootbox.hideAll();
			bootbox.alert({
				size:'small',
				message:"<img src='triangle.png' height=15 width=15 style='margin-right:10px'>***Node(s) missing taska_id***",
				callback: function(result){

				}
			});
			return;
		}
		var blob = new Blob([m], {type: "text/plain;charset=utf-8"});
		ase.name = name
		name = name + ".yml";
	} else if (document.getElementById('bpmnio').checked) { //YAML
		convertToBPMN(m,name,'save')
		bootbox.hideAll();
		ase.name = name
		return;
	} 
	if (document.getElementById('json').checked) { //JSON
		var blob = new Blob([m], {type: "text/plain;charset=utf-8"});
		ase.name = name
		name = name + ".txt";
	}
*/

	var JSON_blob = new Blob([m], {type: "text/plain;charset=utf-8"});
	ase.name = name
	JSON_name = name + ".txt";
	
	YAMLString = convertToYaml(textToWrite)
	if (YAMLString==false){
		bootbox.hideAll();
		bootbox.alert({
			size:'small',
			message:"<img src='triangle.png' height=15 width=15 style='margin-right:10px'>***Node(s) missing taska_id***",
			callback: function(result){

			}
		});
		return;
	}
	var YAML_blob = new Blob([YAMLString], {type: "text/plain;charset=utf-8"});
	ase.name = name
	YAML_name = name + ".yml";

	if (navigator.appVersion.toString().indexOf('.NET') > 0) {
        window.navigator.msSaveBlob(JSON_blob, JSON_name);
		window.navigator.msSaveBlob(YAML_blob, YAML_name);
	} else {	
		var downloadLink = document.createElement("a");
		//window.description=description;
		ase.description = description;
		downloadLink.download = JSON_name;
		downloadLink.innerHTML="Download File";
		downloadLink.href = window.URL.createObjectURL(JSON_blob)||window.webkitURL.createObjectURL(JSON_blob);
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	
		var downloadLink = document.createElement("a");
		downloadLink.download = YAML_name;
		downloadLink.innerHTML="Download File";
		downloadLink.href = window.URL.createObjectURL(YAML_blob)||window.webkitURL.createObjectURL(YAML_blob);
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}
	resetTitleBar();
	bootbox.hideAll();

}

//Creates blob and exports to database
function saveDBFile(description) {
	bootbox.hideAll();

	var data = JSON.parse(m);
	$.extend(data.diagram,{"description":description});
	m=JSON.stringify(data,null,' ');

	//file name from description
	//fileName=description.trim().replace(/ /g,"_");
	
	// JSON
	var textToWrite = m;
	
	// YAML
	var ymlTextToWrite = convertToYaml(m);
	
	//window.description=description;
	ase.description=description;
	
	$.post("ase.htm?action=save",{
		jsonString:textToWrite,
		ymlString:ymlTextToWrite,
		callFlowName:description,
		uid:uid})
		.success(function(data){
			console.log("success");
			bootbox.alert({
				size:'small',
				message:'<img src="images/checkmark_yes.gif" height=15 width=15 style="margin-right:10px"> Successfully stored! </br>The call flow is accessible in the <a class="controls" href="../welcome.htm?showASE=true"><img class="controls">Network Simulator</a>',
				callback: function(result){
				}
			});
		})
		.error(function(jqXHR, textStatus, errorThrown){
			//console.log(textToWrite);
			bootbox.alert({
				size:'small',
				message:"<img src='triangle.png' height=15 width=15 style='margin-right:10px'>***Failed to save to Server***",
				callback: function(result){
				}
			});
		});
	
	
/*
	$.post("postjaml.htm",{
		jamlData:textToWrite,
		filename:description,
		uid:uid})
		.success(function(data){
			console.log("success");
		})
		.error(function(jqXHR, textStatus, errorThrown){
			//console.log(textToWrite);
			bootbox.alert({
				size:'small',
				message:"<img src='triangle.png' height=15 width=15 style='margin-right:10px'>***Failed to save to database***",
				callback: function(result){
				}
			});
		});
*/
	resetTitleBar();
}

//LOADING///////////////////////////////////////////////////////

//Prompts user to select file then loads
function loadDialog(){
	//load table into var
	var message = null;
	//$.get('loadableList.htm?sessiontoken=' + sessiontoken)
	//	.success(function(data){
	//var message = data;
	bootbox.dialog({
		backdrop:true,
		animate:false,
		onEscape: function() {},
		title: 'Load File',
		size: 'small',
		message: '<p><h4>Load locally from hard drive : </h4></p>' +
		'<input type="file" accept=".txt" name="fileToLoad" id = "fileToLoad"><button style = "display:inline;" onclick="loadFile(0);">Load</button></div>',
			//'<input type="file" accept=".txt" name="fileToLoad" id = "fileToLoad"><button style = "display:inline;" onclick="loadFile(0);">Replace!</button><button style = "display:inline;" onclick="loadFile(1);">Append!</button><button style = "margin-left:10px;display:inline;" onclick="loadFile(2);">Source</button></div>'+
				//'<br><hr>'+
				//'<p><h4>Load from database : </h4></p>'+message
				
		});
		/*
		},"text")
		.error(function(jqXHR, textStatus, errorThrown){ //If server not reached
			//console.log(jqXHR+' ' +textStatus+' ' +errorThrown);
			var message = '<i>Error: Database not detected or configured</i>';
			bootbox.dialog({
				backdrop:true,
				animate:false,
				onEscape: function() {},
				title: 'Load File',
				size: 'small',
				message: '<p><h4>Load locally from hard drive : </h4></p>' +
					'<input type="file" accept=".txt" name="fileToLoad" id = "fileToLoad"><br><button style = "display:inline;" onclick="loadFile(0);">Load</button></div>',
				//'<input type="file" accept=".txt" name="fileToLoad" id = "fileToLoad"><button style = "display:inline;" onclick="loadFile(0);">Replace!</button><button style = "display:inline;" onclick="loadFile(1);">Append!</button><button style = "margin-left:10px;display:inline;" onclick="loadFile(2);">Source</button></div>'+
				//'<br><hr>'+
				//'<p><h4>Load from database : </h4></p>'+message

			});
		});
		*/
}



function loadFile(typeOfLoad,preloadedFile,preloadedJSON) {
	//Case of load locally
	if(preloadedFile==null && preloadedJSON==null){
		var file = document.getElementById("fileToLoad").files[0];
		var reader = new FileReader();
		reader.onload = recievedText;
		reader.readAsText(file);
	}
	//Not used, but can be useful if you load the page with a parameter of "preloadedJSON"
	else if (preloadedFile==null && preloadedJSON!=null){
		recievedText(preloadedJSON);
	}
	//Case of load from server
	else if (preloadedFile!=null && preloadedJSON==null){
		$.get(preloadedFile,function(data){
			recievedText(data);
		});
	}
	function recievedText (importedText) { //Called when fully loaded
		var textFromFileLoaded ="";
		if (preloadedFile === null && preloadedJSON === null) {
			var textFromFileLoaded = reader.result;
	    	//var path = document.getElementById("fileToLoad").value;
	    	//var loadedFilename = path.replace(/^.*\\/,"");
		} else {
			textFromFileLoaded = importedText;
		}
		
		m = decodeJSON(textFromFileLoaded,null);
		console.log("m=" + m);
		
		var n = JSON.parse(m);

		var elementList = n.diagram.elements; //stores all elements
        var allNodes = n.diagram.elements.nodes;
        var allArrows = n.diagram.elements.arrows;
        var allNotes = n.diagram.elements.notes;
        var loadedRows = n.diagram.rows;
        var loadedCols = n.diagram.cols;
        var description = n.diagram.description
        

        //Promotes backwards compatibility to before descriptions were added
        try {
        	var path = document.getElementById("fileToLoad").value;
	    	var loadedFilename = path.replace(/^.*\\/,"");
        }
        catch (err){
        	var loadedFilename = description;
        }

        //Replace
		if (typeOfLoad == 0){
			bootbox.hideAll();
	        //window.description = n.diagram.description;
	        ase.description = n.diagram.description;
	        $('#description').text(ase.description);
	        linesToMakeDouble = []
	        doubleLineText = []
	        doubleLineType = []
        	var separators = n.diagram.elements.separators;
	        if (separators == null) separators = [] //Backwards compatibility
	        $.each(separators,function(index, value){
        		linesToMakeDouble.push(value.lineNumber);
        		doubleLineText.push(value.text);
        	// Added on Sept 24, 2015
        	// double line separator should not store message type
        	doubleLineType.push(value.messageType);
        	});

	        rows=loadedRows;
			cols=loadedCols;
			newProject(linesToMakeDouble,doubleLineText,loadedRows,doubleLineType);
			document.getElementById('grid').style.height = 91.5 + (rows-initialRows)*6 + '%'; //Increases height by 6%
			for (var j = 0; j<loadedCols-initialCols; j++){
				addWidth();
			}
			var nodeArr = [], arrowArr = [];

			if (loadedFilename.slice(-3) == "txt"){
				loadedFilename =loadedFilename.substring(0, loadedFilename.length-4);
			}
			ase.name = loadedFilename;

			resetTitleBar();
			loadEverything(0,"replace");
			adjustWidth();
		//Append
		} else if (typeOfLoad == 1){
			bootbox.hideAll();
			$("#nodeZone").addClass('drop-target');
			$("#nodeZone").css('cursor','crosshair');
			document.getElementById("titleBar").innerHTML = '<div class="center" style="width:25%;">Click here to append then press okay <button id="appendBtn" style="margin-left:10px;">Okay!</button></div>';

			//Resets the append spot
			document.getElementById("appendSpot").style.visibility='visible';
			document.getElementById("appendSpot").style.webkitTransform =
				document.getElementById("appendSpot").style.transform =
					'translate(' + 250 + 'px, ' + 22 + 'px)';
			document.getElementById("appendSpot").setAttribute("x",250);
			document.getElementById("appendSpot").setAttribute("y",22);

			//Need to account for user clicking on either #nodeZone or a node (with class .nodeDraggable)
			$("#nodeZone").on('click',function(event){
				window.tapX = event.pageX;
				window.tapY = event.pageY;
				var transposeX = Math.round((tapX)/160)*160-70;
				var transposeY = 22;
				document.getElementById("appendSpot").style.webkitTransform =
					document.getElementById("appendSpot").style.transform =
						'translate(' + transposeX + 'px, ' + transposeY + 'px)';
				document.getElementById("appendSpot").setAttribute("x",transposeX);
			});
			$(".nodeDraggable").on('click',function(event){
				window.tapX = event.pageX;
				window.tapY = event.pageY;
				var transpose = Math.round((tapX)/160)*160-70;
				var transposeY = 22;
				document.getElementById("appendSpot").style.webkitTransform =
					document.getElementById("appendSpot").style.transform =
						'translate(' + transposeX + 'px, ' + transposeY + 'px)';
				document.getElementById("appendSpot").setAttribute("x",transposeX);
			});

			//On clicking append, transposes elements to be appended at the selected spot
			$("#appendBtn").on("click",function(){
				document.getElementById("appendSpot").style.visibility='hidden';
				var transpose = document.getElementById("appendSpot").getAttribute("x");
				if (loadedRows>rows){
					var deltaRow = loadedRows-rows
					for (var i = 0; i<deltaRow; i++){
						addHeight();
					}
					rows=loadedRows;
				}
				//Cols are dealt with in storeArray()
				$("#nodeZone").removeClass('drop-target');
				$("#nodeZone").css('cursor','auto');

				if (loadedFilename.slice(-3) == "txt"){
					loadedFilename =loadedFilename.substring(0, loadedFilename.length-4);
				}
				name = name + "_&_" + loadedFilename
				resetTitleBar();
				loadEverything(transpose,"append");
				adjustWidth();
			});
		} else {
			decodeJSON(textFromFileLoaded,"show");
		}

		function loadEverything (transpose,typeOfLoad){
			for (var i in allNodes ){
	           var text = allNodes[i].innerText;
	           var id = guid();
	           if (typeOfLoad == "append"){
	        	   var lX = parseInt(allNodes[i].data_x) - parseInt(allNodes[0].data_x) + parseInt(transpose);
	           }
	           else {
	        	   var lX = parseInt(allNodes[i].data_x);
	           }
	           var lY = allNodes[i].data_y;
	           var wide = allNodes[i].width;
	           var arrayType="nodeArr";
	           var roleName = '';
	           roleName = allNodes[i].role;
	           console.log('role name:')
	           console.log(roleName)
	           storeArray(arrayType, i, id, text, lX, lY, wide,null, null,allNodes[i].bpmn,allNodes[i].taska_id, null, null, roleName);
			}
			for (var i in allArrows ){
	           var text = allArrows[i].innerText;
	           var id = guid();
	           if (typeOfLoad == "append"){
	        	   var lX = parseInt(allArrows[i].data_x) - parseInt(allNodes[0].data_x) + parseInt(transpose);
	           }
	           else {
	        	   var lX = parseInt(allArrows[i].data_x);
	           }
	           var lY = allArrows[i].data_y;
	           var wide = allArrows[i].width;
	           var direction = allArrows[i].direction;
	           var arrayType="arrowArr";
	           var MessageTypeName = allArrows[i].messageType;
//	           storeArray(arrayType, i, id, text, lX, lY, wide,direction, null,null,null,allArrows[i].arrowDescription);
	           storeArray(arrayType, i, id, text, lX, lY, wide,direction, null,null,null,allArrows[i].arrowDescription, MessageTypeName);
	           warning();
			}
			for (var i in allNotes ){
		       var text = allNotes[i].innerText;
		       var id = guid();
	           if (typeOfLoad == "append"){
	        	   var lX = parseInt(allNotes[i].data_x) - parseInt(allNodes[0].data_x) + parseInt(transpose);
	           }
	           else {
	        	   var lX = parseInt(allNotes[i].data_x);
	           }
		       var lY = allNotes[i].data_y;
		       var wide = allNotes[i].width;
		       var height = allNotes[i].height;
		       var arrayType="noteArr";
		       storeArray(arrayType, i, id, text, lX, lY, wide, null, height);
			}
			//fitToDoc(); /// Doesn't really work well. 
		}
	}
}

function decodeJSON (m,whatToDo) {
	data = JSON.parse(m);
//	console.log('Loaded JS Object:')
//	console.log(data)
	if (data.diagram.encoding == "base64"){
		$.each(data.diagram.elements.nodes, function(index, value) {
		    var newText = Base64.decode(value.innerText);
		    value.innerText = newText
		    if (value.bpmn != null && value.bpmn != ""){
			    var newXML = Base64.decode(value.bpmn);
			    value.bpmn = newXML
		    }
		    if (value.taska_id != null && value.taska_id  != ""){
			    var newXML = Base64.decode(value.taska_id );
			    value.taska_id  = newXML
		    }
		    //role added to each node
		    if (value.role != null && value.role  != ""){
			    var newXML = Base64.decode(value.role );
			    value.role  = newXML
		    }
		});
		$.each(data.diagram.elements.arrows, function(index, value) {
		    var newText = Base64.decode(value.innerText);
		    value.innerText = newText
		    if (value.arrowDescription != null && value.arrowDescription != ""){
			    var newXML = Base64.decode(value.arrowDescription);
			    value.arrowDescription = newXML
		    }
		    //decode messageType
		    if (value.messageType != null && value.messageType != ""){
			    var newXML = Base64.decode(value.messageType);
			    value.messageType = newXML
		    }
		    
		});
		$.each(data.diagram.elements.notes, function(index, value) {
		    var newText = Base64.decode(value.innerText);
		    value.innerText = newText
		});
		$.each(data.diagram.elements.separators, function(index, value) {
		    var newText = Base64.decode(value.text);
		    value.text = newText
		    if (value.messageType!=null && value.messageType != ""){
		    	var newText = Base64.decode(value.messageType);
		    	value.messageType = newText;
		    }

		});
	}
	m=JSON.stringify(data,null,' ');
	if(whatToDo=="show") alert(m);
//	console.log('Generated JSON:')
//	console.log(m)
	return m
	
}

function adjustWidth () {
	var maxX = 0;
	for (var i=0; i<nodeArr.length; i++){
		if (nodeArr[i][3]>maxX){
			maxX = nodeArr[i][3];
		}
	}
	while (maxX>$("#grid").width() - $("#sideBar").width()){
		addWidth();
	}
}

function resetTitleBar () {
	//if (uid==null || uid=="" || uid==''){
	//	document.getElementById("titleBar").innerHTML = '<h3 class=titleBar>' + description + '</h3><div id = "loginArea" class="notLoggedIn" onClick="logIn();">Log In</div>';
	//}
	//else{
		//document.getElementById("titleBar").innerHTML = '<h3 class=titleBar>' + description + '</h3><div id = "loginArea" class="loggedIn" onClick="showInfo();">Hello, '+username+'<img style="position:absolute;top:0;right:-20px;" src="./images/downCaret.gif" height=20 width=auto></div>';
		$("h3 .titleBar").html(ase.description);
		/*
		$('.loggedIn').tooltipster({
			minWidth:200,
	    	theme: 'tooltipster-shadow',
	    	interactive:true,
	    	trigger:'hover',
	    	contentAsHTML:true,
	    	content: 'Hello '+username+' how are you'+
	    	'<p>Your diagram has'+
	    	'<li style="margin-left:20px;">'+nodeArr.length+' nodes</li>'+
	    	'<li style="margin-left:20px;">'+arrowArr.length+' arrows</li><br>'+
	    	'<a href="index.htm">Log out</a>'
		});
 		*/
	//}
}

function logIn () {
	open("login.htm");
	resetTitleBar();
}

function showInfo () {
	//Called when user clicks on their name after they are logged in
}

//Allows editing title by double clicking on the top bar
$("#titleBar").dblclick(function(event) {
	var presetSelectMenu=''
	presetSelectMenu+='<form action="#"><fieldset class="selectMenu"><label class="selectMenu" for="presetSelect">Preset:</label><select name="presetSelect" id="presetSelect">'
    for (var i=0; i<presetNames.length; i++){
    	if (window.selectedPreset!=presetNames[i]) presetSelectMenu+='<option class="selectMenu">'+presetNames[i]+'</option>'
    	else presetSelectMenu+='<option class="selectMenu" selected="selected">'+presetNames[i]+'</option>'
    }
	presetSelectMenu+='</select></fieldset></form>'
	bootbox.confirm({
		size:'small',
		backdrop:true,
		onEscape: function() {},
		title: "Change file attributes",
		message:'Filename: <br><input id="saveFileName" type="text" value="'+name+'">'+
		'<br><br>Description: <br><textarea id="saveDescription" rows="10" placeholder="Add description">'+description+'</textarea>'+
		'<br><div class="selectMenu">'+presetSelectMenu+'</div>',
		callback: function(result){
			if (result == true){
				name = $("#saveFileName").val();
				description = $("#saveDescription").val();
				window.selectedPreset = document.getElementById('presetSelect-button').textContent;
				resetTitleBar();
			}
		}
	});
	$( "#presetSelect" ).selectmenu();
	$('#presetSelect-button').css('width','inherit');
	$('#presetSelect-button').css('top',10);
	$('#presetSelect-button').css('font-size','14px')
	$('#presetSelect-button').css('margin-left',10)
	$("#saveFileName").click(function(){
		currentInput = $("#saveFileName").val();
		$("#saveFileName").selectRange(0,currentInput.length);
	});
	$("#saveDescription").click(function(){
		currentInput = $("#saveDescription").val();
		$("#saveDescription").selectRange(0,currentInput.length);
	});
});

//SELECT TEXT RANGE
$.fn.selectRange = function(start, end) {
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

