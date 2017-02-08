/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Contains methods to drag, copy, resize nodes
// Some notes about nodes. Nodes created at top contain details about the service such as the toscaid and sname
// (Short Name)

var nodeArr = []; //Node array stored as [tag, uuid]
var lifelineX = [];
var startArrowDependants = [];
var endArrowDependants = [];
var lastSelected = null;

interact('.nodeDraggable')
	.on('tap', function(event) {
		var target = event.target;

		if ($(target).hasClass('collapsedPlus')) return;
		if (target.className == 'hasNodesHeader' && event.button == 0) return;
		if (event.target.id == "") target = event.target.parentNode;
		if ($("#" + target.id).hasClass('placed') && event.ctrlKey == false && event
			.shiftKey == false && event.button == 0) {
			clearSelection();
			selection.push(target.id);
			$("#" + target.id).addClass('selected');
			lastSelected = target.id;
		}
		//Ctrl key & left click & not already selected = adds it
		else if ($("#" + target.id).hasClass('placed') && selection.indexOf(target.id) ==
			-1 && event.ctrlKey == true && event.button == 0) {
			selection.push(target.id);
			$("#" + target.id).addClass('selected');
			lastSelected = target.id;
		}
		//Ctrl key & Left click & already selected = removes it
		else if (selection.indexOf(target.id) != -1 && event.ctrlKey == true &&
			event.button == 0) {
			selection.splice(selection.indexOf(target.id), 1);
			$("#" + target.id).removeClass('selected')
		}
		//Shift key & left click
		else if ($("#" + target.id).hasClass('placed') && selection.indexOf(target.id) ==
			-1 && event.shiftKey == true && event.button == 0) {
			selection.push(target.id);
			$("#" + target.id).addClass('selected');
			if (lastSelected != null) {
				if (parseInt(document.getElementById(lastSelected).getAttribute('data_x')) >
					parseInt(target.getAttribute('data_x'))) {
					for (var i = 0; i < nodeArr.length; i++) {
						if (nodeArr[i][1] == lastSelected || nodeArr[i][1] == target.id) {
							continue;
						}
						if (nodeArr[i][3] < parseInt(document.getElementById(lastSelected).getAttribute(
								'data_x')) && nodeArr[i][3] > parseInt(target.getAttribute('data_x'))) {
							selection.push(nodeArr[i][1]);
							$("#" + nodeArr[i][1]).addClass('selected');
						}
					}
				} else if (parseInt(document.getElementById(lastSelected).getAttribute(
						'data_x')) < parseInt(target.getAttribute('data_x'))) {
					for (var i = 0; i < nodeArr.length; i++) {
						if (nodeArr[i][1] == lastSelected || nodeArr[i][1] == target.id) {
							continue;
						}
						if (nodeArr[i][3] > parseInt(document.getElementById(lastSelected).getAttribute(
								'data_x')) && nodeArr[i][3] < parseInt(target.getAttribute('data_x'))) {
							selection.push(nodeArr[i][1]);
							$("#" + nodeArr[i][1]).addClass('selected');
						}
					}
				}
			}
			lastSelected = target.id;
		} else if (event.button == 2) {
			if (selection.indexOf(target.id) == -1) {
				clearSelection();
				selection.push(target.id);
				$("#" + target.id).addClass('selected');
				lastSelected = target.id;
			}

		}
		//Else clear
		else {
			if (event.button == 0) {
				clearSelection();
			}
		}
	})
	//CLONING
	.on('move', function(event) {
		var interaction = event.interaction;
		$("nodeDropzone").addClass("drop-target");
		// if the pointer was moved while being held down
		// and an interaction hasn't started yet
		if (interaction.pointerIsDown && !interaction.interacting() && !$(event.currentTarget)
			.hasClass("child")) {
			//console.log(event);
			var original = event.currentTarget,
				// create a clone of the currentTarget element
				clone = event.currentTarget.cloneNode(true);
			uuid = guid();
			clone.id = uuid;
			clone.classList.remove('drag');
			clone.classList.add('drag-1');
			// insert the clone to the page
			var dropOffLocation = document.getElementById("nodeChildrenDroppedOffHere");

			var clone = dropOffLocation.insertBefore(clone, dropOffLocation.parentNodes);
			var d = document.getElementById(uuid);
			d.className = d.className + " child"; //Adds child class to prevent child cloning


			// translate the element
			clone.style.webkitTransform = clone.style.transform = 'translate(' + 0 + $(
				document).scrollLeft() + 'px, ' + 0 + $(document).scrollTop() + 'px)';

			// update the position attributes
			clone.setAttribute('data_x', 0 + $(document).scrollLeft());
			clone.setAttribute('data_y', 0 + $(document).scrollTop());


			nodeArr.push([clone, uuid]);

			// start a drag interaction targeting the clone
			interaction.start({
					name: 'drag'
				},
				event.interactable,
				clone);
		}
	})

