
function CLDGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    // call the baseGraph init function
    // that.initializeGraph();
    that.setZoomExtent(0.1,6);
    this.dblClick=function(){
        console.log("Hello From CLD Graph");

        var aNode=that.createNode(that);
        var grPos=getScreenCoords(d3.event.clientX,d3.event.clientY+that.verticalOffset,that.translation,that.zoomFactor);
        aNode.x=grPos.x;
        aNode.y=grPos.y;
        that.nodeElementArray.push(aNode);
        that.clearRendering();
        that.redrawGraphContent();
        aNode.editInitialText();
    };

    this.createNode=function(parent){
        return new CLDNode(parent);
    };

    this.createLink=function(parent){
        return new CLDLink(parent);
    };


    // debug things
    function getScreenCoords(x, y, translate, scale){
        var xn=(x - translate[0])/scale;
        var yn=(y - translate[1])/scale;
        return {x: xn, y: yn};
    }
}

CLDGraph.prototype = Object.create(BaseGraph.prototype);
CLDGraph.prototype.constructor = CLDGraph;
