
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

    this.requestSaveDataAsJson=function(){
        // THIS SHOULD BE OVERWRITTEN BY ALL GRAPHS!
        var retObj={};
        retObj.type=that.className;
        retObj.graphSchema=that.graphSchema;
        retObj.nodes=[];
        retObj.links=[];
        var i, obj;
        for (i=0;i<that.nodeElementArray.length;i++){
            var node=that.nodeElementArray[i];
            obj={};
            obj.id=node.id();
            obj.name=node.label;
            obj.nodeType=node.typeName;
            obj.nodeTypeId = node.getTypeId();
            obj.pos=[node.x,node.y];
            retObj.nodes.push(obj);
        }

        for (i=0;i<that.pathElementArray.length;i++){
            var link =that.pathElementArray[i];
            var linkObj={};
            linkObj.id=link.id();
            linkObj.source_target=[link.sourceNode.id(),link.targetNode.id()];
            linkObj.linkTypeId = link.getTypeId();
            linkObj.linkType = link.cldTypeString;
            retObj.links.push(linkObj);
        }
        return  JSON.stringify(retObj, null, '  ');
    };

    this.addLinkFromJSON=function(jsonLink){
        var s_t =jsonLink.source_target;
        var sourceId=s_t[0];
        var targetId=s_t[1];

        // find it
        // todo : fix the for loop searching with filter function of array ...
        var sourceNode,targetNode;
        for (var i=0;i<that.nodeElementArray.length;i++){
            var aNode=that.nodeElementArray[i];
            if (aNode.id()===sourceId) sourceNode=aNode;
            if (aNode.id()===targetId) targetNode=aNode;

            if (targetNode&& sourceNode)
                break; // can leave the loop
        }
        if (targetNode && sourceNode){
            // both should be found otherwise no link ...
            var newLink=that.createLink(that);
            newLink.source(sourceNode);
            newLink.target(targetNode);
            newLink.setCLDTypeString(jsonLink.linkTypeId);
            that.pathElementArray.push(newLink);
            that.needsRedraw(true);
        }
    };

    this.addNodeFromJSON=function(jsonNode){
        var nodeName=jsonNode.name;
        var nodePos=jsonNode.pos;
        var nodeId=jsonNode.id;
        var typeId = jsonNode.nodeTypeId;
        var typeName = jsonNode.nodeType;

        console.log("Graph should add now a node with : " );
        console.log("   Name : "+nodeName );
        console.log("   Id   : "+nodeId);
        console.log("   Pos  : "+nodePos);

        var newNode=that.createNode(that);
        // todo: check how to handle the data;
        newNode.id(nodeId);
        newNode.setLabelText(nodeName);
        newNode.setType(typeId, typeName);
        var x=parseFloat(nodePos[0]);
        var y=parseFloat(nodePos[1]);
        newNode.setPosition(x,y);
        // push to array of nodes
        console.log("newNode  "+newNode);
        that.nodeElementArray.push(newNode);
        that.needsRedraw(true);

    };






    this.draggerElementReleaseFunction=function(d){
        // overwrite if needed;
        that.draggerLayer.classed("hidden",true);
        // check he the node stoped
        that.draggingObject=false;
        var draggeEndPos=[that.draggerElement.x, that.draggerElement.y];
        var targetNode=that.getTargetNode(draggeEndPos);
        // console.log("dragger End pos"+draggeEndPos);
        if (targetNode) {
            // console.log("Target node name" + targetNode.label);
            // create a link between these;
            var aLink=that.createLink(that);
            aLink.source(d.parentNode());
            aLink.target(targetNode);

            that.pathElementArray.push(aLink);
            validateAllPaths();

            that.forceRedrawContent();
        }
    };


    function validateAllPaths(){
        // simple solution, not fast .. to do make it faster
        // all links are set to be single link
        var i, j;
        for (i=0;i<that.pathElementArray.length;i++){
            that.pathElementArray[i].setLinkType(0); // 0 means single link;
        }


        for (i=0;i<that.pathElementArray.length;i++){
            var src=that.pathElementArray[i].sourceNode;
            var tar=that.pathElementArray[i].targetNode;

            for (j=0;j<that.pathElementArray.length;j++){
                if (i==j) continue;

                var cmpSrc=that.pathElementArray[j].sourceNode;
                var cmpTar=that.pathElementArray[j].targetNode;

                if (src===cmpTar && tar===cmpSrc){
                    // we have a multilink between these two nodes;
                    that.pathElementArray[i].setLinkType(1);
                    that.pathElementArray[j].setLinkType(1);
                }
            }
        }



    }



    this.handleLinkDeletion = function(link) {
        // overwriting this because we have added validate all paths function
        that.pathElementArray.splice(that.pathElementArray.indexOf(link), 1);
        validateAllPaths();
        that.forceRedrawContent();
        that.removeDeletedElements();
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
            return (n.getTypeId() === 1 || n.getTypeId() === 4)
        });        
        console.log("number of factor nodes are: "+factorNodes.length);

        var externalFactorNodes = [];
        for(var i=0; i<factorNodes.length; i++) {
            console.log("The factor node id is: "+factorNodes[i].id());
            factorNodes[i].setType(1, "Factor");
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
        // var feedbackLoops = [];
        // for(var i=0; i<that.pathElementArray.length; i++) {
        //     var pathLoops = that.pathElementArray.filter(function(l) {
        //         if(that.pathElementArray[i].id() !== l.id()) {
        //             return (l.sourceNode === that.pathElementArray[i].targetNode && l.targetNode === that.pathElementArray[i].sourceNode);
        //         }
        //     });
        //     if(pathLoops.length !== 0)
        //         feedbackLoops.push(that.pathElementArray[i]);
        // }
        // console.log("Number of feedback loops are: "+feedbackLoops.length);

        // for(var i=0; i<feedbackLoops.length; i++) {
        //     console.log("The feedback loop id is: "+feedbackLoops[i].id());
        //     feedbackLoops[i].setLoopStyle();
        // }
        
        var adjNodes = [];
        var adjLinks = [];
        var loops = {};
        var path = [];
        var allTheLoops = [];
        var feedbackLoops = [];
        
        for(var i=0; i<that.nodeElementArray.length; i++) {
            var j = that.nodeElementArray[i].id();
            adjNodes.push(j);
            loops[j] = 0;
        }

        for(var i=0; i<that.pathElementArray.length; i++) {
            var arr = [that.pathElementArray[i].sourceNode.id(), that.pathElementArray[i].targetNode.id()];
            adjLinks.push(arr);
        }
        console.log("The nodes are: "+adjNodes);
        console.log("The links are: "+JSON.stringify(adjLinks));

        for (var i=0; i<adjNodes.length; ++i) {
            var vertex = adjNodes[i];
            console.log("**************************");
            if (loops[vertex] == 0) {
                var result = checkLoops(adjLinks, loops, path, vertex);
                if (result.hasLoop) {
                    allTheLoops.push(result.loop);
                    path.pop();
                }
            }
        }
        console.log("All the loops in a graph are: "+JSON.stringify(allTheLoops));
        console.log("how is loops: "+JSON.stringify(loops));
        for(var i=0; i<allTheLoops.length; i++) {
            var tempLoop = allTheLoops[i];
            for(var j=0; j<tempLoop.length; j++) {
                for(var k=0; k<that.pathElementArray.length; k++) {
                    if(tempLoop[j+1] !== undefined) {
                        if(tempLoop[j] === that.pathElementArray[k].sourceNode.id() && tempLoop[j+1] === that.pathElementArray[k].targetNode.id())
                            feedbackLoops.push(that.pathElementArray[k]);
                    }                    
                }                
            }            
        }

        for(var i=0; i<feedbackLoops.length; i++) {
            console.log("The feedback loop id is: "+feedbackLoops[i].id());
            feedbackLoops[i].setLoopStyle();
        }        
    };
    
    //TODO: The algorithm is not efficient in finding loops when a node is involved in more then one cycle
    function checkLoops(edges, loops, path, vertex) {
        loops[vertex] = 1;
        path.push(vertex);
        console.log("This is vertex: "+vertex+" Path is: "+path);
        var adjacentEdges = [];
        for (var i=0; i<edges.length; ++i) {
            var edge = edges[i];
            if (edge[0] == vertex) {
                adjacentEdges.push(edge);
            }
        }

        for (var i=0; i<adjacentEdges.length; ++i) {
            console.log("The adjacent edge of node: "+vertex+ " is: "+JSON.stringify(adjacentEdges));
            var edge = adjacentEdges[i];
            var adjVertex = edge[1];

            if (loops[adjVertex] == 1) {      
            console.log("The adjVertex "+adjVertex+" is 1");          
                var loop = path.slice(path.indexOf(adjVertex));
                loop.push(adjVertex);
                console.log("The loop is: "+loop);
                return { hasLoop: true, loop: loop };
            }

            if (loops[adjVertex] == 0) {
                console.log("The adjVertex "+adjVertex+" is still 0");
                var result = checkLoops(edges, loops, path, adjVertex);
                if (result.hasLoop) {
                    return result;
                }
            }
        }
        console.log("coloring vertex: "+vertex+" as black");
        loops[vertex] = 2;
        path.pop();
        return { hasLoop: false };
    }
}

CLDGraph.prototype = Object.create(BaseGraph.prototype);
CLDGraph.prototype.constructor = CLDGraph;