//DRAGGING
.draggable({
		snap: {
			targets: [ // give this function the x and y page coords
				// and snap to the object returned

				interact.createHorizontalSnapGrid({
					x: 160,
					y: 100,
					offset: {
						x: -51,
						y: 0
					}
				})

			],
			range: 150,
			relativePoints: [{
				x: 0,
				y: 0.5
			}]
		},
		// enable inertial throwing
		inertia: true,

		restrict: {
			endOnly: true,
			elementRect: {
				top: 0,
				left: 0,
				bottom: 0,
				right: 0
			}
		},


		// call this function on every dragmove event
		onstart: function(event) {
			if (event.button == 0 && !$("#" + event.target.id).hasClass('selected')) { //Makes anything you drag dashed
				clearSelection();
				selection.push(event.target.id);
				$("#" + event.target.id).addClass('selected');
				lastSelected = event.target.id;
			}
			calcChildren(event.target.id);
			for (var i = 0; i < childrenIDs.length; i++) {
				if (selection.indexOf(childrenIDs[i]) == -1) {
					selection.push(childrenIDs[i]);
				}
			}


			//Bring drag elements to the front
			for (var i = 0; i < selection.length; i++) {
				document.getElementById(selection[i]).style.zIndex = 9997;
				if ($("#" + selection[i]).hasClass('hasNodes')) {
					document.getElementById(selection[i]).style.zIndex = document.getElementById(
						selection[i]).style.zIndex - 1;
				}
			}


			//This may cause lag if there are an extremely large number of arrows
			for (var i = 0; i < arrowArr.length; i++) {
				determineLRNode(arrowArr[i][1], "arrow");
			}
		},
		// call this function on every dragmove event
		onmove: window.dragMoveListener,
		// call this function on every dragend event
		onend: function(event) {
			for (var i = 0; i < selection.length; i++) {
				try {
					document.getElementById(selection[i]).style.zIndex = 9996;
					if ($("#" + selection[i]).hasClass('hasNodes')) {
						document.getElementById(selection[i]).style.zIndex = document.getElementById(
							selection[i]).style.zIndex - 10;
					}
					calcParent(event.target.id);
				} catch (err) {
					continue;
				}
			}

			//Shifts nodes to the right by running shiftRight on every node (first sorts the selections by x)
			for (var k = selection.length - 1; k >= 0; k--) {
				for (var m = 1; m <= k; m++) {
					if (document.getElementById(selection[m - 1]).getAttribute("data_x") >
						document.getElementById(selection[m]).getAttribute("data_x")) {
						var swap = selection[m];
						selection[m] = selection[m - 1];
						selection[m - 1] = swap;
					}
				}
			}
			for (var i = 0; i < selection.length; i++) {
				if (isOverlapped(selection[i]) == true) {
					shiftRight(document.getElementById(selection[i]), 160);
				}
			}

		}
	})
	.on('dragstart', function(event) {

	})
	.on('dragend', function(event) {

	})
	.on('dragmove', function(event) {

	})

//RESIZING
.resizable({
		edges: {
			left: false,
			right: false,
			bottom: false,
			top: false
		}
	})
	.on('resizemove', function(event) {
		var target = event.target,
			x = (parseFloat(target.getAttribute('data_x')) || 0),
			y = (parseFloat(target.getAttribute('data_y')) || 0);

		// update the element's style
		target.style.width = event.rect.width + 'px';
		target.style.height = event.rect.height + 'px';

		// translate when resizing from top or left edges
		x += event.deltaRect.left;
		y += event.deltaRect.top;

		target.style.webkitTransform = target.style.transform =
			'translate(' + x + 'px,' + y + 'px)';

		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);


	});

function clearSelection() {
	for (var i = 0; i < selection.length; i++) {
		$("#" + selection[i]).removeClass('selected')
	}
	selection.length = 0;
}

function getStartArrowDependants(nodeID) {
	startArrowDependants.length = 0;
	startArrowDependants = [];
	for (var i = 0; i < arrowArr.length; i++) {
		if (arrowArr[i][8] == nodeID) {
			startArrowDependants.push(arrowArr[i][1]);
		}
	}
}

function getEndArrowDependants(nodeID) {
	endArrowDependants.length = 0;
	endArrowDependants = [];
	for (var i = 0; i < arrowArr.length; i++) {
		if (arrowArr[i][9] == nodeID) {
			endArrowDependants.push(arrowArr[i][1]);
		}
	}
}

