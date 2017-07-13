function SimpleSFDNode(graph,nodeDescriptions) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
    BaseNode.apply(this, arguments);
    var exampleTypeId = 0;
    var numTypes = 3;
    var defaultRadius=50;
    var typesArray = ["baseRoundNode", "exampleNodeA", "exampleNodeB"];
    var labelTags=["Undefined", "Example A", "Example B"]; // used for init name of the elements in the hud;
    var imageUrls=[];
    var portDescriptions=[];
    var portElements=[];
    var superDrawFunction = that.drawNode;
    var superClickFunction= that.onClicked;
    var m_nodeDescriptions=nodeDescriptions;

    var portSvgRoot=undefined;

    this.getPortSvgRoot=function(){
        return portSvgRoot;
    };

    this.getPortElements=function(){
        return portElements;
    }

    this.parseNodeDescriptions=function(){
        console.log("Parsing node descripions");
        console.log("found node types "+m_nodeDescriptions.length);
        labelTags=[];
        typesArray=[];
        for (var i=0;i<m_nodeDescriptions.length;i++){
            labelTags.push(m_nodeDescriptions[i].name);
            typesArray.push("baseRoundNode");
            imageUrls.push(m_nodeDescriptions[i].imgUrl);
            portDescriptions.push(m_nodeDescriptions[i].ports);
        }
    };


    this.getRadius=function(){
        return defaultRadius;
    };

    that.parseNodeDescriptions();



    this.getLabelTags=function(){
        return labelTags;
    };


    this.setAllTypes = function (types) {
        // types are array of css styles o
        numTypes = types.length;
        typesArray = types;
    };

    this.getTypeId = function () {
        return exampleTypeId;
    };


    this.setTypeId = function (val) {
        if (val < numTypes)
            exampleTypeId = val;
        else
            exampleTypeId = 0; // << fixing if wong numTypes;
    };

    this.setType=function(typeId) {

        that.setTypeId(typeId);
        that.label=labelTags[that.getTypeId()];
        that.nodeClass=typesArray[that.getTypeId()];
        if (that.nodeElement) {
            for (var i = 0; i < typesArray.length; i++) {
                console.log("disabling :" + typesArray[i]);
                that.nodeElement.classed(typesArray[i], false);
            }
            that.nodeElement.classed(that.nodeClass, true);
        }

        // hard coded sfd nodes have always ports;


    };

    this.drawNode=function(){
        that.nodeElement= that.rootNodeLayer.append('circle').attr("r", 50)
            .classed(that.nodeClass,true);

        // add hover text if you want
        if (that.hoverTextEnabled===true)
            that.rootNodeLayer.append('title').text(that.hoverText);

        // add title
        that.labelRenderingElement=  that.rootNodeLayer.append("text")
            .attr('y',-that.getRadius()-5)
            .attr('x',-0.5*that.getRadius())
            .attr("text-anchor","middle")
            .text(that.label)
            .style("cursor","default");


        // adding image
        console.log("adding image "+imageUrls[that.getTypeId()]);
        var imagePrimitive=that.rootNodeLayer.append("image")
            .attr('x',-that.getRadius())
            .attr('y',-that.getRadius())
            .attr('width', 2*that.getRadius())
            .attr('height', 2*that.getRadius())
            .attr("xlink:href",imageUrls[that.getTypeId()]);
        that.nodeElement.classed(that.nodeClass, true);



        that.drawPorts();

    };

    this.updateElement=function(){
        that.rootElement.attr("transform", "translate(" + that.x + "," + that.y + ")");

        for (var i=0;i<portElements.length;i++){

            var nV=angleToNormedVec(-45*i);
            var px=that.getRadius()*nV.x;
            var py=that.getRadius()*nV.y;
            portElements[i].setPosition(px,py);
        }

    };


    this.addPortFromDescription=function(portDesc, i){
        // create a new port()
        var nPort=new SimplePortNode(that,portDesc);

        var nV=angleToNormedVec(-45*i);
        var px=that.getRadius()*nV.x;
        var py=that.getRadius()*nV.y;
        console.log("port "+i+" -> new positoins "+px+"  "+py);
        if (that.getNodeObjectType()===that.OVERLAY_OBJECT_NODE)
            nPort.setPortTypeToOverlay();

        nPort.drawPort();
        nPort.setPosition(px,py);
        portElements.push(nPort)

    };


    function angleToNormedVec(angle){
        // angle given in degree , need rad for cos and sin
        var xn=Math.cos(angle*Math.PI/180);
        var yn=Math.sin(angle*Math.PI/180);
        return {x: xn, y: -yn}
    }

    function generatePortNodesOfType(index){

        // this node generates its own ports;
        var myPorts=portDescriptions[index];
        console.log("generating ports for node:"+that.label);
        console.log(myPorts);
        if (portElements.length===0 && myPorts.length!==0) {
            for (var i = 0; i < myPorts.length; i++) {
                that.addPortFromDescription(myPorts[i], i);
            }
        }
        else if (portElements.length>0){
            for (var i = 0; i < portElements.length; i++) {
                portElements[i].drawPort();
                var nV=angleToNormedVec(-45*i);
                var px=that.getRadius()*nV.x;
                var py=that.getRadius()*nV.y;
                portElements[i].setPosition(px,py);

            }

        }
    }

    var superUpdate=this.updateElement;
    this.updateElement=function(){
        superUpdate();
        for (var i=0;i<portElements.length;i++) {
            portElements[i].updateLinkElement();
        }
    };


    this.drawPorts=function(){
        portSvgRoot=that.rootNodeLayer.append('g');

        // where are the other ports?

        generatePortNodesOfType(that.getTypeId());
    };

    // owverwrite the onClick function
    this.onClicked=function(){
        superClickFunction();
        if (that.getNodeObjectType()===that.OVERLAY_OBJECT_NODE) {
            if (that.nodeIsFocused === true) {
                graph.focusThisOverlayNode(that);
            }
            else {
                graph.focusThisOverlayNode(undefined);
            }
        }
        if (that.getNodeObjectType()===that.GRAPH_OBJECT_NODE){
            // nothing to do // the super function should have done thisl
            // kill drager element
            graph.hideDraggerElement();
        }
    };
    // disable double click function
    this.executeUserDblClick=function(){
        // tell graph to ignore dblClick on nodes;
        d3.event.stopPropagation();
    };

    this.addPortDragger=function(port){
        graph.createDraggerElement(port);
    }




}

SimpleSFDNode.prototype = Object.create(BaseNode.prototype);
SimpleSFDNode.prototype.constructor = SimpleSFDNode;
