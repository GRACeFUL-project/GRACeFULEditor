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
    var parametersDescriptions=[];
    var parameterElements=[];
    var portElements=[];
    var nodeName="noName";
    var assosiatedLinks=[];
    var superDrawFunction = that.drawNode;
    var superClickFunction= that.onClicked;
    var m_nodeDescriptions=nodeDescriptions;

    var portSvgRoot=undefined;

    this.getPortSvgRoot=function(){
        return portSvgRoot;
    };

    this.getPortElements=function(){
        return portElements;
    };

    this.parseNodeDescriptions=function(){
        // console.log("Parsing node descripions");
        // console.log("found node types "+m_nodeDescriptions.length);
        labelTags=[];
        typesArray=[];
        for (var i=0;i<m_nodeDescriptions.length;i++){
            labelTags.push(m_nodeDescriptions[i].name);
            typesArray.push("baseRoundNode");
            imageUrls.push(m_nodeDescriptions[i].imgUrl);
            portDescriptions.push(m_nodeDescriptions[i].ports);
            console.log(m_nodeDescriptions[i]);
            parametersDescriptions.push(m_nodeDescriptions[i].params);
            numTypes++; // increase if number of node types has increased
        }
    };

    this.getInterfaceDescription=function(){
        // check for the connections;
        var the_ports=[];
        for (var i=0;i<portElements.length;i++){
            var anPort=portElements[i].getConnectionAndDescriptionOfPort();
            the_ports.push(anPort)
        }
        return the_ports;
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


    this.getImageURL=function(){
        return imageUrls[that.getTypeId()];
    };


    this.getNodeName=function(){
        return nodeName
    };


    this.setTypeId = function (val) {
        if (val < numTypes)
            exampleTypeId = val;
        else
            exampleTypeId = 0; // << fixing if wong numTypes;
    };

    function createParameterObjects(){
      console.log(parametersDescriptions);
        var parDesc=parametersDescriptions[that.getTypeId()];
        for (var i=0;i<parDesc.length;i++){
            var parObj={};
            parObj.name=parDesc[i].name;
            parObj.type=parDesc[i].type;
            if (parDesc[i].value===undefined)
                parObj.value=0;
            else
                parObj.value=parDesc[i].value;
            parameterElements.push(parObj);
        }
    }

    this.getParameterElements=function(){
        return parameterElements;
    };

    this.setType=function(typeId) {

        that.setTypeId(typeId);
        that.label=labelTags[that.getTypeId()];
        nodeName=labelTags[that.getTypeId()];
        that.nodeClass=typesArray[that.getTypeId()];
        that.parameters=createParameterObjects();
        if (that.nodeElement) {
            for (var i = 0; i < typesArray.length; i++) {
               // console.log("disabling :" + typesArray[i]);
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
      //  console.log("port "+i+" -> new positoins "+px+"  "+py);
        if (that.getNodeObjectType()===that.OVERLAY_OBJECT_NODE)
            nPort.setPortTypeToOverlay();

        nPort.drawPort();
        nPort.setPosition(px,py);
        nPort.id(i);
        portElements.push(nPort)

    };

    function angleToNormedVec(angle){
        // angle given in degree , need rad for cos and sin
        var xn=Math.cos(angle*Math.PI/180);
        var yn=Math.sin(angle*Math.PI/180);
        return {x: xn, y: -yn}
    }

    this.addLink=function(aLink){
        assosiatedLinks.push(aLink);
    };

    function generatePortNodesOfType(index){
        // this node generates its own ports;
        var myPorts=portDescriptions[index];
        //console.log("generating ports for node:"+that.label);
        //console.log(myPorts);
        var i;
        if (portElements.length===0 && myPorts.length!==0) {
            for (i = 0; i < myPorts.length; i++) {
                that.addPortFromDescription(myPorts[i], i);
            }
        }
        else if (portElements.length>0){
            for (i = 0; i < portElements.length; i++) {
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
        for (var i=0;i<assosiatedLinks.length;i++){
            // if (assosiatedLinks[i])
            assosiatedLinks[i].updateElement();
        }
    };


    this.getAssociatedLinks=function(){
        return assosiatedLinks;
    };



    this.drawPorts=function(){
        portSvgRoot=that.rootNodeLayer.append('g');
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
        // force a selection of this node if a port was clicked
        graph.selectNode(undefined);
        graph.selectNode(that);
    }




}

SimpleSFDNode.prototype = Object.create(BaseNode.prototype);
SimpleSFDNode.prototype.constructor = SimpleSFDNode;
