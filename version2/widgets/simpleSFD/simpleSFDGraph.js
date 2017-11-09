
function SimpleSFDGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    // call the baseGraph init function
    that.initializeGraph();
    var hudEnabled=false;
    var hudGenerated=false;

    var libraryLoaded=false;


    var inputClasses=[]; // descriptions for the different classes;

    var overlayNodes=[];
    var overlayLinks=[];
    var overlayArea;
    var overlayRect;
    this.selectedOverlayId=0;


    // helper var;
    var mouseEntered=false;

    this.setSelectedOverlayId=function(val){
        that.selectedOverlayId = val ;
    };

    this.getSelectedOverlayId=function(){
      return that.selectedOverlayId;
    };

    this.initializeGraph=function(){

        // modify to you needs
        this.specialLayer= this.svgElement.append("g");
        // console.log("a graph has"+this.nodeLayer);
        // console.log("a graph has"+this.pathLayer);
        // console.log("a graph has"+this.specialLayer);
        // setting the extent default(0.1,3)
        that.setZoomExtent(0.5,4);
        // det a double click event if needed
        //that.setDoubleClickEvent(that.dblClick);
    };

    this.createLink=function(parent){
        return new SimpleSFDLink(parent);
    };


    // overwrite the doublClick action
    this.dblClick=function() {
           that.deselectLastLink();
           that.deselectLastNode();
            console.log(that.selectedOverlayId);
            console.log(inputClasses[that.selectedOverlayId]);
           if (inputClasses[that.selectedOverlayId].name==="relation"){
               console.log("this is an edge");
               return;
           }

        var handler=that.parentWidget.getHandler();
        var globalNode=handler.createGlobalNode(that);
        globalNode.setNodeType(that,that.selectedOverlayId,that.createNode(that,inputClasses));
        var temp=["Causal","Node","Relation"];




        handler.addGlobalNode(globalNode);
        var repR=globalNode.filterInformation(that);
        repR.setGlobalNodePtr(globalNode);

        var coordinatesRelativeToCanvasArea;
        coordinatesRelativeToCanvasArea=d3.mouse(this);
        var grPos=getScreenCoords(coordinatesRelativeToCanvasArea[0],coordinatesRelativeToCanvasArea[1],that.translation,that.zoomFactor);
        globalNode.setNodePos(that,grPos);
        globalNode.setGlobalName(inputClasses[that.selectedOverlayId].name);
        that.clearRendering();
        that.redrawGraphContent();

        // add friendly nodes;
        console.log("-------------SFD NAME "+inputClasses[that.selectedOverlayId].name);
        if (inputClasses[that.selectedOverlayId].name==="Factor" || inputClasses[that.selectedOverlayId].name==="node"){
            console.log("yeas'");
            var friendlyWidget=that.parentWidget.cldGraphObj;
            globalNode.setVisibleInWidget(friendlyWidget,true);
            var friendlyNode=friendlyWidget.createNode(that.parentWidget.cldGraphObj);
            globalNode.setNodeType(friendlyWidget,1,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);
            globalNode.setKind("CLD_NODE")
        }

        if (inputClasses[that.selectedOverlayId].name==="action"){
            var friendlyWidget=that.parentWidget.cldGraphObj;
            globalNode.setVisibleInWidget(friendlyWidget,true);
            var friendlyNode=friendlyWidget.createNode(that.parentWidget.cldGraphObj);
            globalNode.setNodeType(friendlyWidget,2,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);
            globalNode.setKind("CLD_NODE")
        }

        if (inputClasses[that.selectedOverlayId].name==="criterion"){
            var friendlyWidget=that.parentWidget.cldGraphObj;
            globalNode.setVisibleInWidget(friendlyWidget,true);
            var friendlyNode=friendlyWidget.createNode(that.parentWidget.cldGraphObj);
            globalNode.setNodeType(friendlyWidget,3,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);
            globalNode.setKind("CLD_NODE")
        }

        if (inputClasses[that.selectedOverlayId].name==="criterion"){
            var friendlyWidget=that.parentWidget.gtwGraphObj;
            globalNode.setVisibleInWidget(friendlyWidget,true);
            var friendlyNode=friendlyWidget.createNode(that.parentWidget.gtwGraphObj);
            globalNode.setNodeType(friendlyWidget,3,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);
            globalNode.setKind("CLD_NODE")
        }



        // if the selected thing is createria
        // if (that.nodeTypeGraph===3){
        //     var friendlyWidget=that.parentWidget.gtGraphObj;
        //     globalNode.setVisibleInWidget(friendlyWidget,true);
        //     var friendlyNode=friendlyWidget.createNode(that.parentWidget.gtGraphObj);
        //     globalNode.setNodeType(friendlyWidget,3,friendlyNode);
        //     friendlyNode.setGlobalNodePtr(globalNode);
        // }
        //
        //
        // // generate in sfd;
        // // all node types are added to the sdf
        // var friendlyWidget=that.parentWidget.gtGraphObj;
        // var sfdWdiget=that.parentWidget.sfdGraphObj;
        // globalNode.setVisibleInWidget(sfdWdiget,true);
        // friendlyNode=sfdWdiget.createFriendlyNode();
        // globalNode.setNodeType(sfdWdiget,that.nodeTypeGraph-1,friendlyNode);
        // friendlyNode.setGlobalNodePtr(globalNode);


        // console.log("A Double Click "+d3.event);
      //   // console.log("BaseGraph does not implement this");
      //   // console.log("Debugging ");
      // //  console.log("overwritten dblClick");
      //   that.deselectLastLink();
      //   that.deselectLastNode();
      //   var coordinatesRelativeToCanvasArea=[0,0];
      //   coordinatesRelativeToCanvasArea=d3.mouse(this);
      //   var aNode = that.createNode(that, inputClasses);
      //   var grPos = getScreenCoords(coordinatesRelativeToCanvasArea[0], coordinatesRelativeToCanvasArea[1], that.translation, that.zoomFactor);
      //   aNode.x = grPos.x;
      //   aNode.y = grPos.y;
      //
      //
      //   that.nodeElementArray.push(aNode);
      //   that.clearRendering();
      //   that.redrawGraphContent();
      //
      //   aNode.editInitialText();
        that.selectNode(undefined);
    };

    that.setDoubleClickEvent(this.dblClick);

    this.createNode=function(parent,nodeDescriptions){
        var exampleNode=new SimpleSFDNode(parent,nodeDescriptions);
        // if type is selected than we can generate typed nodes;
        // get who is selected;
        // TODO: make the selected overlayid class level to change id types at anymoment required.
        //that.setSelectedOverlayId(0); //var selectedOverlayId=0;
        if (overlayNodes.length>0){
            for (var i=0;i<overlayNodes.length;i++){
                if (overlayNodes[i].getSelectionStatus()===true){
                    that.setSelectedOverlayId(i);
                    break;
                }
            }
        }
        exampleNode.setType(that.selectedOverlayId);
        // console.log(that.selectedOverlayId+"it is the one");
        return exampleNode;
    };

    this.changeNodeType=function(){
    //  that.getSele()
    };

    this.updateSvgSize=function(){
        var drawArea=that.parentWidget.getCanvasArea();
        var w = drawArea.node().getBoundingClientRect().width;
        var h= window.innerHeight ;
        if (that.svgElement)
            that.svgElement.attr("width", w).attr("height", h);

        // fix the size of the overlay area;
        if (overlayRect)
            overlayRect.attr("height", window.innerHeight );

    };


    // function for wrapping the graph data into the solver format;
    this.requestModelDataAsJson=function(){
        // var modelObj={};
        // modelObj.nodes=[];
        // var i,j;
        // for (i=0;i<that.nodeElementArray.length;i++){
        //     var node=that.nodeElementArray[i];
        //     var obj={};
        //     obj.name=node.getNodeName();
        //     obj.parameters=[];
        //     // add parameters
        //     var nodeParameters=node.getParameterElements();
        //     for (j=0;j<nodeParameters.length;j++){
        //         obj.parameters.push(nodeParameters[j])
        //
        //     }
        //     obj.identity=node.id();
        //     obj.interface=node.getInterfaceDescription();
        //
        //     modelObj.nodes.push(obj);
        // }
        // console.log(JSON.stringify(modelObj, null, ''));
        // return  JSON.stringify(modelObj, null, '  ');

        console.log("----------------------- REQUESTING MODEL DATA")
        var modelObj = {};
        modelObj.nodes = [];
        // modelObj.links = [];


        that.budgetId = 0;
        that.budgetPortIndex = 0;
        that.actionNodes = 0;
        that.criteriaNodes = 0;
        that.optimiseId = 1;
        that.optimisePortIndex = 0;
        var initEvelId=-1;

        console.log("Does CLD have budget "+that.parentWidget.cldGraphObj.budget);
        var qrBudget=that.parentWidget.cldGraphObj.budget;
        console.log("QR Budget:"+qrBudget);
        for(var i=0; i<that.nodeElementArray.length; i++) {
            var node = that.nodeElementArray[i];
            var obj = {};
            node.getGlobalNodePtr().updateNodeIds();
            initEvelId=node.getGlobalNodePtr().getHighestGlobalNodeValue();
            if(node.typeName !== "Stake Holder") {
                if (node.getGlobalNodePtr().getCLDNODE()) {
                    var cldNode=node.getGlobalNodePtr().getCLDNODE();
                    // this is cld node faction action etc
                    cldNode.getFinalData();
                    obj.name = cldNode.typeNameForSolver;
                    obj.parameters = cldNode.parameters;
                    obj.interface = cldNode.interfaces;
                    obj.identity = cldNode.id();
                    //need to add more attributes
                    modelObj.nodes.push(obj);
                }
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
                    evals.identity = initEvelId++;



                    for(var m=0; m<sLinkIds.length; m++) {
                        sLinkIds[m].setEvaluateId(evals.identity);
                    }

                    modelObj.nodes.push(evals);
                }
            }
            node.getGlobalNodePtr().setGlobalHighestIdValue(initEvelId);
            console.log("Highest ID"+node.getGlobalNodePtr().getHighestGlobalNodeValue());
        }


        for( i=0; i<that.pathElementArray.length; i++) {
            var link = that.pathElementArray[i];
            link.getGlobalLinkPtr().updateLinkID();
            if(link.superLinkType !== 100) {
                var obj={};
                if (link.getGlobalLinkPtr().getCLDLINK()) {

                    var cldLink = link.getGlobalLinkPtr().getCLDLINK();
                    cldLink.getFinalData();
                    obj.name = cldLink.name;
                    obj.parameters = cldLink.parameters;
                    obj.interface = cldLink.interfaces;
                    obj.identity = cldLink.id();
                    modelObj.nodes.push(obj);
                }
            }
        }

        var nodeBudget = {
            "name": "budget",
            "parameters": [{"name": "numberOfPorts", "value": that.actionNodes, "type": "Int"}, {"name": "maximumBudget", "value": Number(qrBudget), "type": "Int"}],
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
            obj.interface=node.getInterfaceDescription();
            obj.nodeIdType=node.getTypeId();
            obj.pos=[node.x,node.y];
            retObj.nodes.push(obj);
        }

        for (i=0;i<that.pathElementArray.length;i++){
            var link =that.pathElementArray[i];
            var linkObj={};
            linkObj.linkID=link.id();
            linkObj.nodeSource_nodeTarget=[link.sourceNode.getParentId(),link.targetNode.getParentId()];
            linkObj.portSource_portTarget=[link.sourceNode.id(),link.targetNode.id()];
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
            that.pathElementArray.push(newLink);
            that.needsRedraw(true);
        }
    };

    this.addNodeFromJSON=function(jsonNode){
        var nodeName=jsonNode.name;
        var nodePos=jsonNode.pos;
        var nodeId=jsonNode.id;

        //
        // console.log("Graph should add now a node with : " );
        // console.log("   Name : "+nodeName );
        // console.log("   Id   : "+nodeId);
        // console.log("   Pos  : "+nodePos);

        var newNode=that.createNode(that);
        // todo: check how to handle the data;
        newNode.id(nodeId);
        newNode.setLabelText(nodeName);
        var x=parseFloat(nodePos[0]);
        var y=parseFloat(nodePos[1]);
        newNode.setPosition(x,y);
        // push to array of nodes
        // console.log("newNode  "+newNode);
        that.nodeElementArray.push(newNode);
        that.needsRedraw(true);

    };


    this.enableHUD=function(val){
        hudEnabled=val;
        if (val===false) {
            that.clearOverlayRendering();
            hudGenerated=false;
            return;
        }
    //    console.log("Generate HUD if needed");
        if (hudGenerated===false){
            this.generateHUD();
        }
    };


    this.clearOverlayRendering=function(){
      //  console.log("clearing the overlay rendering");
        that.overlayRenderingSvg.selectAll('*').remove();
    };

    this.createOverlayArea=function(){
        // do a simple rectangular drawing;

        overlayArea=that.overlayRenderingSvg.append('g');

        overlayRect=overlayArea.append('rect')
            .classed("overlayAreaRect",true)
            .attr("x",0)
            .attr("y",0)
            .attr("width",200)
            .attr("height", window.innerHeight );




    };


    this.focusThisOverlayNode=function(node){
        console.log("focusing overlay node "+node);
        // remove all selections;
        if (overlayNodes.length===0) return ; // nothing to overlay with
        var nodeSelectionStatus;
        if (node!==undefined){
            nodeSelectionStatus=node.getSelectionStatus();
        }
        // lazy deselection, since overlay
        for (var i=0;i<overlayNodes.length;i++){
            var lNode=overlayNodes[i];
            lNode.setSelectionStatus(false);
        }
        if (node===undefined){
            // per default undefined should be selected
            overlayNodes[0].setSelectionStatus(true);

        }else{
            // restore selection status
            node.setSelectionStatus(nodeSelectionStatus);
        }


    };

    this.createOverlayNodes=function(){
        overlayNodes=[];
        console.log("generating nodes");

        var tempNode=that.createNode(that,inputClasses);
        // this node tells me what things we have;
        var labelTags=tempNode.getLabelTags();

        // create a node;
        for (var i=0;i<labelTags.length;i++){
            var lNode=that.createNode(that,inputClasses);
            lNode.setLabelText(labelTags[i]);
            lNode.id("overlayNode_"+i);
            // set positions;
            lNode.x=100;
            lNode.y=75+i*125;
            lNode.setType(i);
            lNode.setNodeObjectTypeToOverlay();
            overlayNodes.push(lNode);
        }

    };

    this.implementResultIntoGraphData=function(jsonOBJ){
        var results=jsonOBJ.result;
        var nE,p;
        if (results.length===0){
            // result does not provide any information;
            // reset the ports values;

            for (nE=0;nE<that.nodeElementArray.length;nE++){
                nodeElement=that.nodeElementArray[nE];
                var ports=nodeElement.getPortElements();
                for (p=0;p<ports.length;p++){
                    ports[p].resetPortValue();
                }
            }


        }

        for (var i=0;i<results.length;i++){
            // parse the id of the node from the result
            var temp=results[i];
            // get key name
            var nameVar;
            var value;
            for (var name in temp){
                nameVar=name;
                value=temp[name];
            }
            // try to parse the ports name and id of node;
            if (nameVar===undefined){
                console.log("Could not parse the json object ");
                console.log("input :");
                console.log(jsonOBJ);
                return;

            }
            var nodeId=parseInt(nameVar.replace( /^\D+/g, ''));
            var portName=nameVar.replace(new RegExp("[0-9]"),'');


            var nodeElement=undefined;
            for (nE=0;nE<that.nodeElementArray.length;nE++){
                if (that.nodeElementArray[nE].id()===nodeId)
                    nodeElement=that.nodeElementArray[nE];
            }


            if (nodeElement){
                console.log("node exists");
                // get port elements;
                var portElements=nodeElement.getPortElements();
                // search for port name;
                for ( p=0;p<portElements.length;p++){
                    if (portElements[p].getPortName()===portName){
                        // found port
                        portElements[p].setPortValue(parseFloat(value));
                        console.log("---------------------------------------------");
                        console.log("Node iD: "+nodeId);
                        console.log("Port Name: "+portName);
                        console.log("Port Value: "+value);

                    }
                }
            }else{
                console.log("node with id "+nodeId+" does not exist");

            }


        // update the selected node if there is one
            if (that.prevSelectedNode){
                // do this twice so it is defenetly selected
                var nodeToSelect=that.prevSelectedNode;
                that.selectNode(undefined);
                that.selectNode(nodeToSelect);
            }

        }
    };



    this.generateHUD=function(){
     //   console.log("generating hud FOR SFD ");
        hudGenerated=true;

      //  console.log("Do we have an overlay thingy?"+that.overlayRenderingSvg);
        // yes;

        // clear it
        that.clearOverlayRendering();
        that.createOverlayArea();
        if (libraryLoaded===true) {
            that.createOverlayNodes();
         //   that.createOverlayLinks();
            that.redrawOverlayContent();
            that.focusThisOverlayNode(undefined);
        }

    };


    this.createOverlayLinks=function() {
        overlayLinks = [];
        // do this as stand alone classes and fix overlay and selection of the linkTypes
        var tempNode = that.createLink(that);
        // this node tells me what things we have;
        var labelTags = tempNode.getLabelTags();
        var linkClasses = tempNode.getAllClasses();

        // create some elements
        // get offset for the elements position;
        var heightOffset = overlayNodes[overlayNodes.length - 1].y;
        // add the radius of that element to the offset;
        //heightOffset+=2*overlayNodes[overlayNodes.length-1].getRadius();
        heightOffset += 2 * 50;
        // create clickable link elements;

        for (var i = 0; i < labelTags.length; i++) {
            var anElement = overlayArea.append('g');
            var hudElement = anElement.append("rect")
                .classed("overlayLinkElement", true)
                .attr("x", 25)
                .attr("y", heightOffset)
                .attr("width", 150)
                .attr("height", 60);


            // generate the things we need;
            anElement.append('line')
                .classed(linkClasses[i], true)
                .attr("x1", 35)
                .attr("y1", heightOffset + 40)
                .attr("x2", 160)
                .attr("y2", heightOffset + 40);

            anElement.append('text').text(labelTags[i])
                .attr("x", 100)
                .attr("y", heightOffset + 30)
                .attr("text-anchor", "middle")
                .attr("style", "fill: black");

            heightOffset += 80;
            overlayLinks.push(hudElement);

            renderElement=hudElement;
            renderElement.on("mouseover", function () {
                        if (mouseEntered === true) return;
                        // set the hover class;
                        renderElement.classed("overlayLinkElementHovered", true);
                        renderElement.classed("overlayLinkElement", false);
                        mouseEntered = true;
                    })
                        .on("mouseout", function () {
                            mouseEntered = false;
                            renderElement.classed("overlayLinkElementHovered", false);
                            renderElement.classed("overlayLinkElement", true);
                        })
                        .on("click", function () {
                            renderElement.classed("overlayLinkElementHovered", false);
                            renderElement.classed("overlayLinkElement", false);
                            if (renderElement.classed("overlayLinkElementToggeled") === false)
                                renderElement.classed("overlayLinkElementToggeled", true);
                            else {
                                renderElement.classed("overlayLinkElementToggeled", false);
                            }
                        });


        }




        // // make the connectios for the hud elements;
        // // connect this
        // for (i=0;i<overlayLinks.length;i++) {
        //     var renderElement=overlayLinks[i];
        //     renderElement.on("mouseover", function () {
        //         if (mouseEntered === true) return;
        //         // set the hover class;
        //         renderElement.classed("overlayLinkElementHovered", true);
        //         renderElement.classed("overlayLinkElement", false);
        //         mouseEntered = true;
        //     })
        //         .on("mouseout", function () {
        //             mouseEntered = false;
        //             renderElement.classed("overlayLinkElementHovered", false);
        //             renderElement.classed("overlayLinkElement", true);
        //         })
        //         .on("click", function () {
        //             renderElement.classed("overlayLinkElementHovered", false);
        //             renderElement.classed("overlayLinkElement", false);
        //             if (renderElement.classed("overlayLinkElementToggeled") === false)
        //                 renderElement.classed("overlayLinkElementToggeled", true);
        //             else {
        //                 renderElement.classed("overlayLinkElementToggeled", false);
        //             }
        //         });
        // }

    };

    this.redrawOverlayContent=function(){
      //  console.log("redrawing overlay Area");
        var overlayNodeElements = overlayArea.selectAll(".node")
            .data(overlayNodes).enter()
            .append("g")
            .classed("node", true)
            .attr("id", function (d) {
                return d.id();
            });
            // generate own drag behavoir for the elements;
            //.call(that.dragBehaviour);

        overlayNodeElements.each(function (node) {
            node.svgRoot(d3.select(this));
            node.drawNode();
            node.updateElement();
        });


    };

    // testing hud properties;

    this.ignoreEvents=function(){
        console.log("graph object ignores drag event");
        d3.event.stopPropagation();
        console.log("works");
    };

    // testing sfd library load functions
    this.libraryLoaded=function(val){
        if (!arguments.length) return libraryLoaded;
        else libraryLoaded=val;

    };

    this.clearRendering=function(){
        // clear the graph
        that.graphRenderingSvg.selectAll('*').remove();

        that.draggerLayer=that.graphRenderingSvg.append('g');
        that.pathLayer=that.graphRenderingSvg.append('g');
        that.nodeLayer=that.graphRenderingSvg.append('g');
        that.markerLayer=that.graphRenderingSvg.append('g');

        that.draggerElement=that.createDraggerItem(that);
        that.draggerElement.svgRoot(that.draggerLayer);
        that.draggerLayer.classed("hidden",true);
        that.draggerObjectsArray.push(that.draggerElement);
    };

    this.redrawHUD=function(){
        this.generateHUD();
    };

    this.createFriendlyNode=function(){
        var aNode=that.createNode(that,inputClasses);
        return aNode;

    };



    this.redrawGraphContent=function(){


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
            node.updateElement();
        });



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


    this.clearWidgetsElements=function(){
        inputClasses=[];
    };

    this.paseLoadedLibrary=function(jsonObj){
        // clear the input classes
        inputClasses=[];
        if (!jsonObj){
            console.log("Error while parsing json");
            return false;
        }
        var header=jsonObj.header;

        var metaInformation={};

        if (header){
            // parse some meta Info:
            metaInformation.title=header.title;
            metaInformation.comment=header._comment;
        }else{
            metaInformation.title="Not presented in file";
            metaInformation.comment="Not presented in file";
        }
        console.log("PARSING DATA");

        var TBOX=jsonObj.library;
        // for number of objects in TBOX do parsing



        for (var iA=0;iA<TBOX.length;iA++) {

            // generate nodeDescriptiosn which are then used for initializing the nodes;

            var nodeDescription={};

            var libDisc = TBOX[iA];
            // get description of the library in terms of nodes and their interfaces
            // each object is here a node with its values;
            var nodeName = libDisc.name;
            //        console.log(libDisc);
            var imgURL = libDisc.imgURL;
            var description = libDisc.description;
            var params = libDisc.parameters; // TODO: parse them and add them to the node object;

            // console.log("-----------IN THE NEW LOADED FILE FORMAT--------------------------");
            // console.log("node " + nodeName );
            // console.log("img URL " + imgURL );
            // console.log("hover Text " + description);
            // console.log("params " + params);

            nodeDescription.name=nodeName;
            nodeDescription.imgUrl=imgURL;
            nodeDescription.hoverText=description;
            nodeDescription.params=params;
            nodeDescription.type=libDisc.type;
            nodeDescription.graphElement=libDisc.graphElement;
            nodeDescription.ports=libDisc.interface;
            inputClasses.push(nodeDescription);
        }

    return true;
    };

    this.paseLibrary=function(jsonObj){
        // clear the input classes
        inputClasses=[];

        if (!jsonObj){
            console.log("Error while parsing json");
            return false;
        }

        // parsing crud library as example lib


       var header=jsonObj.header;

       var metaInformation={};

        if (header){
            // parse some meta Info:
            metaInformation.title=header.title;
            metaInformation.comment=header._comment;
        }else{
            metaInformation.title="Not presented in file";
            metaInformation.comment="Not presented in file";
        }
        console.log("PARSING DATA");

        var TBOX=jsonObj.library;
        // for number of objects in TBOX do parsing
        for (var iA=0;iA<TBOX.length;iA++) {
            // generate nodeDescriptiosn which are then used for initializing the nodes;
            var nodeDescription={};
            var libDisc = TBOX[iA];
            // get description of the library in terms of nodes and their interfaces
            // each object is here a node with its values;
            var nodeName = libDisc.name;
    //        console.log(libDisc);
            var imgURL = libDisc.icon;
            var hoverText = libDisc.hoverText;
            var params = libDisc.parameters; // TODO: parse them and add them to the node object;

            console.log("-------------------------------------");
            console.log("node " + nodeName );
            console.log("img URL " + imgURL );
            console.log("hover Text " + hoverText);
            console.log("params " + params);

            nodeDescription.name=nodeName;
            nodeDescription.imgUrl=imgURL;
            nodeDescription.hoverText=hoverText;
            nodeDescription.params=params;
            nodeDescription.ports=libDisc.interface;
            nodeDescription.nodeTypus=libDisc.type; // this is telling us if it is an interlink node or nod
                                                    // used later for validation ; interlinks should have all ports conj

            inputClasses.push(nodeDescription);
        }

        return true;
    };

    this.createDraggerItem=function(parent){
        return new PortDragger(parent);
    };

    function getScreenCoords(x, y, translate, scale){
        var xn=(x - translate[0])/scale;
        var yn=(y - translate[1])/scale;
        return {x: xn, y: yn};
    }

    this.getTargetNode=function(position) {
        // computes the nearest node center to the given position;
        // todo : use kd-tree for node positions and optimizations;
        // todo: do we really need this;
        console.log("Searching for Traget Node")
        var dx=position[0];
        var dy=position[1];
        var tN=undefined;
        var minDist=1000000000000;


        that.nodeElementArray.forEach(function (el){
            // compute distance;
            var cDist=Math.sqrt((el.x-dx)*(el.x-dx)+(el.y-dy)*(el.y-dy));
            if (cDist<minDist){
                minDist=cDist;
                tN=el;
                console.log("Found target node")
            }
        });
        //     console.log("minDist="+minDist);
        if (minDist>80) return null;
        return tN;


    };
    // owerwrite dragger release function;
    this.draggerElementReleaseFunction=function(d){

        // check if we have to perform a interlink operation;
        var nodeDesc=inputClasses[that.selectedOverlayId];


        that.draggerLayer.classed("hidden",true);

        // what type is d;
        console.log(d.parentNode().getElementType());
        console.log("------------------");
        var targetNode=undefined;
        var draggeEndPos=[that.draggerElement.x, that.draggerElement.y];
        that.draggingObject=false;
        if (d.parentNode().getElementType()==="sfdNode"){
            // find the closes NODE!
            targetNode=that.getTargetNode(draggeEndPos);
            console.log("targetNode");
            console.log(targetNode);
            // some fancy stuff;
            if (d.parentNode().getElementType()==="sfdNode" && targetNode.getElementType()==="sfdNode"){
                console.log("create the connection in CLD please");
                if(targetNode.getGlobalNodePtr().getKind() && d.parentNode().getGlobalNodePtr().getKind()) {
                    that.parentWidget.cldGraphObj.addLinkFormSFD(d.parentNode(), targetNode);
                }else{
                    that.parentWidget.cldGraphObj.createShadowLink(d.parentNode(), targetNode);

                }

                that.forceRedrawContent();

            }

            return;

        }
        // check he the node stoped



        var targetPort=that.getTargetPort(draggeEndPos);




        // console.log("dragger End pos"+draggeEndPos);
        if (targetPort && d.parentNode().getParentId()!==targetPort.getParentId()) {
            console.log("Target node name: " + targetPort.getName());
            // create a link between these;

            var newLibType=(targetPort.getProvidedPortConnectionTypes() || d.parentNode().getProvidedPortConnectionTypes()); // atleast one of the ports should tell me something;
            console.log("Hey ho, are we a new lib format? "+newLibType);
            // check if you are allow to connect these ports;
            var sourcePort=d.parentNode();
            var t_portIT=targetPort.getIncomingConnectionType();
            var t_portOT=targetPort.getOutgoingConnectionType();
            var s_portIT=sourcePort.getIncomingConnectionType();
            var s_portOT=sourcePort.getOutgoingConnectionType();
            console.log("Testing Connection Types");
            console.log("Target("+targetPort.getName()+": INPUT="+t_portIT);
            console.log("Target("+targetPort.getName()+": OUTPUT="+t_portOT);
            console.log("Target("+targetPort.getName()+": USED ="+targetPort.isUsed());

            console.log("Source("+sourcePort.getName()+": INPUT="+s_portIT);
            console.log("Source("+sourcePort.getName()+": OUTPUT="+s_portOT);
            console.log("Source("+sourcePort.getName()+": USED="+sourcePort.isUsed());
            console.log("-----------------");

            var aLink,sourceNode, targetNode,seenLink;

            // define cases
            if (newLibType===false){
                // use old one to one mapping with used ports
                if (targetPort.isUsed()===false && sourcePort.isUsed()===false){
                    // create connection

                    // crreate a global links
                    var handler=that.parentWidget.getHandler();
                    var globalLink=handler.createGlobalLink(that);
                    globalLink.setLinkGenerator(that,that.createLink(that));
                    handler.addGlobalLink(globalLink);
                    var repR=globalLink.filterInformation(that);
                    repR.setGlobalLinkPtr(globalLink);
                    console.log("globalLink");
                    console.log(globalLink);
                    sourceNode=d.parentNode().getParentNode();
                    targetNode=targetPort.getParentNode();



                    //aLink = that.createLink(that);

                    seenLink=repR.validateConnection(sourceNode,targetNode);
                    if (seenLink===false) {
                        repR.addPortConnection(sourcePort,targetPort);
                        repR.source(sourceNode);
                        repR.target(targetNode);

                        globalLink.setSource(sourceNode.getGlobalNodePtr());
                        globalLink.setTarget(targetNode.getGlobalNodePtr());

                    }else{
                        seenLink.setMultiLinkType(true);
                        seenLink.addPortConnection(sourcePort,targetPort);
                    }
                    targetPort.isUsed(true);
                    d.parentNode().isUsed(true);
                    // force draw of link;
                    that.forceRedrawContent();
                }
            }
            if (newLibType===true){
                // TODO: RE-EVALUATE ALL USE CASES!!! <<
                console.log("validating link connection in the new lib format");
                // ah now it gets more complex;

                // first does the source port allow outgoing types?
                if (s_portOT==="NONE"){
                    console.log("this source port does not allow anything to go out...");
                    return;
                }
                if (s_portIT==="SINGLE" && sourcePort.isUsed()===true){
                    console.log("Well Nope this does not allow also source port already used");
                    return;
                }
                if (s_portOT==="SINGLE" && sourcePort.isUsed()===true){
                    console.log("Well Nope this does not allow also source port already used");
                    return;
                }

                if (t_portIT==="NONE"){
                    console.log("this Target port does not allow anything to go in...");
                    return;
                }
                // check if we allow outgoing connections but are already used in a prev link
                if (t_portIT==="SINGLE" && targetPort.isUsed()===true){
                    console.log("Well Nope this does not allow also target port already used");
                    return;
                }

                // everthing that forbids connections should be handled now
                // now we can create the connections;

                // check if relational type is selected
                sourceNode=d.parentNode().getParentNode();
                targetNode=targetPort.getParentNode();

                var sourceDesc=inputClasses[sourceNode.getTypeId()];
                var targetDesc=inputClasses[targetNode.getTypeId()];
                console.log("nodeDesc");
                console.log(nodeDesc);
                if (nodeDesc.graphElement==="RELATIONAL" && sourceDesc.graphElement!=="RELATIONAL" && targetDesc.graphElement!=="RELATIONAL"){
                    console.log("Creating relational Type Node and its connection");
                    // get the positions of the parents;

                    var x=sourceNode.x+0.5*(targetNode.x-sourceNode.x);
                    var y=sourceNode.y+0.5*(targetNode.y-sourceNode.y);


                    // create a interlink node and set its position in the middle;
                    var handler=that.parentWidget.getHandler();
                    var globalNode=handler.createGlobalNode(that);
                    console.log("GlobalNode?"+globalNode);
                    globalNode.setNodeType(that,that.selectedOverlayId,that.createNode(that,inputClasses));
                    handler.addGlobalNode(globalNode);
                    var repR=globalNode.filterInformation(that);
                    console.log("representer"+repR);
                    repR.setGlobalNodePtr(globalNode);
                    globalNode.setGlobalName(inputClasses[that.selectedOverlayId].name);

                    // var coordinatesRelativeToCanvasArea;
                    // coordinatesRelativeToCanvasArea=d3.mouse(this);
                    // var grPos=getScreenCoords(coordinatesRelativeToCanvasArea[0],coordinatesRelativeToCanvasArea[1],that.translation,that.zoomFactor);
                    // globalNode.setNodePos(that,grPos);
                    // var interLinkNode=that.createNode(that,inputClasses);
                    repR.setPosition(x,y);
                    // that.nodeElementArray.push(interLinkNode);
                    // force a redraw so the port elements of this node are generated
                    that.forceRedrawContent();
                    console.log("this things should be redrawns;'")
                    // figure out the interlink port candiates;
                    var IL_InPort;
                    var IL_OUTPort;

                    /** TODO: currently a vague assumption that there exist only on suitable port
                        (using types=NONE for disambiguation)
                    **/
                    var allInterlinkPorts=repR.getPortElements();
                    for (var q=0;q<allInterlinkPorts.length;q++){
                        var tempPort=allInterlinkPorts[q];
                        if (tempPort.getOutgoingConnectionType()==="NONE" && tempPort.getIncomingConnectionType()!=="NONE"){
                            // todo: check for validation of candidate
                            //found canditate
                            IL_InPort=tempPort;
                        }
                        if (tempPort.getOutgoingConnectionType()!=="NONE" && tempPort.getIncomingConnectionType()==="NONE"){
                            // todo: check for validation of candidate
                            //found canditate
                            IL_OUTPort=tempPort;
                        }
                    }
                    console.log("Found Candidates for connection");
                    if (IL_InPort===undefined || IL_OUTPort===undefined){
                        console.log("SOMETHING BAD HAS HAPPEND------------------------------------------------------" );
                    }else{
                        // Build up the connection

                        // todo: validate the connection of the interlink type if this is allow by the definition
                        // but for now this should be fine

                        // we need to create two links
                        // aLink means from source to interlink

                        globalLink=handler.createGlobalLink(that);
                        globalLink.setLinkGenerator(that,that.createLink(that));
                        handler.addGlobalLink(globalLink);
                        aLink=globalLink.filterInformation(that);
                        sourceNode=d.parentNode().getParentNode();
                        aLink.setGlobalLinkPtr(globalLink);
                        aLink.source(sourceNode);
                        aLink.target(repR);
                        aLink.addPortConnection(sourcePort,IL_InPort);
                        globalLink.setSource(sourceNode.getGlobalNodePtr());
                        globalLink.setTarget(repR.getGlobalNodePtr());



                        globalLink=handler.createGlobalLink(that);
                        globalLink.setLinkGenerator(that,that.createLink(that));
                        handler.addGlobalLink(globalLink);
                        var bLink=globalLink.filterInformation(that);


                        bLink.source(repR);
                        bLink.target(targetNode);
                        bLink.addPortConnection(IL_OUTPort,targetPort);
                        globalLink.setSource(repR.getGlobalNodePtr());
                        globalLink.setTarget(targetNode.getGlobalNodePtr());

                        // blink means form interlink to target node;

                        // update usage of the ports;
                        IL_InPort.isUsed(true);
                        IL_OUTPort.isUsed(true);
                        targetPort.isUsed(true);
                        d.parentNode().isUsed(true);
                    }
                    // force a redraw : updates the new links
                    that.forceRedrawContent();




                }else{
                    // crreate a somple link
                    sourceNode=d.parentNode().getParentNode();
                    targetNode=targetPort.getParentNode();

                    var handler=that.parentWidget.getHandler();
                    var globalLink=handler.createGlobalLink(that);
                    globalLink.setLinkGenerator(that,that.createLink(that));

                    var repR=globalLink.filterInformation(that);
                    repR.setGlobalLinkPtr(globalLink);
                    console.log("globalLink");
                    console.log(globalLink);
                    globalLink.setSource(sourceNode.getGlobalNodePtr());
                    globalLink.setTarget(targetNode.getGlobalNodePtr());


                    seenLink=repR.validateConnection(sourceNode,targetNode);
                    if (seenLink===false) {
                        repR.source(sourceNode);
                        repR.target(targetNode);
                        repR.addPortConnection(sourcePort,targetPort);
                        handler.addGlobalLink(globalLink);
                    }else{
                        console.log("found the link already");
                        seenLink.setMultiLinkType(true);
                        seenLink.addPortConnection(sourcePort,targetPort);
                    }
                    targetPort.isUsed(true);
                    d.parentNode().isUsed(true);
                    // force draw of link;
                    that.forceRedrawContent();
                }


            }


        }
    };

    this.forceRedrawContent=function(){
        that.clearRendering();
        that.redrawGraphContent();
    };

    this.getTargetPort=function(position) {
        // computes the nearest node center to the given position;
        // todo : use kd-tree for node positions and optimizations;
        // todo: do we really need this;
        var dx=position[0];
        var dy=position[1];
        var tN=undefined;
        var minDist=1000000000000;


        that.nodeElementArray.forEach(function (el){
            // compute distance;
            var cDist=Math.sqrt((el.x-dx)*(el.x-dx)+(el.y-dy)*(el.y-dy));
            if (cDist<minDist){
                minDist=cDist;
                tN=el;
            }
        });
        console.log("minDist="+minDist);
        if (minDist>80) return null;

        minDist=1000000000000000;
        // now you know the target node;
        var tP=undefined;
        tN.getPortElements().forEach(function (el){

            // compute distance;
            var cDist=Math.sqrt((el.x-dx)*(el.x-dx)+(el.y-dy)*(el.y-dy));
            if (cDist<minDist){
                minDist=cDist;
                tP=el;
            }
            console.log("targetPort is :"+tP);
        });

        console.log("found target Port");
        console.log(tP);
        console.log("------------------------------------");


        return tP;


    }



}

SimpleSFDGraph.prototype = Object.create(BaseGraph.prototype);
SimpleSFDGraph.prototype.constructor = SimpleSFDGraph;
