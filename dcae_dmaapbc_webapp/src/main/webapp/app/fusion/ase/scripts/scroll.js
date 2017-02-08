/*
=============================================================================================
The MIT License (MIT)

Copyright 2015 AT&T Intellectual Property. All other rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Called when the user scrolls. Adjusts transparencies and keeps the nodes on the page at all times

function scroll () {	
	
	var scrollY = $(document).scrollTop();
	var scrollX = $(document).scrollLeft();
	
	$("#numbers").css("margin-top", 0-scrollY);
	
	if(scrollX != 0 ) {		
		if (scrollX<=80){
			$( "#numbers" ).css('opacity', 1- 0.01 * (scrollX));
		}
		else {
			$( "#numbers" ).css('opacity', '.2');
		}
	} 
	else {
		$( "#numbers" ).css('opacity', '1');
	}
	
	var busy = false;
	if (scrollY > 50 ){
		if(busy)
			return;
		busy = true;
		
		//Scrolls Nodes down the page
		$(".verticallyScrollable").css("margin-top", -50+scrollY);
		
		//Fades nodes as T->B
		if (scrollY<=120){
			$( ".verticallyScrollable" ).css('opacity', 1- 0.01 * (scrollY-50));
		}
		else {
			$( ".verticallyScrollable" ).css('opacity', '.3');
		}
		//console.log(scrollY);
		$(".verticalLine").css("top", 102-scrollY);

		busy = false;
	}
	else{
		$( ".verticallyScrollable" ).css('opacity', 1);
	}	
	
	//Fades numbers as L->R
	if(scrollX != 0 ) {
		
		if (scrollX<=80){
			$( "#numbers" ).css('opacity', 1- 0.01 * (scrollX));
		}
		else {
			$( "#numbers" ).css('opacity', '.2');
		}
	} 
	else {
		$( "#numbers" ).css('opacity', '1');
	}
	if (scrollY == 0) {
		$(".verticallyScrollable").css("margin-top", 0);
		$(".verticalLine").css("top", 52);
	}
}