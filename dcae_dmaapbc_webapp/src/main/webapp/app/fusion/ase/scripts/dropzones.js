/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Contains interactions and functions that control dropzone behaviors

//Creates the node dropzone///////////////////////////////////////////////////////////////////////
interact('.nodeDropzone').dropzone({
	// Require a 50% element overlap for a drop to be possible
	overlap: 0.50,
	accept: '.drag-1',
	// listen for drop related events:

	ondropactivate: function (event) {
		// add active dropzone feedback
		event.target.classList.add('drop-active');
	},
	ondragenter: function (event) {
		var draggableElement = event.relatedTarget,
		dropzoneElement = event.target;

		// feedback the possibility of a drop
		dropzoneElement.classList.add('drop-target');
		draggableElement.classList.add('can-drop');
		if (!$(draggableElement).hasClass("placed")){
			draggableElement.textContent = 'You can drop me anywhere!';
		}
	},
	ondragleave: function (event) {
		// remove the drop feedback style
		event.target.classList.remove('drop-target');
		event.relatedTarget.classList.remove('can-drop');
		event.relatedTarget.textContent = 'Dragged out';
	},
	ondrop: function (event) {
		grabbedNode = event.relatedTarget;
		var toscaID = $(grabbedNode).attr('taska_id');
		var serviceName = "";
	    for ( var i = 0; i <= networkMap.length; i++ ) {
	        if ( networkMap[i].tosca_id == toscaID ) {
	            serviceName = networkMap[i].displayShortname;
	            
	            break;
	        }
	    }
		uuid = grabbedNode.id;
		event.relatedTarget.textContent = 'Placed on grid';
		if ($(grabbedNode).hasClass("placed")){
			recallArray(nodeArr, uuid);
			createNode(text, uuid);
		}
		if (!$(grabbedNode).hasClass("placed")){
			var index = recallArray(nodeArr, uuid);
			nodeArr[index][8] = null;
			nodeArr[index][9] = null;
			nodeArr[index][10] = null;
			// When Node is placed this is the popup box that appears.
			bootbox.confirm({
				closeButton: false,
				backdrop: true,
				animate: false,
				size: 'small',
				title: 'Add Element ' + serviceName,  
				onEscape: function() {},
				message: '<div style="color:grey;font-size:12px;"><br>Role : <input id="rolefield" style="width:100%;" type="text" placeholder="Add role for network element" value=""></div>',
				callback: function(result) {
					if (result == true) {
						//EXECUTE THIS ON OKAY///
						var text = serviceName;
               		    document.getElementById(nodeArr[index][1]).setAttribute("taska_id",toscaID);
						document.getElementById(nodeArr[index][1]).setAttribute("role_id",$("#rolefield").val());
						document.getElementById(nodeArr[index][1]).setAttribute("sname",serviceName);
						
						pushToDict(text, "node");
						storeText(nodeArr, uuid, text);
						grabbedNode.classList.add('placed');
						grabbedNode.classList.add('verticallyScrollable');
						if (isOverlapped(uuid) == false) {
							for (var i = 0; i < arrowArr.length; i++) {
								determineLRNode(arrowArr[i][1], uuid);
									}
						}
						createNode(text, uuid);
						for (var i = 0; i < arrowArr.length; i++) {
							determineLRNode(arrowArr[i][1], uuid);
						}
						clearSelection();
						/////////////////////////
					}
				}
			});
        	$("#rolefield").autocomplete({
            	source: window[window.selectedPreset+"Role"],
            	autoFocus: true,
            	delay: 0
        	});

        	$("#rolefield").keyup( function(e) {
		    	if (e.keyCode == 13){
			   		$(document.getElementsByClassName('btn-primary')[0]).click();
		    	}
        	});

		/* #nodeInnerText Code no longer needed Harde Codedd information. */
	}

		function createNode(text, uuid) {
			var nodeHeight = parseInt($("#" + uuid).height());
			nodeHeightCorrected = nodeHeight + 16;
			var gridHeight = document.getElementById('grid').clientHeight;
			gridHeightCorrected = gridHeight - 90;
			if ($("#" + uuid).hasClass("expanded") == true) {
				event.relatedTarget.innerHTML = '<div class="hasNodesHeader">' + text +
					'</div>' +
					'<div class="hasNodesBackground" style="height:' + gridHeightCorrected +
					'px"></div>' +
					'<div class="verticalLine" style = "margin-left:0px; top:' +
					nodeHeightCorrected + 'px;height:' + gridHeightCorrected +					'px;"></div>';
			} else if ($("#" + uuid).hasClass("collapsed") == true) {
				document.getElementById(uuid).innerHTML =
					'<div class="nodeText nodeEllipsis">' + text +
					'</div><div class="verticalLine" style = "top:' + nodeHeightCorrected +
					'px;height:' + gridHeightCorrected +
					'px;"></div><div class="collapsedPlus">+</div>';
			} else {
				event.relatedTarget.innerHTML = '<div class="nodeText nodeEllipsis">' +
					text + '</div><div class="verticalLine" style = "top:' +
					nodeHeightCorrected + 'px;height:' + gridHeightCorrected +
					'px;"></div>';
			}


		}
	},
	ondropdeactivate: function(event) {
		// remove active dropzone feedback
		event.target.classList.remove('drop-active');
		event.target.classList.remove('drop-target');
	}
})
.on('tap', function(event) {
	if (event.button == 0) {
		clearSelection();
	}
});

