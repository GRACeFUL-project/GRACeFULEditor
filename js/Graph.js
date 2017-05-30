
function GraphCreator(svg) {
	var thisGraph = this;
	thisGraph.idct = 0;

	thisGraph.nodes = [];
	thisGraph.edges = [];
	
	thisGraph.state = {
	    selectedNode: null,
	    selectedEdge: null,
	    mouseDownNode: null,
	    mouseDownLink: null,
	    lastKeyDown: -1,
	    dragArrow: false
	};

	thisGraph.consts =  {
	    selectedClass: "selected",
	    circleGClass: "conceptG",
	    graphClass: "graph",
	    activeEditId: "active-editing",
	    BACKSPACE_KEY: 8,
	    DELETE_KEY: 46,
	    ENTER_KEY: 13,
	    nodeRadius: 50
	};

	// define arrow markers for graph links
	var defs = svg.append('svg:defs');
	defs.append('svg:marker')
	  .attr('id', 'end-arrow')
	  .attr('viewBox', '0 -5 10 10')
	  .attr('refX', "32")
	  .attr('markerWidth', 3.5)
	  .attr('markerHeight', 3.5)
	  .attr('orient', 'auto')
	  .append('svg:path')
	  .attr('d', 'M0,-5L10,0L0,5');

	// define arrow markers for leading arrow
	defs.append('svg:marker')
	  .attr('id', 'mark-end-arrow')
	  .attr('viewBox', '0 -5 10 10')
	  .attr('refX', 7)
	  .attr('markerWidth', 3.5)
	  .attr('markerHeight', 3.5)
	  .attr('orient', 'auto')
	  .append('svg:path')
	  .attr('d', 'M0,-5L10,0L0,5');

	thisGraph.svg = svg;
	thisGraph.svgG = svg.append("g").classed(thisGraph.consts.graphClass, true);

	// displayed when dragging between nodes
	thisGraph.dragLine = thisGraph.svgG.append('svg:path')
	      .attr('class', 'link dragline hidden')
	      .attr('d', 'M0,0L0,0')
	      .style('marker-end', 'url(#mark-end-arrow)');

	// svg nodes and edges 
	thisGraph.paths = thisGraph.svgG.append("g").selectAll("g");
	thisGraph.circles = thisGraph.svgG.append("g").selectAll("g");

	thisGraph.drag = d3.behavior.drag()
	    .origin(function(d){
	        return {x: d.x, y: d.y};
	    })
	    .on("drag", function(args){
	        thisGraph.dragmove.call(thisGraph, args);
	    });

	thisGraph.dragmove = function(d) {
	  if (thisGraph.state.dragArrow){
	    thisGraph.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(thisGraph.svgG.node())[0] + ',' + d3.mouse(this.svgG.node())[1]);
	  } else{
	    d.x += d3.event.dx;
	    d.y +=  d3.event.dy;
	    thisGraph.updateGraph();
	  }
	};

	// listen for key events
	d3.select(window).on("keydown", function(){
	  thisGraph.svgKeyDown.call(thisGraph);
	})
	.on("keyup", function(){
	  thisGraph.svgKeyUp.call(thisGraph);
	});

	svg.on("dblclick", function() {
	    	var xycoords = d3.mouse(thisGraph.svgG.node()),
			newNode = {id: thisGraph.idct++, title: "new concept", x: xycoords[0], y: xycoords[1]};
			thisGraph.nodes.push(newNode);
			thisGraph.updateGraph();
			// make title of text immediently editable
			var d3txt = thisGraph.changeTextOfNode(thisGraph.circles.filter(function(dval){
				        	return dval.id === newNode.id;
					    }), newNode),
			txtNode = d3txt.node();
			thisGraph.selectElementContents(txtNode);
			txtNode.focus();
	});

	// listen for dragging
	var dragSvg = d3.behavior.zoom()
	    .on("zoom", function(){
	        thisGraph.zoomed.call(thisGraph);
	        return true;
	      })
	      .on("zoomstart", function(){
	        var ael = d3.select("#" + thisGraph.consts.activeEditId).node();
	        if (ael){
	          ael.blur();
	        }
	        d3.select('#canvasArea').style("cursor", "move");
	      })
	      .on("zoomend", function(){
	        d3.select('#canvasArea').style("cursor", "auto");
	      });
	
	svg.call(dragSvg).on("dblclick.zoom", null);

	thisGraph.zoomed = function(){
	  d3.select("." + this.consts.graphClass)
	    .attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")"); 
	};
}

/* select all text in element: taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element */
GraphCreator.prototype.selectElementContents = function(el) {
	var range = document.createRange();
	range.selectNodeContents(el);
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
};

/* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
GraphCreator.prototype.insertTitleLinebreaks = function (gEl, title) {
  	var words = title.split(/\s+/g),
    nwords = words.length;
  	var el = gEl.append("text")
        		.attr("text-anchor","middle")
        		.attr("dy", "-" + (nwords-1)*7.5);

  	for (var i = 0; i < words.length; i++) {
    	var tspan = el.append('tspan').text(words[i]);
    	if (i > 0)
      		tspan.attr('x', 0).attr('dy', '15');
  	}
};

/* place editable text on node in place of svg text */
GraphCreator.prototype.changeTextOfNode = function(d3node, d){
  	var thisGraph= this,
    consts = thisGraph.consts,
    htmlEl = d3node.node();
  	d3node.selectAll("text").remove();
  	var nodeBCR = htmlEl.getBoundingClientRect(),
    curScale = nodeBCR.width/consts.nodeRadius,
    placePad  =  5*curScale,
    useHW = curScale > 1 ? nodeBCR.width*0.71 : consts.nodeRadius*1.42;
  	// replace with editableconent text
  	var d3txt = thisGraph.svg.selectAll("foreignObject")
    	.data([d])
        .enter()
        .append("foreignObject")
        .attr("x", nodeBCR.left + placePad )
        .attr("y", nodeBCR.top)
        .attr("height", 2*useHW)
        .attr("width", useHW)
        .append("xhtml:p")
        .attr("id", consts.activeEditId)
        .attr("contentEditable", "true")
        .text(d.title)
        .on("mousedown", function(d){
          d3.event.stopPropagation();
        })
        .on("keydown", function(d){
          d3.event.stopPropagation();
          if (d3.event.keyCode == consts.ENTER_KEY){
            this.blur();
          }
        })
        .on("blur", function(d){
          d.title = this.textContent;
          thisGraph.insertTitleLinebreaks(d3node, d.title);
          d3.select(this.parentElement).remove();
        });
  	return d3txt;
};

// remove edges associated with a node
GraphCreator.prototype.spliceLinksForNode = function(node) {
  	var thisGraph = this,
    toSplice = thisGraph.edges.filter(function(l) {
    	return (l.source === node || l.target === node);
  	});
  	toSplice.map(function(l) {
    	thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
  	});
};

GraphCreator.prototype.replaceSelectEdge = function(d3Path, edgeData){
  	var thisGraph = this;
  	d3Path.classed(thisGraph.consts.selectedClass, true);
  	if (thisGraph.state.selectedEdge){
    	thisGraph.removeSelectFromEdge();
  	}
  	thisGraph.state.selectedEdge = edgeData;
};

GraphCreator.prototype.removeSelectFromEdge = function(){
  	var thisGraph = this;
  	thisGraph.paths.filter(function(cd){
    	return cd === thisGraph.state.selectedEdge;
  	}).classed(thisGraph.consts.selectedClass, false);
  	thisGraph.state.selectedEdge = null;
};

GraphCreator.prototype.replaceSelectNode = function(d3Node, nodeData){
  	var thisGraph = this;
  	d3Node.classed(this.consts.selectedClass, true);
  	if (thisGraph.state.selectedNode){
    	thisGraph.removeSelectFromNode();
  	}
  	thisGraph.state.selectedNode = nodeData;
};

GraphCreator.prototype.removeSelectFromNode = function(){
  	var thisGraph = this;
  	thisGraph.circles.filter(function(cd){
    		return cd.id === thisGraph.state.selectedNode.id;
  		}).classed(thisGraph.consts.selectedClass, false)
  		.select("image").remove();
  	thisGraph.state.selectedNode = null;
};

GraphCreator.prototype.pathMouseDown = function(d3path, d){
  	var thisGraph = this;
  	d3.event.stopPropagation();
  	thisGraph.state.mouseDownLink = d;

  	if (thisGraph.state.selectedNode){
    	thisGraph.removeSelectFromNode();
  	}
  
  	var prevEdge = thisGraph.state.selectedEdge;  
  	if (!prevEdge || prevEdge !== d){
    	thisGraph.replaceSelectEdge(d3path, d);
  	} else{
    	thisGraph.removeSelectFromEdge();
  	}
};

// mousedown on node
GraphCreator.prototype.circleMouseDown = function(d3node, d){
  	var thisGraph = this;
  	d3.event.stopPropagation();
  	thisGraph.state.mouseDownNode = d;
  	if (thisGraph.state.dragArrow){
    // reposition dragged directed edge
    thisGraph.dragLine.classed('hidden', false)
    					.attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
    return;
	}
};

