var drId= 0;

function BaseDragger(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
    // this.parentWidget=parentWidget; // tells the graph which widget it talks to

    this.nodeId = drId++;
    this.label = "empty";
    this.parent=undefined;
    this.x = 0;
    this.y = 0;
    this.rootElement=undefined;
    this.rootNodeLayer=undefined;
    var mouseEntered=false;
    var mouseButtonPressed=false;
    var nodeElement=undefined;
    var pathElement=undefined;
    var id;
    var type="Dragger";


    this.type=function(){
        return type;
    };

    this.parentNode=function(){
        return this.parent;
    };

    this.setParentNode=function(parentNode){
        this.parent=parentNode;
        if (that.parent.getRadius && that.parent.getRadius()){
            this.x=that.parent.x+10+that.parent.getRadius();
        }else {
            this.x = that.parent.x + 50;
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
    this.drawNode=function(){
        if (nodeElement===undefined) {
            pathElement = that.rootNodeLayer.append('line')
                .classed("baseDragPath",true);
            pathElement.attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", 0);

            nodeElement = that.rootNodeLayer.append('circle').attr("r", 20);
        }

    };


    this.updateElement=function(){
        that.rootElement.attr("transform", "translate(" + that.x + "," + that.y + ")");
        if (pathElement) {
            pathElement.attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", that.parent.x - this.x)
                .attr("y2", that.parent.y - this.y);
        }
    };

    /** MOUSE HANDLING FUNCTIONS ------------------------------------------------- **/

    this.addMouseEvents=function(){
        // console.log("adding mouse events");
        that.rootNodeLayer.on("mouseover", that.onMouseOver)
            .on("mouseout", that.onMouseOut)
            .on("click", that.onClicked)
            .on("dblclick",that.executeUserDblClick)
            .on("mousedown",that.mouseDown)
            .on("mouseup",that.mouseUp);
    };

    this.mouseDown=function(){
        nodeElement.style("cursor","move");
        nodeElement.classed("baseNodeHovered",true);
        mouseButtonPressed=true;
    };

    this.mouseUp=function(){
        nodeElement.style("cursor","auto");
        mouseButtonPressed=false;
    };


    this.mouseEntered=function(p){
        if (!arguments.length) return mouseEntered;
        mouseEntered = p;
        return this;
    };
    this.onMouseOver=function(){
        if (that.mouseEntered()) {
            return;
        }
        nodeElement.classed("baseNodeHovered",true);
        var selectedNode = that.rootElement.node(),
            nodeContainer = selectedNode.parentNode;
        nodeContainer.appendChild(selectedNode);

        that.mouseEntered(true);

    };
    this.onMouseOut=function(){
        if (mouseButtonPressed===true)
            return;
        nodeElement.classed("baseNodeHovered",false);
        that.mouseEntered(false);
    };


}

BaseDragger.prototype.constructor = BaseDragger;
