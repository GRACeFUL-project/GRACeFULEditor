var linkId= 0;

function BaseLink(graph) {

    /** variable defs **/
    var that = this;
    this.sourceNode=undefined;
    this.targetNode=undefined;
    this.rootElement=undefined;
    var pathElement=undefined;
    var id=linkId++;

    /** BASE HANDLING FUNCTIONS ------------------------------------------------- **/
    this.id=function(index) {
        if (!arguments.length) {
            return id;
        }
        id=index;
    };

    this.source=function(src){
        this.sourceNode=src;
        console.log("Source Add");
        src.addLink(that);

    };
    this.target=function(target){
        console.log("Target Add");
        this.targetNode=target;
        target.addLink(that);
    };


    this.svgRoot=function(root){
        if (!arguments.length)
            return that.rootElement;
        that.rootElement=root;
    };

    this.drawElement=function(){
        console.log("drawing a link ");
        var marker = that.rootElement.append("marker")
                    .attr("id", "arrow"+id)
                    .attr("markerHeight", 3)
                    .attr("markerWidth", 4)
                    .attr("markerUnits", "strokeWidth")
                    .attr("orient", "auto")
                    .attr("refX", 34)
                    .attr("refY", 5)
                    .attr("viewBox", "0 0 10 10")
                    .append("path")
                    .attr("d", "M 0 0 L 10 5 L 0 10 z");

        pathElement = that.rootElement.append('line')

            .classed("baseDragPath",true);
        pathElement.attr("x1", that.sourceNode.x)
             .attr("y1", that.sourceNode.y)
             .attr("x2", that.targetNode.x)
             .attr("y2", that.targetNode.y)
             .attr('marker-end', 'url(#arrow'+id+')');
    };

    this.updateElement=function(){
        if (pathElement) {
            pathElement.attr("x1", that.sourceNode.x)
                .attr("y1", that.sourceNode.y)
                .attr("x2", that.targetNode.x)
                .attr("y2", that.targetNode.y);
        }

    }




}

BaseLink.prototype.constructor = BaseLink;