var textsToInsert = [];

function addMultipleNodes(uuidToDelete, leftX) {
	textsToInsert.length = 0;
	textsToInsert = [];
	bootbox.hideAll();
	bootbox.dialog({
		title: 'Add multiple nodes',
		message: '<input id="bulkNodeTextBox" type="text" style="margin-left:5%;width:90%;" placeholder="Add node text">' +
			'<div id="listOfText" style="margin-top:10px;"><h4>Nodes to be added:</h4></div>',
		onEscape: function() {},
		closeButton: true,
		animate: false,
		buttons: {
			Insert: {
				label: 'Insert',
				callback: function() {
					for (var i = 0; i < nodeArr.length; i++) {
						if (nodeArr[i][1] == uuidToDelete) {
							nodeArr.splice(i, 1);
							warning();
							break;
						}
					}
					document.getElementById(uuidToDelete).remove();
					for (var i = 0; i < textsToInsert.length; i++) {
						id = guid();
						storeArray("nodeArr", i, id, textsToInsert[i], leftX + i * 160, 22,
								100, null, null)
							//if (i!=0) shiftByDx(160,id);
					}
				}
			}
		}
	});
	$("#bulkNodeTextBox").focus();
	$("#bulkNodeTextBox").keyup(function(e) {
		if (e.keyCode == 13) {
			index = textsToInsert.push($("#bulkNodeTextBox").val());
			var addHTML = '<div id="text' + index +
				'"><div style="cursor:pointer;display:inline;margin-right:15px;" onclick="removeThis(event,this);">x</div><div style="display:inline;">' +
				$("#bulkNodeTextBox").val() + '</div></div>'
			document.getElementById("listOfText").innerHTML += addHTML;
			$("#bulkNodeTextBox").val('');
			$("#bulkNodeTextBox").focus();
		}
	});
}

function removeThis(event, ha) {
	removeIndex = textsToInsert.indexOf(event.target.nextSibling.textContent)
	textsToInsert.splice(removeIndex, 1)
	event.target.parentNode.remove();
	console.log(textsToInsert);
}

//Checks for overlaps
function isOverlapped(uuid) {
	for (var i = 0; i < nodeArr.length; i++) {
		calcChildren(nodeArr[i][1]);
	}
	index = recallArray(nodeArr, uuid);
	calcChildren(nodeArr[index][1]);
	var x = parseInt(document.getElementById(uuid).getAttribute("data_x"));
	for (var i = 0; i < nodeArr.length; i++) {
		if (uuid == nodeArr[i][1] || selection.indexOf(nodeArr[i][1]) != -1 ||
			nodeArr[index][8] == nodeArr[i][1] || childrenIDs.indexOf(nodeArr[i][1]) !=
			-1 || $('#' + nodeArr[i][1]).css('display') == 'none') {
			continue;
		}
		if (nodeArr[i][3] == x) {
			return true;
		}
	}
	return false;
}

