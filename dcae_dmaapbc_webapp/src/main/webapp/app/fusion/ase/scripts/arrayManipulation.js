
//Contains functions to update, create and retrieve arrays. Also uses arrays to determine properties (lNode, rNode) of arrows

var missingStarts = [];
var missingEnds = [];

//Stores module's properties in its array
function storeXY (arrayType,id) {
    'use strict';
    var index;
    for ( i = 0; i<arrayType.length; i++){
        if (arrayType[i][1] == id) {
            index = i;
            arrayType[i][3] = parseInt(document.getElementById(id).getAttribute('data_x'));
            arrayType[i][4] = parseInt(document.getElementById(id).getAttribute('data_y'));
            arrayType[i][5] = $("#"+id).width();
            arrayType[i][6] = arrayType[i][3] + arrayType[i][5];
            arrayType[i][7] = arrayType[i][4] + $("#"+id).height();
        }
    }
    return index;
}

//Returns lifeline coordinates in the array lifelineX[]
function getLifelines () {
    lifelineX.length = 0;
    lifelineX=[];
    for (var i = 0; i<nodeArr.length; i++){
        if (!$('#'+nodeArr[i][1]).hasClass('expanded')){
            lifelineX.push([nodeArr[i][3] + (nodeArr[i][5])/2,nodeArr[i][1]]);
        }
    }
    for (i = 0; i<lifelineX.length; i++){
        if(lifelineX[i]===null){
            lifelineX.splice(i,1);
            i--;
        }
    }
}

//Finds a module in its array then stores user-inputed text
function storeText (arrayType,id,text) {
    var index;
    for (var i = 0; i<arrayType.length; i++){
        if (arrayType[i][1] == id) {
            index = i;
            arrayType[i][2] = text;        
        }    
    }
    return index;
}

//Recalls an arrays values and returns the items index
function recallArray (arrayType, id) {
    var index;
    for (var i = 0; i<arrayType.length; i++){
        if (arrayType[i][1] == id) {
            index = i;
            text = arrayType[i][2];
            lX = arrayType[i][3];
            lY = arrayType[i][4];
            wide = arrayType[i][5];
            rX = arrayType[i][6];
            rY = arrayType[i][7];
        }    
    }
    return index;
}

