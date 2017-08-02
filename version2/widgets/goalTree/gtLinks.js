
function GTLink(graph) {
	var that = this;
    BaseLink.apply(this,arguments);

    console.log("Generating a link with id "+that.id());

    this.drawElement = function () {
        that.pathElement = that.rootElement.append('line')
            .classed("baseDragPath", true);
        that.pathElement.attr("x1", that.sourceNode.x)
            .attr("y1", that.sourceNode.y)
            .attr("x2", that.targetNode.x)
            .attr("y2", that.targetNode.y);

        that.addMouseEvents();

        //add delete image
        that.rootElement.append("image")
            .attr("id", "linkDeleteIcon")
            .attr("xlink:href", "images/delete.png")
            .attr("display", "none")
            .attr("width", 17)
            .attr("height", 17)
            .on('click', function() {
                d3.event.stopPropagation();
                console.log("This link has to be deleted: "+that.id());
                graph.handleLinkDeletion(that);
            });
    };
}

GTLink.prototype = Object.create(BaseLink.prototype);
GTLink.prototype.constructor = GTLink;