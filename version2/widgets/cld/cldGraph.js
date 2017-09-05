
function CLDGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    this.nodeTypeGraph=1;

    // call the baseGraph init function
    // that.initializeGraph();
    that.setZoomExtent(0.1,6);
    this.dblClick=function(){
        console.log("Hello From CLD Graph");

        var coordinatesRelativeToCanvasArea = [0,0] ;
        coordinatesRelativeToCanvasArea = d3.mouse(this);
        var aNode=that.createNode(that);
        var grPos=getScreenCoords(coordinatesRelativeToCanvasArea[0],coordinatesRelativeToCanvasArea[1],that.translation,that.zoomFactor);
        aNode.x=grPos.x;
        aNode.y=grPos.y;
        that.nodeElementArray.push(aNode);
        that.clearRendering();
        that.redrawGraphContent();
        aNode.editInitialText();
        console.log("New node id is: "+aNode.id());
        console.log("Mouse Coordinates relative to the div:"+d3.mouse(this));
        aNode.setType(that.nodeTypeGraph, aNode.allClasss[that.nodeTypeGraph]);
    };

    this.changeNodeType=function(nodeT){
      that.nodeTypeGraph=nodeT;
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

    this.requestModelDataAsJson = function() {
        var modelObj = {};
        modelObj.nodes = [];
        modelObj.links = [];

        for(var i=0; i<that.nodeElementArray.length; i++) {
            var node = that.nodeElementArray[i];
            var obj = {};
            obj.id = node.id();
            obj.name = node.label;
            obj.nodeType = node.typeName;
            //need to add more attributes
            modelObj.nodes.push(obj);
        }

        for(var i=0; i<that.pathElementArray.length; i++) {
            var link = that.pathElementArray[i];
            var obj = {};
            obj.id = link.id();
            obj.source_target = [link.sourceNode.id(), link.targetNode.id()];
            obj.className = link.className;
            obj.value = link.cldTypeString;
            //need to add more attributes
            modelObj.links.push(obj);
        }

        return JSON.stringify(modelObj, null, '');
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

    this.clearCriteria = function() {
        console.log("clear the criteria nodes from the CLD");
        var deleteCriteria = [];
        for(var i=0; i<that.nodeElementArray.length; i++) {
            if(that.nodeElementArray[i].typeName === "Criteria") {
                deleteCriteria.push(that.nodeElementArray[i]);
            }
        }
        for(var i=0; i<deleteCriteria.length; i++) {
            var temp = deleteCriteria[i];
            console.log("temp is: "+temp.id());
            that.nodeElementArray.splice(that.nodeElementArray.indexOf(temp), 1);
            var spliceLinks = that.pathElementArray.filter(function(l) {
                return (l.sourceNode === temp || l.targetNode === temp);
            });
            spliceLinks.map(function(l) {
                that.pathElementArray.splice(that.pathElementArray.indexOf(l), 1);
            });
        }
        //redraw the graph
        that.forceRedrawContent();
        that.removeDeletedElements();
    };

    this.addCriteriaFromGT = function(criteriaNode) {
        var newNode = that.createNode(that);

        newNode.setLabelText(criteriaNode.name);
        newNode.setType(criteriaNode.nodeTypeId, criteriaNode.nodeType);
        var x= parseFloat(criteriaNode.pos[0]);
        var y = parseFloat(criteriaNode.pos[1]);
        newNode.setPosition(x,y);

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

            that.forceRedrawContent();
            // that.parentWidget.handleSelection(aLink);
            aLink.onClicked();
            aLink.pathElement.classed("cldLinkSelected", true);
        }
    };

    this.handleLinkDeletion = function(link) {
        that.pathElementArray.splice(that.pathElementArray.indexOf(link), 1);
        that.forceRedrawContent();
        that.removeDeletedElements();
    };

    // debug things
    function getScreenCoords(x, y, translate, scale){
        var xn=(x - translate[0])/scale;
        var yn=(y - translate[1])/scale;
        return {x: xn, y: yn};
    }

    this.mergeTheNodes = function() {
        console.log("Calling for merge function. Total nodes to merge are: "+that.multipleNodes.length);
        var mLength = that.multipleNodes.length;

        if(mLength > 1) {
            for(var i=0; i<mLength; i++) {
                //do not delete the nodes, but we need to display a single svg element with all selected nodes inside it
            }
        }
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

        //trying a new algorithm
        //it has two parts - first, the strongly connected components are found by applying Tarjan's algorithm and then the loops are found in the sub-graph which are strongly connected
        var allNodes = [];
        var adjNodes = [];
        var allLinks = [];

        var loops = {};
        var path = [];
        var allTheLoops = [];
        var feedbackLoops = [];

        for(var i=0; i<that.pathElementArray.length; i++) {
            var arr = [that.pathElementArray[i].sourceNode.id(), that.pathElementArray[i].targetNode.id()];
            allLinks.push(arr);
        }

        for(var i=0; i<that.nodeElementArray.length; i++) {
            var n = that.nodeElementArray[i].id();
            allNodes.push(n);
            adjNodes[i] = [];
            that.pathElementArray.filter(function (l) {
                if(l.sourceNode.id() === n)
                    adjNodes[i].push(l.targetNode.id());
            });
        }

        console.log("the all nodes are "+JSON.stringify(allNodes)+" The adjacent nodes are: "+JSON.stringify(adjNodes));
        // var anyObj= stronglyConnectedComponents(adjNodes);
        // console.log("The any obj is: "+JSON.stringify(anyObj));

        //************************************************************************
        // var sccs = anyObj.components;
        var sccsNodes = {};

        // while(sccs.length > 0) {
        //     var scc = sccs.pop();
        //     if(scc.length <= 1) continue;
        //     else {
        //         for(var i=0; i<scc.length; i++) {
        //             var k = scc[i];
        //             sccsNodes[k] = [];
        //             loops[k] = 0;
        //             var q = sccsNodes[k];

        //             that.pathElementArray.filter(function(l) {
        //                 if(l.sourceNode.id() === k) {
        //                     if(scc.indexOf(l.targetNode.id()) > -1)
        //                         q.push(l.targetNode.id());
        //                 }
        //             });
        //         }
        //     }
        // }
        // console.log("The SCCS nodes are: "+JSON.stringify(sccsNodes));

        // for(var key in sccsNodes) {
        //     if(sccsNodes.hasOwnProperty(key)) {
        //         var vertex = Number(key);
        //         var adjLinks = sccsNodes[key];
        //         console.log("Vertex: "+vertex+ " adjLinks: "+adjLinks);
        //         if(loops[key] == 0) {
        //             checkLoops(adjLinks, loops, path, vertex);
        //         }
        //     }
        // }

        for(var i=0; i<allNodes.length; i++) {
            var j = allNodes[i];
            sccsNodes[j] = [];
            loops[j] = 0;
            var q = sccsNodes[j];

            that.pathElementArray.filter(function(l) {
                if(l.sourceNode.id() === j) {
                    q.push(l.targetNode.id());
                }
            });
        }
        for(var key in sccsNodes) {
            if(sccsNodes.hasOwnProperty(key)) {
                var vertex = Number(key);
                var adjLinks = sccsNodes[key];
                if(loops[key] == 0) {
                    checkLoops(adjLinks, loops, path, vertex);
                }
            }
        }        
        console.log("All the loops in a graph are: "+JSON.stringify(allTheLoops));

        var loopNodeNames = [];
        for(var i=0; i<allTheLoops.length; i++) {
            var tempLoop = allTheLoops[i];
            loopNodeNames[i] = [];
            for(var j=0; j<tempLoop.length; j++) {
                for(var k=0; k<that.pathElementArray.length; k++) {
                    if(tempLoop[j+1] !== undefined) {
                        if(tempLoop[j] === that.pathElementArray[k].sourceNode.id() && tempLoop[j+1] === that.pathElementArray[k].targetNode.id())
                            feedbackLoops.push(that.pathElementArray[k]);
                    }
                }
                that.nodeElementArray.filter(function(n) {
                    if(tempLoop[j] === n.id())
                        loopNodeNames[i].push(n.label);
                });
            }
        }

        for(var i=0; i<feedbackLoops.length; i++) {
            console.log("The feedback loop id is: "+feedbackLoops[i].id());
            feedbackLoops[i].setLoopStyle();
        }

        var strLoop = "";
        for(var i=0; i<loopNodeNames.length; i++) {
            var aLoop = loopNodeNames[i];
            strLoop += '<p>';
            for(var j=0; j<aLoop.length; j++) {
                strLoop += aLoop[j];
                if(j != aLoop.length-1)
                    strLoop += " --> ";
            }
            strLoop += '</p>';
        }

        var loopElem = document.getElementById("loopModal");
        if(loopElem)
            loopElem.parentNode.removeChild(loopElem);
        that.parentWidget.createLoopModal("loopModal", "Feedback Loops", strLoop);


        function checkLoops(edges, loops, path, vertex) {
            loops[vertex] = 1;
            path.push(vertex);
            // console.log("This is vertex: "+vertex+" Path is: "+path);
            var adjacentEdges = edges;

            for (var i=0; i<adjacentEdges.length; ++i) {
                // console.log("The adjacent edge of node: "+vertex+ " is: "+JSON.stringify(adjacentEdges));
                var adjVertex = adjacentEdges[i];

                if (loops[adjVertex] == 1) {
                // console.log("The adjVertex "+adjVertex+" is 1");
                    var loop = path.slice(path.indexOf(adjVertex));
                    loop.push(adjVertex);
                    console.log("The loop is: "+loop);
                    allTheLoops.push(loop);
                }

                if (loops[adjVertex] == 0) {
                    // console.log("The adjVertex "+adjVertex+" is still 0");
                    checkLoops(sccsNodes[adjVertex], loops, path, adjVertex);
                }
            }
            // console.log("coloring vertex: "+vertex+" as black");
            loops[vertex] = 2;
            path.pop();
        }

        //************************************************************************

        function stronglyConnectedComponents(adjList) {

            var numVertices = adjList.length;
            var index = [];
            var lowValue = [];
            var active = [];
            var child = [];
            var scc = [];
            var sccLinks = [];

            for(var i=0; i<numVertices; ++i) {
                index[i] = -1;
                lowValue[i] = 0;
                active[i] = false;
                child[i] = 0;
                scc[i] = -1;
                sccLinks[i] = [];
            }

            var count = 0;
            var components = [];
            var sccAdjList = [];

            function strongConnect(v) {
                var S = [v], T = [v];
                index[v] = lowValue[v] = count;
                active[v] = true;
                count++;
                while(T.length > 0) {
                    v = T[T.length-1];
                    var e = adjList[v];
                    if (child[v] < e.length) {
                        for(var i=child[v]; i<e.length; ++i) {
                            var u = e[i];
                            if(index[u] < 0) {
                                index[u] = lowValue[u] = count;
                                active[u] = true;
                                count += 1;
                                S.push(u);
                                T.push(u);
                                break;
                            } else if (active[u]) {
                                lowValue[v] = Math.min(lowValue[v], lowValue[u])|0;
                            }
                            if (scc[u] >= 0) {
                                sccLinks[v].push(scc[u]);
                            }
                        }
                        child[v] = i;
                    } else {
                    if(lowValue[v] === index[v]) {
                        var component = [];
                        var links = [], linkCount = 0;
                        for(var i=S.length-1; i>=0; --i) {
                            var w = S[i];
                            active[w] = false;
                            component.push(w);
                            links.push(sccLinks[w]);
                            linkCount += sccLinks[w].length;
                            scc[w] = components.length;
                            if(w === v) {
                                S.length = i;
                                break;
                            }
                        }
                        component.sort(function(a, b) {
                            return a-b;
                        });
                        components.push(component);
                        var allLinks = new Array(linkCount);
                        for(var i=0; i<links.length; i++) {
                            for(var j=0; j<links[i].length; j++) {
                                allLinks[--linkCount] = links[i][j];
                            }
                        }
                        sccAdjList.push(allLinks);
                    }
                    T.pop();
                    }
                }
            }

            for(var i=0; i<numVertices; ++i) {
                if(index[i] < 0) {
                    strongConnect(i);
                }
            }

            var newE;
            for(var i=0; i<sccAdjList.length; i++) {
                var e = sccAdjList[i];
                if (e.length === 0) continue;
                e.sort(function (a,b) { return a-b; });
                newE = [e[0]];
                for(var j=1; j<e.length; j++) {
                    if (e[j] !== e[j-1]) {
                        newE.push(e[j]);
                    }
                }
                sccAdjList[i] = newE;
            }

            return {components: components, adjacencyList: sccAdjList}
        }
    };
}

CLDGraph.prototype = Object.create(BaseGraph.prototype);
CLDGraph.prototype.constructor = CLDGraph;
