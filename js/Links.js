var idLink = 0;

function aLink(nodeRef, src, tar) {
	var that = this;
	var newLs;
	this.nodeRef = nodeRef;
	this.graph = nodeRef.graph;

	this.source = src;
	this.target = tar;
	this.id = "link" + idLink++;
	this.relation = '+';
}

aLink.prototype.addMouseEvents = function() {
	var that = this;
	newLs.on("mousedown", function(d){
		that.pathMouseDown(d3.select(this), d);
	})
	.on("mouseup", function(d){
		that.graph.state.mouseDownLink = null;
	});
}

aLink.prototype.draw = function() {
	var that = this;
	that.graph.paths = that.graph.paths.data(that.graph.allLinks, function(d){
	  	return String(d.source.id) + "+" + String(d.target.id);
	});
	// add new paths
	newLs = that.graph.paths.enter()
	.append("path")
	.style('marker-end','url(#end-arrow)')
	.classed("link", true)
	.attr("d", function(d){
		return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
	})
	.attr("id", that.id)
	that.addMouseEvents();
	that.setRelation();
}

aLink.prototype.setRelation = function() {
	var that = this;
	var id = that.id;
	var edgelabels = that.graph.svgG.selectAll(".edgelabel")
        .data(that.graph.allLinks)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr("class", "linklabel")
	 	.style("font-size", "13px")
	 	.attr("dy", "-10")
     	.attr("text-anchor", "middle")
	   	.style("fill","#000")

    edgelabels.append('textPath')
        .attr('xlink:href',"#"+id)
        .style("pointer-events", "none")
        .attr("startOffset", "50%")
        .text(function(d,i){return that.relation});
}

aLink.prototype.pathMouseDown = function(d3path, d){
	var that = this;
  	d3.event.stopPropagation();
  	that.graph.state.mouseDownLink = d;

  	if (that.graph.state.selectedNode){
    	that.graph.removeSelectFromNode();
  	}
  
  	var prevEdge = that.graph.state.selectedEdge;  
  	if (!prevEdge || prevEdge !== d){
    	that.graph.replaceSelectEdge(d3path, d);
  	} else{
    	that.graph.removeSelectFromEdge();
  	}
};
