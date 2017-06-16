

function GTNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
    this.elementWidth=80;
    this.elementHeight=50;
   // this.parentWidget=parentWidget; // tells the graph which widget it talks to
    BaseNode.apply(this,arguments);


    this.drawNode=function(){

        that.nodeElement= that.rootNodeLayer.append('rect')
            .attr("x", -0.5*that.elementWidth)
            .attr("y", -0.5*that.elementHeight)
            .attr("width", that.elementWidth)
            .attr("height", that.elementHeight)
            .classed("baseRoundNode",true);

        // add hover text if you want
        if (that.hoverTextEnabled===true)
            that.rootNodeLayer.append('title').text(that.hoverText);

        // add title
        that.labelRenderingElement=  that.rootNodeLayer.append("text")
            .attr("text-anchor","middle")
            .text(that.label)
            .style("cursor","default");
    }
}


GTNode.prototype = Object.create(BaseNode.prototype);
GTNode.prototype.constructor = GTNode;


