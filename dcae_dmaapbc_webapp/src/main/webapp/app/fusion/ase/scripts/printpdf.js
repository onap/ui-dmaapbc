/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Contains functions to export editor data to a pdf

function printDiagram(){

        var now = new Date;
        var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
             now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

	///these figures come from the current drawing 
	//var grid_pitch = 42;
	var grid_start_y = 60;
	
	doubleLineNumbers.length=0;
	doubleLineText.length=0;
	var doubleElements = document.getElementsByClassName("doubleLine");
	$.each(doubleElements,function(index, value){
		doubleLineNumbers.push(($(value).attr('id')).substring(3));
		doubleLineText.push(value.children[0].innerHTML);
	});
	
        //alert('Saving To File -- click OK');
        m = "";
        m +=  '{ "diagram": \n';
        m += '{ "created": "' + utc_timestamp +   '",\n';
        m += '"rows": "' + rows + '",\n';
        m += '"cols": "' + cols + '",\n';
        m += '"description": "' + description + '",\n';
        m += '"gridPitchy": "' + gridPitchy + '",\n';
        m += '"canvasHeight": "' + $("#grid").height() + '",\n';
        m += '"canvasWidth": "' + $("#grid").width() + '",\n';
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
        //console.log(n);
        //console.log(n.diagram.created);
        m = decodeJSON(m);
        //alert(m);
        
        outputPDF(m);


}

