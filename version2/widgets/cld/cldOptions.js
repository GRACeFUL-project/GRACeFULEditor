function CLDControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    this.parent=parentWidget;
    var selectionNode,lineEditNode,commentNode;


    this.generateControls=function(){
        // testing stuff,
        console.log("hello world");


        var accordion= that.createAccordionGroup(that.divControlsGroupNode,"Nodes");
        selectionNode = that.addSelectionOpts(accordion,"Class type",["Undefined","Factor", "Action", "Criteria"],that.onChangeNodeType);
        lineEditNode  = that.addLineEdit(accordion,"Node name","",true,that.onChangeNodeName);
        commentNode   = that.addTextEdit(accordion,"Comments","",true,that.onChangeNodeComment);


    };

    this.handleNodeSelection=function(node){
        // should be overwritten by the real options thing
        this.selectedNode=node;
        // should be overwritten by the real options thing
        lineEditNode.node().value=that.selectedNode.label;
        lineEditNode.node().disabled=false;
        commentNode.node().disabled=false;
        commentNode.node().value=that.selectedNode.hoverText;

        var selId=that.selectedNode.getTypeId();
        console.log("The selectioon id is "+selId);

        selectionNode.node().options[selId].selected="selected";


    };


    this.handleNodeUnSelection=function(node){
        // should be overwritten by the real options thing

    };

    this.onChangeNodeType=function(selectionContainer){

        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        console.log(selectionContainer.selectedIndex+" the user string is "+strUser);
        that.selectedNode.setType(selectionContainer.selectedIndex);

    };
    this.onChangeNodeName=function(){
        that.selectedNode.setLabelText(lineEditNode.node().value);
    };
    this.onChangeNodeComment=function(){
        that.selectedNode.setHoverText(commentNode.node().value);
    };


    this.start();

}

CLDControls.prototype = Object.create(BaseControls.prototype);
CLDControls.prototype.constructor = CLDControls;

