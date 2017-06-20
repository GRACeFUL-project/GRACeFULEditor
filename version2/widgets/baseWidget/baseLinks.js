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
        graph.handleLinkSelection(that);
    };
}

BaseLink.prototype.constructor = BaseLink;
