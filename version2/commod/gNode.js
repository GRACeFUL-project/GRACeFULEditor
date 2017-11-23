//global structure for the nodes

var globalNodeId = 2;
function GlobalNode() {
    /** variable defs **/
    var that = this;
    /** BASE HANDLING FUNCTIONS ------------------------------------------------- **/
    this.id = function (index) {
        if (!arguments.length) {
            return that.nodeId;
        }
        this.nodeId = index;
    };
    //this.nodeId = globalNodeId++; // init value
  //  console.log(that);
    that.id(globalElementIdentifier++);

    this.getHighestGlobalNodeValue=function(){return globalNodeId};
    this.setGlobalHighestIdValue=function(val){globalNodeId=val};
    var representedInWidget=[];

    function initRepresentedWidgets() {
        // initialises all widget objects
        representedInWidget= gHandlerObj.getGraphObjects();
       // console.log("initialized grapoh Obejcts++++++++++++++++++++++++++++++++++++++++++++++++++++");
      //  console.log(representedInWidget);
    }
    initRepresentedWidgets();
    var visibleInWidget=[false,false,false];
    var nodeTypeInWidget=[-1,-1,-1];
    var nodePosInWidget=[];
    var nodeConstructors=[];
    var nodeMetaData=[{},{},{}]; // three empty objects for the metadata;
    var nodeName="enter label"; // should be consistent
    var criteriaUnit = "";
    var globalHoverText="";
    var nodeEmail; // per default undefined;

    // define the basic structure of that node;
    // what das a node have;
    // node has a position in a widget and a referenced object ?

    this.setNodeEmail=function(mail){
        // sets the email addr for the stakeholders
        nodeEmail=mail;
    };

    this.getMetaData=function(){
        nodeMetaData=[{},{},{}];// clear the prev metadata;
        for (var i=0;i<representedInWidget.length;i++)
            that.setNodeMetaData(representedInWidget[i]); // updates metadata
        return nodeMetaData

    };

    this.getNodeName=function(){ return nodeName;};

    this.getNodesEmail=function(){return nodeEmail;};

    this.getNodePositionsInWidgets=function(){
        // manual things;
        var positions=[];
        for (var i=0;i<representedInWidget.length;i++){
            var tw=representedInWidget[i];
            var id=that.findWidgetId(tw);
            if (id>=0){
                if (visibleInWidget[id]===true && nodeConstructors[id]){
                    // this should have now a node in the widget so we can get its pos
                    var nd=nodeConstructors[id];
                    var posInW={x:nd.x,y:nd.y};
                    positions.push(posInW);
                }
                else{
                    var posNotW={x:0,y:0};
                    positions.push(posNotW);
                }
            }
        }
        return positions;

    };
    this.getNodeTypeInWidgets=function(){
        // update it from the nodes itself
        for (var i=0;i<representedInWidget.length;i++){
            if (nodeConstructors[i]){

                nodeTypeInWidget[i]=nodeConstructors[i].getTypeId();
            }
        }
        if (nodeTypeInWidget[0]===100 || nodeTypeInWidget[1]===100 || nodeTypeInWidget[2]===100)
            nodeTypeInWidget=[100,100,100];

        return nodeTypeInWidget;};
    this.getVisibleInWidget=function(){ return visibleInWidget;};
   // this.getRepresentedInWidget=function(){ return representedInWidget;};

    this.updateNodeIds=function(){

      for (var i=0;i<nodeConstructors.length;i++){
          if (nodeConstructors[i]) {

              nodeConstructors[i].id(this.nodeId);
              // console.log("Setting Node Id"+nodeConstructors[i].id());
          }
        }


    };

    this.getSfdNode=function(){
        that.updateNodeIds();
        return nodeConstructors[2];
    };

    this.getGTNode=function(){
        that.updateNodeIds();
        return nodeConstructors[0];
    };

    var associatedGlobalLinks=[];

    this.setGlobalHoverText=function(text){globalHoverText=text};
    this.getGlobalHoverText=function(){return globalHoverText;};


    this.addGlobalAssociatedLink=function(aLink){
        associatedGlobalLinks.push(aLink);
     //   console.log("adding a global link link to "+that.id());
    };


    this.removeNodeRepresentationInWidget=function(widget){
        var indexOfWidget=that.findWidgetId(widget);
        if (nodeConstructors[indexOfWidget]){
            nodeConstructors[indexOfWidget]=undefined;
        }
    };

    this.setGlobalName=function(str){
        nodeName=str;
    };

    this.setGlobalUnit = function(str) {
        criteriaUnit = str;
    };

    this.getCriteriaUnit = function() {
        return criteriaUnit;
    };

    this.filterInformation=function(widget){
        that.updateNodeIds();
        var indexOfWidget=that.findWidgetId(widget);
        var nodeElement=nodeConstructors[indexOfWidget];
        if (nodeElement!=undefined) {
            nodeElement.setLabelText(nodeName);
            if (nodeElement.setCriteriaUnit)
                nodeElement.setCriteriaUnit(criteriaUnit);
            if (globalHoverText.length>0)
                nodeElement.setHoverText(globalHoverText);

            if(nodeElement.x===0 || nodeElement.y===0){
                // copy form known position;
                for (var i=0;i<nodeConstructors.length;i++){
                    var tConst=nodeConstructors[i];
                    if (tConst && tConst!==nodeElement){
                        //check if position is there
                        var parentX=tConst.x;
                        var parentY=tConst.y;
                        if (parentX!=0 && parentY!=0) {
                            nodeElement.x = parentX;
                            nodeElement.y = parentY;
                        }
                    }
                }
            }
            return nodeElement;
        }
    };


    this.getCLDNODE=function(){
        return nodeConstructors[1];
    };

    this.setGlobalMetaDataArray=function(array){
        if (array===undefined) return;

        for (var i=0;i<array.length;i++){
            var meta=array[i];
            var empty=jQuery.isEmptyObject(meta);
            if (empty===true) {
                console.log("the meta object is empty");
                continue;
            }
            else{
                // integrate the metaData;
                nodeMetaData[i]=meta;
                var aNode=that.filterInformation(representedInWidget[i]);
                if (aNode)
                    aNode.setMyMetaData(meta);
            }




        }



    };

    this.setKind=function(str){
        this.kind=str;
    };
    this.getKind=function(){return that.kind;};

    this.setVisibleInWidget=function(widget, visible){
            // set the corresponding value in the visible widgetId;
            var indexOfWidget=that.findWidgetId(widget);
            if (indexOfWidget>=0){
                visibleInWidget[indexOfWidget]=visible;
            }

    };

    this.findWidgetId=function(widget){
        // searches for the widget in the represetedInWidget list;
        return representedInWidget.indexOf(widget);
    };


    // stores the metadataObject;
    this.setNodeMetaData=function(widget){
        var indexOfWidget=that.findWidgetId(widget);
        // get representedNode;
        var repNode=that.filterInformation(widget);
        var metaObject=nodeMetaData[indexOfWidget];

        if (indexOfWidget===1 && repNode){
            //this is a cldWidget;

            metaObject.observe = repNode.getObserve();
            metaObject.trend = repNode.getTrend();
            // metadata for actions;
            metaObject.actions=repNode.getAction();
            metaObject.libMapping = repNode.getLibMapping();
            metaObject.criteriaUnit = repNode.getCriteriaUnit();
        }


    };

    this.setNodeType=function(widget,nodeType,createdNodeInWidget){
        var indexOfWidget=that.findWidgetId(widget);
        if (indexOfWidget>=0){
            nodeTypeInWidget[indexOfWidget]=nodeType;
            nodeConstructors[indexOfWidget]=createdNodeInWidget;
            if (createdNodeInWidget.allClasss)
                createdNodeInWidget.setType(nodeType,createdNodeInWidget.allClasss[nodeType]);
            else{ // this is sfd node
                createdNodeInWidget.setType(nodeType);

            }
        }

    };
    this.setNodePos=function(widget,pos){
        var indexOfWidget=that.findWidgetId(widget);
        if (indexOfWidget>=0){
            var nElement=nodeConstructors[indexOfWidget];
            nElement.x=pos.x;
            nElement.y=pos.y;
        }
    };


}
GlobalNode.prototype.constructor = GlobalNode;
