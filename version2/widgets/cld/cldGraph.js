
function CLDGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    this.nodeTypeGraph=1;
    this.budget = 0;
    this.budgetId = undefined;
    this.budgetPortIndex = undefined;
    this.actionNodes = undefined;
    this.criteriaNodes = undefined;
    this.optimiseId = undefined;
    this.optimisePortIndex = undefined;
    // call the baseGraph init function
    // that.initializeGraph();
    that.setZoomExtent(0.1,6);
    this.dblClick=function(){
        var handler=that.parentWidget.getHandler();
        var globalNode=handler.createGlobalNode(that);
        globalNode.setNodeType(that,that.nodeTypeGraph,that.createNode(that));
        handler.addGlobalNode(globalNode);
        var repR=globalNode.filterInformation(that);
        repR.setGlobalNodePtr(globalNode);

        var coordinatesRelativeToCanvasArea;
        coordinatesRelativeToCanvasArea=d3.mouse(this);
        var grPos=getScreenCoords(coordinatesRelativeToCanvasArea[0],coordinatesRelativeToCanvasArea[1],that.translation,that.zoomFactor);
        globalNode.setNodePos(that,grPos);

        // if the selected thing is createria
        if (that.nodeTypeGraph===3){
            var friendlyWidget=that.parentWidget.gtGraphObj;
            globalNode.setVisibleInWidget(friendlyWidget,true);
            var friendlyNode=friendlyWidget.createNode(that.parentWidget.gtGraphObj);
            globalNode.setNodeType(friendlyWidget,3,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);
        }


        // generate in sfd;
        // all node types are added to the sdf
        var friendlyWidget=that.parentWidget.gtGraphObj;
         var sfdWdiget=that.parentWidget.sfdGraphObj;
            globalNode.setVisibleInWidget(sfdWdiget,true);
            friendlyNode=sfdWdiget.createFriendlyNode();
            var mappedId=friendlyNode.findTypeId(repR.typeNameForSolver);
            console.log("Searching for "+repR.typeNameForSolver);
            globalNode.setNodeType(sfdWdiget,mappedId,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);




        that.clearRendering();
        that.redrawGraphContent();
        that.selectNode(undefined);
    };

    this.changeNodeType=function(nodeT){
      that.nodeTypeGraph=nodeT;
    };

    this.createNode=function(parent){
        return new CLDNode(parent);
    };

    this.createLink=function(parent){
        var aLink=new CLDLink(parent);
        aLink.setClassType(1);
        aLink.setCLDTypeString(1,"+");
        console.log(aLink.getTypeId()+"<<< ");
        return aLink
    };

    this.setBudget = function(val) {
        that.budget = val;
        console.log("New budget is: "+that.budget);
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
            obj.observe = node.getObserve();
            obj.trend = node.getTrend();
            obj.comments = node.hoverText;
            obj.pos=[node.x,node.y];
            retObj.nodes.push(obj);
        }

        for (i=0;i<that.pathElementArray.length;i++){
            var link =that.pathElementArray[i];
            var linkObj={};
            linkObj.id=link.id();
            linkObj.source_target=[link.sourceNode.id(),link.targetNode.id()];
            linkObj.linkClassId = link.getClassType();
            linkObj.linkClassName = link.className;
            linkObj.linkTypeId = link.getTypeId();
            linkObj.linkType = link.cldTypeString;
            linkObj.comments = link.hoverText;
            // adding metadata for solver for questioner results


            retObj.links.push(linkObj);
        }
        return  JSON.stringify(retObj, null, '  ');
    };

    this.requestModelDataAsJson = function() {
        console.log("----------------------- REQUESTING MODEL DATA");
        var modelObj = {};
        modelObj.nodes = [];
        // modelObj.links = [];

        that.budgetId = that.idInNumber++;
        that.budgetPortIndex = 0;
        that.actionNodes = 0;
        that.criteriaNodes = 0;
        that.optimiseId = that.idInNumber++;
        that.optimisePortIndex = 0;

        for(var i=0; i<that.nodeElementArray.length; i++) {
            var node = that.nodeElementArray[i];
            var obj = {};
            if(node.typeName !== "Stake Holder") {
                node.getFinalData();
                obj.name = node.typeNameForSolver;
                obj.parameters = node.parameters;
                obj.interface = node.interfaces;
                obj.identity = node.id();
                //need to add more attributes
                modelObj.nodes.push(obj);
            }
            console.log("How many links: "+that.pathElementArray.length);
            //evaluate
            var evals = {};
            if(node.typeName === "Criteria") {
                var weights = [];
                var values = [];
                var sLinkIds = [];
                for(var k=0; k<that.pathElementArray.length; k++) {
                    var sLink = that.pathElementArray[k];
                    if(sLink.superLinkType === 100 && sLink.targetNode.id() === node.id()) {
                        console.log("sLinkkkk!!! "+sLink.id());
                        values.push(sLink.getEvaluationValue());
                        weights.push(sLink.getNormalizedWeight());
                        sLinkIds.push(sLink);
                    }
                }
                if(weights.length > 0) {
                    evals.name = "evaluate";
                    evals.parameters = [{"name": "values", "value": values, "type": "[Sign]"}, {"name": "weights", "value": weights, "type": "[Float]"}];
                    evals.interface = [
                        {
                            "connection": [node.id(), "value", null],
                            "name": "atPort",
                            "type": "Sign"
                        }, 
                        {
                            "connection": [that.optimiseId, "benefits", that.optimisePortIndex++],
                            "name": "benefit",
                            "type": "Float"
                        }
                    ];
                    evals.identity = that.idInNumber++;
                    for(var m=0; m<sLinkIds.length; m++) {
                        sLinkIds[m].setEvaluateId(evals.identity);
                    }

                    modelObj.nodes.push(evals);
                }
            }
        }

        for( i=0; i<that.pathElementArray.length; i++) {
            var link = that.pathElementArray[i];
            if(link.superLinkType !== 100) {
                var obj={};                
                link.getFinalData();
                obj.name = link.name;
                obj.parameters = link.parameters;
                obj.interface = link.interfaces;
                obj.identity = link.id();
                modelObj.nodes.push(obj);
            }            
        }

        var nodeBudget = {
            "name": "budget",
            "parameters": [{"name": "numberOfPorts", "value": that.actionNodes, "type": "Int"}, {"name": "maximumBudget", "value": Number(that.budget), "type": "Int"}],
            "interface": [{"name": "costs", "type": "[Int]"}],
            "identity": that.budgetId
        };
         modelObj.nodes.push(nodeBudget);

         var nodeOptimise = {
            "name": "optimise",
            "parameters": [{"name": "numberOfPorts", "value": that.criteriaNodes, "type": "Int"}],
            "interface": [{"name": "benefits", "type": "[Float]"}],
            "identity": that.optimiseId
         };
         modelObj.nodes.push(nodeOptimise);

        return JSON.stringify(modelObj, null, '');
    };

    this.deliverResultsForNodes = function(result) {
        var resultObject = result.result;
        console.log("CLDGraph result: "+JSON.stringify(result, null, ""));
        for(var key in resultObject) {
            if(resultObject.hasOwnProperty(key)) {
                console.log(key + "-->" +resultObject[key]);
                var outsign = key.split(/(\d+)/).filter(Boolean);
                if(outsign[0] === "value") {
                    that.nodeElementArray.filter(function(temp) {
                        if(temp.id() == Number(outsign[1])) {
                            temp.setResult(resultObject[key]);
                        } 
                    });
                }
                else if(outsign[0] === "cost") {
                    // that.nodeElementArray.filter(function(temp) {
                    //     if(temp.id() == Number(outsign[1])) {
                    //         temp.setResult(resultObject[key]);
                    //     } 
                    // });
                }
                else if(outsign[0] === "atPort") {
                    that.pathElementArray.filter(function(temp) {
                        if(temp.getEvaluateId() === Number(outsign[1])) {
                            temp.setResultAtPort(resultObject[key]);
                        } 
                    });
                }
                else if(outsign[0] === "benefit") {
                    that.pathElementArray.filter(function(temp) {
                        if(temp.getEvaluateId() === Number(outsign[1])) {
                            temp.setResultBenefits(resultObject[key]);
                        } 
                    });
                }
            }
        }
    };

    this.addLinkFromJSON=function(jsonLink){
        var s_t =jsonLink.source_target;
        var sourceId=s_t[0];
        var targetId=s_t[1];
        var classId = jsonLink.linkClassId;
        var className = jsonLink.linkClassName;
        var comments = jsonLink.comments;

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
            newLink.setClassType(classId, className);
            newLink.setHoverText(comments);
            newLink.setCLDTypeString(jsonLink.linkTypeId, jsonLink.linkType);
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
        var observe = jsonNode.observe;
        var trend = jsonNode.trend;
        var comments = jsonNode.comments;

        console.log("Graph should add now a node with : " );
        console.log("   Name : "+nodeName );
        console.log("   Id   : "+nodeId);
        console.log("   Pos  : "+nodePos);

        var newNode=that.createNode(that);
        // todo: check how to handle the data;
        newNode.id(nodeId);
        newNode.setLabelText(nodeName);
        newNode.setDisplayLabelText(nodeName);
        newNode.setType(typeId, typeName);
        newNode.setObserve(observe);
        newNode.setTrend(trend);
        newNode.setHoverText(comments);
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
            // create a link be
            // tween these;
            // check if target is stakeholder
            if (targetNode.getTypeId()===5){

                d.parentNode().onClicked();
                d.parentNode().onClicked();
                return; // we are a stakeholder we do now allow manual link generation
            }
            var srcRen=d.parentNode();
            var tarRen=targetNode;

            if (srcRen===tarRen){
                console.log("No Capes allowd, i mean loops!");
                return;
            }

            // crreate a global links
            var handler=that.parentWidget.getHandler();
            var globalLink=handler.createGlobalLink(that);

            console.log("global LInk obj");
            console.log(globalLink);

            globalLink.setLinkGenerator(that,that.createLink(that));
            handler.addGlobalLink(globalLink);
            var repR=globalLink.filterInformation(that);
            repR.setGlobalLinkPtr(globalLink);


            repR.source(srcRen);
            repR.target(tarRen);

            globalLink.setSource(srcRen.getGlobalNodePtr());
            globalLink.setTarget(tarRen.getGlobalNodePtr());

            console.log("Node Types are: "+srcRen.getTypeId()+" "+tarRen.getTypeId());
            if ((srcRen.getTypeId()===3 || srcRen.getTypeId()===5)
                && (tarRen.getTypeId()===3 || tarRen.getTypeId()===5)
            ){
                console.log("this should also be visible in CLD ");
                //
                var friendlyWidget=that.parentWidget.gtGraphObj;
                globalLink.setVisibleInWidget(friendlyWidget,true);
                var friendlyLink=friendlyWidget.createLink(friendlyWidget);

                globalLink.setLinkGenerator(friendlyWidget,friendlyLink);
                friendlyLink.setGlobalLinkPtr(globalLink);





            }
            // this should also be added now to GCM;
            friendlyWidget=that.parentWidget.sfdGraphObj;
            globalLink.setVisibleInWidget(friendlyWidget,true);
            friendlyLink=that.createLink(that);
            console.log("okay1");
            globalLink.setLinkGenerator(friendlyWidget,friendlyLink);
            console.log("okay2");
            friendlyLink.setGlobalLinkPtr(globalLink);







            that.forceRedrawContent();
            that.selectNode(undefined);



            // //*****************
            // var aLink=that.createLink(that);
            // aLink.source(d.parentNode());
            // aLink.target(targetNode);
            //
            // that.pathElementArray.push(aLink);
            //
            // that.forceRedrawContent();
            // // that.parentWidget.handleSelection(aLink);
            // aLink.onClicked();
            // aLink.pathElement.classed("cldLinkSelected", true);
        }
    };

    this.createShadowLink=function(source,target){
        // crreate a global links
        var sfdGraph=that.parentWidget.sfdGraphObj;
        var srcRen=source.getGlobalNodePtr().filterInformation(sfdGraph);
        var tarRen=target.getGlobalNodePtr().filterInformation(sfdGraph);

        if (srcRen===tarRen){
            console.log("No Capes allowd, i mean loops!");
            return;
        }

        var handler=that.parentWidget.getHandler();
        var globalLink=handler.createGlobalLink(sfdGraph);

        console.log("global LInk obj");
        console.log(globalLink);

        globalLink.setLinkGenerator(sfdGraph,that.createLink(that));
        handler.addGlobalLink(globalLink);
        var repR=globalLink.filterInformation(sfdGraph);
        repR.setGlobalLinkPtr(globalLink);



        repR.source(srcRen);
        repR.target(tarRen);

        globalLink.setSource(srcRen.getGlobalNodePtr());
        globalLink.setTarget(tarRen.getGlobalNodePtr());


        console.log("This should be it ")

    };
    this.addLinkFormSFD=function(source,target){
        var srcRen=source.getGlobalNodePtr().filterInformation(that);
        var tarRen=target.getGlobalNodePtr().filterInformation(that);

        if (srcRen===tarRen){
            console.log("No Capes allowd, i mean loops!");
            return;
        }

        // crreate a global links
        var handler=that.parentWidget.getHandler();
        var globalLink=handler.createGlobalLink(that);

        console.log("global LInk obj");
        console.log(globalLink);

        globalLink.setLinkGenerator(that,that.createLink(that));
        handler.addGlobalLink(globalLink);
        var repR=globalLink.filterInformation(that);
        repR.setGlobalLinkPtr(globalLink);

        //add the cld representer nodes;



        repR.source(srcRen);
        repR.target(tarRen);

        globalLink.setSource(srcRen.getGlobalNodePtr());
        globalLink.setTarget(tarRen.getGlobalNodePtr());

        console.log("Node Types are: "+srcRen.getTypeId()+" "+tarRen.getTypeId());
        if ((srcRen.getTypeId()===3 || srcRen.getTypeId()===5)
            && (tarRen.getTypeId()===3 || tarRen.getTypeId()===5)
        ){
            console.log("this should also be visible in CLD ");
            //
            var friendlyWidget=that.parentWidget.gtGraphObj;
            globalLink.setVisibleInWidget(friendlyWidget,true);
            var friendlyLink=friendlyWidget.createLink(friendlyWidget);

            globalLink.setLinkGenerator(friendlyWidget,friendlyLink);
            friendlyLink.setGlobalLinkPtr(globalLink);
        }
        // this should also be added now to GCM;
        friendlyWidget=that.parentWidget.sfdGraphObj;
        globalLink.setVisibleInWidget(friendlyWidget,true);
        friendlyLink=that.createLink(that);
        console.log("okay1");
        globalLink.setLinkGenerator(friendlyWidget,friendlyLink);
        console.log("okay2");
        friendlyLink.setGlobalLinkPtr(globalLink);
        that.forceRedrawContent();
        that.selectNode(undefined);

    };


    this.redrawGraphContent=function(){

   //     console.log("redraw functin for CLD");
        var gHandler=that.parentWidget.getHandler();
        that.nodeElementArray=gHandler.collectNodesForWidget(that);
        that.pathElementArray=gHandler.collectLinkForWidget(that);

        var nodeElements = that.nodeLayer.selectAll(".node")
            .data(that.nodeElementArray).enter()
            .append("g")
            .classed("node", true)
            .attr("id", function (d) {
                return d.id();
            })
            .call(that.dragBehaviour);

        nodeElements.each(function (node) {
            node.svgRoot(d3.select(this));
            node.drawNode();
            node.updateElement();
        });


        // todo : FILTER GLOBAL LINKS FOR THIS WIDGET
       // console.log("draw global links");
        var pathElements= that.pathLayer.selectAll(".path")
            .data(that.pathElementArray).enter()
            .append("g")
            .classed("path", true)
            .attr("id", function (d) {
                return d.id();
            })
            .call(that.dragBehaviour);


        pathElements.each(function (node) {
            node.svgRoot(d3.select(this));
            node.drawElement();
            node.updateElement(0,0);
        });


       // console.log("draw global links---Dpone");
        // add the drag behavior to the dragger element;
        var draggerElments = that.draggerLayer.selectAll(".node")
            .data(that.draggerObjectsArray).enter()
            .append("g")
            .classed("node", true)
            .attr("id", function (d) {
                return d.id();
            })
            .call(that.dragBehaviour);

        draggerElments.each(function (node) {
            node.svgRoot(d3.select(this));
            node.drawNode();
        });
        // hide the dragger layer;
        that.draggerLayer.classed("hidden",true);

    };

    this.handleLinkDeletion = function(link) {

        // handle the delete in the handler
        var handler=that.parentWidget.getHandler();
        handler.deleteGlobalLink(link);

        //that.pathElementArray.splice(that.pathElementArray.indexOf(link), 1);
        that.forceRedrawContent();
        that.parentWidget.sfdGraphObj.forceRedrawContent();// redrawing content of the sdf map
        //that.removeDeletedElements();
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
    };

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
            var tempLinks = [];
            loopNodeNames[i] = [];
            for(var j=0; j<tempLoop.length; j++) {
                for(var k=0; k<that.pathElementArray.length; k++) {
                    if(tempLoop[j+1] !== undefined) {
                        if(tempLoop[j] === that.pathElementArray[k].sourceNode.id() && tempLoop[j+1] === that.pathElementArray[k].targetNode.id()) {
                            tempLinks.push(that.pathElementArray[k]);
                        }                            
                    }                    
                }                                
                that.nodeElementArray.filter(function(n) {
                    if(tempLoop[j] === n.id())
                        loopNodeNames[i].push(n.label);
                });
            }
            feedbackLoops.push(tempLinks);
        }

        for(var i=0; i<feedbackLoops.length; i++) {
            var tLinks = feedbackLoops[i];
            var loopType = determineLoops(tLinks);
            for(var j=0; j<tLinks.length; j++) {
                console.log("The feedback loop id is: "+tLinks[j].id()+" and its loop type: "+loopType);
                tLinks[j].setLoopStyle(loopType);
            }            
        }        

        //display the loop nodes in a modal
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

        //determine positive or negative loops
        function determineLoops(loopLinks) {
            var minus = 0;            
            for(var k=0; k<loopLinks.length; k++) {
                if(loopLinks[k].cldTypeString === "-") {
                    minus++;
                }
            }
            if(minus % 2 == 1) {
                return "Balancing";
            }
            else {
                return "Reinforcing";
            }
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
