function CLDControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    this.parent=parentWidget;

    var nodesGroup,linksGroup ;

    var selectionNode,lineEditNode,commentNode;
    var causalSelection,commentLink;
    var delNodeBtn, delLinkBtn, extFactorBtn, loopBtn;


    this.generateControls=function() {
        // testing stuff,
        nodesGroup = that.createAccordionGroup(that.divControlsGroupNode, "Nodes");
        selectionNode = that.addSelectionOpts(nodesGroup, "Class type", ["Undefined", "Factor", "Action", "Criteria", "External Factor"], that.onChangeNodeType);
        var hideClass = selectionNode.node().options[selectionNode.node().length - 1];
        hideClass.hidden = true;
        lineEditNode = that.addLineEdit(nodesGroup, "Node name", "", true, that.onChangeNodeName);
        commentNode = that.addTextEdit(nodesGroup, "Comments", "", true, that.onChangeNodeComment);
        delNodeBtn = that.addButtons(nodesGroup, "Delete", "nodeDelete", that.deleteNodes);


        linksGroup = that.createAccordionGroup(that.divControlsGroupNode, "Links");
        causalSelection = that.addSelectionOpts(linksGroup, "Causal relation", ["?", "+", "-"], that.onChangeLinkType);
        commentLink = that.addTextEdit(linksGroup, "Comments", "", true, that.onChangeLinkComment);
        delLinkBtn = that.addButtons(linksGroup, "Delete", "linkDelete", that.deleteLinks);

        additionalSettings = that.createAccordionGroup(that.divControlsGroupNode, "Settings");
        extFactorBtn = that.addButtons(additionalSettings, "Identify External Factors", "extF", that.identifyExtFact);

        loopBtn = that.addButtons(additionalSettings, "Identify Feeback Loops", "loops", that.feedbackLoop);
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
            // console.log("controls handle node operation" + node);
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
            var selId = that.selectedNode.getTypeId();
            causalSelection.node().options[selId].selected="selected";
            commentLink .node().disabled = false;
            commentLink .node().value = that.selectedNode.hoverText;

        }

    };



    this.onChangeLinkComment=function(){
        that.selectedNode.setHoverText(commentLink.node().value);
    };
    this.onChangeLinkType=function (selectionContainer) {
        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        console.log(selectionContainer.selectedIndex+" the user string is "+strUser);
        that.selectedNode.setCLDTypeString(selectionContainer.selectedIndex);

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

    this.deleteNodes = function() {
        that.parent.nodeDeletion(that.selectedNode);
        that.selectedNode = null;
    };

    this.deleteLinks = function() {
        that.parent.linkDeletion(that.selectedNode);
        that.selectedNode = null;
    };

    this.identifyExtFact = function() {
        that.parent.identifyExtFact();
    };

    this.feedbackLoop = function() {
        that.parent.identifyLoops();
    }
    
    this.start();

}

CLDControls.prototype = Object.create(BaseControls.prototype);
CLDControls.prototype.constructor = CLDControls;

