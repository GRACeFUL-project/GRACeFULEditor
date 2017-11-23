

function BaseGraph(parentWidget) {
    /** variable defs **/

    var transformAnimation=false;
    this.parentWidget=parentWidget; // tells the graph which widget it talks to

    this.zoom=undefined;
    this.dragBehaviour=undefined;
    this.svgElement=undefined;
    this.graphRenderingSvg=undefined;
    this.overlayRenderingSvg=undefined;
    this.zoomFactor=1.0;
    this.translation=[0,0];
    this.minZoomFactor=0.1;
    this.maxZoomFactor=3;
    this.last_touch_time;


    this.prevSelectedNode=undefined;
    this.prevSelectedLink=undefined;

    this.horizontalOffset=-5;
    this.verticalOffset=-45;
    this.hasDoubleClickEvent=true;// TODO:  // default has no doublClick Event


    this.svgElementClassStyle="";
    this.pathLayer=undefined;
    this.nodeLayer=undefined;
    this.nodeElementArray=[];
    this.pathElementArray=[];
    this.draggerObjectsArray=[];
    this.draggerElement=undefined;
    this.draggingObject=false;

    this.needUpdateRedraw=false;
    this.multipleNodes = [];
    this.idInNumber = 0;
    this.originalD3_touchZoomFunction=undefined;

    var that = this;
    // some state of graph functionality
    this.needsRedraw=function(val){
        if (!arguments.length) return that.needUpdateRedraw;
        else that.needUpdateRedraw=val;
    };


    this.setZoomExtent=function(min,max){
      this.minZoomFactor=min;
      this.maxZoomFactor=max;
      if (that.zoom){
          that.zoom.scaleExtent([that.minZoomFactor,that.maxZoomFactor])
      }
    };

    this.requestSaveDataAsJson=function(){
      // THIS SHOULD BE OVERWRITTEN BY ALL GRAPHS!
        var retObj={};
        retObj.type="baseWidget";
        retObj.nodes=[];

        for (var i=0;i<that.nodeElementArray.length;i++){
            var node=that.nodeElementArray[i];
            var obj={};
            obj.id=node.id();
            obj.name="baseNode"+i;
            obj.pos=[node.x,node.y];
            retObj.nodes.push(obj);
        }


        return  JSON.stringify(retObj, null, '  ');

    };

    this.emptyGraphStructure=function(){
        this.nodeElementArray=[];
        this.pathElementArray=[];

        // do we kill the whole model? sure!

        that.parentWidget.getHandler().emptyGraphStructure();

    };

    this.updateSvgSize=function(){
        var drawArea=this.parentWidget.getCanvasArea();
        var w = drawArea.node().getBoundingClientRect().width;
        var h= window.innerHeight ;
        if (that.svgElement)
            that.svgElement.attr("width", w).attr("height", h);


    };

    this.activateGraph=function(val){
        if (val===true){
            this.svgElement.classed("hidden",false);
            console.log("A tab was Activated");
            that.forceRedrawContent();
            console.log("Forcing Redrawing of this graph!");

            if (that.parentWidget.redeliverResultToWidget)
                that.parentWidget.redeliverResultToWidget();
        }
        else
            this.svgElement.classed("hidden",true);
    };


    this.simulateClickOnGraph=function(){
        console.log("simulating click");
      // todo : fix the operation when we are in an edit state of a node text, so we cant drag other nodes or
      // todo : at least their position is than at the proper position

    };
    // needs to be called by the derived graph itself!
    this.initializeGraph=function(){
        // generatges the svg element and adds this to the drawArea;
        var drawArea=parentWidget.getCanvasArea();
        // console.log("the draw area is "+drawArea);
        // todo: figure out why hight is not properly detected
        var w = drawArea.node().getBoundingClientRect().width;
        //var h= drawArea.node().getBoundingClientRect().height;
        var h= window.innerHeight ;
        this.svgElement= parentWidget.getCanvasArea().append("svg")

            .attr("width", w)
            .attr("height", h);
        // classing the graph is a particular graph thing so we dont do this here
        // per default hidden
        that.svgElement.classed("hidden",true);

        // layer generations;

        // generate the graph rendering layer
        this.graphRenderingSvg=that.svgElement.append('g');

        // currently not used but remains here if we want to add tools and huds
        this.overlayRenderingSvg=that.svgElement.append('g');

        // svg nodes and edges
        this.draggerLayer = that.graphRenderingSvg.append("g");
        this.pathLayer    = that.graphRenderingSvg.append("g");
        this.nodeLayer    = that.graphRenderingSvg.append("g");


        // add the dragger element



        that.addMouseEvents();

    };

    this.getTranslation=function(){
        return that.translation;
    };
    this.getZoomFactor=function(){
        return that.zoomFactor;
    };

    this.getDragBehavoir=function(){
        return that.dragBehaviour;
    };
    this.getD3Object=function(){
        return d3.behavior;
    };

    // hacking:
    this.forceNotZooming=false;

    this.touchzoomed=function(){
        if (that.originalD3_touchZoomFunction)
            that.originalD3_touchZoomFunction();
        else return;
        that.forceNotZooming=true;
        if (d3.event === null ) return;
        var touch_time = d3.event.timeStamp;

        if (touch_time-that.last_touch_time < 500 && d3.event.touches.length===1) {
            d3.event.stopPropagation();
                d3.event.preventDefault();
                that.zoom.translate(that.translation);
                that.zoom.scale(that.zoomFactor);
                that.dblClick("asTouch versiono");
            return;
        }

        that.forceNotZooming=false;
        that.last_touch_time = touch_time;
        if (that.originalD3_touchZoomFunction)
            that.originalD3_touchZoomFunction();
    };


    this.addMouseEvents=function(){
        // console.log("--------------Adding Mouse events--------------");
        this.zoom = d3.behavior.zoom()
            .duration(150)
            .scaleExtent([that.minZoomFactor,that.maxZoomFactor])
            .on("zoom", that.zoomingFunction)
            .on("zoomstart", function(){
                d3.select('#canvasArea').style("cursor", "move");
            })
            .on("zoomend", function(){
                d3.select('#canvasArea').style("cursor", "auto");
            });
        that.svgElement.call(that.zoom);
        // add double click function;
        if (that.hasDoubleClickEvent===true)
            that.svgElement.on("dblclick.zoom",that.dblClick);


        // add node drag behavior
        this.dragBehaviour = d3.behavior.drag()
            .origin(function (d) {

              //  console.log("origin"+d.x+"  "+d.y);
                return d;

            })
            .on("dragstart", function (d) {
                d3.event.sourceEvent.stopPropagation(); // Prevent panning
            })
            .on("drag", function (d) {
                // console.log(" prevented by drag?"+d3.event.sourceEvent.defaultPrevented);
                var oldX=d.x;
                var oldY=d.y;
                d.x=d3.event.x;
                d.y=d3.event.y;
                if(d.type()==="Node") {
                    d.updateElement(oldX-d.x,oldY-d.y);
                    if (d.getSelectionStatus()===true) {
                        that.draggerElement.setParentNode(d);
                        that.draggerElement.updateElement();
                    }
                }
                if(d.type()==="Dragger") {
                    that.draggingObject=true;
                    that.draggerElement.x=d3.event.x;
                    that.draggerElement.y=d3.event.y;
                    that.draggerElement.updateElement();
                }

                d3.event.sourceEvent.stopPropagation(); // Prevent panning
            })
            .on("dragend", function (d) {
                // kill the dragger element on end
                if (d.type()==="Dragger"){
                    that.draggerElementReleaseFunction(d);
                }
                d3.event.sourceEvent.stopPropagation(); // Prevent panning
              //  console.log("dragger ended");
            })

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

            // crreate a global links
            var handler=that.parentWidget.getHandler();
            var globalLink=handler.createGlobalLink(that);

            console.log("global LInk obj");
            console.log(globalLink);

            globalLink.setLinkGenerator(that,that.createLink(that));
            handler.addGlobalLink(globalLink);
            var repR=globalLink.filterInformation(that);
            repR.setGlobalLinkPtr(globalLink);

            var srcRen=d.parentNode();
            var tarRen=targetNode;

            repR.source(srcRen);
            repR.target(tarRen);

            globalLink.setSource(srcRen.getGlobalNodePtr());
            globalLink.setTarget(tarRen.getGlobalNodePtr());


            // add the global pointers for the connection;




            that.forceRedrawContent();
        }
    };

    this.getTargetNode=function(position) {
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
   //     console.log("minDist="+minDist);
        if (minDist>80) return null;
        return tN;


    };

    this.setDoubleClickEvent=function(onDoubleClickFunction){
        that.hasDoubleClickEvent=true;
        that.svgElement.on("dblclick.zoom",onDoubleClickFunction);
    };


    this.createNode=function(parent){
        return new BaseNode(parent);
    };


    this.createLink=function(parent){
        return new BaseLink(parent);
    };



    this.dblClick=function(asTouch){
         // console.log("A Double Click "+d3.event);
         // console.log("BaseGraph does not implement this");
         // console.log("Debugging ");

        concole.log("This is a double TAB from Touch?"+asTouch);
        that.deselectLastLink();
        that.deselectLastNode();
        var coordinatesRelativeToCanvasArea= [0,0];
        coordinatesRelativeToCanvasArea=d3.mouse(this);
        var aNode=that.createNode(that);
        var grPos=getScreenCoords(coordinatesRelativeToCanvasArea[0],coordinatesRelativeToCanvasArea[1],that.translation,that.zoomFactor);
        aNode.x=grPos.x;
        aNode.y=grPos.y;


        that.nodeElementArray.push(aNode);
        that.clearRendering();
        that.redrawGraphContent();

        aNode.editInitialText();


    };

    this.zoomingFunction=function(){
        // todo add smooth zoom
        // console.log("zooming function called: "+that.zoomFactor);
        // that.graphRenderingSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        // that.zoomFactor=d3.event.scale;
        // that.translation=d3.event.translate;

        var zoomEventByMWheel=false;
        if (d3.event.sourceEvent) {
            if (d3.event.sourceEvent.deltaY)
                zoomEventByMWheel=true;
        }

        if (zoomEventByMWheel===false){
            if (transformAnimation===true){
                return;
            }
            that.zoomFactor = d3.event.scale;
            that.translation= d3.event.translate;
            that.graphRenderingSvg.attr("transform", "translate(" + that.translation+ ")scale(" + that.zoomFactor + ")");

            return;
        }

        /** animate the transition **/
        that.zoomFactor = d3.event.scale;
        that.translation= d3.event.translate;
        that.graphRenderingSvg.transition()
            .tween("attr.translate", function () {
                return function (t) {
                    transformAnimation=true;
                    var tr = d3.transform( that.graphRenderingSvg.attr("transform"));
                    that.translation[0] = tr.translate[0];
                    that.translation[1] = tr.translate[1];
                    that.zoomFactor=tr.scale[0];

                };
            })
            .each("end", function(){transformAnimation=false;})
            .attr("transform", "translate(" + that.translation + ")scale(" + that.zoomFactor + ")")
            .ease('linear')
            .duration(250);

    };


    this.clearRendering=function(){
        // clear the graph
        that.graphRenderingSvg.selectAll('*').remove();

        that.draggerLayer=that.graphRenderingSvg.append('g');
        that.pathLayer=that.graphRenderingSvg.append('g');
        that.nodeLayer=that.graphRenderingSvg.append('g');

        that.draggerElement=that.createDraggerItem(that);
        that.draggerElement.svgRoot(that.draggerLayer);
        that.draggerLayer.classed("hidden",true);
        that.draggerObjectsArray.push(that.draggerElement);

        this.originalD3_touchZoomFunction=that.svgElement.on("touchstart");

        that.nodeLayer.on("touchstart",that.touchzoomed());
    };

    this.createDraggerItem=function(parent){
        return new BaseDragger(parent);
    };

    this.clearOverlayRendering=function(){
        // console.log("BaseGraph does not implement this");
    };


    this.graphStyle=function(cssStyle){

        if (!arguments.length)
            return that.svgElementClassStyle; // this is a string
        else {
            that.svgElementClassStyle = cssStyle;
            that.svgElement.classed(cssStyle,true);
        }
    };

    // now add some node functionallity

    this.forceRedrawContent=function(){
        that.clearRendering();
        that.redrawGraphContent();
    };



    this.redrawGraphContent=function(){
        var gHandler=gHandlerObj;
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
            node.drawElement(0,0);
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
        this.originalD3_touchZoomFunction=that.svgElement.on("touchstart");

    };

    this.createDraggerElement=function(parentNode){
        // this should be cleared now;
        console.log("parent node calls createor of drager element");
        this.draggerElement.setParentNode(parentNode);
        this.draggerLayer.classed("hidden",false);
        this.draggerElement.setAdditionalClassForDragger("draggerNode",false);
    };

    // this is for node dragger
    this.createDraggerElementNode=function(parentNode){
        // this should be cleared now;
        //  console.log("parent node calls createor of drager element");
        this.draggerElement.setParentNode(parentNode);
        this.draggerLayer.classed("hidden",false);
        this.draggerElement.setAdditionalClassForDragger("draggerNode",true);


    };

    this.hideDraggerElement=function(){
        this.draggerLayer.classed("hidden",true);
    };


    function getScreenCoords(x, y, translate, scale){
        var xn=(x - translate[0])/scale;
        var yn=(y - translate[1])/scale;
        return {x: xn, y: yn};
    }

    this.deselectLastNode=function(){
        if (that.prevSelectedNode!=undefined){
            that.prevSelectedNode.setSelectionStatus(false);
            parentWidget.handleSelection(undefined);
            that.prevSelectedNode=undefined;

        }
    };
    this.deselectLastLink=function(){
        if (that.prevSelectedLink!=undefined){
            that.prevSelectedLink.setSelectionStatus(false);
            parentWidget.handleSelection(undefined);
            that.prevSelectedLink=undefined;
        }
    };

    this.selectNodeForOptions=function(node){


            parentWidget.handleSelectionForOptions(node);

    };

    // node and other element selections
    this.selectNode=function(node){
        // graph handles node selection
      //  that.deselectLastLink();
      //    console.log("handling selection stuff"+node);
      //   console.log("*-----------*");
      //   console.log(node)
      //   console.log(typeof  node)
      //   console.log("*-----------*");
      //
      //   if (node && node.hasSubClass){
      //       var subClasses=node.getSubClasses();
      //       console.log("subClasses");
      //       console.log(subClasses);
      //       console.log("----------------");
      //   }

        if (node===undefined){

            that.prevSelectedNode=undefined;
            parentWidget.handleSelection(undefined);
            return;
        }
        // tell control widget that this node is selected
        if (that.prevSelectedNode===undefined){

            parentWidget.handleSelection(node);
            that.prevSelectedNode=node;
            return;
        }

        if (that.prevSelectedNode===node){
            parentWidget.handleSelection(undefined);
            that.prevSelectedNode=undefined;
        }
        else{
            that.prevSelectedNode.setSelectionStatus(false);
            that.prevSelectedNode=node;
            parentWidget.handleSelection(node);
        }

    };

    this.selectMultiples = function(node) {
        that.deselectLastLink();
        var isPresent = false;

        if(that.multipleNodes.length === 0) {
            console.log("previous node: "+that.prevSelectedNode.id());
            that.prevSelectedNode.nodeElement.classed("focused", false);
            parentWidget.handleSelection(undefined);
            that.prevSelectedNode=undefined;
        }

        for(var i=0; i<that.multipleNodes.length; i++) {
            if(node.id() === that.multipleNodes[i].id())
                isPresent = true;
        }

        if(!isPresent) {
            console.log("Pushing node id: "+node.id());
            that.multipleNodes.push(node);
            node.nodeElement.classed("focused", true);
        }
        else {
            that.multipleNodes.splice(that.multipleNodes.indexOf(node), 1);
            console.log("Popping node: "+node.id());
            node.nodeElement.classed("focused", false);
        }

        console.log("Total no of nodes are: "+that.multipleNodes.length);
    };

    this.handleNodeDeletion = function(node) {
        // console.log("node deleting button. Selected node is: "+node.nodeId);

        // get the global Node pointer and let the handler perform this option;

        var handler=that.parentWidget.getHandler();
        handler.deleteNodeAndLinks(node);



        that.forceRedrawContent();
        that.removeDeletedElements();
    };

    this.handleLinkDeletion = function(link) {
        // console.log("link deleting button. Selected link is: "+link.id());
        // let the handler do that;
        var handler=that.parentWidget.getHandler();
        handler.deleteGlobalLink(link);
        that.forceRedrawContent();
        that.removeDeletedElements();
    };

    this.removeDeletedElements = function() {
        that.nodeLayer.selectAll(".node")
            .data(that.nodeElementArray)
            .exit()
            .remove();
        that.pathLayer.selectAll(".path")
            .data(that.pathElementArray)
            .exit()
            .remove();
    };

    that.handleLinkSelection=function(link){
        // deselect the selected node
        that.deselectLastNode();
        // console.log("handling selection stuff");
        if (link===undefined){
            that.prevSelectcedLink=undefined;
            parentWidget.handleSelection(undefined);
            return;
        }
        // tell control widget that this node is selected
        if (that.prevSelectedLink===undefined){

            parentWidget.handleSelection(link);
            that.prevSelectedLink=link;
            return;
        }

        if (that.prevSelectedLink===link){

            // do an deselect
            parentWidget.handleSelection(undefined);
            that.prevSelectedLink=undefined;
        }
        else{

            that.prevSelectedLink.setSelectionStatus(false);
            that.prevSelectedLink=link;
            parentWidget.handleSelection(link);
        }
        parentWidget.handleSelection(link);

    };


}

BaseGraph.prototype.constructor = BaseGraph;
