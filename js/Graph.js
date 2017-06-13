
function GraphCreator(svg) {
    var thisGraph = this;

    thisGraph.allNodes = [];
    thisGraph.allLinks = [];
    thisGraph.state = {
        selectedNode: null,
        selectedEdge: null,
        mouseDownNode: null,
        mouseDownLink: null,
        lastKeyDown: -1
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
    thisGraph.svg = svg;
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
    thisGraph.svgG = svg.append("g").classed(thisGraph.consts.graphClass, true);

    // displayed when dragging between nodes
    thisGraph.dragLine = thisGraph.svgG.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0')
        .style('marker-end', 'url(#mark-end-arrow)');

    // svg nodes and edges 
    thisGraph.paths = thisGraph.svgG.append("g").selectAll("g");
    thisGraph.circles = thisGraph.svgG.append("g").selectAll("g");

    // listen for zoomin/out
    thisGraph.zoomSvg = d3.behavior.zoom()
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

    thisGraph.addMouseEvents = function() {
        svg.on("dblclick", function() {
                var newNode = new aNode(thisGraph);
                thisGraph.allNodes.push(newNode);
                newNode.draw();
                console.log("double click:"+JSON.stringify(newNode.id));
        });

        svg.call(thisGraph.zoomSvg).on("dblclick.zoom", null);
    };
    thisGraph.addKeyEvents = function() {
        // listen for key events
        d3.select(window).on("keydown", function(){
            thisGraph.svgKeyDown.call(thisGraph);
        })
        .on("keyup", function(){
            thisGraph.svgKeyUp.call(thisGraph);
        });
    };
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
                console.log("Selected node is: "+selectedNode.id);
                thisGraph.allNodes.splice(thisGraph.allNodes.indexOf(selectedNode), 1);
                thisGraph.spliceLinksForNode(selectedNode);
                thisGraph.state.selectedNode = null;
                thisGraph.removeElements();                
            } 
            else if (selectedEdge){
                console.log("Selected edge is: "+selectedEdge.id);
                thisGraph.allLinks.splice(thisGraph.allLinks.indexOf(selectedEdge), 1);
                thisGraph.state.selectedEdge = null;
                thisGraph.removeElements();                  
            }
        break;
    }
    console.log("key down");
};

GraphCreator.prototype.svgKeyUp = function() {
    var thisGraph = this;
    thisGraph.state.lastKeyDown = -1;
    console.log("key up");
};

GraphCreator.prototype.zoomed = function(){
    var thisGraph = this;
    d3.select("." + thisGraph.consts.graphClass)
        .attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")"); 
};

// remove edges associated with a node
GraphCreator.prototype.spliceLinksForNode = function(node) {
    var thisGraph = this,
    toSplice = thisGraph.allLinks.filter(function(l) {
        return (l.source === node || l.target === node);
    });
    toSplice.map(function(l) {
        thisGraph.allLinks.splice(thisGraph.allLinks.indexOf(l), 1);
    });
};

GraphCreator.prototype.replaceSelectEdge = function(d3Path, edgeData){
    var thisGraph = this;
    d3Path.classed(thisGraph.consts.selectedClass, true);
    if (thisGraph.state.selectedEdge){
        thisGraph.removeSelectFromEdge();
    }
    thisGraph.state.selectedEdge = edgeData;
    linkDetails(edgeData);
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
    d3Node.classed(thisGraph.consts.selectedClass, true);
    if (thisGraph.state.selectedNode){
        thisGraph.removeSelectFromNode();
    }
    thisGraph.state.selectedNode = nodeData;
    setNodeDetails(thisGraph.state.selectedNode);
};

GraphCreator.prototype.removeSelectFromNode = function(){
    var thisGraph = this;
    thisGraph.circles.filter(function(cd){
            return cd.id === thisGraph.state.selectedNode.id;
        }).classed(thisGraph.consts.selectedClass, false)
        .select("image").remove();
    thisGraph.state.selectedNode = null;
};

GraphCreator.prototype.removeElements= function() {
    var thisGraph = this;
    thisGraph.paths = thisGraph.paths.data(thisGraph.allLinks, function(d){
        return String(d.source.id) + "+" + String(d.target.id);
    });
    thisGraph.paths.exit().remove();
    thisGraph.circles = thisGraph.circles.data(thisGraph.allNodes, function(d){ return d.id;});
    thisGraph.circles.exit().remove();
}

GraphCreator.prototype.initialize= function() {
    var thisGraph = this;
    thisGraph.addKeyEvents();
    thisGraph.addMouseEvents();
}