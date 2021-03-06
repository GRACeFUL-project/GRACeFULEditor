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
    this.mouseEnteredVar=false;
    this.mouseButtonPressed=false;
    this.nodeElement=undefined;
    this.pathElement=undefined;
    var id;
    this.typus="Dragger";


    this.type=function(){
        return this.typus;
    };

    this.parentNode=function(){
        return this.parent;
    };

    this.setParentNode=function(parentNode){
        this.parent=parentNode;
        if (that.parent.getRadius && that.parent.getRadius()){
            this.x=that.parent.x+10+that.parent.getRadius();
        }else {
            this.x = that.parent.x + 60;
        }
        this.y=that.parent.y;
        this.updateElement();
        this.nodeElement.classed("hidden",false);
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

        if (that.nodeElement===undefined) {
            that.pathElement = that.rootNodeLayer.append('line')
                .classed("baseDragPath",true);
            that.pathElement.attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", 0);

          var lineData = [ { "x": 0,   "y": 0},  { "x": 0,  "y": 40},
                           { "x": -40, "y":0}, { "x": 0,   "y": -40},
                           {"x": 0, "y":0}
                         ];

          var lineFunction = d3.svg.line()
                           .x(function(d) { return d.x; })
                           .y(function(d) { return d.y; })
                          .interpolate("linear");

            that.nodeElement = that.rootNodeLayer.append('path').attr("d", lineFunction(lineData))
                .attr("id", that.nodeId)
                                                                .attr("stroke", "white")
                                                                .attr("stroke-width", 0.5)
                                                                .attr("fill", "#616161");
            that.nodeElement.classed("hidden",true);
        }

    };


    this.updateElement=function(){
        console.log("updating BaseDrager ELEMENT");

        that.rootElement.attr("transform", "translate(" + that.x + "," + that.y + ")");
        if (that.pathElement) {
            that.pathElement.attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", that.parent.x - this.x)
                .attr("y2", that.parent.y - this.y);
        }
        var angle = Math.atan2(that.parent.y - this.y, that.parent.x - this.x) * 180 / Math.PI;
        that.nodeElement.attr("transform", function(d) { return "rotate("+ angle +")"; });
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
        that.nodeElement.style("cursor","move");
        that.nodeElement.classed("baseNodeHovered",true);
        that.mouseButtonPressed=true;
    };

    this.mouseUp=function(){
        that.nodeElement.style("cursor","auto");
        that.mouseButtonPressed=false;
    };


    this.mouseEntered=function(p){
        if (!arguments.length) return that.mouseEnteredVar;
        that.mouseEnteredVar = p;
        return this;
    };
    this.onMouseOver=function(){
        if (that.mouseEntered()) {
            return;
        }
        that.nodeElement.classed("baseNodeHovered",true);
        var selectedNode = that.rootElement.node(),
            nodeContainer = selectedNode.parentNode;
        nodeContainer.appendChild(selectedNode);

        that.mouseEntered(true);

    };
    this.onMouseOut=function(){
        if (that.mouseButtonPressed===true)
            return;
        that.nodeElement.classed("baseNodeHovered",false);
        that.mouseEntered(false);
    };

    this.setAdditionalClassForDragger=function(name,val){
        // console.log("this should sett the class here")
        // that.nodeElement.classed(name,val);

    };

}

BaseDragger.prototype.constructor = BaseDragger;