function moveSelection(dx, dy, draggedNodeID) {
	for (var i = 0; i < selection.length; i++) {
		if (selection[i] == draggedNodeID) {
			continue;
		}
		selectionTarget = document.getElementById(selection[i]);
		var x = (parseFloat(selectionTarget.getAttribute('data_x')) || 0);
		var y = (parseFloat(selectionTarget.getAttribute('data_y')) || 0);

		x += dx;
		y += dy;
		if ($('#' + selection[i]).css('display') != 'none') {
			selectionTarget.style.webkitTransform =
				selectionTarget.style.transform =
				'translate(' + x + 'px, ' + y + 'px)';
		} else {
			draggedIndex = recallArray(nodeArr, draggedNodeID);
			selectionTarget.style.webkitTransform =
				selectionTarget.style.transform =
				'translate(' + document.getElementById(nodeArr[draggedIndex][1]).getAttribute(
					'data_x') + 'px, ' + document.getElementById(nodeArr[draggedIndex][1]).getAttribute(
					'data_y') + 'px)';

		}
		selectionTarget.setAttribute('data_x', x);
		selectionTarget.setAttribute('data_y', y);

		storeXY(nodeArr, selection[i]);

		moveDependants(dx, dy, selection[i]);
		if (isOverlapped(selection[i]) == true) {
			document.getElementById(selection[i]).style.transition =
				"background .5s ease";
			document.getElementById(selection[i]).style.background =
				"rgba(255,255,0,.40)"; //yellow
		} else {
			document.getElementById(selection[i]).style.background = "#29e"; //remove yellow
		}
		while (x > $("#grid").width() - $("#sideBar").width()) {
			addWidth();
		}
	}
}

