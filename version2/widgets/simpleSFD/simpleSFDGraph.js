
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


    // helper var;
    var mouseEntered=false;


    this.initializeGraph=function(){

        // modify to you needs
        this.specialLayer= this.svgElement.append("g");
        // console.log("a graph has"+this.nodeLayer);
        // console.log("a graph has"+this.pathLayer);
        // console.log("a graph has"+this.specialLayer);

        // setting the extent default(0.1,3)
        that.setZoomExtent(0.5,2);
        // det a double click event if needed
        //that.setDoubleClickEvent(that.dblClick);
    };

    this.createLink=function(parent){
        return new SimpleSFDLink(parent);
    };


    // overwrite the doublClick action
    this.dblClick=function() {
        // console.log("A Double Click "+d3.event);
        // console.log("BaseGraph does not implement this");
        // console.log("Debugging ");
      //  console.log("overwritten dblClick");
        that.deselectLastLink();
        that.deselectLastNode();
        var aNode = that.createNode(that, inputClasses);
        var grPos = getScreenCoords(d3.event.clientX, d3.event.clientY + that.verticalOffset, that.translation, that.zoomFactor);
        aNode.x = grPos.x;
        aNode.y = grPos.y;


        that.nodeElementArray.push(aNode);
        that.clearRendering();
        that.redrawGraphContent();

        aNode.editInitialText();
    };

    that.setDoubleClickEvent(this.dblClick);

    this.createNode=function(parent,nodeDescriptions){
        var exampleNode=new SimpleSFDNode(parent,nodeDescriptions);
        // if type is selected than we can generate typed nodes;
        // get who is selected;
        // TODO: make the selected overlayid class level to change id types at anymoment required.
        var selectedOverlayId=0;
        if (overlayNodes.length>0){
            for (var i=0;i<overlayNodes.length;i++){
                if (overlayNodes[i].getSelectionStatus()===true){
                    selectedOverlayId=i;
                    break;
                }
            }
        }
        exampleNode.setType(selectedOverlayId);
        return exampleNode;
    };

    this.changeNodeType=function(val){

      overlayNodes[0].setSelectionStatus(false);
      overlayNodes[1].setSelectionStatus(true);
      overlayNodes[2].setSelectionStatus(false);
    }

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
        var modelObj={};
        modelObj.nodes=[];
        var i,j;
        for (i=0;i<that.nodeElementArray.length;i++){
            var node=that.nodeElementArray[i];
            var obj={};
            obj.name=node.getNodeName();
            obj.parameters=[];
            // add parameters
            var nodeParameters=node.getParameterElements();
            for (j=0;j<nodeParameters.length;j++){
                obj.parameters.push(nodeParameters[j])

            }
            obj.identity=node.id();
            obj.interface=node.getInterfaceDescription();

            modelObj.nodes.push(obj);
        }
        console.log(JSON.stringify(modelObj, null, ''));
        return  JSON.stringify(modelObj, null, '  ');
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



    // testing sfd library load functions
    this.libraryLoaded=function(val){
        if (!arguments.length) return libraryLoaded;
        else libraryLoaded=val;

    };

    this.redrawHUD=function(){
        this.generateHUD();
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


    // owerwrite dragger release function;
    this.draggerElementReleaseFunction=function(d){

        that.draggerLayer.classed("hidden",true);
        // check he the node stoped
        that.draggingObject=false;
        var draggeEndPos=[that.draggerElement.x, that.draggerElement.y];
        var targetPort=that.getTargetPort(draggeEndPos);
        // console.log("dragger End pos"+draggeEndPos);
        if (targetPort && d.parentNode().getParentId()!==targetPort.getParentId()) {
            console.log("Target node name" + targetPort.getName());
            // create a link between these;
            if  (targetPort.isUsed()===false && d.parentNode().isUsed()===false) {
                var aLink = that.createLink(that);
                aLink.source(d.parentNode());
                aLink.target(targetPort);
                that.pathElementArray.push(aLink);
                that.forceRedrawContent();
                // one to one constraint;
                targetPort.isUsed(true);
                d.parentNode().isUsed(true);
            }
        }
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

        // now you know the target node;
        var tP=undefined;
        tN.getPortElements().forEach(function (el){
            // compute distance;
            var cDist=Math.sqrt((el.x-dx)*(el.x-dx)+(el.y-dy)*(el.y-dy));
            if (cDist<minDist){
                minDist=cDist;
                tP=el;
            }
        });

        console.log("found target Port");
        console.log(tP);
        console.log("------------------------------------");


        return tP;


    }



}

SimpleSFDGraph.prototype = Object.create(BaseGraph.prototype);
SimpleSFDGraph.prototype.constructor = SimpleSFDGraph;
