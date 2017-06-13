

function BaseGraph(parentWidget) {
    /** variable defs **/
    var that = this;
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

    this.horizontalOffset=-5;
    this.verticalOffset=-65;
    this.hasDoubleClickEvent=true;// TODO:  // default has no doublClick Event


    this.svgElementClassStyle="";
    this.pathLayer=undefined;
    this.nodeLayer=undefined;
    this.nodeElementArray=[];
    this.pathElementArray=[];
    this.draggerObjectsArray=[];
    this.draggerElement=undefined;
    this.draggingObject=false;

    this.setZoomExtent=function(min,max){
      this.minZoomFactor=min;
      this.maxZoomFactor=max;
      if (that.zoom){
          that.zoom.scaleExtent([that.minZoomFactor,that.maxZoomFactor])
      }
    };

    this.updateSvgSize=function(){
        var drawArea=this.parentWidget.getCanvasArea();
        var w = drawArea.node().getBoundingClientRect().width;
        var h= window.innerHeight + that.verticalOffset;
        console.log("size:"+w+" "+h );
        if (that.svgElement)
            that.svgElement.attr("width", w).attr("height", h);
    };

    this.activateGraph=function(val){
        console.log("A graph wants to be rendered "+ val);
        if (val===true)
            this.svgElement.classed("hidden",false);
        else
            this.svgElement.classed("hidden",true);
    };


    // needs to be called by the derived graph itself!
    this.initializeGraph=function(){
        // generatges the svg element and adds this to the drawArea;
        var drawArea=parentWidget.getCanvasArea();
        console.log("the draw area is "+drawArea);
        // todo: figure out why hight is not properly detected
        var w = drawArea.node().getBoundingClientRect().width;
        //var h= drawArea.node().getBoundingClientRect().height;
        var h= window.innerHeight - 80;
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

        // connect the mouse drag and zoom options

      //  that.redrawGraph();
        // that.redrawOverlay();
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

    this.addMouseEvents=function(){
        console.log("--------------Adding Mouse events--------------");
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
              return d;
            })
            .on("dragstart", function (d) {
                d3.event.sourceEvent.stopPropagation(); // Prevent panning
            })
            .on("drag", function (d) {
                d.x=d3.event.x;
                d.y=d3.event.y;
                if(d.type()==="Node") {
                    d.updateElement();
                    that.draggerElement.setParentNode(d);
                    that.draggerElement.updateElement();
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
                    that.draggerLayer.classed("hidden",true);
                    // check he the node stoped
                    that.draggingObject=false;
                    var draggeEndPos=[that.draggerElement.x, that.draggerElement.y];
                    var targetNode=getTargetNode(draggeEndPos);
                    // console.log("dragger End pos"+draggeEndPos);
                    if (targetNode) {
                        // console.log("Target node name" + targetNode.label);
                        // create a link between these;
                        var aLink=new BaseLink(that);
                        aLink.source(d.parentNode());
                        aLink.target(targetNode);
                        that.pathElementArray.push(aLink);
                        that.forceRedrawContent();
                    }

                }
                d3.event.sourceEvent.stopPropagation(); // Prevent panning

            })

    };

    function getTargetNode(position) {
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
        return tN;


    }

    this.setDoubleClickEvent=function(onDoubleClickFunction){
        that.hasDoubleClickEvent=true;
        that.svgElement.on("dblclick.zoom",onDoubleClickFunction);
    };


    this.createNode=function(parent){
        return new BaseNode(parent);
    };

    this.dblClick=function(){
        // console.log("A Double Click "+d3.event);
        // console.log("BaseGraph does not implement this");
        // console.log("Debugging ");

        var aNode=that.createNode(that);
        var grPos=getScreenCoords(d3.event.clientX,d3.event.clientY,that.translation,that.zoomFactor);
        aNode.x=grPos.x;
        aNode.y=grPos.y;


        that.nodeElementArray.push(aNode);
        that.clearRendering();
        that.redrawGraphContent();


    };

    this.zoomingFunction=function(){
        // todo add smooth zoom
        // console.log("zooming function called: "+that.zoomFactor);
        that.graphRenderingSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        that.zoomFactor=d3.event.scale;
        that.translation=d3.event.translate;
    };


    this.clearRendering=function(){
        // clear the graph
        that.graphRenderingSvg.selectAll('*').remove();
        
        that.draggerLayer=that.graphRenderingSvg.append('g');
        that.pathLayer=that.graphRenderingSvg.append('g');
        that.nodeLayer=that.graphRenderingSvg.append('g');        

        this.draggerElement=new BaseDragger(that);
        that.draggerElement.svgRoot(that.draggerLayer);
      //  that.draggerElement.drawNode();
        that.draggerLayer.classed("hidden",true);
        that.draggerObjectsArray.push(that.draggerElement);




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

    this.createDraggerElement=function(parentNode){
        // this should be cleared now;
        this.draggerElement.setParentNode(parentNode);
        this.draggerLayer.classed("hidden",false);

    };


    function getScreenCoords(x, y, translate, scale){
        var xn=(x+that.horizontalOffset -translate[0])/scale;
        var yn=(y+that.verticalOffset  - translate[1])/scale;
        return {x: xn, y: yn};
    }

}

BaseGraph.prototype.constructor = BaseGraph;