function moveDependants(dx, dy, nodeID) {
	getStartArrowDependants(nodeID);
	getEndArrowDependants(nodeID);
	for (var i = 0; i < startArrowDependants.length; i++) {
		var target = document.getElementById(startArrowDependants[i]);
		for (var j = 0; j < arrowArr.length; j++) {
			if (startArrowDependants[i] == arrowArr[j][1]) {
				var arrowI = j;
			}
		}
		if (arrowArr[arrowI][9] == null) {

			// keep the dragged position in the data-x/data-y attributes
			x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
				y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;

			// translate the element
			target.style.webkitTransform =
				target.style.transform =
				'translate(' + x + 'px, ' + y + 'px)';

			// update the position attributes
			target.setAttribute('data_x', x);
			target.setAttribute('data_y', y);

			var index = storeXY(arrowArr, target.id);
			arrowArr[index][8] = nodeID;
			continue;
		}
		if (target.getAttribute("direction") == "right") {
			if ($("#" + target.id).width() + 12 - dx > 0) {
				target.style.width = parseFloat(target.style.width) - dx + 'px';

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
					y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;

				// translate the element
				target.style.webkitTransform =
					target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);

				var index = storeXY(arrowArr, target.id);
				arrowArr[index][8] = nodeID;
			} else if ($("#" + target.id).width() + 12 - dx < 0) {
				var newWide = Math.abs(parseFloat(target.style.width) + dx) - 12;
				target.setAttribute("direction", "left");
				makeArrow(target);
				target.style.width = newWide + 'px';

				var index = storeXY(arrowArr, target.id);
				arrowArr[index][8] = nodeID;
			} else if ($("#" + target.id).width() + 12 - dx == 0) {
				target.style.width = '0px';
				target.setAttribute("direction", "self");
				makeArrow(target);
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
					y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;

				// translate the element
				target.style.webkitTransform =
					target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				var index = storeXY(arrowArr, target.id);
				arrowArr[index][8] = nodeID;
			}
		} else if (target.getAttribute("direction") == "left") {
			if (-1 * ($("#" + target.id).width() + 12) - dx < 0) {
				target.style.width = parseFloat(target.style.width) + dx + 'px';

				var index = storeXY(arrowArr, target.id);
				arrowArr[index][8] = nodeID;
			} else if (-1 * ($("#" + target.id).width() + 12) - dx > 0) {
				var newWide = Math.abs(parseFloat(target.style.width) + dx);
				target.setAttribute("direction", "right");
				makeArrow(target);
				target.style.width = newWide + 'px';

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
					y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;

				// translate the element
				target.style.webkitTransform =
					target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);


				var index = storeXY(arrowArr, target.id);
				arrowArr[index][8] = nodeID;
			} else if (-1 * ($("#" + target.id).width() + 12) - dx == 0) {
				target.style.width = '0px';
				target.setAttribute("direction", "self");
				makeArrow(target);


				var index = storeXY(arrowArr, target.id);
				arrowArr[index][8] = nodeID;
			}
		} else if (target.getAttribute("direction") == "self") {
			if (dx > 0) {
				target.setAttribute("direction", "left");
				makeArrow(target);
				target.style.width = dx - 12 + 'px';

				var index = storeXY(arrowArr, target.id);
				arrowArr[index][8] = nodeID;
			} else if (dx < 0) {
				target.setAttribute("direction", "right");
				makeArrow(target);
				target.style.width = Math.abs(dx) - 12 + 'px';

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
					y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;

				// translate the element
				target.style.webkitTransform =
					target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);


				var index = storeXY(arrowArr, target.id);
				arrowArr[index][8] = nodeID;
			}
		}
	}


	/////////

	for (var i = 0; i < endArrowDependants.length; i++) {
		var target = document.getElementById(endArrowDependants[i]);
		if (target.getAttribute("direction") == "right") {
			if ($("#" + target.id).width() + 12 + dx > 0) {
				target.style.width = parseFloat(target.style.width) + dx + 'px';
				var index = storeXY(arrowArr, target.id);
				arrowArr[index][9] = nodeID;
			} else if ($("#" + target.id).width() + 12 + dx < 0) {
				var newWide = Math.abs(parseFloat(target.style.width) + dx) - 12;
				target.setAttribute("direction", "left");
				makeArrow(target);
				target.style.width = newWide + 'px';

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
					y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;

				// translate the element
				target.style.webkitTransform =
					target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);


				var index = storeXY(arrowArr, target.id);
				arrowArr[index][9] = nodeID;
			} else if ($("#" + target.id).width() + 12 + dx == 0) {
				target.style.width = '0px';
				target.setAttribute("direction", "self");
				makeArrow(target);
				var index = storeXY(arrowArr, target.id);
				arrowArr[index][9] = nodeID;
			}
		} else if (target.getAttribute("direction") == "left") {
			if (-1 * ($("#" + target.id).width() + 12) + dx < 0) {
				target.style.width = parseFloat(target.style.width) - dx + 'px';
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
					y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;

				// translate the element
				target.style.webkitTransform =
					target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);
				var index = storeXY(arrowArr, target.id);
				arrowArr[index][9] = nodeID;
			} else if (-1 * ($("#" + target.id).width() + 12) + dx > 0) {
				var newWide = Math.abs(parseFloat(target.style.width) + dx);
				target.setAttribute("direction", "right");
				makeArrow(target);
				target.style.width = newWide + 'px';

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
					y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;

				// translate the element
				target.style.webkitTransform =
					target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);


				var index = storeXY(arrowArr, target.id);
				arrowArr[index][9] = nodeID;
			} else if (-1 * ($("#" + target.id).width() + 12) + dx == 0) {
				target.style.width = '0px';
				target.setAttribute("direction", "self");
				makeArrow(target);

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
					y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;

				// translate the element
				target.style.webkitTransform =
					target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);

				var index = storeXY(arrowArr, target.id);
				arrowArr[index][9] = nodeID;
			}
		} else if (target.getAttribute("direction") == "self") {
			if (dx > 0) {
				target.setAttribute("direction", "right");
				makeArrow(target);
				target.style.width = dx - 12 + 'px';

				var index = storeXY(arrowArr, target.id);
				arrowArr[index][9] = nodeID;
			} else if (dx < 0) {
				target.setAttribute("direction", "left");
				makeArrow(target);
				target.style.width = Math.abs(dx) - 12 + 'px';

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
					y = (parseFloat(target.getAttribute('data_y')) || 0) + dy;

				// translate the element
				target.style.webkitTransform =
					target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				target.setAttribute('data_x', x);
				target.setAttribute('data_y', y);


				var index = storeXY(arrowArr, target.id);
				arrowArr[index][9] = nodeID;
			}
		}
	}
}


