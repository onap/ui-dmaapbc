

// Contains methods to drag, copy, resize arrows

var arrowArr = []; //Arrow array stored as [tag, uuid]

interact('.arrowDraggable')

.on('move',function (event){
	var interaction = event.interaction;

	$ ("nodeDropzone").addClass("drop-target");
	// if the pointer was moved while being held down
	// and an interaction hasn't started yet
	if (interaction.pointerIsDown && !interaction.interacting() && !$(event.currentTarget).hasClass("child")) {
		var clone;
		var original = event.currentTarget;
		// create a clone of the currentTarget element
		clone = event.currentTarget.cloneNode(true);
		window.uuid = guid();
		clone.id = uuid;
		// insert the clone to the page
		var dropOffLocation = document.getElementById("arrowChildrenDroppedOffHere");
		clone = dropOffLocation.insertBefore(clone,dropOffLocation.parentNodes);
		
		var d = document.getElementById(uuid);
		d.className = d.className + " child"; //Adds child class to prevent child cloning
		
		// translate the element
		clone.style.webkitTransform = clone.style.transform = 'translate(' + 0 + $(document).scrollLeft() + 'px, ' + 168 + $(document).scrollTop() + 'px)';

		// update the position attributes
		clone.setAttribute('data_x', 0 + $(document).scrollLeft());
		clone.setAttribute('data_y', 168 + $(document).scrollTop());
				
		
		arrowArr.push([clone,uuid]);

		// start a drag interaction targeting the clone
		interaction.start({ name: 'drag' },
				event.interactable,
				clone);
	}
})	

.draggable({
	autoscroll:true,
	snap: {
    	targets: [ 
    	           interact.createSnapGrid({
    	        	   x: 160, y: 42,
    	        	   offset: {x:11 , y:26}
    	           })
          ],
          range: Infinity,
          relativePoints: [ { x: 0, y: 0 } ]
	},
	// enable inertial throwing
	inertia: true,
	// keep the element within the area of it's parent
	restrict: {
		//restriction: "parent",
		endOnly: true,
		elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
	},

	// call this function on every dragmove event
	onmove: dragMoveListenerArrow,
	// call this function on every dragend event
	onend: function (event) {

	}
})
.on('dragmove', function (event) { 

});

interact('.arrowPlaced')
.on('doubletap',function (event){
	var uuid = event.target.id;
	if (uuid === ""){ //accounts for double tapping .triangle
		uuid = event.target.parentNode.id;
	}
	if (uuid === ""){ //accounts for double tapping .triangle
		uuid = event.target.parentNode.parentNode.id;
	}
	renameArrow(uuid);
	
});

function renameArrow(uuid){
	var index = recallArray(arrowArr, uuid);
	var sourceTaska,destinationTaska;
	try{
		sourceTaska = document.getElementById(arrowArr[index][8]).getAttribute("taska_id");
	}
	catch (err) {
		sourceTaska = 'null';
	}
	try{
		destinationTaska = document.getElementById(arrowArr[index][9]).getAttribute("taska_id");
	}
	catch (err) {
		destinationTaska = 'null';
	}
	var linkText = arrowArr[index][2];
	var descText = arrowArr[index][10];
	var messageType = $(arrowArr[index][0]).attr('message_type');
	var options = "";
	if ( messageType === 'signal' ) {
		options = '<option value="signal" selected="selected">Signal</option><option value="media">Media</option>';
	} else {
		options = '<option value="signal">Signal</option><option value="media" selected="selected">Media</option>';
	}
	
	
	bootbox.confirm({
		closeButton:false,backdrop:true,animate:false,
		size:'small',
		title: "Modify Link Text",
		onEscape: function() {},
		message: 'Link Message: <br> <input id="arrowInnerText" style="width:100%;" type="text" placeholder="Add text here" value="'+ text +'">' +
		'<br>Description: <br><textarea id="arrowDescription" rows="5" placeholder="Add description (optional)">' + descText + '</textarea>' +
		'<br>Message Type: <br> <select id="arrowMessageType" style="width:100%;">'+ options +'</select>',
		callback: function(result){
			if (result === true) {
				var innerText=$("#arrowInnerText").val();
				var messageType = $("#arrowMessageType").val();
				pushToDict(innerText, "arrow");
				storeText(arrowArr,uuid,innerText);
				makeArrow(uuid);
				arrowArr[index][10] = $("#arrowDescription").val();
				$(arrowArr[index][0]).attr("message_type",messageType);
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
	$("#arrowInnerText").selectRange(0,currentInput.length);
	$("#arrowInnerText").click(function(){
		var currentInput = $("#arrowInnerText").val();
		$("#arrowInnerText").selectRange(0,currentInput.length);
	});
	$("#arrowInnerText").keyup( function(e) {
		if (e.keyCode == 13){
			$(document.getElementsByClassName('btn-primary')[0]).click();
		}
	});
	$("#arrowDescription").keyup( function(e) {
		if (e.keyCode == 13){
			$(document.getElementsByClassName('btn-primary')[0]).click();
		}
	});
}

$(document).delegate('.arrowText','mouseover',function(mainEvent){
	if(!$(this).hasClass("bound")){
		console.log("ENTERING");
		var hoverIndex = recallArray(arrowArr,event.target.parentNode.parentNode.id);
		if (arrowArr[hoverIndex][10] !== null && arrowArr[hoverIndex][10] !== "") {
			arrowDescript = arrowArr[hoverIndex][10];
		} else { 
			arrowDescript = '--no description entered--';
		} 
		$('#'+event.target.parentNode.parentNode.id).tooltipster({
			maxWidth:200,
			position:'bottom',
	    	theme: 'tooltipster-shadow',
	    	interactive:false,
	    	delay:300,
	    	multiple:false,
	    	trigger:'click',
	    	contentAsHTML:true,
	    	content: arrowDescript
		});
		$(this).hover(
		function(event){
			var hoverIndex = recallArray(arrowArr,event.target.parentNode.parentNode.id);
			if (arrowArr[hoverIndex][10] !== null && arrowArr[hoverIndex][10] !== "") { 
				arrowDescript = arrowArr[hoverIndex][10];
			} else { 
				arrowDescript = '--no description entered--';
			}
			console.log("ENTERING"+event.target.parentNode.parentNode.id);
			$('#'+event.target.parentNode.parentNode.id).tooltipster({
				maxWidth:200,
				position:'bottom',
		    	theme: 'tooltipster-shadow',
		    	interactive:false,
		    	delay:300,
		    	multiple:false,
		    	trigger:'click',
		    	contentAsHTML:true,
		    	content: arrowDescript
			});
		},
		function(event) {
			$(this).addClass("bound");
			console.log("LEAVING"+event.target.parentNode.parentNode.id);
			$('#'+event.target.parentNode.parentNode.id).tooltipster('destroy');			
		});	
	}
});