//If overlaps are detected, this moves them to the right
var shiftMe = [];

function shiftRight(target, dx) {
	document.getElementById(target.id).style.background = "#29e"; //remove yellow
	var x = parseInt(document.getElementById(target.id).getAttribute("data_x"));
	shiftMe.length = 0;
	index = recallArray(nodeArr, target.id);
	for (var i = 0; i < nodeArr.length; i++) {
		if (target.id == nodeArr[i][1] || selection.indexOf(nodeArr[i][1]) != -1 ||
			nodeArr[i][8] == nodeArr[index][1] || $('#' + nodeArr[i][1]).css('display') ==
			'none') {
			continue;
		}
		if (nodeArr[i][3] == x) { //Found an overlap
			shiftMe.push(nodeArr[i][1]);
			for (var j = 0; j < nodeArr.length; j++) {
				if (nodeArr[j][3] > nodeArr[i][3] && selection.indexOf(nodeArr[j][1]) == -1 &&
					$('#' + nodeArr[i][1]).css('display') != 'none') { //found node to the right of overlap
					shiftMe.push(nodeArr[j][1]);
				}
			}
		}
	}
	for (var i = 0; i < shiftMe.length; i++) {
		shiftedID = shiftMe[i];
		var dy = 0;
		var x = parseInt(document.getElementById(shiftedID).getAttribute("data_x")) +
			dx;
		var y = parseInt(document.getElementById(shiftedID).getAttribute("data_y")) +
			dy;

		document.getElementById(shiftedID).style.webkitTransform =
			document.getElementById(shiftedID).style.transform =
			'translate(' + x + 'px, ' + y + 'px)';

		// update the position attributes
		document.getElementById(shiftedID).setAttribute('data_x', x);
		document.getElementById(shiftedID).setAttribute('data_y', y);

		storeXY(nodeArr, shiftedID);

		startArrowDependants.length = 0;
		endArrowDependants.length = 0;

		getStartArrowDependants(shiftedID);
		getEndArrowDependants(shiftedID);

		moveDependants(dx, dy, shiftedID);
	}
	getLifelines();
}