interact('.hasNodesHeader')
	.on('tap', function(event) {
		if (event.button == 0) {
			clearSelection();
			var mainNode = event.target;
			if (mainNode.id == "") {
				mainNode = event.target.parentNode;
			}
			var index = recallArray(nodeArr, mainNode.id);

			if ($("#" + mainNode.id).hasClass("expanded")) {
				calcChildren(mainNode.id);
				var children = nodeArr[index][9];
				for (var k = children.length - 1; k >= 0; k--) {
					for (var m = 1; m <= k; m++) {
						if (parseInt(document.getElementById(children[m - 1]).getAttribute(
								"data_x")) > parseInt(document.getElementById(children[m]).getAttribute(
								"data_x"))) {
							var swap = children[m];
							children[m] = children[m - 1];
							children[m - 1] = swap;
						}
					}
				}
				for (var i = 0; i < children.length; i++) {
					for (var z = 0; z < arrowArr.length; z++) {
						determineLRNode(arrowArr[z][1], "arrow");
					}
					getStartArrowDependants(children[i]);
					getEndArrowDependants(children[i]);
					document.getElementById(children[i]).setAttribute('tempStartDep',
						startArrowDependants);
					document.getElementById(children[i]).setAttribute('tempEndDep',
						endArrowDependants);
				}
				for (var i = 0; i < children.length; i++) {
					document.getElementById(children[i]).setAttribute('xOffset', i);
					//document.getElementById(children[i]).setAttribute('xOffset',parseInt(document.getElementById(children[i]).getAttribute('data_x')-x))
					$("#" + children[i]).css('display', 'none');
					getStartArrowDependants(children[i]);
					getEndArrowDependants(children[i]);
					//Collapse
					var x = nodeArr[index][3];
					var y = document.getElementById(children[i]).getAttribute('data_y');
					document.getElementById(children[i]).style.webkitTransform = document.getElementById(
							children[i]).style.transform =
						'translate(' + x + 'px,' + y + 'px)';
					document.getElementById(children[i]).setAttribute('data_x', x);
					document.getElementById(children[i]).setAttribute('data_y', y);
					storeXY(nodeArr, children[i]);
					for (var j = 0; j < startArrowDependants.length; j++) {
						target = document.getElementById(startArrowDependants[j]);
						for (var k = 0; k < arrowArr.length; k++) {
							if (arrowArr[k][1] == target.id) {
								var arrowIndex = k;
							}
						}
						if (arrowArr[arrowIndex][3] >= nodeArr[index][3] && arrowArr[arrowIndex]
							[6] <= nodeArr[index][6]) {
							endArrowDependants.splice(endArrowDependants.indexOf(target.id), 1);
							target.setAttribute('direction', 'self');

							target.style.width = 0 + 'px';
							// keep the dragged position in the data-x/data-y attributes
							x = nodeArr[index][3] + 50;
							y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
							makeArrow(arrowArr[arrowIndex][1]);
							continue;
						}
						if (target.getAttribute('direction') == 'right') {
							dx = i * 160;
							target.style.width = parseFloat(target.style.width) + dx + 'px';

							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data_x')) || 0) - dx,
								y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
						}
						if (target.getAttribute('direction') == 'left') {
							dx = i * 160;
							target.style.width = parseFloat(target.style.width) - dx + 'px';

							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data_x')) || 0),
								y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
						}
					}
					for (var j = 0; j < endArrowDependants.length; j++) {
						target = document.getElementById(endArrowDependants[j]);
						if (target.getAttribute('direction') == 'right') {
							dx = i * 160;
							target.style.width = parseFloat(target.style.width) - dx + 'px';

							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data_x')) || 0),
								y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
						} else if (target.getAttribute('direction') == 'left') {
							dx = i * 160;
							target.style.width = parseFloat(target.style.width) + dx + 'px';

							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data_x')) || 0) - dx,
								y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
						}
					}
				}
				$("#" + mainNode.id).removeClass("expanded");
				$("#" + mainNode.id).addClass("collapsed");

				//REFORM NODE///////////////////////////////////////////////
				var height = $("#" + mainNode.id).height();
				var dy = 12;
				var dx = 0;
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(mainNode.getAttribute('data_x'))) + 0,
					y = (parseFloat(mainNode.getAttribute('data_y'))) + dy / 2;

				// translate the element
				mainNode.style.webkitTransform =
					mainNode.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				mainNode.setAttribute('data_x', x);
				mainNode.setAttribute('data_y', y);

				$("#" + mainNode.id).width(100);
				$("#" + mainNode.id).height(height - dy);
				var nodeHeight = $("#" + mainNode.id).height();
				nodeHeightCorrected = nodeHeight + 16;
				var gridHeight = document.getElementById('grid').clientHeight;
				gridHeightCorrected = gridHeight - 90;
				recallArray(nodeArr, mainNode.id);
				document.getElementById(mainNode.id).innerHTML =
					'<div class="nodeText nodeEllipsis">' + text +
					'</div><div class="verticalLine" style = "top:' + nodeHeightCorrected +
					'px;height:' + gridHeightCorrected +
					'px;"></div><div class="collapsedPlus">+</div>';
				////////////////////////////////////////////////////////////

				shiftByDx(-160 * (children.length - 1), mainNode.id);
				storeXY(nodeArr, mainNode.id);
			}
		}
	});
