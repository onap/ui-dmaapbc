/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Contains functions for making and resizing arrows

interact('.resizable')
.resizable({

	snap: {
    	targets: [ interact.createLifelineSnapGrid(	) ],
	    relativePoints: [ { x: 0, y: 0 } ],
		range: Infinity,
		endOnly: true //CREATES SMOOTH SNAP
	},
	edges: { left: true, right: true, bottom: false, top: false },
	invert: 'reposition'
	
})
.on('resizemove', function (event) {
	var target = event.target;
	if (target.id=="") target = event.target.parentNode;
	var x = (parseFloat(target.getAttribute('data_x')) || 0),
	y = (parseFloat(target.getAttribute('data_y')) || 0);
	
	// update the element's style
	if (window.resized == false){
		target.style.width  = event.rect.width + 'px';
	
	
	target.style.height = event.rect.height + 'px';

	// translate when resizing from top or left edges
	x += event.deltaRect.left;
	y += event.deltaRect.top;
	
	target.style.webkitTransform = target.style.transform =
		'translate(' + x + 'px,' + y + 'px)';

	target.setAttribute('data_x', x);
	target.setAttribute('data_y', y);
	}
	uuid = target.id;
	if (uuid==""){
		uuid = target.parentElement.id;
	}
	
	
	var index = storeXY(arrowArr,uuid);
	window.currentArrow = arrowArr[index][1];
	window.leftX = arrowArr[index][3];
	window.rightX = arrowArr[index][6];
	window.currentY = y;
		
	window.resized = false;
	var endingLeftX = event.target.getAttribute("data_x");
	var endingRightX = parseInt(event.target.getAttribute("data_x")) + parseInt($("#"+target.id).width());
	
	if ($("#"+event.target.id).width() == 0){
		target.setAttribute("direction","self");
		makeArrow(target);
	}
	if (target.getAttribute("direction") == "self"){
		if (endingRightX>startingLeftX){ //Not negative case
			target.setAttribute("direction","right");
			makeArrow(target);
		}
		else if (endingLeftX<startingLeftX){ //Negative case: swap 
			startingRightX = startingLeftX;
			target.setAttribute("direction","left");
			makeArrow(target);	
		}
		else if (endingLeftX==endingRightX){
			target.setAttribute("direction","self");
			makeArrow(target);
		}
	}
	else if (target.getAttribute("direction") == "right"){

		if (endingLeftX<startingLeftX && $('#'+target.id).width()<25){ //Negative case: swap 
			startingRightX = startingLeftX;
			target.setAttribute("direction","left");
			makeArrow(target);	
		}	
		else if (endingLeftX==endingRightX){
			target.setAttribute("direction","self");
			makeArrow(target);
		}
		
	}
	else if (target.getAttribute("direction") == "left"){

		if (endingRightX>startingRightX && $('#'+target.id).width()<25){
			startingLeftX = startingRightX;
			target.setAttribute("direction","right");
			makeArrow(target);
		}
		else if (endingLeftX==endingRightX){
			target.setAttribute("direction","self");
			makeArrow(target);
		}
	}
	storeXY(arrowArr,uuid);
	determineLRNode(uuid,"arrow"); //move to resizeend api if lagging
	
	
})
.on('resizestart', function(event){
	startingLeftX = event.target.getAttribute("data_x");
	startingRightX = parseInt(event.target.getAttribute("data_x")) + parseInt($("#"+event.target.id).width());
	startWidth = parseInt($("#"+event.target.id).width());
})
.on('resizeend', function(event){
	if ($("#"+event.target.id).width() == 0){
		event.target.setAttribute("direction","self");
		makeArrow(event.target);
	}
	var target = event.target
	if (target.id=="") target = event.target.parentNode;
	determineLRNode(target.id,"arrow");
});

function makeArrow(target){
	try{
		recallArray(arrowArr, target.id);
		if (target.getAttribute("direction") == "right"){
			target.innerHTML = '<div class="arrow" style="display:inline; width:100%"><div class="makeEllipsis arrowText">'+text+'</div></div><div class="triangle" style="display:inline;"></div>'
		}
		else if (target.getAttribute("direction") == "left"){
			target.innerHTML = '<div class="leftTriangle" style="display:inline;"></div><div class="leftArrow" style="display:inline; width:100%;"><div class="makeEllipsis arrowText">'+text+'</div></div>'
		}
		else if (target.getAttribute("direction") == "self"){
			target.innerHTML = '<div style="display:inline; width:100%"><img src="../images/selfArrow.png" style = "cursor:e-resize;"><div class="makeEllipsisSelf arrowText" style="width:75px;font-size:12px;margin-left:3px;text-align:left;display:inline">'+text+'</div></div>'
		}
	}
	catch(err){
		var uuid = target
		var target = document.getElementById(target);
		recallArray(arrowArr, uuid);
		if (target.getAttribute("direction") == "right"){
			target.innerHTML = '<div class="arrow" style="display:inline; width:100%"><div class="makeEllipsis arrowText">'+text+'</div></div><div class="triangle" style="display:inline;"></div>'
		}
		else if (target.getAttribute("direction") == "left"){
			target.innerHTML = '<div class="leftTriangle" style="display:inline;"></div><div class="leftArrow" style="display:inline; width:100%;"><div class="makeEllipsis arrowText">'+text+'</div></div>'
		}
		else if (target.getAttribute("direction") == "self"){
			target.innerHTML = '<div style="display:inline; width:100%"><img src="../images/selfArrow.png" style = "cursor:e-resize;"><div class="makeEllipsisSelf arrowText" style="width:75px;font-size:12px;margin-left:3px;text-align:left;display:inline">'+text+'</div></div>'
		}
	}
}