//Stores a module when given properties and a type. After storing it appends it to the DOM
//function storeArray (arrayType, i, id, text, lX, lY, wide, direction, height,bpmn,tosca_ID,arrowDescription, messageType) {
function storeArray (arrayType, i, id, text, lX, lY, wide, direction, height,bpmn,tosca_ID,arrowDescription, messageType, role) {
    var tag = "";
    var dropOffLocation;
    if (arrayType == "nodeArr"){
        //var nodeHeight = $('.drag-1').height(); //DOES NOT WORK
        var nodeHeight = 36; //FIXES THE PROBLEM, DOES NOT ALLOW RESIZE
        var nodeHeightCorrected = nodeHeight+16;
        
        var gridHeight = document.getElementById('grid').clientHeight;
        var gridHeightCorrected = gridHeight - 90;
        tag = '<div class="nodeDraggable drag-drop drag-1 child can-drop placed verticallyScrollable" '+
                    'id=' + id + ' data_x="' +lX+ '" data_y="' +lY+ '"' +
                    'style="transform: translate(' + lX + 'px, ' + lY + 'px); -webkit-transform: translate(' + lX + 'px, ' + lY + 'px);">' +
                        '<div class="nodeText nodeEllipsis">'+ text +'</div>'+
                    '<div class="verticalLine" style="top:'+nodeHeightCorrected+'px;height:'+gridHeightCorrected+'px;"></div>'+
                  '</div>';
        dropOffLocation = document.getElementById("nodeChildrenDroppedOffHere");
        dropOffLocation.innerHTML += tag;
        var index = nodeArr.push([document.getElementById(id),id,text,parseInt(lX),parseInt(lY),wide,parseInt(lX)+parseInt(wide),parseInt(lY)]);
        if (tosca_ID !==null){
            document.getElementById(id).setAttribute('taska_id',tosca_ID);
        }
        if ( text !== null ){ 
            document.getElementById(id).setAttribute('sname',text);
        }
        // When Role is added uncomment. 
        console.log(role);
        if ( role !== null ){ 
            document.getElementById(id).setAttribute('role_id',role);
        }

        if (isOverlapped(id) === true){
            shiftRight(document.getElementById(id),160);
        }
        if (isOverlapped(id) === false){
            for (i=0;i<arrowArr.length;i++){
                determineLRNode(arrowArr[i][1],id);
            }
        }
        nodeArr[index-1][10] = bpmn;
        if (bpmn !== '' && bpmn !== null){
            $('#'+nodeArr[index-1][1]).addClass('bpmn');
        }
    }
    if (arrayType === "arrowArr"){
        if (direction === "right"){
            tag = '<div class="arrowDraggable resizable child gridDropzone can-drop arrowPlaced" '+
            'style="margin-left: 27px; transform: translate('+ lX +'px, '+lY+'px); -webkit-transform: translate('+ lX +'px, '+lY+'px);width: '+ wide +'px;" '+
            'id="'+id+'" data_x="'+lX+'" data_y="'+lY+'" direction="right" message_type="'+messageType+'">'+
                '<div class="arrow resizable" style="display:inline; width:100%;"><div class="makeEllipsis arrowText">'+text+'</div></div>'+
                '<div class="triangle" style="display:inline;"></div>'+
          '</div>';
        }
        if (direction === "left"){
            tag = '<div class="arrowDraggable resizable child gridDropzone can-drop arrowPlaced" '+
            'style="margin-left: 27px; transform: translate('+ lX +'px, '+lY+'px); -webkit-transform: translate('+ lX +'px, '+lY+'px);width: '+ wide +'px;" '+
            'id="'+id+'" data_x="'+lX+'" data_y="'+lY+'" direction="left" message_type="'+messageType+'">'+
                '<div class="leftTriangle" style="display:inline;"></div>'+
                '<div class="leftArrow" style="display:inline; width:100%;"><div class="makeEllipsis arrowText">' + text + '</div></div>'+
          '</div>';
        }
        if (direction === "self"){
            tag = '<div class="arrowDraggable resizable child gridDropzone can-drop arrowPlaced" '+
            'style="margin-left: 27px; transform: translate('+ lX +'px, '+lY+'px); -webkit-transform: translate('+ lX +'px, '+lY+'px);width: 0px;" '+
            'id="'+id+'" data_x="'+lX+'" data_y="'+lY+'" direction="self" message_type="'+messageType+'">'+
                '<div style="display:inline; width:100%"><img src="./images/selfArrow.png" style="cursor:e-resize;">'+
                '<div class="makeEllipsisSelf arrowText" style="width:75px;font-size:12px;margin-left:3px;text-align:left;display:inline;">' + text + '</div></div>'+
          '</div>';
        }
                    
        
        dropOffLocation = document.getElementById("arrowChildrenDroppedOffHere");
        dropOffLocation.innerHTML += tag;
        arrowArr.push([document.getElementById(id),id,text,parseInt(lX),lY,parseInt(wide),parseInt(lX)+parseInt(wide),parseInt(lY),"","",arrowDescription]);
        
        determineLRNode(id,"arrow");
    }
    if (arrayType == "noteArr"){
        tag = '<div class="postit note child gridDropzone can-drop notePlaced" '+
                    'id=' + id + ' data_x="' +lX+ '" data_y="' +lY+ '"' +
                    'style="transform: translate(' + lX + 'px, ' + lY + 'px); -webkit-transform: translate(' + lX + 'px, ' + lY + 'px);width: '+wide+'px; height: '+height+'px;">' +
                        text +
                  '</div>';
        dropOffLocation = document.getElementById("noteChildrenDroppedOffHere");
        dropOffLocation.innerHTML += tag;
        noteArr.push([document.getElementById(id),id,text,parseInt(lX),parseInt(lY),wide,parseInt(lX)+parseInt(wide),parseInt(lY)+parseInt(height)]);
        
    }
    
}

var layers = {};
var nodesInLayer = [];
function determineLayers () {
    var doAgain = true;
    layers.length = 0;
    var layerNumber = -1;
    while (doAgain === true){
        layerNumber++;
        nodesInLayer.length = 0;
        var classToAssign = 'layer'+layerNumber;
        for (var i=0; i<nodeArr.length; i++){
            if (nodeArr[i][8]===null || nodeArr[i][8]===0){
                //console.log(nodeArr[i][1]);
                $('#'+nodeArr[i][1]).addClass(classToAssign);
                nodesInLayer.push(nodeArr[i][1]);        
            }
        }
        if (nodesInLayer.length === 0){
            doAgain = false;
        }
        else{
            layers[classToAssign] = nodesInLayer;
        }    
        doAgain = false;
    }
    
    
    //console.log(layers);
}

