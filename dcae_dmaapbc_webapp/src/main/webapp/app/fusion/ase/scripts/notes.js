/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Contains methods to drag, copy, resize notes

var noteArr = []; //Node array stored as [tag, uuid]

interact('.postit')
	//CLONING
	.on('move',function (event){
		var interaction = event.interaction;

		$ ("arrowDropzone").addClass("drop-target");
		// if the pointer was moved while being held down
		// and an interaction hasn't started yet
		if (interaction.pointerIsDown && !interaction.interacting() && !$(event.currentTarget).hasClass("child")) {
			var original = event.currentTarget;
			// create a clone of the currentTarget element
			
			var dropOffLocation = document.getElementById("noteChildrenDroppedOffHere");
			uuid = guid();
			dropOffLocation.innerHTML+='<div id="' + uuid + '" class="postit note child gridDropzone"></div>'
			clone = document.getElementById(uuid);
			
			// translate the element
			clone.style.webkitTransform = clone.style.transform = 'translate(' + 0 + $(document).scrollLeft() + 'px, ' + 215 + $(document).scrollTop() + 'px)';

			// update the position attributes
			clone.setAttribute('data_x', 0 + $(document).scrollLeft());
			clone.setAttribute('data_y', 218 + $(document).scrollTop());
			
			
			noteArr.push([clone,uuid]);

			// start a drag interaction targeting the clone
			interaction.start({ name: 'drag' },
					event.interactable,
					clone);
		}
	})
	
	//DRAGGING
	.draggable({
		snap: {
	    	targets: [ // give this function the x and y page coords
		    	          // and snap to the object returned
	    		          interact.createSnapGrid({
	    		        	  x:100,
	    		        	  y:42
	    		          })
		    	      ],
		    	      offset:{x:0,y:-5},
		    	      range:Infinity,
	    	          relativePoints: [ { x: 0, y: 0 } ],
	    	          endOnly: true
		},
	    // enable inertial throwing
	    inertia: true,
	    
	    restrict: {
	    	endOnly: true,
	    	elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
	    },
	
		// call this function on every dragmove event
	    onmove: window.dragMoveListenerArrow,
		// call this function on every dragend event
		onend: function (event) {
	
		}
	})
	.on('dragmove', function (event) { 

	})
	
	//RESIZING
	.resizable({
		edges: { left: true, right: true, bottom: true, top: true },
		snap: {
			targets: [ 
			           interact.createSnapGrid({
			        	   x:100,
			        	   y:42
			           })
			           ],
	    	      offset:{x:0,y:0},
	    	      range:Infinity,
    	          relativePoints: [ { x: -5, y: 23 } ],
    	          endOnly: true
		}
	})
	.on('resizemove', function (event) {
		var target = event.target,
		x = (parseFloat(target.getAttribute('data_x')) || 0),
		y = (parseFloat(target.getAttribute('data_y')) || 0);
	
		// update the element's style
		target.style.width  = event.rect.width + 'px';
		target.style.height = event.rect.height + 'px';
	
		// translate when resizing from top or left edges
		x += event.deltaRect.left;
		y += event.deltaRect.top;
	
		target.style.webkitTransform = target.style.transform =
			'translate(' + x + 'px,' + y + 'px)';
	
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
		
		storeXY(noteArr,event.target.id);
})
;

interact('.notePlaced')
.on('doubletap',function (event){
	var uuid = event.target.id;
	recallArray(noteArr, uuid);
	event.preventDefault();
	bootbox.prompt({
		closeButton:false,backdrop:true,animate:false,
		size:'small',
		title: "Change Note Text",
		value:text,
		placeholder: "add text here",
		callback: function(result) {
			if (result != null) {
				//EXECUTE THIS ON OKAY///
				innerText = result;
				pushToDict(innerText, "note");
				storeText(noteArr,uuid,innerText);
				event.target.innerHTML = innerText;
				/////////////////////////
		 	} 		
		}
	});
	$("#box").autocomplete({
		source: noteTags,
		autoFocus: true,
		delay: 0
	});	
});