// mouseup on nodes
GraphCreator.prototype.circleMouseUp = function(d3node, d){
  	var thisGraph = this;
  
  	var mouseDownNode = thisGraph.state.mouseDownNode;
  
  	if (!mouseDownNode) return;

  	thisGraph.dragLine.classed("hidden", true);
  	if (mouseDownNode !== d){
    	// we're in a different node: create new edge from mousedown edge and add to graph
    	var newEdge = {source: mouseDownNode, target: d};
    	var filtRes = thisGraph.paths.filter(function(d){
      		if (d.source === newEdge.target && d.target === newEdge.source){
        		thisGraph.edges.splice(thisGraph.edges.indexOf(d), 1);
      		}
      	return d.source === newEdge.source && d.target === newEdge.target;
    	});
    	if (!filtRes[0].length){
      		thisGraph.edges.push(newEdge);
      		thisGraph.updateGraph();
          thisGraph.removeSelectFromNode();
    	}
  	} 
  	else{
        	var prevNode = thisGraph.state.selectedNode;            
        
        	if (!prevNode || prevNode.id !== d.id){
          		thisGraph.replaceSelectNode(d3node, d);
          		thisGraph.addDragger(d3node, d);
        	} 
        	else{
          		thisGraph.removeSelectFromNode();
        	}
    }
	thisGraph.state.mouseDownNode = null;
  	thisGraph.state.dragArrow = false;
  	return;
}; // end of circles mouseup

GraphCreator.prototype.addDragger = function(dEl, d) {
	var thisGraph = this;
  var newEl = dEl.append("image")
            .attr("xlink:href", "images/arrow.png")   
            .attr("x", 40)
            .attr("y", 10) 
            .style("display",null)           
            .attr("width", 17)
            .attr("height", 17)
            .on('mousedown',function() {
              thisGraph.state.dragArrow = true;
            })
            .on('mouseout', function() {
              if(thisGraph.state.dragArrow)
                dEl.select("image").remove();
            });
}

// keydown on main svg
GraphCreator.prototype.svgKeyDown = function() {
  	var thisGraph = this;
  	// make sure repeated key presses don't register for each keydown
  	if(thisGraph.state.lastKeyDown !== -1) return;

  	thisGraph.state.lastKeyDown = d3.event.keyCode;
  	var selectedNode = thisGraph.state.selectedNode,
    selectedEdge = thisGraph.state.selectedEdge;

  	switch(d3.event.keyCode) {
  		case thisGraph.consts.BACKSPACE_KEY:
  		case thisGraph.consts.DELETE_KEY:
    		d3.event.preventDefault();
    		if (selectedNode){
      			thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1);
      			thisGraph.spliceLinksForNode(selectedNode);
      			thisGraph.state.selectedNode = null;
      			thisGraph.updateGraph();
    		} 
    		else if (selectedEdge){
      			thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1);
      			thisGraph.state.selectedEdge = null;
      			thisGraph.updateGraph();
    		}
    	break;
  	}
};

GraphCreator.prototype.svgKeyUp = function() {
	var thisGraph = this;
  	thisGraph.state.lastKeyDown = -1;
};

// call to propagate changes to graph
GraphCreator.prototype.updateGraph = function(){
  	var thisGraph = this;
    thisGraph.paths = thisGraph.paths.data(thisGraph.edges, function(d){
    	return String(d.source.id) + "+" + String(d.target.id);
  	});
  	var paths = thisGraph.paths;
  	// update existing paths
  	paths.style('marker-end', 'url(#end-arrow)')
    	.classed(thisGraph.consts.selectedClass, function(d){
      		return d === thisGraph.state.selectedEdge;
    	})
    	.attr("d", function(d){
      		return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
    });

  	// add new paths
  	paths.enter()
    	.append("path")
    	.style('marker-end','url(#end-arrow)')
    	.classed("link", true)
    	.attr("d", function(d){
      		return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
    	})
    	.on("mousedown", function(d){
      		thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
      	})
    	.on("mouseup", function(d){
      		thisGraph.state.mouseDownLink = null;
    });

  	// remove old links
  	paths.exit().remove();
  
  	// update existing nodes
  	thisGraph.circles = thisGraph.circles.data(thisGraph.nodes, function(d){ return d.id;});
  	thisGraph.circles.attr("transform", function(d){
      return "translate(" + d.x + "," + d.y + ")";
    });

  	// add new nodes
  	var newGs= thisGraph.circles.enter()
        .append("g");

  	newGs.classed(thisGraph.consts.circleGClass, true)
    	.attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})
    	.on("mousedown", function(d){
      		thisGraph.circleMouseDown.call(thisGraph, d3.select(this), d);
    	})
    	.on("mouseup", function(d){
      		thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
    	})
    	.on("dblclick", function(d) {
    		d3.event.stopPropagation();
    		var d3txt = thisGraph.changeTextOfNode(d3.select(this), d);
        	var txtNode = d3txt.node();
        	thisGraph.selectElementContents(txtNode);
        	txtNode.focus();
    	})
    	.call(thisGraph.drag);

  	newGs.append("circle")
    	.attr("r", String(thisGraph.consts.nodeRadius));

  	newGs.each(function(d){
    	thisGraph.insertTitleLinebreaks(d3.select(this), d.title);
  	});

  	// remove old nodes
  	thisGraph.circles.exit().remove();
};
