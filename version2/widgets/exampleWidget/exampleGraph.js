
function ExampleGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    // call the baseGraph init function
    that.initializeGraph();
    var hudEnabled=false;
    var hudGenerated=false;


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
        return new ExampleLink(parent);
    };

    this.createNode=function(parent){
        var exampleNode=new ExampleNode(parent);
        // if type is selected than we can generate typed nodes;
        // get who is selected;
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
            obj.nodeIdType="none";
            obj.pos=[node.x,node.y];
            retObj.nodes.push(obj);
        }

        for (i=0;i<that.pathElementArray.length;i++){
            var link =that.pathElementArray[i];
            var linkObj={};
            linkObj.id=link.id();
            linkObj.source_target=[link.sourceNode.id(),link.targetNode.id()];
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


        console.log("Graph should add now a node with : " );
        console.log("   Name : "+nodeName );
        console.log("   Id   : "+nodeId);
        console.log("   Pos  : "+nodePos);

        var newNode=that.createNode(that);
        // todo: check how to handle the data;
        newNode.id(nodeId);
        newNode.setLabelText(nodeName);
        var x=parseFloat(nodePos[0]);
        var y=parseFloat(nodePos[1]);
        newNode.setPosition(x,y);
        // push to array of nodes
        console.log("newNode  "+newNode);
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
        console.log("Generate HUD if needed");
        if (hudGenerated===false){
            this.generateHUD();
        }
    };


    this.clearOverlayRendering=function(){
        console.log("clearing the overlay rendering");
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

        var tempNode=that.createNode(that);
        // this node tells me what things we have;
        var labelTags=tempNode.getLabelTags();

        // create a node;
        for (var i=0;i<labelTags.length;i++){
            var lNode=that.createNode(that);
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

    this.generateHUD=function(){
        console.log("generating hud");
        hudGenerated=true;

        console.log("Do we have an overlay thingy?"+that.overlayRenderingSvg);
        // yes;

        // clear it
        that.clearOverlayRendering();
        that.createOverlayArea();
        that.createOverlayNodes();
        that.createOverlayLinks();
        that.redrawOverlayContent();
        that.focusThisOverlayNode(undefined);

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
        console.log("redrawing overlay Area");
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





}

ExampleGraph.prototype = Object.create(BaseGraph.prototype);
ExampleGraph.prototype.constructor = ExampleGraph;
