
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

    this.identifyExternalFactors = function() {
        console.log("Looking for External factors...");
        var factorNodes = that.nodeElementArray.filter(function(n) {
            //nodes whose type is Factor, which is equivalent to 1 in the selection type
            return (n.getTypeId() === 1)
        });        
        console.log("number of factor nodes are: "+factorNodes.length);

        var externalFactorNodes = [];
        for(var i=0; i<factorNodes.length; i++) {
            console.log("The factor node id is: "+factorNodes[i].id());
            var extLinks = that.pathElementArray.filter( function(l) {
                return (l.targetNode === factorNodes[i]) 
            });
            if(extLinks.length === 0)
                externalFactorNodes.push(factorNodes[i]);
        }
        console.log("The external factor nodes are: "+externalFactorNodes.length);

        for(var i=0; i<externalFactorNodes.length; i++) {
            console.log("External factor id is: "+externalFactorNodes[i].id());
            externalFactorNodes[i].setExternalFactors();
        }
    };

    this.identifyFeedbackLoops = function() {
        console.log("Looking for feedback loops");
        var feedbackLoops = [];
        for(var i=0; i<that.pathElementArray.length; i++) {
            var pathLoops = that.pathElementArray.filter(function(l) {
                if(that.pathElementArray[i].id() !== l.id()) {
                    return (l.sourceNode === that.pathElementArray[i].targetNode && l.targetNode === that.pathElementArray[i].sourceNode);
                }
            });
            if(pathLoops.length !== 0)
                feedbackLoops.push(that.pathElementArray[i]);
        }
        console.log("Number of feedback loops are: "+feedbackLoops.length);

        for(var i=0; i<feedbackLoops.length; i++) {
            console.log("The feedback loop id is: "+feedbackLoops[i].id());
            feedbackLoops[i].setLoopStyle();
        }
    };
}

CLDGraph.prototype = Object.create(BaseGraph.prototype);
CLDGraph.prototype.constructor = CLDGraph;