function outputPDF(c) {

        var c;
        //alert(c);
        var n = JSON.parse(c);
        var doc = new jsPDF("landscape");
	var borderwidth=10;

	//for landscape
	var pdf_paper_xmax = 297;
	var pdf_paper_ymax = 210;

        var mystring = n.diagram.created;
        var creationTime = n.diagram.created;
        var description = n.diagram.description;
        var canvasHeight = n.diagram.canvasHeight;
        var canvasWidth = n.diagram.canvasWidth;
        var rows	= n.diagram.rows;
        var cols	= n.diagram.cols;
        var elementList = n.diagram.elements;
        //I dont think these are needed. I omitted them for testing and printPDF did not fail
        	//var oneNode    = n.diagram.elements.nodes[0].id;
        	//var oneArrow   = n.diagram.elements.arrows[0].id;

        var lineSpacing = 5;
        var linePosition = lineSpacing;

	var pdf_x_scale = pdf_paper_xmax / canvasWidth ; //this converts from canvasWidth to paper coords.
	var pdf_y_scale = (pdf_paper_ymax) / (canvasHeight );


	var title = 'Creation time:  '+ n.diagram.created ;
	var title = 'Description:  '+ n.diagram.description;
	//title += ' rows=' + rows;
	//title += ' cols=' + cols;
	//title += ' canvasHeight=' + canvasHeight;
	//title += ' canvasWidth=' + canvasWidth;
	//title += ' pdf_x_scale=' + pdf_x_scale;
	//title += ' pdf_y_scale=' + pdf_y_scale;

	doc.setFontSize(10);
        doc.text((pdf_paper_xmax/2)-(title.length/2), 10, title);

	drawgrid(doc,n.diagram.elements.separators)

        var allNodes = n.diagram.elements.nodes;
	DrawNodes(allNodes);


        var allArrows = n.diagram.elements.arrows;
	DrawArrows(allArrows);


        // Output as Data URI
        doc.output('dataurlnewwindow');


function drawborder(doc,max_x,max_y){
	var doc;
	var max_x;
	var max_y;
	doc.setDrawColor(255,0,0);
	doc.setFillColor(0,0,0);
	var borderwidth = 10;
	doc.rect(borderwidth, borderwidth, max_x - (2*borderwidth), max_y - (2*borderwidth), 'F'); // filled red square

	//doc.setDrawColor(255,0,0); // draw red lines
	doc.setLineWidth(1);
	doc.line(borderwidth, borderwidth, max_x-borderwidth,borderwidth ); // horz topline
	doc.line(max_x-borderwidth, borderwidth, max_x-borderwidth,max_y-borderwidth ); // right hand border 
	doc.line(max_x-borderwidth, max_y-borderwidth, borderwidth,max_y-borderwidth ); // bottom border 
	doc.line(borderwidth,max_y-borderwidth,borderwidth,borderwidth ); // lefthand border 


}

function drawgrid(doc,separators){
	console.log(separators);
	var rowsToMakeDouble=[]
	$.each(separators,function(index, value){
		rowsToMakeDouble.push(value.lineNumber);
	});
	
	var doc;
	//var grid_pitch = 42; 
        var grid_start_y = 60; 


        doc.setFontSize(10);

	//var max_x;
	//var max_y;
	doc.setDrawColor(255,0,0);
	doc.setFillColor(0,0,0);
	var borderwidth = 10;

	doc.setDrawColor(255,0,0); // draw red lines
	doc.setLineWidth(1);

	var xleftpos = 10;
	var yleftpos = 15;
	//var linepitch = 10;
	var lifeline_linepitch = (pdf_paper_xmax - (2*borderwidth))/ cols;

	//for the horizontal lines, we give two borderwidth at top and one at bottom for the drawing area
	var horz_gridpitch = Math.round(pdf_y_scale*gridPitchy);

	for (i = 1; i <= rows; i++) {  //for each row, draw a dotted line horizontally across
		xleftpos = borderwidth;
		yleftpos = (2*borderwidth) + (i*horz_gridpitch )  ;
		doc.setFontSize(10);
		doc.setLineWidth(0.01);
		doc.text(xleftpos, yleftpos, i.toString());
		//If there are no separators || the current row is not a separator : print dotted line. Else double line
		if (rowsToMakeDouble==null || rowsToMakeDouble.indexOf(i.toString())==-1){		
			dottedline(doc, xleftpos, yleftpos-1, cols*lifeline_linepitch, yleftpos-1); // horz topline
		}
		else {
			doubleline(doc, xleftpos, yleftpos-1, cols*lifeline_linepitch, yleftpos-1,separators[rowsToMakeDouble.indexOf(i.toString())].text); // horz topline
		}
	}
	//doc.line(borderwidth, borderwidth, max_x-borderwidth,borderwidth ); // horz topline
	//doc.line(max_x-borderwidth, borderwidth, max_x-borderwidth,max_y-borderwidth ); // right hand border 
	//doc.line(max_x-borderwidth, max_y-borderwidth, borderwidth,max_y-borderwidth ); // bottom border 
	//doc.line(borderwidth,max_y-borderwidth,borderwidth,borderwidth ); // lefthand border 

	//for debugging
	//var title="hello";
	//title += " =" + numlines;
        //doc.text((pdf_paper_xmax/2)-(title.length/2), 20, title);

}

function dottedline(doc,x1,y1,x2,y2){
	doc.setDrawColor(0,0,0); // draw blacklines
	
	var doc;
	var x1;
	var x2;
	var y1;
	var y2;
	var delta_y;
	var delta_x;
	var pitch;
	var ticklength;
	var j;
	var k;
	var fromx;
	var fromy;
	var tox;
	var toy;
	delta_x = (x2 - x1)/200;
	delta_y = (y2 - y1)/200;

	fromx = x1 ;
	fromy = y1 ;
	tox = fromx + (delta_x);
	toy = fromy + (delta_y);

	for(j = 1; j<= 200; j++){
		tox = tox + delta_x;
		toy = toy + delta_y;

		if(j%2==0 ){
			doc.line(fromx,fromy,tox,toy ); // draw tick line
		}

		fromx = tox;
		fromy = toy;

	}
}

function doubleline(doc,x1,y1,x2,y2,text){
	doc.setLineWidth(.3); //bolder lines
	//x values are transposed as to not interfere with the numbers on the left
	doc.line(x1+3,y1,x2+2,y2);
	doc.line(x1+3,y1+1,x2+2,y2+1); //shifts second line one unit down
	//console.log(text);
	doc.setFontStyle("italic");
	doc.text(text,x1+x2/2,y1-1);
	doc.setFontStyle("normal");
}


function DrawNodes(allNodes){
        console.log(n.diagram.elements);
        //console.log(document);
	        //for landscape

        var lifeline_linepitch = (pdf_paper_xmax - (2*borderwidth))/ cols;
        var horz_gridpitch     = (pdf_paper_ymax - 3*(borderwidth)) / rows;

        for (var i in allNodes ){
		xpos = (allNodes[i].data_x * pdf_x_scale) ;
                doc.text(xpos - (    (allNodes[i].innerText.length)/1.5), 20, allNodes[i].innerText);
		//xpos = allNodes[i].data_x*pdf_x_scale + (allNodes[i].innerText.length/2) ;
		doc.line(xpos, 20, xpos, pdf_paper_ymax-borderwidth); // vert line
        }
        //console.log(allNodes);
}


function DrawArrows(allArrows){
	var xpos;
	var ypos;
	//var grid_pitch = 42; 
        var grid_start_y = 60; 
	var horz_gridpitch = Math.round(pdf_y_scale*gridPitchy);

	var delta = Math.round(horz_gridpitch/3);
        //var title="hello!  ";
        //title += " pdf_x_scale=" + pdf_x_scale;
        //title += " pdf_y_scale=" + pdf_y_scale;
        //title += "arrow count =" + allArrows.length;
        //doc.text((pdf_paper_xmax/2)-(title.length/2), 15, title);

        for (var j in allArrows){
		var fromNode     = document.getElementById(allArrows[j].fromNodeID);
		var fromArrow    = findObjectWithId(allNodes,fromNode.id);
		var fromArrowx   = Math.round(fromArrow.data_x * pdf_x_scale) ;
		var fromArrowy   = (allArrows[j].data_y * pdf_y_scale) ;

		var toNode       = document.getElementById(allArrows[j].toNodeID);
		var toArrow      = findObjectWithId(allNodes,toNode.id);
		var toArrowx     = Math.round(toArrow.data_x*pdf_x_scale) ;
		//var toArrowy     = (allArrows[j].data_y*pdf_y_scale) ;
		//var toArrowy     = ((Math.round(allArrows[j].data_y-60)/42)) * Math.round((pdf_paper_ymax-30)/rows)) +20;
		var rowindex     =  Math.round( allArrows[j].data_y-grid_start_y) /gridPitchy;
		var toArrowy     = 20 + (rowindex * horz_gridpitch) - 2;

		fromArrowy = toArrowy;
		var mytext;
		
		mytext = allArrows[j].innerText;
		//mytext += " From Node ID " + fromArrow.id;
		//mytext += " From Node data_x=" + fromArrowx;
		//mytext += " rows= " + rows;
		//mytext += " cols= " + cols;
		//mytext += " pdf_paper_ymax= " + pdf_paper_ymax;
		//mytext += " canvasHeight= " + canvasHeight;
		//mytext += " Raw data_y= " + allArrows[j].data_y;
		//mytext += " From Node data_y= " + fromArrowy;
		//mytext += " pdf_y_scale= " + pdf_y_scale;

		//mytext += " From Node ID "   + fromArrow.id;
		//mytext += " To Node ID "   + toArrow.id;
		//mytext += " To Node data_x=" + toArrowx;
		//mytext += " To Node data_y=" + toArrowy;


		if(fromArrow.id != toArrow.id) {
		  //fromArrowy = 20*j + 40;
		  var textx = fromArrowx + (toArrowx - fromArrowx)/2 - (mytext.length/2);
                  doc.text(textx , fromArrowy-1, mytext);
		  doc.setLineWidth(0.7);
		  doc.line(fromArrowx, fromArrowy+1, toArrowx, fromArrowy+1); // draw arrow
		  if(fromArrowx < toArrowx){
			drawRightArrow(toArrowx,fromArrowy+1); // draw arrow
			}else{
			drawLeftArrow(toArrowx,fromArrowy+1); // draw arrow
			}
		  }else{   //special case of self loop back
		    var textx = fromArrowx  + (3*delta);
                    doc.text(textx , fromArrowy, mytext );
		    doc.setLineWidth(0.7);
		    doc.line(fromArrowx, fromArrowy-delta, fromArrowx+(2*delta), fromArrowy-delta ); // loop back brackets the same coords top line
		    doc.line(fromArrowx+(2*delta), fromArrowy-delta, fromArrowx+(2*delta), fromArrowy+delta ); // loop back brackets the same coords right hand loop
		    doc.line(fromArrowx+(2*delta), fromArrowy+delta, fromArrowx, fromArrowy+delta ); // loop back brackets the same coords bottom line
		    drawLeftArrow(fromArrowx,fromArrowy+delta); // draw arrow
		  }
        }
        //for debugging

}

function findObjectWithId(thing,id){
	var thing;
	var id;
	for(var k in thing){
		if(thing[k].id==id){
		  return(thing[k]);
		}
	}

}

function drawRightArrow(x,y){
	doc.setLineWidth(.7);
	var px0 = x;
	var py0 = y;
	var px1 = px0 -3;
	var py1 = py0 -2;
	var px2 = px0 -3;
	var py2 = py0 +2;
	var centerx = (px0 + px1)/2.0;
	var centery = (py1 + py2)/2.0;

	//basic big triangle
	doc.line(px0, py0, px1, py1);
	doc.line(px1, py1, px2, py2);
	doc.line(px2, py2, px0, py0);

	//smaller triangle within big triangle
	var scale = 0.8;
	px0 = px0 * scale;
	px1 = px1 * scale;
	px2 = px2 * scale;
	py0 = py0 * scale;
	py1 = py1 * scale;
	py2 = py2 * scale;
	var deltax = centerx - ((px1 + px0)/2.0) ;
	var deltay = centery - ((py1 + py2)/2.0);
	px0 = px0 + deltax;
	px1 = px1 + deltax;
	px2 = px2 + deltax;
	py0 = py0 + deltay;
	py1 = py1 + deltay;
	py2 = py2 + deltay;
	doc.line(px0, py0, px1, py1);
	doc.line(px1, py1, px2, py2);
	doc.line(px2, py2, px0, py0);

	//smaller triangle within big triangle
	var scale = 0.5;
	px0 = px0 * scale;
	px1 = px1 * scale;
	px2 = px2 * scale;
	py0 = py0 * scale;
	py1 = py1 * scale;
	py2 = py2 * scale;
	var deltax = centerx - ((px1 + px0)/2.0) ;
	var deltay = centery - ((py1 + py2)/2.0);
	px0 = px0 + deltax;
	px1 = px1 + deltax;
	px2 = px2 + deltax;
	py0 = py0 + deltay;
	py1 = py1 + deltay;
	py2 = py2 + deltay;
	doc.line(px0, py0, px1, py1);
	doc.line(px1, py1, px2, py2);
	doc.line(px2, py2, px0, py0);

	//smaller triangle within big triangle
	var scale = 0.3;
	px0 = px0 * scale;
	px1 = px1 * scale;
	px2 = px2 * scale;
	py0 = py0 * scale;
	py1 = py1 * scale;
	py2 = py2 * scale;
	var deltax = centerx - ((px1 + px0)/2.0) ;
	var deltay = centery - ((py1 + py2)/2.0);
	px0 = px0 + deltax;
	px1 = px1 + deltax;
	px2 = px2 + deltax;
	py0 = py0 + deltay;
	py1 = py1 + deltay;
	py2 = py2 + deltay;
	doc.line(px0, py0, px1, py1);
	doc.line(px1, py1, px2, py2);
	doc.line(px2, py2, px0, py0);

}
function drawLeftArrow(x,y){


	doc.setLineWidth(.7);
	var px0 = x;
	var py0 = y;
	var px1 = px0 +3;
	var py1 = py0 -2;
	var px2 = px0 +3;
	var py2 = py0 +2;
	var centerx = (px0 + px1)/2.0;
	var centery = (py1 + py2)/2.0;

	//basic big triangle
	doc.line(px0, py0, px1, py1);
	doc.line(px1, py1, px2, py2);
	doc.line(px2, py2, px0, py0);

	//smaller triangle within big triangle
	var scale = 0.8;
	px0 = px0 * scale;
	px1 = px1 * scale;
	px2 = px2 * scale;
	py0 = py0 * scale;
	py1 = py1 * scale;
	py2 = py2 * scale;
	var deltax = centerx - ((px1 + px0)/2.0) ;
	var deltay = centery - ((py1 + py2)/2.0);
	px0 = px0 + deltax;
	px1 = px1 + deltax;
	px2 = px2 + deltax;
	py0 = py0 + deltay;
	py1 = py1 + deltay;
	py2 = py2 + deltay;
	doc.line(px0, py0, px1, py1);
	doc.line(px1, py1, px2, py2);
	doc.line(px2, py2, px0, py0);

	//smaller triangle within big triangle
	var scale = 0.5;
	px0 = px0 * scale;
	px1 = px1 * scale;
	px2 = px2 * scale;
	py0 = py0 * scale;
	py1 = py1 * scale;
	py2 = py2 * scale;
	var deltax = centerx - ((px1 + px0)/2.0) ;
	var deltay = centery - ((py1 + py2)/2.0);
	px0 = px0 + deltax;
	px1 = px1 + deltax;
	px2 = px2 + deltax;
	py0 = py0 + deltay;
	py1 = py1 + deltay;
	py2 = py2 + deltay;
	doc.line(px0, py0, px1, py1);
	doc.line(px1, py1, px2, py2);
	doc.line(px2, py2, px0, py0);

	//smaller triangle within big triangle
	var scale = 0.3;
	px0 = px0 * scale;
	px1 = px1 * scale;
	px2 = px2 * scale;
	py0 = py0 * scale;
	py1 = py1 * scale;
	py2 = py2 * scale;
	var deltax = centerx - ((px1 + px0)/2.0) ;
	var deltay = centery - ((py1 + py2)/2.0);
	px0 = px0 + deltax;
	px1 = px1 + deltax;
	px2 = px2 + deltax;
	py0 = py0 + deltay;
	py1 = py1 + deltay;
	py2 = py2 + deltay;
	doc.line(px0, py0, px1, py1);
	doc.line(px1, py1, px2, py2);
	doc.line(px2, py2, px0, py0);

	//doc.setLineWidth(.75);
	//doc.line(x+3, y-2, x+3, y+2); // draw arrow //left bar
	//doc.line(x+2.8, y-1.3, x+2.8, y+1.3); // draw arrow //left bar
	//doc.line(x+2.5, y-1, x+2.5, y+1); // draw arrow //left bar
	//doc.line(x+2, y-1, x+2, y+1); // draw arrow //left bar
	//doc.line(x, y, x+3, y+2); // draw arrow //lower triangle
	//doc.line(x, y, x+3, y-2); // draw arrow //upper triangle

}

}