//Creates the arrow dropzone//////////////////////////////////////////////////////////////////////
interact('.arrowDropzone').dropzone({
		// Require a 75% element overlap for a drop to be possible
		overlap: 0.75,
		accept: '.gridDropzone',
		// listen for drop related events:

		ondropactivate: function(event) {
			// add active dropzone feedback
			event.target.classList.add('drop-active');
		},
		ondragenter: function(event) {
			var draggableElement = event.relatedTarget,
				dropzoneElement = event.target;

			// feedback the possibility of a drop
			dropzoneElement.classList.add('drop-target');
			draggableElement.classList.add('can-drop');
		},
		ondragleave: function(event) {
			// remove the drop feedback style
			event.target.classList.remove('drop-target');
			event.relatedTarget.classList.remove('can-drop');
		},
		ondrop: function(event) {
			grabbedNode = event.relatedTarget
			uuid = grabbedNode.id;
			if ($(grabbedNode).hasClass("arrowPlaced")) {
				determineLRNode(uuid, "arrow");
			}
			if (!$(grabbedNode).hasClass("arrowPlaced") && !$(grabbedNode).hasClass(
					"note")) {
				bootbox.confirm({
					closeButton: false,
					backdrop: true,
					animate: false,
					size: 'small',
					title: "Add Link",
					onEscape: function() {},
						message: 'Link Message: <br> <input id="arrowInnerText" style="width:100%;" type="text" placeholder="Add text here" value="">' +
						'<br>Description: <br><textarea id="arrowDescription" rows="5" placeholder="Add description (optional)"></textarea>' +
						'<br>Message Type: <br> <select id="arrowMessageType" style="width:100%;"><option value="signal" selected="selected">Signal</option><option value="media">Media</option></select>',
					callback: function(result) {
						if (result == true) {
							var innerText = $("#arrowInnerText").val();
							var messageType = $("#arrowMessageType").val();
							
							pushToDict(innerText, "arrow");
							var index = storeText(arrowArr, uuid, innerText);
							makeArrow(uuid);
							arrowArr[index][10] = $("#arrowDescription").val();
							if ($("#arrowDescription").val() == null) arrowArr[index][10] = "";
							grabbedNode.classList.add('arrowPlaced');
							grabbedNode.classList.add('resizable');
							grabbedNode.setAttribute("direction", "right");
							grabbedNode.setAttribute("message_type",messageType);
							grabbedNode.innerHTML =
								'<div class="arrow" style="display:inline; width:100%"><div class="makeEllipsis arrowText">' +
								innerText +
								'</div></div><div class="triangle" style="display:inline;"></div>';
							determineLRNode(uuid, "arrow");
						}
					}
				});
				$("#arrowInnerText").autocomplete({
					source: arrowTags,
					autoFocus: true,
					delay: 0
				});
				$("#arrowMessageType").autocomplete({
					source: messageTags,
					autoFocus: true,
					delay: 0
				});

				var currentInput = $("#arrowInnerText").val();
				$("#arrowInnerText").selectRange(0, currentInput.length);
				$("#arrowInnerText").click(function() {
					var currentInput = $("#arrowInnerText").val();
					$("#arrowInnerText").selectRange(0, currentInput.length);
				});
				$("#arrowInnerText").keyup(function(e) {
					if (e.keyCode == 13) {
						$(document.getElementsByClassName('btn-primary')[0]).click();
					}
				});

			}

			if ($(grabbedNode).hasClass("notePlaced")) {

			}
			if (!$(grabbedNode).hasClass("notePlaced") && $(grabbedNode).hasClass(
					"note")) {
				bootbox.prompt({
					closeButton: false,
					backdrop: true,
					animate: false,
					size: 'small',
					title: "Add Note",
					value: "add text here",
					placeholder: "add text here",
					callback: function(result) {
						if (result != null) {
							//EXECUTE THIS ON OKAY///
							var innerText = result;
							pushToDict(innerText, "note");
							var index = storeText(noteArr, uuid, innerText);
							grabbedNode.classList.add('notePlaced');
							grabbedNode.innerHTML = innerText;
							/////////////////////////
						}
					}
				});
				$("#box").autocomplete({
					source: noteTags,
					autoFocus: true,
					delay: 0
				});
			}
		},
		ondropdeactivate: function(event) {
			// remove active dropzone feedback
			event.target.classList.remove('drop-active');
			event.target.classList.remove('drop-target');
		}
	})
	.on('tap', function(event) {
		if (event.button == 0) {
			clearSelection();
		}
	});

