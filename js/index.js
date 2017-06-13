document.onload = (function(d3, saveAs, Blob, undefined){
  	"use strict";

	var width = document.getElementById('canvasArea').getBoundingClientRect().width;
	var height = document.getElementById('canvasArea').getBoundingClientRect().height;

	  /** MAIN SVG **/
	var svg = d3.select("#canvasArea").append("svg")
	        .attr("width", width)
	        .attr("height", height);

	window.onresize = function(){
		width = document.getElementById('canvasArea').getBoundingClientRect().width;
		height = document.getElementById('canvasArea').getBoundingClientRect().height;
		svg.attr("width", width).attr("height", height);
	};

	var graph = new GraphCreator(svg);
	graph.initialize();

	controlWidget(graph);

})(window.d3, window.saveAs, window.Blob);