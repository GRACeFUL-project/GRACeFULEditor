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
    this.parentElement=parentElement;


    this.getOptionsArea=function(){
      return parentElement.getOptionsArea();

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

    };


    // selection stuff;
    this.handleSelection=function(node){
        // console.log("handling Selection of a node");
        that.controlsObject.handleNodeSelection(node);

    };

    this.nodeDeletion = function(node) {
        that.graphObject.handleNodeDeletion(node);
    };

    this.linkDeletion = function(link) {
        that.graphObject.handleLinkDeletion(link);
    };

    
/** -------------------------------------------------------------**/
}// end of baseWidget def
BaseWidget.prototype.constructor = BaseWidget;
