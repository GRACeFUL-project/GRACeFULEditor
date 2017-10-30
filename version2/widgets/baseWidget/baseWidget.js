var baseInstanceIds=0;

function BaseWidget(parentElement) {
    /** variable defs **/
    var that=this;
    this.className = "BaseWidget";
    this.communicationModule = undefined;
    this.tabName = "Unnamed";
    this.myInstanceId = baseInstanceIds++;
    this.uniqueIdentifyer="";
    this.widgetTabItem=undefined;
    this.graphObject=undefined;
    this.controlsObject=undefined;
    this.graphCssStyle="";
    this.graphSchema="default";
    this.parentElement=parentElement;
    this.handlerModule=undefined;

    this.setCommunicationModule=function(mod){
        this.communicationModule=mod;
    };


    /** Setter and Getter for the handler module**/
    this.setHandlerModule=function(handler){
        this.handlerModule=handler;
    };
    this.getHandler=function(){
        return that.handlerModule;
    };

    this.getOptionsArea=function(){
      return parentElement.getOptionsArea();

    };

    this.getGraphObject=function(){
      return that.graphObject;
    };


    this.setupGuiElements=function(navigation,tabs,canvas,controls){
        // console.log("Setting up the widget Gui");
        //tells this widget where to find the dom of the homepage.
        this.navMenu=navigation;
        this.tabMenu=tabs;
        this.canvasArea=canvas;
        this.controlsArea=controls;
        // setup the visualizations
         that.setupWidget();
         that.setupMyGraphAndControls();

    };

    this.getCanvasArea=function(){
        if (this.canvasArea)
            return this.canvasArea;
        else return undefined;
    };

    this.updateSvgSize=function(){
        if (that.graphObject)
            that.graphObject.updateSvgSize();

        //
        // var w= window.innerWidth*0.2;
        // if (w<300)
        //     w=500;
        //  that.controlsObject.parent.getOptionsArea().style({
        //      'width': 300+'px'
        //  });
        // console.log(that.controlsObject.divControlsGroupNode.node());
    };

    this.setupWidget=function(){
        // this is global for all widets
        var tabWidgetHolder=this.tabMenu.node();
        if (that.widgetTabItem===undefined) {
            var listItem = document.createElement('li');
            listItem.id = that.getUniqueId();
            var widgetTabItem = document.createElement('a');
            widgetTabItem.href = "#";
            widgetTabItem.innerHTML = that.tabName;
            widgetTabItem.onclick = function () {

                resurectToolBar();
                that.widgetIsActivated();

            };
            widgetTabItem.ondragstart=function(){return false;}; // remove drag operations of tabs items
            listItem.appendChild(widgetTabItem);
            tabWidgetHolder.appendChild(listItem);
            var tabNode = d3.select("#" + that.getUniqueId());
            tabNode.classed("tabHighlightNot", true);
            that.widgetTabItem=widgetTabItem;
        }
    };

    this.setupMyGraphAndControls=function(){
        //this is related to individual widgets it self
        // MUST BE OVERWRITTEN BU THE WIDGET
    };


    this.setupControls=function(){
        console.log("Base class does not implement this");

    };


    this.setClassName = function (uniqueClassName) {
        that.className=uniqueClassName;
        that.uniqueIdentifyer=uniqueClassName+that.myInstanceId;
    };
    this.getUniqueId=function () {
        return that.uniqueIdentifyer;
    };


    this.setTabTitle=function(title){
        that.tabName=title;
        // update in the gui;
        if (that.widgetTabItem) {
            that.widgetTabItem.innerHTML = title;
        }
    };


    this.forceGraphCssStyle=function(cssStyle){
        // if we have a graph;
        this.graphCssStyle=cssStyle;
        if (that.graphObject)
            that.graphObject.graphStyle(cssStyle);
    };

    this.getGraphCssStyle=function(){
        return that.graphCssStyle;
    };


    this.updateCommunicationSolverAddres=function(val){
        console.log("updating sover Address: "+val);
        that.communicationModule.registerSolver(val);
    };

    this.enableHUD=function(val){
        // enables HUD / legend for a graph object

        if (that.graphObject.enableHUD) // check if this function exists;
            that.graphObject.enableHUD(val);

    };

    this.deactivateWidget=function () {
        var tabNode=d3.select("#"+that.getUniqueId());
        tabNode.classed("tabHighlight",false);
        tabNode.classed("tabHighlightNot",true);
        if (that.graphObject)
            that.graphObject.activateGraph(false);
        if (that.controlsObject)
            that.controlsObject.activateControls(false);
    };

    this.widgetIsActivated=function(){
        // console.log(that.tabName+" is activated! ");
        // get the d3 node and add a style

        var tabNode=d3.select("#"+that.getUniqueId());
        tabNode.classed("tabHighlight",true);
        tabNode.classed("tabHighlightNot",false);
        //tell the main container about this

        that.parentElement.widgetActivated(this);

        if (that.graphObject)
            that.graphObject.activateGraph(true);


        if (that.controlsObject)
            that.controlsObject.activateControls(true);

        if (that.getUniqueId() == "SimpleSFDWidget2") {
          clearAllToolbars();
          setActiveToolbar('widgetList');
          resurectToolBar();

        }else if (that.getUniqueId() == "CLDWidget1"){
          clearAllToolbars();
          setActiveToolbar('widgetListCLD');
          resurectToolBar();

        }else if (that.getUniqueId() == "GoalTreeWidget0"){
          clearAllToolbars();
          setActiveToolbar('widgetListGT');
            resurectToolBar();
        }else if (that.getUniqueId == "ExampleWidget0"){
          clearAllToolbars();
          setActiveToolbar('widgetListExampleB  ');
          resurectToolBar();
        }else {
            console.log("Error matching the tab name" + that.getUniqueId());
            killToolBar();
        }

    };


    // selection stuff;
    this.handleSelection=function(node){
        console.log("handling Selection of a node");
        that.controlsObject.handleNodeSelection(node);

    };

    this.nodeDeletion = function(node) {
        that.graphObject.handleNodeDeletion(node);
    };

    this.linkDeletion = function(link) {
        that.graphObject.handleLinkDeletion(link);
    };

    this.loadGlobalModelAsJSON=function(jsonData){
      //  console.log("lets load the global model");
        // get at
      //  console.log("read the data");
        //console.log(jsonData);

        that.getHandler().emptyGraphStructure();

        var jObj=JSON.parse(jsonData);
        // validation;

        var modelType=jObj.type;
        var globalNodeElements=jObj.nodes;
        var globalLinkElements=jObj.links;
        var v;

      //  console.log("modelType "+modelType);
       // console.log("nodes "+globalNodeElements);
        console.log("links "+globalLinkElements);
        console.log(globalLinkElements);
        if (modelType==="GLOBAL_MODEL"){
            // nice we have a global model

            // get a handler for creation
            var handler=that.getHandler();
            var reprGraphObjects=handler.getGraphObjects();
            for (var i=0;i<globalNodeElements.length;i++){

                // stored data;
                var s_node=globalNodeElements[i];
                var storedId=s_node.id;
                var storedName=s_node.name;
                var visible=s_node.visibleInWidgets;
                var nodeMetaData=s_node.metaData;
                var nodeTypeId=s_node.nodeTypeId;
                var globalHoverText=s_node.comments;
                var storedPositions=s_node.pos;
                var storedEmail=s_node.email;


                // create the global node
                var globalNode=handler.createGlobalNode(undefined);
                globalNode.id(storedId);
              //  console.log("have global hover text"+globalHoverText);
                globalNode.setGlobalHoverText(globalHoverText);

                globalNode.setNodeEmail(storedEmail);

                for ( v=0;v<visible.length;v++){
                    globalNode.setVisibleInWidget(reprGraphObjects[v],visible[v]);
                    if (visible[v]===true){
                       var correspondingGraphObject=reprGraphObjects[v];
                        // create that node;
                        var correspondingNodeType=nodeTypeId[v];

                        if (correspondingGraphObject.createFriendlyNode){
                            globalNode.setNodeType(correspondingGraphObject,correspondingNodeType,
                                correspondingGraphObject.createFriendlyNode(correspondingGraphObject));
                        }else{
                        globalNode.setNodeType(correspondingGraphObject,correspondingNodeType,
                            correspondingGraphObject.createNode(correspondingGraphObject));
                        }
                        var repNode=globalNode.filterInformation(correspondingGraphObject);
                        repNode.setGlobalNodePtr(globalNode);
                        globalNode.setGlobalMetaDataArray(nodeMetaData);

                        // set globalMetaData for the object;


                        // set the position of that element;
                        var correspondingPosition=storedPositions[v];
                        if (correspondingPosition.x!==0 && correspondingPosition.y!==0){
                            // copy the position to the node;
                            repNode.x=correspondingPosition.x;
                            repNode.y=correspondingPosition.y;

                        }
                        if (globalHoverText && globalHoverText.length>0) {
                            globalNode.setGlobalHoverText(globalHoverText);
                        }
                        globalNode.setGlobalName(storedName);
                    }
                }// end of for loop that handles information
                handler.addGlobalNode(globalNode);
            }
            // force the sfdgraph to redraw;
            reprGraphObjects[2].forceRedrawContent();
            console.log("nodes should be visible and present now'");
            // LINK GENERATION; more complex but hey;
            for (i=0;i<globalLinkElements.length;i++){
                // stored data;
                var s_link=globalLinkElements[i];
                var storedId=s_link.id;
                var storedSourceTargetIds=s_link.source_target;
                var visible=s_link.visibleInWidgets;
                var linkTypes=s_link.linkTypesInWidgets; // array of types (causal relation etc..)
                var linkValues=s_link.linkValuesInWidgets; // array of values (+,-,? etc)
                var linkCpStatus=s_link.controlPointsStatus;
                var linkCpPos=s_link.controlPointsPosition;
                var linkSfdCon=s_link.sfdPortConnections;

                var globalLink=handler.createGlobalLink(undefined);
                globalLink.id(storedId);

                // set the global source and target ids;
              //  console.log("setting global source/target");
                var g_srcId=storedSourceTargetIds[0];
                var g_tarId=storedSourceTargetIds[1];

                var gNodeSrc=handler.findNodeWithId(g_srcId);
                var gNodeTar=handler.findNodeWithId(g_tarId);

                if (gNodeSrc===undefined || gNodeTar===undefined){
                    console.log("cant create the global link")
                }

                globalLink.setSource(gNodeSrc);
                globalLink.setTarget(gNodeTar);

                for ( v=0;v<visible.length;v++){
                    globalLink.setVisibleInWidget(reprGraphObjects[v],visible[v]);
                    if (visible[v]===true){
                        var correspondingGraphObject=reprGraphObjects[v];
                        // create that node;
                        var correspondingLinkType=linkTypes[v];
                        var correspondingLinkValue=linkValues[v];

                        if (v===0){
                            globalLink.crateLinkFromOutside(correspondingGraphObject,
                                correspondingGraphObject.createLink(correspondingGraphObject));
                        }
                        if (v===2){
                            if (visible[0]===false && visible[1]===false && visible[2]===true){
                                // this should be an sdf link
                                // create the sfd link inside the sfd graph
                                var sfdgraph=reprGraphObjects[2];
                                globalLink=gHandlerObj.createGlobalLink(sfdgraph);

                                globalLink.setLinkGenerator(sfdgraph,sfdgraph.createLink(sfdgraph));
                                //handler.addGlobalLink(globalLink);
                                var repR=globalLink.filterInformation(sfdgraph);
                                repR.setGlobalLinkPtr(globalLink);
                                globalLink.setSource(gNodeSrc);
                                globalLink.setTarget(gNodeTar);

                                // update the ports connections;;
                                var sourceNode=gNodeSrc.getSfdNode();
                                var targetNode=gNodeTar.getSfdNode();

                                for (var p=0;p<linkSfdCon.length;p++) {
                                    var sourcePort = sourceNode.getPortWithId(linkSfdCon[p].s);
                                    var targetPort = targetNode.getPortWithId(linkSfdCon[p].t);
                                    var seenLink = repR.validateConnection(sourceNode, targetNode);
                                    if (seenLink === false) {
                                        repR.source(sourceNode);
                                        repR.target(targetNode);
                                        repR.addPortConnection(sourcePort, targetPort);
                                    } else {
                                        seenLink.setMultiLinkType(true);
                                        seenLink.addPortConnection(sourcePort, targetPort);
                                    }
                                    targetPort.isUsed(true);
                                    sourcePort.isUsed(true);
                                }

                            }
                        }

                        if (visible[0]===false && visible[1]===true && visible[2]===true){
                            // create a corresponding link if v==1;

                            if(v===1) {
                                globalLink.crateLinkFromOutside(correspondingGraphObject,
                                    correspondingGraphObject.createLink(correspondingGraphObject));
                                var cLink = globalLink.filterInformation(correspondingGraphObject);
                                // get that status form the node
                                var lT = linkTypes[v];
                                var lV = linkValues[v];

                                if (cLink.setCLDLinkTypeFromOutside)
                                    cLink.setCLDLinkTypeFromOutside(lV, lV);
                            }
                            if (v===2){
                                // craete a cld link that is used in sfd
                                //   console.log("generated the corresponding link representor");
                                globalLink.crateLinkFromOutside(correspondingGraphObject,
                                    reprGraphObjects[1].createLink(reprGraphObjects[1]));
                            }

                        }


                   //     console.log("DONE");
                        console.log(linkCpStatus);
                        if (linkCpStatus[v]===true){
                            // add the controlpoint position from the loaded json model
                            cLink.setControlPoint(linkCpPos[v]);
                        }
                    }
                }// end of for loop that handles information
                handler.addGlobalLink(globalLink);
            }
            // force redraw
            handler.redrawAllWidgets();
        }



    };

    this.saveGlobalModelAsJSON=function(){
        console.log("Saving Global Model");

        // get the handler
        var handler=that.getHandler();
        var saveObj=handler.requestSaveDataAsJson();
        console.log("text to write: "+saveObj);
        // create a hidden wrapper for saving files;

        var tempHref=document.createElement('a');
        tempHref.type="submit";
        tempHref.href="#";
        tempHref.download="";
        tempHref.innerHTML="Save Global Model";
        tempHref.id="temporalHrefId";

        that.controlsObject.divControlsGroupNode.node().appendChild(tempHref);
        tempHref.href="data:text/json;charset=utf-8," + encodeURIComponent(saveObj);
        tempHref.download="globalModel.json";
        tempHref.click();
        tempHref.hidden = true;
        // remove that thing
        d3.select("#TemporalDiv").remove();

    };


/** COMMUNICATION BASE WIDGET HANDLING  -------------------------------------------------------------**/
    this.requestAction=function(action){
        this.communicationModule.actionProcessing(that,action);

    };

    this.updateIfNeeded=function(){
        if (that.graphObject.needsRedraw()===true)
            that.graphObject.forceRedrawContent();
    };

    this.saveAsJSON=function(){
        // request from the graph all graph data that can be accessed from it;
        console.log("requesting save json for this widget");
        var saveObj=that.graphObject.requestSaveDataAsJson();
        console.log("text to write: "+saveObj);

        // create a hidden wrapper for saving files;

        var tempHref=document.createElement('a');
        tempHref.type="submit";
        tempHref.href="#";
        tempHref.download="";
        tempHref.innerHTML="Send Model";
        tempHref.id="temporalHrefId";

        that.controlsObject.divControlsGroupNode.node().appendChild(tempHref);
        tempHref.href="data:text/json;charset=utf-8," + encodeURIComponent(saveObj);
        tempHref.download="example.json";
        tempHref.click();
        tempHref.hidden = true;
        // remove that thing
        d3.select("#TemporalDiv").remove();
    };

    // LOAD JSON ACTION
    this.loadJSON=function(jsonData){
        // base widget does not load data it self;
        that.graphObject.emptyGraphStructure(); //<< clears current graph structure
        this.graphObject.forceRedrawContent(); //<< redraws the new graph structure
    };

    this.parseJSON=function(jsonObj){
        console.log("Parsing Json obj"+jsonObj);
        // you need to know the json structure that you are loading
        // for each widget we will have to modify this functions;
        var jsonTyp=jsonObj.type;
        var nodes=jsonObj.nodes;
        console.log("we have type:"+jsonTyp);
        // usually  they are some how separated like in webvowl
        // so we can here combine the classes and attributes or what ever
        // and then give this to the graph object;
        // for now only nodes are given;





    };



    /** -------------------------------------------------------------**/
}// end of baseWidget def
BaseWidget.prototype.constructor = BaseWidget;
