

function GTNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
   // this.parentWidget=parentWidget; // tells the graph which widget it talks to
    BaseNode.apply(this,arguments);


    this.drawNode=function(){

        that.nodeElement= that.rootNodeLayer.append('rect')
            .attr("x", -25)
            .attr("y", -10)
            .attr("width", 50)
            .attr("height", 20)
            .classed("baseRoundNode",true);

        // add hover text if you want
        if (that.hoverTextEnabled===true)
            that.rootNodeLayer.append('title').text(that.hoverText);

        // add title
        that.labelRenderingElement=  that.rootNodeLayer.append("text")
            .attr("text-anchor","middle")
            .text(that.label)
            .on("click",function(){
                console.log("Should pop up edit window");
                d3.event.stopPropagation();
                that.executeUserDblClick();
            })
            .on("focuslost",function(){
                console.log("lost focusoO ");
            })

        ;
    }
}


GTNode.prototype = Object.create(BaseNode.prototype);
GTNode.prototype.constructor = GTNode;