interact('.collapsedPlus')
	.on('tap', function(event) {
		if (event.button == 0) {
			clearSelection();
			var mainNode = event.target;
			if (mainNode.id == "") {
				mainNode = event.target.parentNode;
			}
			var index = recallArray(nodeArr, mainNode.id);
			if ($("#" + mainNode.id).hasClass("collapsed")) {
				clearSelection();
				var children = nodeArr[index][9];
				var selfStart = [];
				var selfEnd = [];
				shiftByDx(160 * (children.length - 1), mainNode.id);
				for (var i = 0; i < children.length; i++) {
					$("#" + children[i]).css('display', 'inline-block');
					startArrowDependants = document.getElementById(children[i]).getAttribute(
						'tempStartDep');
					endArrowDependants = document.getElementById(children[i]).getAttribute(
						'tempEndDep');
					if (startArrowDependants.length != 0) startArrowDependants =
						startArrowDependants.split(",");
					if (endArrowDependants.length != 0) endArrowDependants =
						endArrowDependants.split(",");
					var nonConnectedArrows = []
					for (var j = 0; j < arrowArr.length; j++) {
						if (startArrowDependants.indexOf(arrowArr[j][1]) == -1 &&
							endArrowDependants.indexOf(arrowArr[j][1]) == -1 && (children[i] ==
								arrowArr[j][8] || children[i] == arrowArr[j][9] || arrowArr[j][8] ==
								mainNode.id || arrowArr[j][9] == mainNode.id)) {
							nonConnectedArrows.push(arrowArr[j][1])
						}
					}


					//Restore
					//var x = parseInt(document.getElementById(children[i]).getAttribute('data_x')) + parseInt(document.getElementById(children[i]).getAttribute('xOffset'));
					var x = parseInt(document.getElementById(children[i]).getAttribute(
						'data_x')) + parseInt(document.getElementById(children[i]).getAttribute(
						'xOffset') * 160);
					var y = document.getElementById(children[i]).getAttribute('data_y');
					document.getElementById(children[i]).style.webkitTransform = document.getElementById(
							children[i]).style.transform =
						'translate(' + x + 'px,' + y + 'px)';
					document.getElementById(children[i]).setAttribute('data_x', x);
					document.getElementById(children[i]).setAttribute('data_y', y);
					storeXY(nodeArr, children[i]);
					for (var j = 0; j < startArrowDependants.length; j++) {
						target = document.getElementById(startArrowDependants[j]);
						if (target.getAttribute('direction') == 'right') {
							dx = document.getElementById(children[i]).getAttribute('xOffset') * 160;
							target.style.width = parseFloat(target.style.width) - dx + 'px';

							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
								y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
						} else if (target.getAttribute('direction') == 'left') {
							dx = document.getElementById(children[i]).getAttribute('xOffset') * 160;
							target.style.width = parseFloat(target.style.width) + dx + 'px';

							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data_x')) || 0),
								y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
						} else if (target.getAttribute('direction') == 'self') {
							selfStart.push(target.id);
						}
					}
					for (var j = 0; j < endArrowDependants.length; j++) {
						target = document.getElementById(endArrowDependants[j]);
						if (target.getAttribute('direction') == 'right') {
							dx = document.getElementById(children[i]).getAttribute('xOffset') * 160;
							target.style.width = parseFloat(target.style.width) + dx + 'px';

							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data_x')) || 0),
								y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
						} else if (target.getAttribute('direction') == 'left') {
							dx = document.getElementById(children[i]).getAttribute('xOffset') * 160;
							target.style.width = parseFloat(target.style.width) - dx + 'px';

							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
								y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
						} else if (target.getAttribute('direction') == 'self') {
							selfEnd.push(target.id);
						}
					}
					for (var j = 0; j < nonConnectedArrows.length; j++) {
						target = document.getElementById(nonConnectedArrows[j]);
						if (target.getAttribute('direction') == 'right') {
							dx = -52;
							target.style.width = parseFloat(target.style.width) + dx + 'px';

							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data_x')) || 0),
								y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
						} else if (target.getAttribute('direction') == 'left') {
							dx = -52
							target.style.width = parseFloat(target.style.width) - dx + 'px';

							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data_x')) || 0) + dx,
								y = (parseFloat(target.getAttribute('data_y')) || 0);

							// translate the element
							target.style.webkitTransform =
								target.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

							// update the position attributes
							target.setAttribute('data_x', x);
							target.setAttribute('data_y', y);

							storeXY(arrowArr, target.id);
						}
					}
				}
				$("#" + mainNode.id).addClass("expanded");
				$("#" + mainNode.id).removeClass("collapsed");
				//REFORM NODE///////////////////////////////////////////////
				var dy = 12;
				var dx = 0;
				var height = $("#" + mainNode.id).height();
				var wide = $("#" + mainNode.id).width();

				height += dy;
				wide += dx;

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(mainNode.getAttribute('data_x'))) + 0,
					y = (parseFloat(mainNode.getAttribute('data_y'))) - dy / 2;

				// translate the element
				mainNode.style.webkitTransform =
					mainNode.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

				// update the position attributes
				mainNode.setAttribute('data_x', x);
				mainNode.setAttribute('data_y', y);


				$("#" + mainNode.id).height(height);
				$("#" + mainNode.id).width(wide);

				text = nodeArr[index][2];

				nodeHeightCorrected = height + 16;
				var gridHeight = document.getElementById('grid').clientHeight;
				gridHeightCorrected = gridHeight - 90;
				mainNode.innerHTML = '<div class="hasNodesHeader">' + text + '</div>' +
					'<div class="hasNodesBackground" style="height:' + gridHeightCorrected +
					'px"></div>' +
					'<div class="verticalLine" style = "margin-left:0px; top:' +
					nodeHeightCorrected + 'px;height:' + gridHeightCorrected + 'px;"></div>';
				////////////////////////////////////////////////////////////

				$("#" + mainNode.id).width(100 + 160 * (children.length - 1));
				storeXY(nodeArr, mainNode.id);
				for (var j = 0; j < selfStart.length; j++) {
					target = document.getElementById(selfStart[j]);
					for (var k = 0; k < nodeArr.length; k++) {
						try {
							if (document.getElementById(nodeArr[k][1]).getAttribute('tempstartdep')
								.indexOf(selfStart[j]) != -1) {
								var startX = nodeArr[k][3];
							}
						} catch (err) {};
						try {
							if (document.getElementById(nodeArr[k][1]).getAttribute('tempenddep').indexOf(
									selfStart[j]) != -1) {
								var endX = nodeArr[k][3];
							}
						} catch (err) {};
					}
					if (startX < endX) {
						target.setAttribute('direction', 'right');
						target.style.width = endX - startX - 12 + 'px';

						// keep the dragged position in the data-x/data-y attributes
						x = startX + 50;
						y = (parseFloat(target.getAttribute('data_y')) || 0);

						// translate the element
						target.style.webkitTransform =
							target.style.transform =
							'translate(' + x + 'px, ' + y + 'px)';

						// update the position attributes
						target.setAttribute('data_x', x);
						target.setAttribute('data_y', y);

						makeArrow(target);
						storeXY(arrowArr, target.id);
					}
					if (startX > endX) {
						target.setAttribute('direction', 'left');
						target.style.width = startX - endX - 12 + 'px';

						// keep the dragged position in the data-x/data-y attributes
						x = endX + 50;
						y = (parseFloat(target.getAttribute('data_y')) || 0);

						// translate the element
						target.style.webkitTransform =
							target.style.transform =
							'translate(' + x + 'px, ' + y + 'px)';

						// update the position attributes
						target.setAttribute('data_x', x);
						target.setAttribute('data_y', y);
						makeArrow(target);
						storeXY(arrowArr, target.id);
					}
				}
			}
		}
	});


