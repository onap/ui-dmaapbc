/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Contains functions to convert diagram to BPMN and display in a #canvas div
var xmlText=null;
var lifelineBPMN = [];
var nodeXVal = [];
function convertToBPMN (m,BPMNFilename,whatToDo) {
	if (whatToDo!='source'){
		bootbox.hideAll();	
	}
	
	m = decodeJSON(m);
	n = JSON.parse(m);
	$.each(n.diagram.elements.nodes, function(index, value) {
	    var newText = value.innerText.replace(/&/g,"&amp;")
	    .replace(/"/g,"&quot;")
	    .replace(/'/g,"&apos;")
	    .replace(/</g,"&lt;")
	    .replace(/>/g,"&gt;");
	    value.innerText = newText;
	}); 
	var elementList = n.diagram.elements; //stores all elements
    var allNodes = n.diagram.elements.nodes;
    var allArrows = n.diagram.elements.arrows;
    var allNotes = n.diagram.elements.notes;
    var loadedRows = n.diagram.rows;
    var loadedCols = n.diagram.cols;
    var description = n.diagram.description;
    var transposeDown = 75;
    xmlText = '';
    lifelineBPMN.length=0;
    lifelineBPMN = [];
    nodeXVal.length=0;
    nodeXVal = [];
    xmlText  = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlText  += '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">\n';
    xmlText  += '	<bpmn:process id="Process_1" isExecutable="false">\n'
    for (var i=0; i<allNodes.length; i++){
    	getStartArrowDependants(allNodes[i].id);
    	getEndArrowDependants(allNodes[i].id);
    	xmlText  += '		<bpmn:task id="'+allNodes[i].id+'" name="'+allNodes[i].innerText+'">\n'
    	for (var j=0; j<startArrowDependants.length;j++){
    		xmlText += '			<bpmn:outgoing>'+startArrowDependants[j]+'</bpmn:outgoing>\n'
    	}
    	for (var j=0; j<endArrowDependants.length;j++){
    		xmlText += '			<bpmn:incoming>'+endArrowDependants[j]+'</bpmn:incoming>\n'
    	}
    	xmlText  += '		</bpmn:task>\n'
    	var tempId = guid();//
    	lifelineBPMN.push(tempId);//
    	xmlText  += '		<bpmn:task id="'+tempId+'" name="" />\n'//
    }
    for (var i=0; i<allArrows.length; i++){
    	xmlText  += '		<bpmn:sequenceFlow id="'+arrowArr[i][1]+'" name="'+arrowArr[i][2]+'" sourceRef="'+arrowArr[i][8]+'" targetRef="'+arrowArr[i][9]+'" />\n'
    }
    xmlText  += '	</bpmn:process>\n'
    xmlText  += '	<bpmndi:BPMNDiagram id="BpmnDiagram_1">\n'
    xmlText  += '		<bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1">\n'
    var maxY = 0;
	for (var i=0; i<arrowArr.length; i++){
		if (parseInt(arrowArr[i][4])>maxY){
			maxY = parseInt(arrowArr[i][4]);
		}		
	}
    for (var i=0; i<allNodes.length; i++){
        xmlText  += '			<bpmndi:BPMNShape id="'+allNodes[i].id+'_di" bpmnElement="'+allNodes[i].id+'">\n'
        xmlText  += '				<dc:Bounds x="'+parseInt(50+i*150)+'" y="50" width="100" height="80" />\n'
        xmlText  += '			</bpmndi:BPMNShape>\n'

        xmlText  += '			<bpmndi:BPMNShape id="'+lifelineBPMN[i]+'_di" bpmnElement="'+lifelineBPMN[i]+'">\n'//
        xmlText  += '				<dc:Bounds x="'+parseInt(100+i*150)+'" y="130" width="2" height="'+parseInt(maxY-25)+'" />\n'//
        nodeXVal.push(parseInt(100+i*150));
        xmlText  += '			</bpmndi:BPMNShape>\n'//
    }	
    
    for (var i=0; i<allArrows.length; i++){
   	 var arrowIndex = recallArray(arrowArr,allArrows[i].id); 
   	 	if (arrowArr[arrowIndex][8]!=arrowArr[arrowIndex][9]){
	    	 xmlText  += '			<bpmndi:BPMNEdge id="'+allArrows[i].id+'_di" bpmnElement="'+allArrows[i].id+'">\n'
	    	 for (var j=0; j<nodeArr.length; j++){
	    		 if(arrowArr[arrowIndex][8]==nodeArr[j][1]){
	    			 var startNodeIndex = j
	    		 }
	    		 if(arrowArr[arrowIndex][9]==nodeArr[j][1]){
	    			 var endNodeIndex = j
	    		 }
	    	 }
	    	 xmlText  += '				<di:waypoint xsi:type="dc:Point" x="'+nodeXVal[startNodeIndex]+'" y="'+(parseInt(arrowArr[arrowIndex][4])+parseInt(transposeDown))+'" />\n'
	    	 xmlText  += '				<di:waypoint xsi:type="dc:Point" x="'+nodeXVal[endNodeIndex]+'" y="'+(parseInt(arrowArr[arrowIndex][4])+parseInt(transposeDown))+'" />\n'
	    	 xmlText  += '				<bpmndi:BPMNLabel>\n'
	    		 var textWidth = parseInt((arrowArr[arrowIndex][2]).length) * 6
	    		 if (nodeXVal[startNodeIndex]<nodeXVal[endNodeIndex]){ //Points right, so place text left
	    		 xmlText  += '					<dc:Bounds x="'+((nodeXVal[startNodeIndex]+nodeXVal[endNodeIndex])/2-(textWidth/2))+'" y="'+parseInt(parseInt(arrowArr[arrowIndex][4])+parseInt(transposeDown)-20)+'" width="'+textWidth+'" height="20" />\n'
	    	 }
	    	 else{ //Points left, so place text right
	    		 xmlText  += '					<dc:Bounds x="'+((nodeXVal[startNodeIndex]+nodeXVal[endNodeIndex])/2-(textWidth/2))+'" y="'+parseInt(parseInt(arrowArr[arrowIndex][4])+parseInt(transposeDown)-20)+'" width="'+textWidth+'" height="20" />\n' 
	    	 }
	    	 xmlText  += '				</bpmndi:BPMNLabel>\n'
	    	 xmlText  += '			</bpmndi:BPMNEdge>\n'
    	}
    	else{
        	xmlText  += '			<bpmndi:BPMNEdge id="'+allArrows[i].id+'_di" bpmnElement="'+allArrows[i].id+'">\n'
    	   	 for (var j=0; j<nodeArr.length; j++){
    	   		 if(arrowArr[arrowIndex][8]==nodeArr[j][1]){
    	   			 var startNodeIndex = j
    	   		 }
    	   	 }
    	   	 xmlText  += '				<di:waypoint xsi:type="dc:Point" x="'+nodeXVal[startNodeIndex]+'" y="'+(parseInt(arrowArr[arrowIndex][4])+transposeDown-10)+'" />\n'
    	   	 xmlText  += '				<di:waypoint xsi:type="dc:Point" x="'+(parseInt(nodeXVal[startNodeIndex])+20)+'" y="'+(parseInt(arrowArr[arrowIndex][4])+transposeDown-10)+'" />\n'
    	   	 xmlText  += '				<di:waypoint xsi:type="dc:Point" x="'+(parseInt(nodeXVal[startNodeIndex])+20)+'" y="'+(parseInt(arrowArr[arrowIndex][4])+transposeDown+10)+'" />\n' 
    	   	 xmlText  += '				<di:waypoint xsi:type="dc:Point" x="'+nodeXVal[startNodeIndex]+'" y="'+(parseInt(arrowArr[arrowIndex][4])+transposeDown+10)+'" />\n'
    	   	 xmlText  += '				<bpmndi:BPMNLabel>\n'
    	   		var textWidth = parseInt((arrowArr[arrowIndex][2]).length) * 6	 							
    	     xmlText  += '					<dc:Bounds x="'+parseInt(nodeXVal[startNodeIndex]+20-textWidth/36)+'" y="'+parseInt(parseInt(arrowArr[arrowIndex][4])+transposeDown-10)+'" width="'+textWidth+'" height="20" />\n'
    	   	 xmlText  += '				</bpmndi:BPMNLabel>\n'
    	   	 xmlText  += '			</bpmndi:BPMNEdge>\n'
        }
    }
    
    xmlText  += '		</bpmndi:BPMNPlane>\n'
    xmlText  += '	</bpmndi:BPMNDiagram>\n'
    xmlText  += '</bpmn:definitions>'
    		
    //alert(xmlText);
    
    if (whatToDo=="save"){
    	var textToWrite = xmlText
    	var blob = new Blob([textToWrite], {type: "text/plain;charset=utf-8"});
    	
    	var downloadLink = document.createElement("a");

    	filename = BPMNFilename + ".BPMN";

    	downloadLink.download = filename;
    	downloadLink.innerHTML="Download File";
    	downloadLink.href = window.webkitURL.createObjectURL(blob);
    	downloadLink.click();
    }
    else if (whatToDo =="show"){
		bootbox.dialog({
			size:'large',
			message:'<div id="canvas" style="height:600px;"></div><div class="help" style="margin-top:25px;" id="exportButtons">Please save before exporting<br><b>Export as :<b><button class="little" style = "margin-left:15px;display:inline;color:white;" onclick="svgprint(4)">PNG low</button><button class="little" style="margin-left:15px;display:inline;color:white;" onclick="svgprint(6)">PNG med</button><button class="little" style="margin-left:15px;display:inline;color:white;" onclick="svgprint(8)">PNG high</button><button style="margin-left:15px;display:inline;color:white;" class="little" onclick="svgprint(10)">PNG super high</button></div>',
			animate:false,
			backdrop:true,
			onEscape: function() {},
			callback: function(result){
				if (result == true){
				
				}
			}
		});
		showBPMN(xmlText);
	}
    else if (whatToDo =="source"){
		return xmlText
	}
}

function showBPMN (xmlText) {
	var BpmnViewer = window.BpmnJS;

	var viewer = new BpmnViewer({ container: '#canvas' });

	viewer.importXML(xmlText, function(err) {
	  if (!err) {
	    console.log('success!');
	    viewer.get('canvas').zoom('fit-viewport');
	  } else {
	    console.log('something went wrong:', err);
	  }
	});
}

function svgprint (quality) {
	var setWide = $(document.querySelector('svg')).width();
	var setHeight = $(document.querySelector('svg')).height();
	$(document.querySelector('svg')).attr('width',setWide)
	$(document.querySelector('svg')).attr('height',setHeight)
	svgAsDataUri(document.querySelector('svg'), {scale:quality}, function(uri){
		console.log(uri)
		var img = new Image();
		img.src = uri;
		img.onload = function() {
			var canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			var context = canvas.getContext('2d');
			context.drawImage(img,0,0);
			
			var a = document.createElement('a');
			a.download = 'image.png';
			a.href = canvas.toDataURL('image/png');
			document.body.appendChild(a);
			a.click();
		}
	})
}