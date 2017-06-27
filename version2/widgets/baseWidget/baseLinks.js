var linkId= 0;

function BaseLink(graph) {

    /** variable defs **/
    var that = this;
    this.mouseEntered = false;
    this.sourceNode = undefined;
    this.targetNode = undefined;
    this.rootElement = undefined;
    this.pathElement = undefined;
    var id = linkId++;
    this.elementType="LinkElement";
    this.hoverText="";
    this.elementIsFocused=false;

    this.getSelectionStatus=function(){
        return that.elementIsFocused;
    };
    this.setSelectionStatus=function(val){
        that.elementIsFocused=val;
        that.pathElement.classed("LinkFocused", val);
    };


    /** BASE HANDLING FUNCTIONS ------------------------------------------------- **/
    this.id = function (index) {
        if (!arguments.length) {
            return id;
        }
        id = index;
    };

    this.getElementType=function(){
        return that.elementType;
    };

    this.type = function () {
        return "undefined";
    };

    this.source = function (src) {
        this.sourceNode = src;
        console.log("Source Add");
        src.addLink(that);

    };
    this.target = function (target) {
        console.log("Target Add");
        this.targetNode = target;
        target.addLink(that);
    };


    this.svgRoot = function (root) {
        if (!arguments.length)
            return that.rootElement;
        that.rootElement = root;
    };

    this.setHoverText=function(val){
        this.hoverText=val;
        if (that.rootElement){
            that.rootElement.select("title").text(that.hoverText);
        }
    };

    this.drawElement = function () {
        that.pathElement = that.rootElement.append('line')
            .classed("baseDragPath", true);
        that.pathElement.attr("x1", that.sourceNode.x)
            .attr("y1", that.sourceNode.y)
            .attr("x2", that.targetNode.x)
            .attr("y2", that.targetNode.y)
            .attr('marker-end', 'url(#arrow' + id + ')');

        that.addMouseEvents();
    };

    this.updateElement = function () {
        if (that.pathElement) {
            that.pathElement.attr("x1", that.sourceNode.x)
                .attr("y1", that.sourceNode.y)
                .attr("x2", that.targetNode.x)
                .attr("y2", that.targetNode.y);
        }
        else{
          console.log("link exists but not drawn");
        }

    };


    this.addMouseEvents = function () {
        if (that.pathElement) {
            // console.log("adding mouse events");
            that.pathElement.on("mouseover", that.onMouseOver)
                .on("mouseout", that.onMouseOut)
                .on("click", that.onClicked)
        }

    };

    this.mouseEnteredFunc = function (p) {
        if (!arguments.length) return that.mouseEntered;
        that.mouseEntered = p;
        return this;
    };

    this.onMouseOver = function () {
        if (that.mouseEnteredFunc()) {
            return;
        }
        that.pathElement.classed("baseHoveredPath", true);
        // var selectedNode = that.rootElement.node(),
        //     nodeContainer = selectedNode.parentNode;
        // nodeContainer.appendChild(selectedNode);

        that.mouseEnteredFunc(true);

    };
    this.onMouseOut = function () {
        console.log("mouseOut");
        that.pathElement.classed("baseHoveredPath", false);
        that.mouseEnteredFunc(false);
    };
    this.onClicked = function () {
        console.log("link click");
        if (that.elementIsFocused===false) {
            that.elementIsFocused=true;
            that.pathElement.classed("LinkFocused", true);
            graph.handleLinkSelection(that);
            that.rootElement.selectAll("image")
                .attr("display", null)
                .attr("x", (that.sourceNode.x + that.targetNode.x)/2)
                .attr("y", (that.sourceNode.y + that.targetNode.y)/2 - 10);
            return;
        }
        if (that.elementIsFocused===true) {
            that.elementIsFocused=false;
            that.pathElement.classed("LinkFocused", false);
            graph.handleLinkSelection(undefined);
            that.rootElement.selectAll("image")
                .attr("display", "none");
        }

        that.mouseEnteredFunc(false);
        that.onMouseOver();
    };
}

BaseLink.prototype.constructor = BaseLink;