//Determines what nodes an arrow is connecting. 
//When from = "arrow" it finds the left and right nodes. When from = nodeUUID it finds the arrows attached to that node
function determineLRNode (id, from) {
    var connections = 0;
    // tolerance for subtle difference between x coordinate of nodes (midpoint) and x coordinates of arrow (end points) due to zoom in/out
    // this enables the arrows stay connected to nodes after re-scale window size.
    var tol = 2;
    var arrowIndex;
    getLifelines();
    for (var i = 0; i<arrowArr.length; i++){
        if (arrowArr[i][1] == id) { //finds correct arrow
            arrowIndex = i;
        }
    }

    if (from == "arrow"){
        arrowArr[arrowIndex][8]=null;
        arrowArr[arrowIndex][9]=null;
        for (var j = 0; j<lifelineX.length;j++){
            if (Math.abs(arrowArr[arrowIndex][3] - lifelineX[j][0]) <= tol ){
                arrowArr[arrowIndex][8] = lifelineX[j][1];
                connections++;
            }
            if (Math.abs(arrowArr[arrowIndex][6] + 12 - lifelineX[j][0]) <= tol ){
                arrowArr[arrowIndex][9] = lifelineX[j][1];
                connections++;
            }
            else if (  (Math.abs(arrowArr[arrowIndex][6] - lifelineX[j][0]) <= tol ) && document.getElementById(arrowArr[arrowIndex][1]).getAttribute("direction") == "self") { //Allows for self arrow
                arrowArr[arrowIndex][9] = lifelineX[j][1];
                connections++;
            }
        }
        changeColors();
        
    }
    
    else { //Handles constructor of type node uuid
        var nodeIndex;
        for (i=0; i<lifelineX.length;i++){
            if (lifelineX[i][1] == from) { //Finds node index, corresponds to lifeline index
                nodeIndex = i;
            }
        }
        if (Math.abs(arrowArr[arrowIndex][3] - lifelineX[nodeIndex][0]) <= tol ){ //If the x is equal to the new node lifeline
            arrowArr[arrowIndex][8] = nodeArr[nodeIndex][1]; //store to arrow's leftNode
            if (arrowArr[arrowIndex][9] !== null){ //if it has a right node
                connections = 2;
            }
            else {
                connections = 1;
            }
            changeColors();
        }
    }
    if (document.getElementById(id).getAttribute("direction") == "left"){
        var swap = arrowArr[arrowIndex][8];
        arrowArr[arrowIndex][8] = arrowArr[arrowIndex][9];
        arrowArr[arrowIndex][9] = swap;
    }
    warning(); //Displays warning on the sidebar if an arrow lacks an endpoint
    
    function changeColors () {
        if (connections == 2){        
            document.getElementById(id).style.background = "rgba(0,255,0,.30)"; //Green
            setTimeout(function (){
                document.getElementById(id).style.background = "rgba(0,255,0,0)"; //Fade out
            }, 500);
        }
        else if (connections == 1){
            document.getElementById(id).style.background = "rgba(255,255,0,.30)"; //Yellow
        }
        else if (connections === 0){
            document.getElementById(id).style.background = "rgba(255,0,0,.30)"; //Red
        }
    }    
}

var repeater;
function warning() {
    var allow = testAllConnections();
    if (allow === false) {
        document.getElementById("warning").innerHTML = "*Link missing lifeline";
    }
    else {
        document.getElementById("warning").innerHTML = "";
    }
    if (allow === false){
        document.getElementById("saveButton").style.cursor = "no-drop";
        //document.getElementById("printButton").style.cursor = "no-drop";
    }
    else {
        document.getElementById("saveButton").style.cursor = "pointer";
        //document.getElementById("printButton").style.cursor = "pointer";
    }
}


function blinkMissingArrows () {
    testAllConnections();
    var allMissing = missingStarts.concat(missingEnds);
    for (var i = 0; i<allMissing.length; i++){
        for (var j = i+1; j<allMissing.length;j++){
            if(allMissing[i]===allMissing[j])
                allMissing.splice(j--,1);
        }
    }
    var originalBG=[];
    for (i = 0; i<allMissing.length; i++) {
        id = allMissing[i];
        originalBG.push(document.getElementById(id).style.background);
        document.getElementById(id).style.background = "rgba(255,0,0,.80)";
    }
    setTimeout(function (){
    for (var i = 0; i<allMissing.length; i++) {
        id = allMissing[i];        
        document.getElementById(id).style.background = originalBG[i];
    }}, 1000);
}

function testAllConnections () {
    var allow = true;
    missingStarts = [];
    missingEnds = [];
    
    for (var i = 0; i<arrowArr.length;i++){
        result = determineNodeStart(arrowArr[i][1]);
        if (result === null){
            missingStarts.push(arrowArr[i][1]);
            allow=false;
        }
        result = determineNodeEnd(arrowArr[i][1]);
        if (result === null){
            missingEnds.push(arrowArr[i][1]);
            allow=false;
        }
    }
    return allow;
}

function determineNodeStart (id) {
    for (var i = 0; i<arrowArr.length; i++){
        if (arrowArr[i][1] === id) { //finds correct arrow
            return arrowArr[i][8];            
        }
    }
}
function determineNodeEnd (id) {
    for (var i = 0; i<arrowArr.length; i++){
        if (arrowArr[i][1] == id) { //finds correct arrow
            return arrowArr[i][9];
        }
    }
}

//Generates uuid
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}