//BPMN on double click of node
interact('.placed')
	.on('doubletap', function(event) {
		if (event.button == 0) {
			target = event.target.id;
			while (target == "") {
				target = event.target.parentNode.id;
			}
			renameNode(target);
		}
	});

function bpmnAction(target) {
	if (target.id == "") target = target.parentNode;
	var index = recallArray(nodeArr, target.id);
	if (nodeArr[index][10] == null || nodeArr[index][10] == "") { //No diagram detected
		bootbox.confirm({
			size: 'small',
			animate: false,
			title: 'No BPMN Detected',
			message: 'Please follow the following steps : <ol>' +
				'<li>Go to <a href="bpmn.io/new">bpmn.io</a> and create a flow diagram</li>' +
				'<li>Click the export button</li>' +
				'<li>Find the file here: <input type="file" accept=".bpmn" name="xmlToLoad" id = "xmlToLoad"></li>' +
				'<li>Click "OK" below</li>' +
				'</ol>',
			callback: function(result) {
				if (result == true) {
					uploadBPMN(index)
				}
			}
		});
	} else { //Diagram is present
		//$('#'+event.target.parentNode.id).tooltipster('destroy');
		//var displayCanvas = setInterval(function () {
		bootbox.dialog({
			size: 'large',
			message: '<div id="canvas" style="height:600px;"></div><div style="margin-top:20px;">Upload Edits: <input type="file" accept=".bpmn" name="xmlToLoad" id = "xmlToLoad"><button style = "display:inline;" onclick="uploadBPMN(index);">Change</button><button style = "display:inline;" onclick="exportBPMN(index);">Export</button><button style = "display:inline;" onclick="removeBPMN(index);">Remove</button></div>',
			animate: false,
			callback: function(result) {
				if (result == true) {

				}
			}
		});
		showBPMN(nodeArr[index][10])
			//	clearInterval(displayCanvas);
			//	},500);
	}
}

