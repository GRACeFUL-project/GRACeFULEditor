var idNode = 0;

function aNode(graph) {
	var xycoords = d3.mouse(graph.svgG.node());
	var newGs;
	var dragArrow = false;
	var that = this;

	this.id = idNode++;
	this.title = "new Concept";
	this.x = xycoords[0];
	this.y = xycoords[1];

	this.graph = graph;

	this.drag = d3.behavior.drag()
	    .origin(function(d){
	        return {x: d.x, y: d.y};
	    })
	    .on("drag", function(args){
	        that.dragmove(args);
	    });

	this.type = "Factor";
}

aNode.prototype.addMouseEvents = function() {
	var that = this;
	newGs.on("mousedown", function(d){
      		that.circleMouseDown(d3.select(this), d);      		
    	})
    	.on("mouseup", function(d){
      		that.circleMouseUp(d3.select(this), d);      		
    	})
    	.on("dblclick", function(d) {
    		d3.event.stopPropagation();
    		that.setTitle();      	
    	})
    	.call(that.drag);
}

aNode.prototype.draw = function() {
	var thisGraph = this.graph;

	thisGraph.circles = thisGraph.circles.data(thisGraph.allNodes, function(d){ 
		return d.id;
	});
	newGs= thisGraph.circles.enter()
			.append("g")
			.classed(thisGraph.consts.circleGClass, true)
    		.attr("transform", function(d){
    			return "translate(" + d.x + "," + d.y + ")";
    		});
    this.addMouseEvents();
	newGs.append("circle")
		.attr("r", String(thisGraph.consts.nodeRadius));
	// make title of text immediently editable
	this.setTitle();
}

aNode.prototype.setTitle = function() {
	var that = this;
	var d3txt = that.changeTextOfNode(that.graph.circles.filter(function(dval){
		        	return dval.id === that.id;
			    }), that),
	txtNode = d3txt.node();
	that.selectElementContents(txtNode);
	txtNode.focus();
}

aNode.prototype.circleMouseDown = function(d3node, d) {
	console.log("mouse down on node: "+d.id);
	var thisGraph = this.graph;
  	d3.event.stopPropagation();
  	thisGraph.state.mouseDownNode = d;
  	if (this.dragArrow){
    // reposition dragged directed edge
    	thisGraph.dragLine.classed('hidden', false)
    		.attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
    	return;
	}
}

aNode.prototype.circleMouseUp = function(d3node, d) {
	console.log("mouse up on node: "+d.id);
	var that = this;
  
  	var mouseDownNode = that.graph.state.mouseDownNode;
  
  	if (!mouseDownNode) return;

  	that.graph.dragLine.classed("hidden", true);
  	if (mouseDownNode !== d){
    	// we're in a different node: create new edge from mousedown edge and add to graph
    	var newEdge = new aLink(that, mouseDownNode, d);
    	var filtRes = that.graph.paths.filter(function(d){
      		if (d.source === newEdge.target && d.target === newEdge.source){
        		that.graph.allLinks.splice(that.graph.allLinks.indexOf(d), 1);
      		}
      	return d.source === newEdge.source && d.target === newEdge.target;
    	});
    	if (!filtRes[0].length){
      		that.graph.allLinks.push(newEdge);
      		newEdge.draw();
          	that.graph.removeSelectFromNode();
    	}
  	} 
  	else{
  		if(that.graph.state.selectedEdge){
  			that.graph.removeSelectFromEdge();
  		}
        var prevNode = that.graph.state.selectedNode;            
        if (!prevNode || prevNode.id !== d.id){
        	that.graph.replaceSelectNode(d3node, d);
        	that.addDragger(d3node, d);
        } 
        else{
        	that.graph.removeSelectFromNode();
        }
    }
	that.graph.state.mouseDownNode = null;
  	that.dragArrow = false;
  	return;
}

aNode.prototype.addDragger = function(dEl, d) {
	var that = this;
	var newEl = dEl.append("image")
        .attr("xlink:href", "images/arrow.png")   
        .attr("x", 40)
        .attr("y", 10) 
        .style("display",null)           
        .attr("width", 17)
        .attr("height", 17)
        .on('mousedown',function() {
        	console.log("mouse down on the image");
            that.dragArrow = true;
        })
        .on('mouseout', function() {
            if(that.dragArrow)
               dEl.select("image").remove();
        });
}

aNode.prototype.dragmove = function(d) {
	var thisGraph = this.graph;

	if(this.dragArrow) {
		thisGraph.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(thisGraph.svgG.node())[0] + ',' + d3.mouse(thisGraph.svgG.node())[1]);
	}
	else {
		d.x += d3.event.dx;
		d.y +=  d3.event.dy;

		// update existing paths
		thisGraph.paths = thisGraph.paths.data(thisGraph.allLinks, function(d){
			return String(d.source.id) + "+" + String(d.target.id);
		});
		thisGraph.paths.style('marker-end', 'url(#end-arrow)')
			.classed(thisGraph.consts.selectedClass, function(d){
		   		return d === thisGraph.state.selectedEdge;
			})
			.attr("d", function(d){
		   		return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
			});
		
		// update existing nodes
  		thisGraph.circles = thisGraph.circles.data(thisGraph.allNodes, function(d){ return d.id;});
  		thisGraph.circles.attr("transform", function(d){
      		return "translate(" + d.x + "," + d.y + ")";
    	});
	}
	console.log("dragging node: "+d.id);
}

aNode.prototype.changeTextOfNode = function(d3node, d) {
	var thisGraph= this.graph,
	that = this,
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
	        that.insertTitleLinebreaks(d3node, d.title);
	        d3.select(this.parentElement).remove();
	        thisGraph.replaceSelectNode(d3node, d);
	        that.addDragger(d3node, d);
	    });
	return d3txt;
}

aNode.prototype.selectElementContents = function(el) {
	var range = document.createRange();
	range.selectNodeContents(el);
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
};

aNode.prototype.insertTitleLinebreaks = function (gEl, title) {
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