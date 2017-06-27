

function CLDNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
    var defaultRadius=50;
   // this.parentWidget=parentWidget; // tells the graph which widget it talks to
    BaseNode.apply(this,arguments);
    var nodeClass="baseRoundNode";
    var selectedTypeId=0;
    var allPossibleClasses=['undefined','nodeOptionA','nodeOptionB','nodeOptionC'];
    this.getTypeId=function(){
      return selectedTypeId;
    };

    this.drawNode=function(){

        that.nodeElement= that.rootNodeLayer.append('circle')
            .attr("r", that.getRadius())
            .classed("baseRoundNode",true)
            .classed(nodeClass,true);

        // add hover text if you want
        if (that.hoverTextEnabled===true)
            that.rootNodeLayer.append('title').text(that.hoverText);

        // add title
        this.labelRenderingElement=  that.rootNodeLayer.append("text")
            .attr("text-anchor","middle")
            .text(that.label)
            .style("cursor","default");

        //add delete image
        that.rootNodeLayer.append("image")
            .attr("xlink:href", "images/delete.png")
            .attr("display", "none")
            .attr("x", that.getRadius()/2)
            .attr("y", -(that.getRadius())+5)
            .attr("width", 17)
            .attr("height", 17)
            .attr("cursor", "pointer")
            .on('click', function() {
                d3.event.stopPropagation();
                graph.handleNodeDeletion(that);
            });
    };

    // cldNodes are round so they have a radius
    this.getRadius=function(){
        return defaultRadius;
    };
    this.setRadius=function(val){
        defaultRadius=val;
    };

    this.onMouseOver=function(){

        if (that.mouseEnteredFunc() || that.editingTextElement===true) {
            return;
        }
        that.nodeElement.classed(nodeClass,false);
        that.nodeElement.classed("baseNodeHovered",true);

        var selectedNode = that.rootElement.node(),
            nodeContainer = selectedNode.parentNode;
        nodeContainer.appendChild(selectedNode);

        that.mouseEnteredFunc(true);

        d3.select(this).selectAll("image").attr("display", null);

    };
    this.onMouseOut=function(){
        if (that.mouseButtonPressed===true)
            return;
        that.nodeElement.classed("baseNodeHovered",false);
        that.nodeElement.classed(nodeClass,true);
        that.mouseEnteredFunc(false);

        d3.select(this).selectAll("image").attr("display", "none");
    };


    this.setType=function(typeId){
        selectedTypeId=typeId;
        nodeClass=allPossibleClasses[typeId];
        console.log("Node class is"+nodeClass);
        // apply the classes ;
        if (that.nodeElement){
            for (var i=0;i<allPossibleClasses.length;i++){
                console.log("disabling :"+allPossibleClasses[i]);
                that.nodeElement.classed(allPossibleClasses[i],false);
            }
            console.log("Setting final class :"+nodeClass);
            that.nodeElement.classed(nodeClass,true);
        }

    };
}


CLDNode.prototype = Object.create(BaseNode.prototype);
CLDNode.prototype.constructor = CLDNode;


