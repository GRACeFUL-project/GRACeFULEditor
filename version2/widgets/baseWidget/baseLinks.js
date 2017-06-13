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
        this.nodeId=index;
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
        pathElement = that.rootElement.append('line')

            .classed("baseDragPath",true);
        pathElement.attr("x1", that.sourceNode.x)
             .attr("y1", that.sourceNode.y)
             .attr("x2", that.targetNode.x)
             .attr("y2", that.targetNode.y);
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
