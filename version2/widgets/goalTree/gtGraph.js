
function GTGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    this.nodeTypeGraph=1;
    // call the baseGraph init function
    // that.initializeGraph();


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

    this.dblClick=function(){
        var handler=that.parentWidget.getHandler();
        console.log("DoubleClick in GoalTree");
        console.log("do we have a handler?");
        console.log(handler);

        var globalNode=handler.createGlobalNode(that);
        console.log("Setting the functions");
        globalNode.setNodeType(that,that.nodeTypeGraph,that.createNode(that));
        handler.addGlobalNode(globalNode);
        var repR=globalNode.filterInformation(that);
        repR.setGlobalNodePtr(globalNode);


        var coordinatesRelativeToCanvasArea;
        coordinatesRelativeToCanvasArea=d3.mouse(this);
        var grPos=getScreenCoords(coordinatesRelativeToCanvasArea[0],coordinatesRelativeToCanvasArea[1],that.translation,that.zoomFactor);
        globalNode.setNodePos(that,grPos);

        // if the selected thing is createria
        if (that.nodeTypeGraph===3){
            //
            console.log("woop whoop we have a criteria");
            var friendlyWidget=that.parentWidget.cldGraphObj;
            console.log(friendlyWidget);
            globalNode.setVisibleInWidget(friendlyWidget,true);
            // lets hope for the best :)
            console.log("Calling SetNodeTypeFrom OUTSIDE ");
            var friendlyNode=friendlyWidget.createNode(that.parentWidget.cldGraphObj);
            console.log("there should be a friendly node ndoe");
            console.log(friendlyNode);
            console.log("yes?" );
            globalNode.setNodeType(friendlyWidget,3,friendlyNode);
            friendlyNode.setGlobalNodePtr(globalNode);

        }


//         var widgetNodeElement=globalNode.filterInformation(that);
//
//
// //        var aNode=that.createNode(that);
//        widgetNodeElement.setTypeId(that.nodeTypeGraph);
//
//          var coordinatesRelativeToCanvasArea;
//          coordinatesRelativeToCanvasArea=d3.mouse(this);
//          var grPos=getScreenCoords(coordinatesRelativeToCanvasArea[0],coordinatesRelativeToCanvasArea[1],that.translation,that.zoomFactor);
//         widgetNodeElement.x=grPos.x;
//         widgetNodeElement.y=grPos.y;
//         that.nodeElementArray.push(widgetNodeElement);
//         // add this global nodes info to
//
         that.clearRendering();
         that.redrawGraphContent();
//         widgetNodeElement.editInitialText();
//         console.log(that.nodeTypeGraph + ": this is the nodeType Graph");
//         widgetNodeElement.setType(that.nodeTypeGraph, widgetNodeElement.allClasss[that.nodeTypeGraph]);

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

    };

    this.addStakeholders = function(data) {
        var randomPointX = Math.random() * 1000;
        var randomPointY = randomPointX;
        console.log("adding stakeholder nodes");
        for(var key in data) {
            var node = key;
            var values = data[key];
            var newNode=that.createNode(that);
            newNode.setLabelText(key);
            newNode.setType(4, "Stakeholder");
            var x=parseFloat(randomPointX);
            var y=parseFloat(randomPointY);
            randomPointX += 200;
            newNode.setPosition(x,y);
            var str = "";
            for(var i=0; i<values.length; i++) {
                str += values[i] + "\n";
            }
            console.log("values: "+str);
            newNode.setHoverText(str);
            // push to array of nodes
            console.log("newNode  "+newNode);
            that.nodeElementArray.push(newNode);
            that.needsRedraw(true);
        }        
    };

}

GTGraph.prototype = Object.create(BaseGraph.prototype);
GTGraph.prototype.constructor = GTGraph;
