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

    this.setCommunicationModule=function(mod){
        this.communicationModule=mod;
    };


    this.getOptionsArea=function(){
      return parentElement.getOptionsArea();

    };

    this.getGraphObject=function(){
      return that.graphObject;
    }


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
                console.log("Oh oh a tab was clicked");
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

        // console.log("does controls object exist?"+that.controlsObject);
        if (that.controlsObject)
            that.controlsObject.activateControls(true);

        if (that.getUniqueId() == "SimpleSFDWidget3") {
          clearAllToolbars();
          setActiveToolbar('widgetList');

        }else if (that.getUniqueId() == "CLDWidget2"){
          clearAllToolbars();
          setActiveToolbar('widgetListCLD');

        }else if (that.getUniqueId() == "GoalTreeWidget1"){
          clearAllToolbars();
          setActiveToolbar('widgetListGT');
        }else if (that.getUniqueId == "ExampleWidget0"){
          clearAllToolbars();
          setActiveToolbar('widgetListExampleB  ');
        }else
          console.log("Error matching the tab name"+that.getUniqueId());

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
        tempHref.download="someFileName.json";
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
