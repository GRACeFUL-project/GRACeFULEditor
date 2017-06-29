
function ExampleGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    // call the baseGraph init function
    that.initializeGraph();


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
        return new ExampleNode(parent);
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



}

ExampleGraph.prototype = Object.create(BaseGraph.prototype);
ExampleGraph.prototype.constructor = ExampleGraph;