var deletedNodes = [];
var deletedArrows = [];
var deletedNotes = [];
//Creates the trashbin as a dropzone and deletes children dropped into it/////////////////////////////////////////////////
interact('.trash').dropzone({
	// Require a 10% element overlap for a drop to be possible
	overlap: 0.1,

	// listen for drop related events:

	ondropactivate: function(event) {
		// add active dropzone feedback
		event.target.classList.add('drop-active');
	},
	ondragenter: function(event) {
		var draggableElement = event.relatedTarget,
			dropzoneElement = event.target;

		// feedback the possibility of a drop
		dropzoneElement.classList.add('drop-targetTrash');
		draggableElement.classList.add('can-drop');
	},
	ondragleave: function(event) {
		// remove the drop feedback style
		event.target.classList.remove('drop-targetTrash');
		event.relatedTarget.classList.remove('can-drop');
	},
	ondrop: function(event) {
		event.relatedTarget.textContent = 'Dropped';
		//DELETES THE ELEMENT
		document.getElementById("trash").src = "../images/trashCanFull.gif";
		draggableElement = event.relatedTarget;
		id = event.relatedTarget.id;
		if ($("#" + id).hasClass("nodeDraggable")) {
			for (var i = 0; i < nodeArr.length; i++) {
				if (nodeArr[i][1] == id) {
					deletedNodes.push(nodeArr[i]);
					nodeArr.splice(i, 1);
					warning();
					break;
				}
			}
		}
		if ($("#" + id).hasClass("arrowDraggable")) {
			for (var i = 0; i < arrowArr.length; i++) {
				if (arrowArr[i][1] == id) {
					deletedArrows.push(arrowArr[i]);
					deletedArrows[deletedArrows.length - 1][10] = document.getElementById(
						arrowArr[i][1]).getAttribute("direction");
					arrowArr.splice(i, 1);
					warning();
					break;
				}
			}
		}
		if ($("#" + id).hasClass("note")) {
			for (var i = 0; i < noteArr.length; i++) {
				if (noteArr[i][1] == id) {
					deletedNotes.push(noteArr[i]);
					noteArr.splice(i, 1);
					break;
				}
			}
		}
		draggableElement.parentNode.removeChild(draggableElement);
		clearSelection();
	},
	ondropdeactivate: function(event) {
		// remove active dropzone feedback
		event.target.classList.remove('drop-active');
		event.target.classList.remove('drop-targetTrash');
	}
});

interact('.trash')
	.on('click', function(event) {
		//Create restore menu
		bootbox.dialog({
			backdrop: true,
			onEscape: function() {},
			title: "<img src=\'../images/trashCan.gif\' height=\'35\' width=\'auto\'>TrashBin",
			size: 'large',
			message: '<div id="trashItems"><div id="nodeItems"><h4>Nodes</h3><ol id="nodeOL"></ol><hr></div><div id="arrowItems"><h4>Arrows</h3><ol id="arrowOL"></ol><hr></div><div id="noteItems"><h4>Notes</h3><ol id="noteOL"></ol><hr></div></div>' +
				'<script>' +
				'for (var i=0;i<deletedNodes.length;i++){' +
				'document.getElementById("nodeOL").innerHTML+= "<li><h6 style=\'margin:0px;\'><pre>"+ deletedNodes[i][2] +"    |    "+deletedNodes[i][1]+"    |    {x:"+deletedNodes[i][3]+",y:"+deletedNodes[i][4]+"}        <div onClick = \'restoreElement("+i+",0)\' style=\'display:inline;cursor:pointer;color:red;\'>Restore</div></pre></h6></li>";' +
				'}' +
				'for (var i=0;i<deletedArrows.length;i++){' +
				'document.getElementById("arrowOL").innerHTML+= "<li><h6 style=\'margin:0px;\'><pre>"+ deletedArrows[i][2] +"    |    "+deletedArrows[i][1]+"    |    {x:"+deletedArrows[i][3]+",y:"+deletedArrows[i][4]+"}        <div onClick = \'restoreElement("+i+",1)\' style=\'display:inline;cursor:pointer;color:red;\'>Restore</div></pre></h6></li>";' +
				'}' +
				'for (var i=0;i<deletedNotes.length;i++){' +
				'document.getElementById("noteOL").innerHTML+= "<li><h6 style=\'margin:0px;\'><pre>"+ deletedNotes[i][2] +"    |    "+deletedNotes[i][1]+"    |    {x:"+deletedNotes[i][3]+",y:"+deletedNotes[i][4]+"}        <div onClick = \'restoreElement("+i+",2)\' style=\'display:inline;cursor:pointer;color:red;\'>Restore</div></pre></h6></li>";' +
				'}' +
				'</script>'

		});
	});

