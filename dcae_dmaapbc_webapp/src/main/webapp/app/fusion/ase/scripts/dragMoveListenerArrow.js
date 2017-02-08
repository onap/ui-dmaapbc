/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Called when an arrow is moved, translates the arrow and updates attributes

x = 0, y = 0; //Define coordinates

function dragMoveListenerArrow (event) {
	var target = event.target,
	uuid = target.id,
	// keep the dragged position in the data-x/data-y attributes
	x = (parseFloat(target.getAttribute('data_x')) || 0) + event.dx,
	y = (parseFloat(target.getAttribute('data_y')) || 0) + event.dy;

	// translate the element
	target.style.webkitTransform =
		target.style.transform =
			'translate(' + x + 'px, ' + y + 'px)';

	// update the position attributes
	target.setAttribute('data_x', x);
	target.setAttribute('data_y', y);

	if ($("#"+uuid).hasClass("arrowDraggable")){
		storeXY(arrowArr,uuid);
	}
	if ($("#"+uuid).hasClass("note")){
		storeXY(noteArr,uuid);
	}

}

// this is used in resizing
window.dragMoveListenerArrow = dragMoveListenerArrow;