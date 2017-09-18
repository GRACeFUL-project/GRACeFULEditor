var drId= 0;

function PortDragger(graph) {
    var that = this;
    BaseDragger.apply(this,arguments);
    // todo: think about a parent widget



    this.setParentNode=function(parentNode){
        this.parent=parentNode;
        if (that.parent.getRadius && that.parent.getRadius()){
            this.x=that.parent.x+10+that.parent.getRadius();
        }else {
            this.x = that.parent.x + 30;
        }
        this.y=that.parent.y;
        this.updateElement();
    };

    /** BASE HANDLING FUNCTIONS ------------------------------------------------- **/
    this.id=function(index) {
        if (!arguments.length) {
            return that.nodeId;
        }
        this.nodeId=index;
    };

    this.svgRoot=function(root){
        if (!arguments.length)
            return that.rootElement;
        that.rootElement=root;
        that.rootNodeLayer=that.rootElement.append('g');
        that.addMouseEvents();
    };


    /** DRAWING FUNCTIONS ------------------------------------------------- **/
    // this.drawNode=function(){
    //     if (that.nodeElement===undefined) {
    //         that.pathElement = that.rootNodeLayer.append('line')
    //             .classed("baseDragPath",true);
    //         that.pathElement.attr("x1", 0)
    //             .attr("y1", 0)
    //             .attr("x2", 0)
    //             .attr("y2", 0);

    //         that.nodeElement = that.rootNodeLayer.append('circle').attr("r", 10);
    //     }

    // };

}



PortDragger.prototype = Object.create(BaseDragger.prototype);
PortDragger.prototype.constructor = PortDragger;

