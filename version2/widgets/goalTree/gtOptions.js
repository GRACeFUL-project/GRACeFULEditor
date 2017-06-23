function GTControls(parentWidget) {
    // todo: think about a parent widget
    /** variable defs **/

    BaseControls.apply(this,arguments);
    var that = this;
    // tells the graph which widget it talks to
    this.parent=parentWidget;

    var goalsGroup, goalName, goalType, goalComment, delGoal;

    this.generateControls=function(){
        goalsGroup = that.createAccordionGroup(that.divControlsGroupNode, "Goals");
        goalName = that.addLineEdit(goalsGroup, "Name", "", true, that.onChangeGoalName);
        goalType = that.addSelectionOpts(goalsGroup, "Type", ["Undefined", "Main Goal", "Sub Goal", "Criteria"], that.onChangeGoalType);
        goalComment = that.addTextEdit(goalsGroup, "Comments", "", true, that.onChangeGoalComment);
        delGoal = that.addButtons(goalsGroup, "Delete", "goalDelete", that.onDeleteGoal);

        //TODO: form fields when the goal type = criteria

    };

    this.handleNodeSelection = function(node) {
        if (node === undefined) {
            return;
        }

        this.selectedNode = node;

        if (node.getElementType()==="NodeElement") {
            goalName.node().value = that.selectedNode.label;
            goalName.node().disabled = false;
            goalComment.node().disabled = false;
            goalComment.node().value = that.selectedNode.hoverText;

            var gtId = that.selectedNode.getTypeId();
            goalType.node().options[gtId].selected = "selected";
        }
    };

    this.onChangeGoalName = function() {
    that.selectedNode.setLabelText(goalName.node().value);
    };

    this.onChangeGoalType = function(selectionContainer) {
        var selectType = selectionContainer.options[selectionContainer.selectedIndex].value;
        console.log(selectionContainer.selectedIndex+" the goal type is "+selectType);
        that.selectedNode.setType(selectionContainer.selectedIndex);
    };

    this.onChangeGoalComment = function() {
    that.selectedNode.setHoverText(goalComment.node().value);
    };

    this.onDeleteGoal = function() {
        that.parent.nodeDeletion(that.selectedNode);
        that.selectedNode = null;
    }; 


    that.start()

}
GTControls.prototype = Object.create(BaseControls.prototype);
GTControls.prototype.constructor = GTControls;

