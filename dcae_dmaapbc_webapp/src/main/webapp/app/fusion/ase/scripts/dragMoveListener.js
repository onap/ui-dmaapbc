
//Called when an node is moved, translates the arrow and updates attributes

x = 0, y = 0; //Define coordinates

function dragMoveListener (event) {
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

	if ($("#"+uuid).hasClass("drag-1")){
		storeXY(nodeArr,uuid);
	}
	if (y<30) {
		moveSelection(event.dx,event.dy,event.target.id);
		moveDependants(event.dx,event.dy,event.target.id);
	}
	else {
		for (var i=0; i<arrowArr.length; i++){
			if (arrowArr[i][8] == target.id){
				arrowArr[i][8] = null;
			}
			if (arrowArr[i][9] == target.id){
				arrowArr[i][9] = null;
			}
			determineLRNode(arrowArr[i][1],"arrow");
		}
	}
	
	if (isOverlapped(uuid) == true){
		document.getElementById(uuid).style.transition = "background .5s ease";
		document.getElementById(uuid).style.background = "rgba(255,255,0,.40)"; //yellow
		//shiftRight(event.target); Include for real-time shifting
	}
	else {
		document.getElementById(uuid).style.background = "#29e"; //remove yellow
	}
	while (x>$("#grid").width() - $("#sideBar").width()){
		addWidth();
	}
}

// this is used in resizing
window.dragMoveListener = dragMoveListener;