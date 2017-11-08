var baseInstanceIds=0;

function ActionWidget(parentElement) {
    /** variable defs **/
    var that=this;
    this.className = "ActionWidget";
    this.tabName = "Action Assessment";
    this.myInstanceId = 500;
    this.uniqueIdentifyer="actionWidget";
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
            // remove drag operations of tabs items
            widgetTabItem.ondragstart=function(){
                return false;
            }; 
            listItem.appendChild(widgetTabItem);
            tabWidgetHolder.appendChild(listItem);
            var tabNode = d3.select("#" + that.getUniqueId());
            tabNode.classed("tabHighlightNot", true);
            that.widgetTabItem=widgetTabItem;
        }
    };

    this.setupControls=function(){
        that.controlsObject=new actionControls(that);
        console.log("generating graph");
        this.graphObject=new actionGraph(that);
        that.graphObject.initializeGraph();
    };

    this.setupMyGraphAndControls=function(){
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
        }
    };

    this.widgetLoadAssessment=function(){
        console.log("Widget action assessment");
        that.graphObject.tableActions();
    };

    /** -------------------------------------------------------------**/
}// end of actionwidget def
ActionWidget.prototype.constructor = ActionWidget;