function restoreElement(index, type) {
	bootbox.hideAll();
	//Nodes
	if (type == 0) {
		$("#nodeZone").addClass('drop-target');
		$("#nodeZone").css('cursor', 'crosshair');
		document.getElementById("titleBar").innerHTML =
			'<div class="center" style="width:25%;">Click where to append then press okay <button id="appendBtn" style="margin-left:10px;">Okay!</button></div>';

		document.getElementById("appendSpot").style.visibility = 'visible';
		document.getElementById("appendSpot").style.webkitTransform =
			document.getElementById("appendSpot").style.transform =
			'translate(' + 250 + 'px, ' + 22 + 'px)';
		document.getElementById("appendSpot").setAttribute("x", 250);
		document.getElementById("appendSpot").setAttribute("y", 22);

		$("#nodeZone").on('click', function(event) {
			alert(this.attr('taska_id'));
			window.tapX = event.pageX;
			window.tapY = event.pageY;
			var transposeX = Math.round((tapX) / 160) * 160 - 70;
			var transposeY = 22;
			document.getElementById("appendSpot").style.webkitTransform =
				document.getElementById("appendSpot").style.transform =
				'translate(' + transposeX + 'px, ' + transposeY + 'px)';
			document.getElementById("appendSpot").setAttribute("x", transposeX);
		});
		$(".nodeDraggable").on('click', function(event) {
			alert(this.attr('taska_id'));
			window.tapX = event.pageX;
			window.tapY = event.pageY;
			var transposeX = Math.round((tapX) / 160) * 160 - 70;
			var transposeY = 22;
			document.getElementById("appendSpot").style.webkitTransform =
				document.getElementById("appendSpot").style.transform =
				'translate(' + transposeX + 'px, ' + transposeY + 'px)';
			document.getElementById("appendSpot").setAttribute("x", transposeX);
		});
		document.getElementById("appendBtn").addEventListener("click", function() {
			$("#nodeZone").removeClass('drop-target');
			$("#nodeZone").css('cursor', 'auto');
			document.getElementById("appendSpot").style.visibility = 'hidden';
			var transposeX = document.getElementById("appendSpot").getAttribute("x");
			var transposeY = document.getElementById("appendSpot").getAttribute("y");
			resetTitleBar();
			storeArray("nodeArr", i, guid(), deletedNodes[index][2], transposeX,
				transposeY, deletedNodes[index][5], null, null, deletedNodes[index][10]);
			deletedNodes.splice(index, 1);
			if (deletedNodes.length + deletedArrows.length + deletedNotes.length == 0) {
				document.getElementById("trash").src = "../images/trashCan.gif";
			}
		});
	}

	//Arrows
	else if (type == 1) {
		$("#lines").addClass('drop-target');
		$("#lines").css('cursor', 'crosshair');
		document.getElementById("titleBar").innerHTML =
			'<div class="center" style="width:25%;">Click where to append then press okay <button id="appendBtn" style="margin-left:10px;">Okay!</button></div>';
		document.getElementById("appendSpot").style.visibility = 'visible';
		document.getElementById("appendSpot").style.webkitTransform =
			document.getElementById("appendSpot").style.transform =
			'translate(' + 300 + 'px, ' + 75 + 'px)';
		document.getElementById("appendSpot").setAttribute("x", 300);
		document.getElementById("appendSpot").setAttribute("y", 75);

		$("#lines").on('click', function(event) {
			window.gridTapX = event.pageX;
			window.gridTapY = event.pageY;
			var transposeX = Math.round((gridTapX) / 160) * 160 - 20;
			var transposeY = Math.floor((gridTapY) / 42) * 42 - 50;
			document.getElementById("appendSpot").style.webkitTransform =
				document.getElementById("appendSpot").style.transform =
				'translate(' + transposeX + 'px, ' + transposeY + 'px)';
			document.getElementById("appendSpot").setAttribute("x", transposeX);
			document.getElementById("appendSpot").setAttribute("y", parseInt(
				transposeY) - 1);
		});

		document.getElementById("appendBtn").addEventListener("click", function() {
			$("#lines").removeClass('drop-target');
			$("#lines").css('cursor', 'auto');
			document.getElementById("appendSpot").style.visibility = 'hidden';
			var transposeX = document.getElementById("appendSpot").getAttribute("x");
			var transposeY = parseInt(document.getElementById("appendSpot").getAttribute(
				"y")) + 27;
			resetTitleBar();
			storeArray("arrowArr", i, guid(), deletedArrows[index][2], transposeX,
				transposeY, deletedArrows[index][5], deletedArrows[index][10], null);
			warning();
			deletedArrows.splice(index, 1);
			if (deletedNodes.length + deletedArrows.length + deletedNotes.length == 0) {
				document.getElementById("trash").src = "../images/trashCan.gif";
			}
		});
	}

	//Notes
	else if (type == 2) {
		$("#lines").addClass('drop-target');
		$("#lines").css('cursor', 'crosshair');
		document.getElementById("titleBar").innerHTML =
			'<div class="center" style="width:25%;">Click where to append then press okay <button id="appendBtn" style="margin-left:10px;">Okay!</button></div>';
		document.getElementById("appendSpot").style.visibility = 'visible';
		document.getElementById("appendSpot").style.webkitTransform =
			document.getElementById("appendSpot").style.transform =
			'translate(' + 300 + 'px, ' + 75 + 'px)';
		document.getElementById("appendSpot").setAttribute("x", 300);
		document.getElementById("appendSpot").setAttribute("y", 75);
		$("#lines").on('click', function(event) {
			window.gridTapX = event.pageX;
			window.gridTapY = event.pageY;
			var transposeX = Math.round((gridTapX) / 160) * 160 - 20;
			var transposeY = Math.floor((gridTapY) / 42) * 42 - 50;
			document.getElementById("appendSpot").style.webkitTransform =
				document.getElementById("appendSpot").style.transform =
				'translate(' + transposeX + 'px, ' + transposeY + 'px)';
			document.getElementById("appendSpot").setAttribute("x", transposeX);
			document.getElementById("appendSpot").setAttribute("y", parseInt(
				transposeY) - 1);
		});
		document.getElementById("appendBtn").addEventListener("click", function() {
			$("#lines").removeClass('drop-target');
			$("#lines").css('cursor', 'auto');
			document.getElementById("appendSpot").style.visibility = 'hidden';
			var transposeX = document.getElementById("appendSpot").getAttribute("x");
			var transposeY = parseInt(document.getElementById("appendSpot").getAttribute(
				"y")) + 38;
			resetTitleBar();
			storeArray("noteArr", i, guid(), deletedNotes[index][2], transposeX,
				transposeY, deletedNotes[index][5], null, deletedNotes[index][7] -
				deletedNotes[index][4]);
			deletedNotes.splice(index, 1);
			if (deletedNodes.length + deletedArrows.length + deletedNotes.length == 0) {
				document.getElementById("trash").src = "../images/trashCan.gif";
			}
		});
	}
}