function uploadBPMN(index) {
	$('#' + nodeArr[index][1]).addClass('bpmn');
	var file = document.getElementById("xmlToLoad").files[0];
	//console.log(file);
	var reader = new FileReader();
	reader.onload = recievedText;
	reader.readAsText(file);
	bootbox.hideAll();

	function recievedText() {
		var textFromFileLoaded = reader.result;
		console.log(textFromFileLoaded);
		nodeArr[index][10] = textFromFileLoaded
		bootbox.dialog({
			size: 'large',
			message: '<div style="text-align:center; margin-bottom:10px;"><b>' +
				nodeArr[index][2] +
				'</b></div><div id="canvas" style="height:600px;"></div><div style="margin-top:20px;">Upload Edits: <input type="file" accept=".bpmn" name="xmlToLoad" id = "xmlToLoad"><button style = "display:inline;" onclick="uploadBPMN(index);">Change</button><button style = "display:inline;" onclick="exportBPMN(index);">Export</button><button style = "display:inline;" onclick="removeBPMN(index);">Remove</button></div>',
			animate: false,
			callback: function(result) {
				if (result == true) {

				}
			}
		});
		showBPMN(nodeArr[index][10]);
	}
}

function removeBPMN(index) {
	nodeArr[index][10] = null;
	bootbox.hideAll();
}

function exportBPMN(index) {
	var textToWrite = nodeArr[index][10];
	var blob = new Blob([textToWrite], {
		type: "text/plain;charset=utf-8"
	});

	var downloadLink = document.createElement("a");

	downloadLink.download = nodeArr[index][2] + '.bpmn';
	downloadLink.innerHTML = "Download File";
	downloadLink.href = window.webkitURL.createObjectURL(blob);
	downloadLink.click();
}

/* TOOLTIPS
$(document).on("mouseenter", '.bpmn',function(event){
	index = recallArray(nodeArr,event.target.id);
	$('#'+event.target.id).tooltipster({
		minWidth:200,
		position:'top',
    	theme: 'tooltipster-shadow',
    	interactive:false,
    	delay:500,
    	multiple:false,
    	trigger:'hover',
    	contentAsHTML:true,
    	functionReady: function (o,t){
    		showBPMN(nodeArr[index][10]);
    	},
    	content: '<div id="canvas" style="height:600px;"></div>'
	});


})
$(document).on("mouseleave", '.bpmn',function(event){
	$('#'+event.target.id).tooltipster('hide');
})
*/

function renameNode(uuid) {
	var index = recallArray(nodeArr, uuid);
    var toscaId = document.getElementById(nodeArr[index][1]).getAttribute("taska_id");
    var serviceName = document.getElementById(nodeArr[index][1]).getAttribute("sname");
	var role_id = document.getElementById(nodeArr[index][1]).getAttribute("role_id");
    
    bootbox.confirm({
		closeButton: false,
		backdrop: true,
		animate: false,
		size: 'small',
		title: "Modify Element " + serviceName,
		onEscape: function() {},
		message: '<div style="color:grey;font-size:12px;"><br>Role : <input id="rolefield" style="width:100%;" type="text" placeholder="Add role for network element" value="'+role_id+'"></div>',
		callback: function(result) {
			if (result == true) {
				//EXECUTE THIS ON OKAY///
				var innerText = serviceName;
				document.getElementById(nodeArr[index][1]).setAttribute("role_id",$("#rolefield").val());
				//document.getElementById(nodeArr[index][1]).setAttribute("toscaid", toscaID);
				pushToDict(innerText, "node");
				storeText(nodeArr, uuid, innerText);
				var nodeHeight = $("#" + uuid).height();
				nodeHeightCorrected = nodeHeight + 16;
				var gridHeight = document.getElementById('grid').clientHeight;
				gridHeightCorrected = gridHeight - 90;
				// Not sure whate below is for? Need to investigate
                if ($("#" + uuid).hasClass("expanded") == true) {
					document.getElementById(uuid).innerHTML =
						'<div class="hasNodesHeader">' + innerText + '</div>' +
						'<div class="hasNodesBackground" style="height:' + gridHeightCorrected +
						'px"></div>' +
						'<div class="verticalLine" style = "margin-left:0px; top:' +
						nodeHeightCorrected + 'px;height:' + gridHeightCorrected +
						'px;"></div>';
				} else if ($("#" + uuid).hasClass("collapsed") == true) {
					document.getElementById(uuid).innerHTML =
						'<div class="nodeText nodeEllipsis">' + innerText +
						'</div><div class="verticalLine" style = "top:' + nodeHeightCorrected +
						'px;height:' + gridHeightCorrected +
						'px;"></div><div class="collapsedPlus">+</div>';
				} else {
					document.getElementById(uuid).innerHTML =
						'<div class="nodeText nodeEllipsis">' + innerText +
						'</div><div class="verticalLine" style = "top:' + nodeHeightCorrected +
						'px;height:' + gridHeightCorrected + 'px;"></div>';
				}
				clearSelection();
			}
		}
	});
	
	/* Removed #nodeInnerText Code as it is no longer needed */
}
