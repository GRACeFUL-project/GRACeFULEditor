var baseInstanceIds=0;

function StakeHolderWidget(parentElement) {
    /** variable defs **/
    var that=this;
    this.className = "QWidget";
    this.tabName = "Questioner";
    this.myInstanceId = 500;
    this.uniqueIdentifyer="qwidget";
    this.widgetTabItem=undefined;
    this.graphObject=undefined;
    this.controlsObject=undefined;
    this.graphCssStyle="";
    this.graphSchema="default";
    this.parentElement=parentElement;
    this.handlerModule=undefined;

    this.gloatTreePtr=undefined;

    this.setGoalTreePtr=function(gtw){
        this.gloatTreePtr=gtw;
    };

    this.setCommunicationModule=function(mod){
        this.communicationModule=mod;
    };

    this.shadow_requestAction=function(action){
        // forward to the goalTree
        that.gloatTreePtr.requestAction(action);

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
        // that.setupMyGraphAndControls();

    };

    this.getCanvasArea=function(){
        if (this.canvasArea)
            return this.canvasArea;
        else return undefined;
    };

    this.updateSvgSize=function(){
        if (that.graphObject)
            that.graphObject.updateSvgSize();
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
                killToolBar();
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

    this.setupControls=function(){
        that.controlsObject=new QWControls(that);
        console.log("generating graph");
        this.graphObject=new qGraph(that);
        that.graphObject.initializeGraph();
    };

    this.setupMyGraphAndControls=function(){
        //this is related to individual widgets it self
        // MUST BE OVERWRITTEN BU THE WIDGET

        // initialize graph;


        that.setupControls();
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


        if (that.controlsObject)
            that.controlsObject.activateControls(true);

        if (that.graphObject)
            that.graphObject.activateGraph(true);


        if (that.getUniqueId() == "SimpleSFDWidget2") {
          clearAllToolbars();
          setActiveToolbar('widgetList');

        }else if (that.getUniqueId() == "CLDWidget1"){
          clearAllToolbars();
          setActiveToolbar('widgetListCLD');

        }else if (that.getUniqueId() == "GoalTreeWidget0"){
          clearAllToolbars();
          setActiveToolbar('widgetListGT');
        }else if (that.getUniqueId == "ExampleWidget0"){
          clearAllToolbars();
          setActiveToolbar('widgetListExampleB  ');
        }else {
            // hide the tool bar
            killToolBar();
           // console.log("Error matching the tab name" + that.getUniqueId());
        }
    };

    this.widgetLoadModel=function(){
      that.graphObject.integrateTheModel();
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

        var jObj=JSON.parse(jsonData);
        // validation;

        var modelType=jObj.type;
        var globalNodeElements=jObj.nodes;
        var globalLinkElements=jObj.links;
        var v;

      //  console.log("modelType "+modelType);
       // console.log("nodes "+globalNodeElements);
      //  console.log("links "+globalLinkElements);
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
                var nodeTypeId=s_node.nodeTypeId;
                var globalHoverText=s_node.comments;
                var storedPositions=s_node.pos;


                // create the global node
                var globalNode=handler.createGlobalNode(undefined);
                globalNode.id(storedId);
              //  console.log("have global hover text"+globalHoverText);
                globalNode.setGlobalHoverText(globalHoverText);
                for ( v=0;v<visible.length;v++){
                    globalNode.setVisibleInWidget(reprGraphObjects[v],visible[v]);
                    if (visible[v]===true){
                       var correspondingGraphObject=reprGraphObjects[v];
                        // create that node;
                        var correspondingNodeType=nodeTypeId[v];
                        globalNode.setNodeType(correspondingGraphObject,correspondingNodeType,
                            correspondingGraphObject.createNode(correspondingGraphObject));
                        var repNode=globalNode.filterInformation(correspondingGraphObject);
                        repNode.setGlobalNodePtr(globalNode);
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

                     //   console.log("generated the corresponding link representor");
                        globalLink.crateLinkFromOutside(correspondingGraphObject,
                            correspondingGraphObject.createLink(correspondingGraphObject));
                        var cLink=globalLink.filterInformation(correspondingGraphObject);
                        // get that status form the node
                        var lT=linkTypes[v];
                        var lV=linkValues[v];

                        if (cLink.setCLDLinkTypeFromOutside)
                            cLink.setCLDLinkTypeFromOutside(lT,lV);


                   //     console.log("DONE");

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

    this.loadStakeholderModel=function(text){
        console.log("loading text"+text);
        // create json object;
        var j_obj=JSON.parse(text);
        console.log("parsed text");
        console.log(j_obj);

        // create the elements in the graph object;
        // that.graphObject.createModelObjects(j_obj);
        that.graphObject.loadQuestionnaire(j_obj);
    };




    /** -------------------------------------------------------------**/
}// end of baseWidget def
StakeHolderWidget.prototype.constructor = StakeHolderWidget;
