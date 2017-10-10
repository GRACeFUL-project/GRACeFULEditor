//global structure for the nodes

var globalNodeId = 0;
function GlobalNode() {
    /** variable defs **/
    var that = this;
    this.nodeId = globalNodeId++; // init value
  //  console.log(that);


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
    var nodeName="empty"; // should be consistent
    var globalHoverText="";
    var nodeEmail; // per default undefined;

    // define the basic structure of that node;
    // what das a node have;
    // node has a position in a widget and a referenced object ?

    this.setNodeEmail=function(mail){
        // sets the email addr for the stakeholders
        nodeEmail=mail;
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
    this.getNodeTypeInWidgets=function(){ return nodeTypeInWidget;};
    this.getVisibleInWidget=function(){ return visibleInWidget;};
   // this.getRepresentedInWidget=function(){ return representedInWidget;};


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

    this.filterInformation=function(widget){
        var indexOfWidget=that.findWidgetId(widget);
        var nodeElement=nodeConstructors[indexOfWidget];
        if (nodeElement!=undefined) {
            nodeElement.setLabelText(nodeName);
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


    this.setNodeType=function(widget,nodeType,createdNodeInWidget){
        var indexOfWidget=that.findWidgetId(widget);
        if (indexOfWidget>=0){
            nodeTypeInWidget[indexOfWidget]=nodeType;
            nodeConstructors[indexOfWidget]=createdNodeInWidget;
            createdNodeInWidget.setType(nodeType,createdNodeInWidget.allClasss[nodeType]);
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
    /** BASE HANDLING FUNCTIONS ------------------------------------------------- **/
    this.id = function (index) {
        if (!arguments.length) {
            return that.nodeId;
        }
        this.nodeId = index;
    };

}
GlobalNode.prototype.constructor = GlobalNode;
