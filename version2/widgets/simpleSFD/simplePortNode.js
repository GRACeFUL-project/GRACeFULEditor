function SimplePortNode(parent,portDesc) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
    var radius=10;
    var imageUrl=undefined;
    var hoverText="none";
    var name="none";
    var portTYPE="none";
    var mouseEntered;
    var assosiatedLinks=[];
    var portIsUsed=false;

    this.isUsed=function(val){
        if (!arguments.length) return portIsUsed;
        else portIsUsed=val;
    };
    this.id=function(){
        return 0;
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

    this.addLink=function(aLink){
        assosiatedLinks.push(aLink);
        console.log("adding a link to "+that.id());
    };

    this.getName=function(){
        return name;
    };

    function parseDescription(portdesc) {
        console.log("parsing port Description");
        imageUrl=portdesc.imgURL;
        hoverText=portdesc.hoverText;
        name=portdesc.name;
        portTYPE=portdesc.type;

        console.log("-----------------------------------");
        console.log("Port url :"+imageUrl);
        console.log("Port hoverText :"+hoverText);
        console.log("Port name :"+name);
        console.log("Port type :"+portTYPE);


        console.log("-----------------------------------");
        console.log("+++++++++++++++++++++++++++++++++++");




    }
    parseDescription(portDesc);

    this.drawPort=function(){
        svgRoot=parent.getPortSvgRoot().append('g');

            // just render the port in the center of the node
            // alignment will be done by the parent node;


            svgRoot.append("circle")
                .attr("style","fill:#fff;")
                .attr("r", radius);
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
        nodeRoot.append("title").text(hoverText);
        nodeRoot.on("click", onClicked);
    };

    function onClicked(){
        d3.event.stopPropagation();
        // set drager element to this
        parent.addPortDragger(that);



    }

    this.updateLinkElement=function(){
      for (var i=0;i<assosiatedLinks.length;i++){
          console.log("port Node updates link element");
          assosiatedLinks[i].updateElement();
      }
    };


    function onImageHover(){
        if (that.mouseEntered()) {
            return;
        }
        that.mouseEntered(true);
        svgRoot.select("circle").attr("style","fill:#0f0;")



    }

    function outImageHover(){
        that.mouseEntered(false);
        svgRoot.select("circle").attr("style","fill:#fff;")
    }


    this.setPosition=function(x,y){

        if (svgRoot) {
            svgRoot.attr("transform", "translate(" + x + "," + y + ")");
            this.x=parent.x+x;
            this.y=parent.y+y;
        }


    }

}
SimplePortNode.prototype.constructor = SimplePortNode;
