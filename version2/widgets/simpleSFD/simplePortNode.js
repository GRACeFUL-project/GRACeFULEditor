function SimplePortNode(parent,portDesc) {

    /** CONSTANTS def **/
    // connection types;
    var NONE      = "NONE",
        SINGLE    = "SINGLE",
        MULTI     = "MULTIPLE",
        ARBITRARY = "ARBITRARY";


    /** variable defs **/
    var that = this;
    var portDragActionStart=false;
    var radius=10;
    var imageUrl=undefined;
    var hoverText="none";
    var name="none";
    var portTYPE="none";
    var mouseEntered;
    var assosiatedLinks=[];
    var portIsUsed=false;
    var portIdInNode=0;

    var dragRoot=undefined;
    var value=0;
    var rotationEnabled=true;
    // default one to one mapping using undefined as not defined type
    var providedPortConnectionType=false;
    var incomingConnectionTYPE=SINGLE;
    var outgoingConnectionTYPE=SINGLE;
    var valueSetFromOutside=false;
    var parentNode=parent;
    var elementType="PortDragger";
    this.type=function(){return elementType;};


    this.getElementType=function(){
        return elementType
    };


    this.getProvidedPortConnectionTypes=function(){
        return providedPortConnectionType;
    };

    this.getOutgoingConnectionType=function(){
        return outgoingConnectionTYPE;
    };

    this.getIncomingConnectionType=function(){
        return incomingConnectionTYPE;
    };

    this.getParentNode=function(){
        return parentNode;
    };

    this.getPortName=function(){
        return name;
    };
    this.getPortType=function(){
        return portTYPE;
    };
    this.getPortValue=function(){
        return value;
    };
    this.setPortValue=function(val){
        value=val;
        valueSetFromOutside=true;
        // update circle color
        svgRoot.select("circle").attr("style","fill:#fff; stroke: #000; stroke-width:3");
    };
    this.resetPortValue=function(){
        value=0;
        valueSetFromOutside=false;
        svgRoot.select("circle").attr("style","fill:#fff;");
    };

    this.isUsed=function(val){
        if (!arguments.length) return portIsUsed;
        else portIsUsed=val;
    };

    this.id=function(val){
        if (!arguments.length) return portIdInNode;
        else portIdInNode=val;

    };

    this.getParentId=function(){
      return parent.id();
    };

    var svgRoot=undefined;
    this.GRAPH_OBJECT_NODE="GraphObjectNode";
    this.OVERLAY_OBJECT_NODE="OverlayNode";
    this.portObjectType=that.GRAPH_OBJECT_NODE;
    this.setPortTypeToOverlay=function(){
        this.portObjectType=that.OVERLAY_OBJECT_NODE;
    };
    function getPortObjectType(){
        return that.portObjectType;
    }

    this.addPortLinks=function(source,target){
        var portLink={src:source,tar:target};
        assosiatedLinks.push(portLink);
    };

    this.getName=function(){
        return name;
    };

    function parseDescription(portdesc) {
       // console.log("parsing port Description");
      //  console.log(portdesc);
        imageUrl=portdesc.imgURL;
        hoverText=portdesc.hoverText;
        if ( portdesc.hoverText===undefined) {
            hoverText=portdesc.description;
        }
        if (portdesc.rotation!==undefined){
            if (portdesc.rotation===true || portdesc.rotation==="true" ) {
                rotationEnabled = true;
            }else {
                rotationEnabled =false;
            }
        }

        // get the incoming outgoing connection types;
        if (portdesc.outgoingType) {
            providedPortConnectionType=true;
            outgoingConnectionTYPE = portdesc.outgoingType;
        }
        if (portdesc.incomingType){
            providedPortConnectionType=true;
            incomingConnectionTYPE=portdesc.incomingType;
        }


        name=portdesc.name;
        portTYPE=portdesc.type;

        // console.log("-----------------------------------");
        // console.log("Port url :"+imageUrl);
        // console.log("Port hoverText :"+hoverText);
        // console.log("Port name :"+name);
        // console.log("Port type :"+portTYPE);
        //
        //
        // console.log("-----------------------------------");
        // console.log("+++++++++++++++++++++++++++++++++++");
    }
    parseDescription(portDesc);

    this.getParentPortName=function(){
        // we only have one to one connections for now
        var linkObj=assosiatedLinks[0];
        if (linkObj.tar===that) return undefined;
        return linkObj.tar.getName();
    };

    this.getParentConnectorId=function(){
        var linkObj=assosiatedLinks[0];
        return linkObj.tar.getParentId();
    };

    this.getConnectionAndDescriptionOfPort=function(){
        var portObj={};
        portObj.name=name;
        portObj.type=portTYPE;
        if (portIsUsed===true){
            // add the connection;
            var pId=that.getParentConnectorId();
            var parentPortName=that.getParentPortName();
            if (parentPortName) {
                portObj.connection = [];
                portObj.connection.push(pId);
                portObj.connection.push(parentPortName);
                portObj.connection.push(null);

            }
        }
        return portObj;

    };
    this.drawDragElement=function(){
        dragRoot=parent.getPortSvgRoot().append('g');

        // just render the port in the center of the node
        // alignment will be done by the parent node;
        var circ=dragRoot.append("circle");
        circ.attr("r", radius);
        if (valueSetFromOutside===true)
            circ.attr("style","fill:#fff; stroke: #000; stroke-width:3");
        else
            circ.attr("style","fill:#fff;");

        // console.log("Adding Image"+ portObj.imageURL());
        dragRoot.append("image")
            .attr('x', -radius)
            .attr('y', -radius)
            .attr('width', 2 * radius)
            .attr('height', 2 * radius)
            .attr("xlink:href", imageUrl);

    };

    this.updateDragElement=function(x,y){
        if (dragRoot) {
            var px=x-parent.x+50;
            var py=y-parent.y;
            // currently allow to rotate the port in the vis;
         //   console.log("is Rotation Enabeld :  "+rotationEnabled);
            if (rotationEnabled===true) {
                var angle=Math.atan2(py,px)* (180 / Math.PI);
                var image=dragRoot.select("image");

                image.attr("transform", "rotate("+angle+")");
                dragRoot.attr("transform", "translate(" + px + "," + py + ")");
            }
            else
                dragRoot.attr("transform", "translate(" + px + "," + py + ")");
        }
        // update the position of the portElement and draw a link;
        if (svgRoot){
            // todo: remove hard coded radii of parent elements;
            var dx=x-parent.x+50;
            var dy=y-parent.y;
            // get normalized direction;
            var len=Math.sqrt(dx*dx+dy*dy);
            var nx=dx/len;
            var ny=dy/len;
            if (rotationEnabled===true) {
                var portAngle = Math.atan2(ny, nx) * (180 / Math.PI);
                var portImage = svgRoot.select("image");
                portImage.attr("transform", "rotate(" + portAngle + ")");
                var ppx = 50 * nx;
                var ppy = 50 * ny;
                svgRoot.attr("transform", "translate(" + ppx + "," + ppy + ")");
            }
        }

    };

    this.drawPort=function(){
        svgRoot=parent.getPortSvgRoot().append('g');

            // just render the port in the center of the node
            // alignment will be done by the parent node;
            var circ=svgRoot.append("circle");
            circ.attr("r", radius);
            if (valueSetFromOutside===true)
                circ.attr("style","fill:#fff; stroke: #000; stroke-width:3");
            else
                circ.attr("style","fill:#fff;");

            // console.log("Adding Image"+ portObj.imageURL());
            svgRoot.append("image")
                    .attr('x', -radius)
                    .attr('y', -radius)
                    .attr('width', 2 * radius)
                    .attr('height', 2 * radius)
                    .attr("xlink:href", imageUrl);

        if (getPortObjectType()===that.GRAPH_OBJECT_NODE){
            // add dragger and mouse actions to this elements;
            that.addMouseEvents();

        }

    };

    this.mouseEntered=function(p){
        if (!arguments.length) return mouseEntered;
        mouseEntered = p;
        return this;
    };
    this.addMouseEvents=function(){

        var nodeRoot=svgRoot.select("image");

        nodeRoot.on("mouseover", function () {onImageHover() ;});
        nodeRoot.on("mouseout" , function () {outImageHover();});
  //      console.log("adding hover Text"+hoverText);
        nodeRoot.append("title").text(hoverText);
        nodeRoot.on("click", onClicked);
        // try simple drag behav

        // console.log("adding drag Behaviour");
        // var mD3=parentNode.getGraphObject().getD3Object();
        // console.log(mD3);
        //
        // portDragBehaviour=mD3.drag()
        //     .origin(function (d) {
        //         //  console.log("origin"+d.x+"  "+d.y);
        //         return d;
        //
        //     })
        //     .on("dragstart", function (d) {
        //         console.log("this is port draggerStart");
        //         portDragActionStart=true;
        //         that.drawDragElement();
        //         // init drag elements position;
        //         var image=svgRoot.select("image");
        //         var imgAngle=image.attr("transform");
        //         var portPos=svgRoot.attr("transform");
        //         dragRoot.attr("transform",portPos);
        //
        //
        //         d3.event.sourceEvent.stopPropagation(); // Prevent panning
        //
        //     })
        //     .on("drag", function (d) {
        //         // console.log(" prevented by drag?"+d3.event.sourceEvent.defaultPrevented);
        //         // var oldX=d.x;
        //         // var oldY=d.y;
        //         // d.x=d3.event.x;
        //         // d.y=d3.event.y;
        //         console.log("port drag call");
        //         that.updateDragElement(d3.event.x,d3.event.y);
        //
        //
        //         d3.event.sourceEvent.stopPropagation(); // Prevent panning
        //     })
        //     .on("dragend", function (d) {
        //         // kill the dragger element on end
        //         portDragActionStart=false;
        //         outImageHover();
        //         d3.event.sourceEvent.stopPropagation(); // Prevent panning
        //
        //
        //     });
        // svgRoot.call(portDragBehaviour);

        // svgRoot.on("dragstart",function(){onPortDragStart();});
        // svgRoot.on("dragend"  ,function(){onPortDragEnd()  ;});
        // svgRoot.on("drag"     ,function(){onPortDrag()     ;});
    };

    function onPortDragStart(){
        console.log("port starts to drag");
        parentNode.getGraphObject().ignoreEvents();

        console.log("stoppend drag propagation");

    }
    function onPortDrag(){
        console.log("port drags");
        svgRoot.classed("hidden",true);

    }

    function onPortDragEnd(){
        console.log("port end to drag");
        svgRoot.classed("hidden",false);
        parentNode.getGraphObject().ignoreEvents();

    }


    function onClicked(){
        d3.event.stopPropagation();
        // set drager element to this
        parent.addPortDragger(that);



    }

    function onImageHover(){
        if (that.mouseEntered()) {
            return;
        }
        that.mouseEntered(true);
        if (valueSetFromOutside===false)
            svgRoot.select("circle").attr("style","fill:#0f0;");
        else
            svgRoot.select("circle").attr("style","fill:#0f0; stroke: #000; stroke-width:3");


    }

    function outImageHover(){
        if (portDragActionStart===true) {
            console.log("this shoud end here");
            parentNode.onMouseOver()
            return; // ignore the out hover when we are an portDargAction;
        }
        that.mouseEntered(false);
        if (valueSetFromOutside===false)
            svgRoot.select("circle").attr("style","fill:#fff;");
        else
            svgRoot.select("circle").attr("style","fill:#fff; stroke: #000; stroke-width:3");
    }
    this.setLinkPosition=function(x,y){
        if (svgRoot) {
            var px=x-parent.x;
            var py=y-parent.y;
            // currently allow to rotate the port in the vis;

            if (rotationEnabled===true) {
                var angle=Math.atan2(py,px)* (180 / Math.PI);
                var image=svgRoot.select("image");

                image.attr("transform", "rotate("+angle+")");
                svgRoot.attr("transform", "translate(" + px + "," + py + ")");
            }
            else
                svgRoot.attr("transform", "translate(" + px + "," + py + ")");
        }
    };

    this.setPosition=function(x,y){
        if (svgRoot) {
            svgRoot.attr("transform", "translate(" + x + "," + y + ")");
            this.x=parent.x+x;
            this.y=parent.y+y;
        }
    }

}
SimplePortNode.prototype.constructor = SimplePortNode;