/*DROPZONE TEMPLATE
interact('.dropzone').dropzone({
	// Require a 75% element overlap for a drop to be possible
	overlap: 0.75,

	// listen for drop related events:

	ondropactivate: function (event) {
		// add active dropzone feedback
		event.target.classList.add('drop-active');
	},
	ondragenter: function (event) {
		var draggableElement = event.relatedTarget,
		dropzoneElement = event.target;

		// feedback the possibility of a drop
		dropzoneElement.classList.add('drop-target');
		draggableElement.classList.add('can-drop');
		draggableElement.textContent = 'You can drop me anywhere!';


		var instruct = document.getElementById("instructions");
		instructions.textContent = '';

	},
	ondragleave: function (event) {
		// remove the drop feedback style
		event.target.classList.remove('drop-target');
		event.relatedTarget.classList.remove('can-drop');
		event.relatedTarget.textContent = 'Dragged out';
	},
	ondrop: function (event) {
		grabbedNode = event.relatedTarget
		grabbedNode.textContent = 'Placed on diagram';
		var innerText = prompt("Please enter what you'd like displayed in this node", "<+->");
		if (innerText != null) {
			grabbedNode.textContent = innerText;
		}
	},
	ondropdeactivate: function (event) {
		// remove active dropzone feedback
		event.target.classList.remove('drop-active');
		event.target.classList.remove('drop-target');
	}
});
*/
