// the global handler which contains all the objects which are then filtered by the elements;

// the global handler is a single object which maintains all the data;
var globalElementIdentifier=2;
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
            that.redrawAllWidgets();
        };

        this.getAllGlobalNodes=function(){
            return globalNodeArray;
        };

        this.setWidgetList=function(goal,cld,sfd){
            // stores the widgets;
            widgetList.push(goal);
            widgetList.push(cld);
            widgetList.push(sfd);
            for (var i=0;i<widgetList.length;i++){
                // console.log("adding graph Obejct to global list"+i);
                graphObjectList.push(widgetList[i].graphObject);

            }
            return graphObjectList;
        };

        this.getGraphObjects=function(){
            // stores the widgets;
            return graphObjectList;
        };



        this.createStakeholderLink=function(src,tar,weight,value, index){

            // console.log("globalHelder generates a link;");
            //
            // console.log("Adding Normalized weights and values");
            //
            // console.log("n_weight="+weight);
            // console.log("value_str="+value);

            // assume we are goalTree
            var globalLink=that.createGlobalLink(graphObjectList[0]);

            // console.log("global LInk obj");
            // console.log(globalLink);

            globalLink.setLinkGenerator(graphObjectList[0],graphObjectList[0].createLink(graphObjectList[0]));
            that.addGlobalLink(globalLink);
            var repR=globalLink.filterInformation(graphObjectList[0]);
            repR.setGlobalLinkPtr(globalLink);
            // console.log(repR);
            // console.log(repR.setLinkTypus);
            repR.setLinkTypus(100);

            var srcRep=src.filterInformation(graphObjectList[0]);
            var tarRep=tar.filterInformation(graphObjectList[0]);
            repR.source(srcRep);
            repR.target(tarRep);
            globalLink.setSource(srcRep.getGlobalNodePtr());
            globalLink.setTarget(tarRep.getGlobalNodePtr());


            if ((srcRep.getTypeId()===3 || srcRep.getTypeId()===100)
                && (tarRep.getTypeId()===3 || tarRep.getTypeId()===100)
            ){
                // console.log("this should also be visible in CLD ");
                //
                var friendlyWidget=graphObjectList[0].parentWidget.cldGraphObj;
                globalLink.setVisibleInWidget(friendlyWidget,true);
                var friendlyLink=friendlyWidget.createLink(friendlyWidget);
                friendlyLink.setClassType(-1,"InterestLink");
                friendlyLink.setLinkTypus(100);
                friendlyLink.setNormalizedWeight(weight);
                friendlyLink.setEvaluationValue(value);
                friendlyLink.setPortIndex(index);
                globalLink.setLinkGenerator(friendlyWidget,friendlyLink);
                friendlyLink.setGlobalLinkPtr(globalLink);

                // this should also be visible in sfd;
                var sfd_friendlyWidget=graphObjectList[2];
                globalLink.setVisibleInWidget(sfd_friendlyWidget,true);
                friendlyLink=friendlyWidget.createLink(friendlyWidget);
                friendlyLink.setClassType(-1,"InterestLink");
                friendlyLink.setLinkTypus(100);
                friendlyLink.setNormalizedWeight(weight);
                friendlyLink.setEvaluationValue(value);
                friendlyLink.setPortIndex(index);
                globalLink.setLinkGenerator(sfd_friendlyWidget,friendlyLink);
                friendlyLink.setGlobalLinkPtr(globalLink);

            }
            gHandlerObj.redrawAllWidgets();




        };

        this.deleteGlobalLink = function (linkElement) {
            var correspondingGlobalLink = linkElement.getGlobalLinkPtr();
            globalLinkArray.splice(globalLinkArray.indexOf(correspondingGlobalLink), 1);
            that.redrawAllWidgets();
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
            that.redrawAllWidgets();
        };


        /** NODE HANDLING **/
        this.createGlobalNode = function (widgetOrGraphObject) {
            var gNode = new GlobalNode();
            gNode.setVisibleInWidget(widgetOrGraphObject, true);

            return gNode;
        };

        this.addGlobalNode = function (gNode) {
            globalNodeArray.push(gNode);
        };

        this.removeGlobalNode = function (gNode) {
            // splice that thing;
            globalNodeArray.splice(globalNodeArray.indexOf(gNode), 1);
            // remove all associated links of gNode;
            // TODO:!
            that.redrawAllWidgets();

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
            globalLinkArray.push(gLink);
        };

        this.removeGlobalLink = function (gLink) {
            // splice that thing;
            globalLinkArray.splice(globalLinkArray.indexOf(gLink), 1);
            for (var i=0;i<graphObjectList.length;i++)
                graphObjectList[i].forceRedrawContent();
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
            // console.log("Forcing all widgets to be redrawn");
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

                if (vis[0]===true && typ[0]===100){
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
                    obj.unit = node.getCriteriaUnit();
                    obj.weight=0;
                    obj.value=0;
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




        this.getNodeById=function(id){
          for (var i=0;i<globalNodeArray.length;i++){
              if (globalNodeArray[i].id()===id)
                  return globalNodeArray[i];
          }
        };

        this.requestSaveDataAsJson = function () {
            // console.log("We should return the global structure of that model");
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
                console.log("nodeEmail");
                console.log(node.getNodesEmail());
                if (node.getNodesEmail()){

                    obj.email=node.getNodesEmail();
                }
               // / obj.representedInWidgets=node.getRepresentedInWidget();
                obj.visibleInWidgets=node.getVisibleInWidget();
                console.log("nodeTypesInWdg");
                obj.nodeTypeId = node.getNodeTypeInWidgets();
                console.log(obj.nodeTypeId);
                obj.comments = node.getGlobalHoverText();
                obj.pos = node.getNodePositionsInWidgets();
                obj.metaData=node.getMetaData();

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
                // console.log(link);
                // console.log("isSFD "+link.isSFDLink());
                if (link.isSFDLink()){
                    // console.log("found SFD LINK!!!");
                    linkObj.sfdPortConnections=link.getSfdPortConnections();
                    // if this function exists then we have an sfd link;

                    // need to store the ports connections;l

                }
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
