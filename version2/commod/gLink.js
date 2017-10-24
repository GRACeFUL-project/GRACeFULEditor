// global structure for the links

//global structure for the nodes

var GlobalLinkId = 0;
function GlobalLink() {
    /** variable defs **/
    var that = this;
    this.globalLinkId = GlobalLinkId++; // init value

    var representedInWidget=[];
    var visibleInWidget=[false,false,false];

    var linkValueInWidget=[-1,-1,-1];
    var linkTypeInWidget=[];

    var linkRepresenter=[];

    function initRepresentedWidgets() {
        // initialises all widget objects
        representedInWidget= gHandlerObj.getGraphObjects();
    }
    initRepresentedWidgets();

    var g_sourceNode=undefined;
    var g_targetNode=undefined;

    this.getVisibleInWidget=function(){ return visibleInWidget;};

    this.getSourceForExport=function(){
        //returns globalNodeObject Id
        return g_sourceNode.id();
    };
    this.getTargetForExport=function(){
        //returns globalNodeObject Id
        return g_targetNode.id();
    };

    this.getLinkValuesForExport=function(){
        var linkValues=[];
        for (var i=0;i<representedInWidget.length;i++){
            var tw=representedInWidget[i];
            var id=that.findWidgetId(tw);
            if (id>=0){
                if (visibleInWidget[id]===true && linkRepresenter[id]){
                    // this should have now a node in the widget so we can get its pos
                    var link=linkRepresenter[id];
                    linkValues.push(link.getTypeId());
                }
                else{
                    var noTypes=-1;
                    linkValues.push(noTypes);
                }
            }
        }
        return linkValues
    };

    // get repsersenterTypes
    this.getRepresenterLinkTypes=function(){

        var repTypes=[];
        for (var i=0;i<representedInWidget.length;i++){
            var tw=representedInWidget[i];
            var id=that.findWidgetId(tw);
            if (id>=0){
                if (visibleInWidget[id]===true && linkRepresenter[id]){
                    // this should have now a node in the widget so we can get its pos
                    var link=linkRepresenter[id];
                    if (link.getClassType)
                        repTypes.push(link.getClassType());
                    else{ repTypes.push(0);}

                }
                else{
                    var noTypes=0;
                    repTypes.push(noTypes);
                }
            }
        }
        return repTypes
    };


    this.setSource=function(g_source){
        g_sourceNode=g_source;
        g_sourceNode.addGlobalAssociatedLink(that)
    };
    this.getSource=function(){
        return g_sourceNode;
    };

    this.setTarget=function(g_target){
        g_targetNode=g_target;
        g_targetNode.addGlobalAssociatedLink(that)
    };
    this.getTarget=function(){
        return g_targetNode;
    };




    this.removeLinkRepresentationInWidget=function(widget){
        var indexOfWidget=that.findWidgetId(widget);
        if (indexOfWidget>0 && linkRepresenter[indexOfWidget]) {
            linkRepresenter[indexOfWidget] = undefined;
        }

    };


    this.getControlPointStatus=function(){
        var stats=[];
        var cpPos=[];
        for (var i=0;i<representedInWidget.length;i++){
            var tw=representedInWidget[i];
            var id=that.findWidgetId(tw);
            if (id>=0){
                if (visibleInWidget[id]===true && linkRepresenter[id]){
                    // this should have now a node in the widget so we can get its pos
                    var link=linkRepresenter[id];
                    if (link.getControlPointStatus){
                        var cpStatus=link.getControlPointStatus();
                        var cp_Pos=link.getControlPointPosition();
                        stats.push(cpStatus);
                        cpPos.push(cp_Pos);
                    }else{
                        stats.push(false);
                        cpPos.push({x:0,y:0});
                    }

                }
                else{
                        stats.push(false);
                        cpPos.push({x:0,y:0});
                    }
                }
            }
        return stats;
    };

    this.getControlPointPosition=function(){
        var stats=[];
        var cpPos=[];
        for (var i=0;i<representedInWidget.length;i++){
            var tw=representedInWidget[i];
            var id=that.findWidgetId(tw);
            if (id>=0){
                if (visibleInWidget[id]===true && linkRepresenter[id]){
                    // this should have now a node in the widget so we can get its pos
                    var link=linkRepresenter[id];
                    if (link.getControlPointStatus){
                        var cpStatus=link.getControlPointStatus();
                        var cp_Pos=link.getControlPointPosition();
                        stats.push(cpStatus);
                        cpPos.push(cp_Pos);
                    }else{
                        stats.push(false);
                        cpPos.push({x:0,y:0});
                    }

                }
                else{
                    stats.push(false);
                    cpPos.push({x:0,y:0});
                }
            }
        }
        return cpPos;
    };



    this.filterInformation=function(widget){
        var indexOfWidget=that.findWidgetId(widget);
        // update the information if the linkTypes;
        if (linkRepresenter[1]!==undefined && linkRepresenter[2]!==undefined){
            var nObj=linkRepresenter[1].getCLDLinkTypeFromOutside();
            linkRepresenter[2].setCLDLinkTypeFromOutside(nObj.type,nObj.value);
        }

        if (indexOfWidget<0){return; } // we return nothing
        var linkElement=linkRepresenter[indexOfWidget];
        if (linkElement!=undefined) {

            // request the information
            if (linkElement.getControlPointPosition){
           //     console.log("this widgetet is cld and has cp");
                linkElement.getControlPointPosition();
            }

            return linkElement;
        }
    };

    this.crateLinkFromOutside=function(widget, createdLinkInWidget) {
        var indexOfWidget = that.findWidgetId(widget);
        if (indexOfWidget < 0) {
            return;
        } // we return nothing
        linkRepresenter[indexOfWidget] = createdLinkInWidget;
        // add the corresponding elements to the represented links;
        if (that.getSource() && that.getTarget()) {
           // console.log("having the source and target from an other widget");
            var sourceNode = that.getSource().filterInformation(widget);
            var targetNode = that.getTarget().filterInformation(widget);
            createdLinkInWidget.source(sourceNode);
            createdLinkInWidget.target(targetNode);
        }
    };


        this.setLinkGenerator=function(widget, createdLinkInWidget){
            console.log("adding thigns");
        var indexOfWidget=that.findWidgetId(widget);
        if (indexOfWidget<0){return; } // we return nothing
        linkRepresenter[indexOfWidget]=createdLinkInWidget;
        // add the corresponding elements to the represented links;
        if (that.getSource() && that.getTarget()) {
            console.log("having the source and target from an other widget");
            var sourceNode = that.getSource().filterInformation(widget);
            var targetNode = that.getTarget().filterInformation(widget);
            console.log("Filter not working ");
            createdLinkInWidget.source(sourceNode);
            createdLinkInWidget.target(targetNode);
            console.log("Filter  working ");
            sourceNode.addLink(createdLinkInWidget);
            targetNode.addLink(createdLinkInWidget);
            console.log("Done");
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


    /** BASE HANDLING FUNCTIONS ------------------------------------------------- **/
    this.id = function (index) {
        if (!arguments.length) {
            return that.globalLinkId;
        }
        this.globalLinkId = index;
    };

}
GlobalLink.prototype.constructor = GlobalLink;
