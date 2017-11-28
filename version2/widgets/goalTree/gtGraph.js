
function GTGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    this.nodeTypeGraph=1;
    // call the baseGraph init function
    that.initializeGraph();


    // this.initializeGraph=function(){
    //
    //     // modify to you needs
    //     this.specialLayer= this.svgElement.append("g");
    //     // setting the extent default(0.1,3)
    //     //that.setZoomExtent(0.5,2);
    //
    //
    //     // det a double click event if needed
    //     //that.setDoubleClickEvent(that.dblClick);
    // };
    // have to overwrite this one
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

            // check if target is stakeholder
            if (targetNode.getTypeId()===100){
                return; // we are a stakeholder we do now allow manual link generation
            }

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


            if ((srcRen.getTypeId()===3 || srcRen.getTypeId()===100)
                && (tarRen.getTypeId()===3 || tarRen.getTypeId()===100)
            ){
                console.log("this should also be visible in CLD ");
                //
                var friendlyWidget=that.parentWidget.cldGraphObj;
                globalLink.setVisibleInWidget(friendlyWidget,true);
                var friendlyLink=friendlyWidget.createLink(friendlyWidget);
                 friendlyLink.setClassType(-1,"InterestLink");
                 globalLink.setLinkGenerator(friendlyWidget,friendlyLink);
                 friendlyLink.setGlobalLinkPtr(globalLink);
                }
            }



            // add the global pointers for the connection;
            gHandlerObj.redrawAllWidgets();

    };



    this.dblClick=function(px,py){
        var handler=that.parentWidget.getHandler();
        var globalNode=handler.createGlobalNode(that);
        globalNode.setNodeType(that,that.nodeTypeGraph,that.createNode(that));
        handler.addGlobalNode(globalNode);
        var repR=globalNode.filterInformation(that);
        repR.setGlobalNodePtr(globalNode);

        var grPos={};
        if (px!==undefined && py!==undefined) {
            grPos.x = px;
            grPos.y = py;
        }else{
            var coordinatesRelativeToCanvasArea;
            coordinatesRelativeToCanvasArea=d3.mouse(this);
            grPos=getScreenCoords(coordinatesRelativeToCanvasArea[0],coordinatesRelativeToCanvasArea[1],that.translation,that.zoomFactor);
        }


        globalNode.setNodePos(that,grPos);
        if (that.nodeTypeGraph===3){
            var friendlyWidget=that.parentWidget.cldGraphObj;
            globalNode.setVisibleInWidget(friendlyWidget,true);
            var friendlyNode=friendlyWidget.createNode(friendlyWidget);
            globalNode.setNodeType(friendlyWidget,3,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);

            // all node types are added to the sdf
            console.log("creating sdf Node")
            var sfdWdiget=that.parentWidget.sfdGraphObj;
            globalNode.setVisibleInWidget(sfdWdiget,true);
            friendlyNode=sfdWdiget.createFriendlyNode();
            globalNode.setNodeType(sfdWdiget,that.nodeTypeGraph-1,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);

        }
        that.clearRendering();
        gHandlerObj.redrawAllWidgets();
        that.selectNode(undefined);
    };

    this.createNode=function(parent){
        return new GTNode(parent);
    };

    this.changeNodeType=function(nodeT){
      that.nodeTypeGraph=nodeT;
    };

    this.createLink=function(parent){
        return new GTLink(parent);
    };

    function getScreenCoords(x, y, translate, scale){
        var xn=(x - translate[0])/scale;
        var yn=(y - translate[1])/scale;
        return {x: xn, y: yn};
    }

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
            obj.nodeType=node.goalType;
            obj.nodeTypeId = node.getTypeId();
            obj.comments = node.hoverText;
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
        gHandlerObj.redrawAllWidgets();
    };

    this.addNodeFromJSON=function(jsonNode){
        var nodeName=jsonNode.name;
        var nodePos=jsonNode.pos;
        var nodeId=jsonNode.id;
        var typeId = jsonNode.nodeTypeId;
        var typeName = jsonNode.nodeType;
        var comments = jsonNode.comments;

        console.log("Graph should add now a node with : " );
        console.log("   Name : "+nodeName );
        console.log("   Id   : "+nodeId);
        console.log("   Pos  : "+nodePos);

        var newNode=that.createNode(that);
        // todo: check how to handle the data;
        newNode.id(nodeId);
        newNode.setLabelText(nodeName);
        newNode.setType(typeId, typeName);
        newNode.setHoverText(comments);
        var x=parseFloat(nodePos[0]);
        var y=parseFloat(nodePos[1]);
        newNode.setPosition(x,y);
        // push to array of nodes
        console.log("newNode  "+newNode);
        that.nodeElementArray.push(newNode);
        that.needsRedraw(true);
        gHandlerObj.redrawAllWidgets();

    };

    this.addStakeholders = function(data,email) {
        //var randomPointX = Math.random() * 1000;
        var randomPointX = 300;
        var randomPointY = 300;
        console.log("adding stakeholder nodes");
        console.log(email);
        var index=0;
        for(var key in data) {
            var node = key;
            var values = data[key];
            var mailaddress=email[index];
            index++;



            // refactoring for global dataStructure;
            var handler=that.parentWidget.getHandler();
            var globalNode=handler.createGlobalNode(that);
            globalNode.setNodeType(that,100,that.createNode(that));
            handler.addGlobalNode(globalNode);
            var repR=globalNode.filterInformation(that);
            repR.setGlobalNodePtr(globalNode);
            repR.setLabelText(key);
            repR.setType(100, "Stakeholder");
            // globalNode.id(globalNode.id()+2000);
            console.log("STAKEEEE "+globalNode.id());
            // var newNode=that.createNode(that);
            // newNode.setLabelText(key);
            // newNode.setType(4, "Stakeholder");
            var x=parseFloat(randomPointX);
            var y=parseFloat(randomPointY);
            randomPointX += 200;
            repR.setPosition(x,y);
            var str = "";
            for(var i=0; i<values.length; i++) {
                str += values[i] + "\n";
            }
            console.log("values: "+str);
            repR.setHoverText(str);
            globalNode.setGlobalHoverText(str);
            globalNode.setNodeEmail(mailaddress);
            // push to array of nodes
            console.log("newNode  "+repR);

            // adding friendly widget for stakeHolders;
            var friendlyWidget=that.parentWidget.cldGraphObj;
            globalNode.setVisibleInWidget(friendlyWidget,true);
            var friendlyNode=friendlyWidget.createNode(friendlyWidget);
            globalNode.setNodeType(friendlyWidget,100,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);
            friendlyNode.setHoverText(str);

            var sfdWdiget=that.parentWidget.sfdGraphObj;
            globalNode.setVisibleInWidget(sfdWdiget,true);
            friendlyNode=sfdWdiget.createFriendlyNode();
            var mappedId=friendlyNode.findTypeId("stakeholder");
            console.log("+6++++++++++++++++++++++"+mappedId);
            globalNode.setNodeType(sfdWdiget,mappedId,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);
// This line is different from prev commit @#$
            globalNode.updateNodeIds();
            that.needsRedraw(true);
            gHandlerObj.redrawAllWidgets();
        }        
    };

}

GTGraph.prototype = Object.create(BaseGraph.prototype);
GTGraph.prototype.constructor = GTGraph;
