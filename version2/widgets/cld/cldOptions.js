function CLDControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    this.parent=parentWidget;

    var nodesGroup,linksGroup ;

    var selectionNode,lineEditNode,commentNode;
    var causalSelection,commentLink;


    this.generateControls=function() {
        // testing stuff,
        nodesGroup = that.createAccordionGroup(that.divControlsGroupNode, "Nodes");
        selectionNode = that.addSelectionOpts(nodesGroup, "Class type", ["Undefined", "Factor", "Action", "Criteria"], that.onChangeNodeType);
        lineEditNode = that.addLineEdit(nodesGroup, "Node name", "", true, that.onChangeNodeName);
        commentNode = that.addTextEdit(nodesGroup, "Comments", "", true, that.onChangeNodeComment);


        linksGroup = that.createAccordionGroup(that.divControlsGroupNode, "Links");
        causalSelection = that.addSelectionOpts(linksGroup, "Causal relation", ["?", "+", "-"], that.onChangeLinkType);
        commentLink = that.addTextEdit(linksGroup, "Comments", "Comment On Link", true, that.onChangeLinkComment);
    };

    this.handleNodeSelection=function(node){

        // what type is given?



        if (node === undefined) {
            linksGroup.collapseBody();
            nodesGroup.collapseBody();
            return;
        }
        console.log("node type "+ node.getElementType());
        if (node.getElementType()==="NodeElement") {

            // should be overwritten by the real options thing
            console.log("controls handle node operation" + node);
            this.selectedNode = node;
                nodesGroup.expandBody();
                linksGroup.collapseBody();
                // should be overwritten by the real options thing
                lineEditNode.node().value = that.selectedNode.label;
                lineEditNode.node().disabled = false;
                commentNode.node().disabled = false;
                commentNode.node().value = that.selectedNode.hoverText;

                var selId = that.selectedNode.getTypeId();
                selectionNode.node().options[selId].selected = "selected";
        }

        if (node.getElementType()==="LinkElement") {

            // should be overwritten by the real options thing
            console.log("controls handle node operation" + node);
            this.selectedNode = node;
            nodesGroup.collapseBody();
            linksGroup.expandBody();

            // todo overwrite the values;

        }

    };



    this.onChangeLinkComment=function(){

    };
    this.onChangeLinkType=function (selectionContainer) {

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

