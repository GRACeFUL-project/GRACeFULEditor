//global structure for the nodes

var globalNodeId = 0;
function GlobalNode() {
    /** variable defs **/
    var that = this;
    this.nodeId = 0; // init value

    var representedInWidget=[];
    var visibleInWidget=[];
    var nodeTypeInWidget=[];
    var nodePosInWidget=[];
    var nodeConstructors=[];
    var nodeName="empty"; // should be consistent
    // define the basic structure of that node;
    // what das a node have;
    // node has a position in a widget and a referenced object ?


    this.setGlobalName=function(str){
        nodeName=str;
    };

    this.filterInformation=function(widget){
        // filters the information for the widget;
        // this returns a node which is drawn in the specified widget;

        // create the widget element;
        var indexOfWidget=that.findWidgetId(widget);

        console.log("The Node Constructors Are");
        console.log(nodeConstructors);
        console.log("-----");
        var nodeElement=nodeConstructors[indexOfWidget];
        if (nodeElement!=undefined) {
            nodeElement.setLabelText(nodeName);
            return nodeElement;
        }


    };


    this.setVisibleInWidget=function(widget, visible){
        // check if the representation in the widget list is already given

        console.log("wiget or graph "+ widget.graphName);
        console.log("visible  "+ visible);
        //1] check if list is empty
        if (representedInWidget.length===0){
            // just add the widget pointer and the visibility value;
            representedInWidget.push(widget);
            visibleInWidget.push(visible);
        }else{
            // set the corresponding value in the visible widgetId;
            var indexOfWidget=that.findWidgetId(widget);
            if (indexOfWidget>=0){
                visibleInWidget[indexOfWidget]=visible;
            }else{
                // add this widget
                representedInWidget.push(widget);
                visibleInWidget.push(visible);
            }
        }
    };

    this.findWidgetId=function(widget){
        // searches for the widget in the represetedInWidget list;
        return representedInWidget.indexOf(widget);
    };


    this.setNodeType=function(widget,nodeType,createdNodeInWidget){

        console.log("what is widget?");
        console.log(widget.graphName);


        var indexOfWidget=that.findWidgetId(widget);
        console.log("searching for widget Id"+ indexOfWidget);
        console.log(representedInWidget);
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
