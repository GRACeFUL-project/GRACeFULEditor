// the global handler which contains all the objects which are then filtered by the elements;

// the global handler is a single object which maintains all the data;

!function(){
    // allow to create new Nodes
    var gHandler={};
    var instanceId=0;

    var widgetList=[];
    var graphObjectList=[];


    var globalNodeArray=[];
    var globalLinkArray=[];


    function new_object() {
        // some variables
        var that = this;

        this.emptyGraphStructure = function () {
            globalLinkArray = [];
            globalNodeArray = [];
            // tada

        };

        this.setWidgetList=function(goal,cld,sfd){
            // stores the widgets;
            widgetList.push(goal);
            widgetList.push(cld);
            widgetList.push(sfd);
            for (var i=0;i<widgetList.length;i++){
                console.log("adding graph Obejct to global list"+i);
                graphObjectList.push(widgetList[i].graphObject);

            }
            return graphObjectList;
        };

        this.getGraphObjects=function(){
            // stores the widgets;
            return graphObjectList;
        };


        this.deleteGlobalLink = function (linkElement) {
            var correspondingGlobalLink = linkElement.getGlobalLinkPtr();
            globalLinkArray.splice(globalLinkArray.indexOf(correspondingGlobalLink), 1);
        };


        this.deleteNodeAndLinks = function (nodeElement) {

            var correspondingGlobalNode = nodeElement.getGlobalNodePtr();
            globalNodeArray.splice(globalNodeArray.indexOf(correspondingGlobalNode), 1);
            //remove links associated with the node
            var spliceLinks = globalLinkArray.filter(function (l) {
                return (l.getSource() === correspondingGlobalNode || l.getTarget() === correspondingGlobalNode);
            });
            spliceLinks.map(function (l) {
                // console.log("the index of links are: "+l.id());
                globalLinkArray.splice(globalLinkArray.indexOf(l), 1);
            });

        };


        /** NODE HANDLING **/
        this.createGlobalNode = function (widgetOrGraphObject) {
            var gNode = new GlobalNode();
            gNode.setVisibleInWidget(widgetOrGraphObject, true);
            return gNode;
        };

        this.addGlobalNode = function (gNode) {
            globalNodeArray.push(gNode)
        };

        this.removeGlobalNode = function (gNode) {
            // splice that thing;
            globalNodeArray.splice(globalNodeArray.indexOf(gNode), 1);
            // remove all associated links of gNode;
            // TODO:!


        };
        this.collectNodesForWidget = function (widget) {
            var nodesArray = [];
            for (var i = 0; i < globalNodeArray.length; i++) {
                var aNode = globalNodeArray[i].filterInformation(widget);
                if (aNode) {
                    nodesArray.push(aNode)
                }
            }
            return nodesArray;
        };

        /** LINK HANDLING **/

        this.createGlobalLink = function (widgetOrGraphObject) {
            var gLink = new GlobalLink();
            gLink.setVisibleInWidget(widgetOrGraphObject, true);
            return gLink;
        };

        this.addGlobalLink = function (gLink) {
            globalLinkArray.push(gLink)
        };

        this.removeGlobalLink = function (gLink) {
            // splice that thing;
            globalLinkArray.splice(globalLinkArray.indexOf(gLink), 1);
        };
        this.collectLinkForWidget = function (widget) {
            var linksArray = [];
            for (var i = 0; i < globalLinkArray.length; i++) {
                var aLink = globalLinkArray[i].filterInformation(widget);
                if (aLink) {
                    linksArray.push(aLink)
                }
            }
            return linksArray;
        };




        /**  COMMUNICATION FUNCTIONS**/

        this.findNodeWithId=function(id){

            // lazy forloop search
            // todo: optimize!
            for (var i=0;i<globalNodeArray.length;i++){
                if (globalNodeArray[i].id()===id){
                    return globalNodeArray[i];
                }
            }

        };

        this.redrawAllWidgets=function(){
            for (var i=0;i<graphObjectList.length;i++){
                graphObjectList[i].forceRedrawContent();
            }

        };

        this.requestDataForQuestionair=function(){
            // go through the global nodes and get the stackholders;
            var stackholderNodes=[];
            for (var i=0;i<globalNodeArray.length;i++){
                var aNode=globalNodeArray[i];
                var vis=aNode.getVisibleInWidget();
                var typ=aNode.getNodeTypeInWidgets();
                if (vis[0]===true && typ[0]===4){
                    // this is stackholder node;
                    //stackholderNodes.push(aNode);


                    // create an stakeholder object
                    var sth={};
                    sth.objectName=aNode.getNodeName();
                    sth.email=aNode.getNodesEmail();
                    stackholderNodes.push(sth);

                }
            }
            return stackholderNodes;
        };

        this.hasModel=function () {
            if (globalNodeArray.length===0){
                return false;
            }
            return true;
        };


        this.requestModelDataForQuestioner=function(){
            var retObj = {};
            retObj.criteria = [];
            for (var i = 0; i < globalNodeArray.length; i++) {
                var node = globalNodeArray[i];
                var vis=node.getVisibleInWidget();
                var typ=node.getNodeTypeInWidgets();
                if (vis[0]===true && typ[0]===3){
                    // this is a critreaia
                    var obj = {};
                    obj.id = node.id();
                    obj.name = node.getNodeName();
                    obj.weight=-1;
                    obj.value="undefined obj Value";
                    retObj.criteria.push(obj);
                }
            }
            return retObj;
        };

        this.requestGlobalLibraryLoading=function(){
            // for all the widgets we want to load the required libraries? oO
            // how do we know all libs from the begining?

            // --> We DONT ! the widgtes load their libs them self on user requests...



        };

        this.requestSaveDataAsJson = function () {
            console.log("We should return the global structure of that model");
            // THIS SHOULD BE OVERWRITTEN BY ALL GRAPHS!
            var retObj = {};

            retObj.type = "GLOBAL_MODEL";
            retObj.graphSchema = "NO_SCHEMA";
            retObj.nodes = [];
            retObj.links = [];
            var i, obj;
            for (i = 0; i < globalNodeArray.length; i++) {
                var node = globalNodeArray[i];
                obj = {};
                obj.id = node.id();
                obj.name = node.getNodeName();
               // / obj.representedInWidgets=node.getRepresentedInWidget();
                obj.visibleInWidgets=node.getVisibleInWidget();
                obj.nodeTypeId = node.getNodeTypeInWidgets();
                obj.comments = node.getGlobalHoverText();
                obj.pos = node.getNodePositionsInWidgets();

                console.log("Object=");
                console.log(obj);

                retObj.nodes.push(obj);
            }

            for (i = 0; i < globalLinkArray.length; i++) {
                var link = globalLinkArray[i];
                var linkObj = {};
                linkObj.id = link.id();
                var g_srcId=link.getSourceForExport();
                var g_tarId=link.getTargetForExport();

                linkObj.source_target = [g_srcId,g_tarId];

                // todo add some types for the link inside the widget;
                linkObj.linkTypesInWidgets=link.getRepresenterLinkTypes();
                linkObj.linkValuesInWidgets=link.getLinkValuesForExport();
                linkObj.visibleInWidgets=link.getVisibleInWidget();
                linkObj.controlPointsStatus=link.getControlPointStatus();
                linkObj.controlPointsPosition=link.getControlPointPosition();
                retObj.links.push(linkObj);
            }

            return JSON.stringify(retObj, null, '  ');
        }

    }

    gHandler.create=function(){
        instanceId++;
        return new new_object();

    };


    this.handler=gHandler;
}();
