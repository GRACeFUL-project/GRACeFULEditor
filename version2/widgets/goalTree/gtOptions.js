function GTControls(parentWidget) {
    // todo: think about a parent widget
    /** variable defs **/

    BaseControls.apply(this,arguments);
    var that = this;
    // tells the graph which widget it talks to
    this.parent=parentWidget;

    var goalchip, goalimage, goalChipNode, goalsGroup, goalName, goalType, goalComment, delGoal, criteriaUnit, additionalSettings, loadcld, saveCld;

    this.generateControls=function(){
        goalsGroup = that.createAccordionGroup(that.divControlsGroupNode, "Goal");
        // goal Chip for the goalNames
        goalchipNode=that.addNodeTypeChip(goalsGroup,"Enter Node Name","#fafafa",that.onDeleteGoal,"gtChipField",true,"undefined","gt","./images/nodes/goal.png");
        goalchip = goalchipNode[0];
        goalimage= goalchipNode[1];

        // goalName = that.addLineEdit(goalsGroup, "Name", "", true, that.onChangeGoalName);
        // d3.select(goalName.node()).attr("placeholder" , "Enter Node name");
        goalType = that.addSelectionOpts(goalsGroup, "Type", ["Undefined", "Goal", "Sub Goal", "Criteria"], that.onChangeGoalType);
        goalComment = that.addTextEdit(goalsGroup, "Comments", "", true, that.onChangeGoalComment);
        //TODO: form fields when the goal type = criteria
        criteriaUnit = that.addLineEdit(goalsGroup, "Unit", "", true, that.onChangeUnit);
        d3.select(criteriaUnit.node().parentNode).classed("hidden", true);

        // delGoal = that.addButtons(goalsGroup, "Delete", "goalDelete", that.onDeleteGoal);

        additionalSettings = that.createAccordionGroup(that.divControlsGroupNode, "Settings");
        loadcld = that.addHrefButton(additionalSettings,"Load",that.loadFunction,true);
        loadcld.setAttribute("class", "btn btn-default btn-sm");
        loadcld.parentNode.setAttribute("id", "goalBasic");
        loadcld.innerHTML = '<span class="glyphicon glyphicon-floppy-open"></span> Load Goal Tree';

        saveCld = that.addHrefButton(additionalSettings,"Save",that.saveFunction,false);
        document.getElementById("goalBasic").appendChild(saveCld);
        saveCld.setAttribute("class", "btn btn-default btn-sm pull-right");
        saveCld.innerHTML = '<span class="glyphicon glyphicon-floppy-save"></span> Save Goal Tree';
    };

    this.handleNodeSelection = function(node) {
        if (node === undefined) {
            return;
        }

        this.selectedNode = node;

        if (node.getElementType()==="NodeElement") {
            goalsGroup.expandBody();

            // goalName.node().value = that.selectedNode.label;
            // goal Chip for The goalNames
            goalchip.innerHTML=that.selectedNode.label;
            goalimage.setAttribute('src',that.selectedNode.getImageURL());

            // goalName.node().disabled = false;
            goalComment.node().disabled = false;
            goalComment.node().value = that.selectedNode.hoverText;
            criteriaUnit.node().value = that.selectedNode.criteriaUnit;
            var gtId = that.selectedNode.getTypeId();
            goalType.node().options[gtId].selected = "selected";

            var selectType = goalType.node().options[gtId].value;
            if(selectType === "Criteria") {
                d3.select(criteriaUnit.node().parentNode).classed("hidden", false);
            }
            if(selectType !== "Criteria") {
                d3.select(criteriaUnit.node().parentNode).classed("hidden", true);
            }
        }

        if(node.getElementType()==="LinkElement") {
            goalsGroup.collapseBody();
        }
    };

    this.onChangeGoalName = function() {
      // change the value to be displayed on the node.
      that.selectedNode.clearDisplayLabelText();
      that.selectedNode.setDisplayLabelText(goalName.node().value);
      // change the value of the tooltip.
      that.selectedNode.clearLabelText();
      that.selectedNode.setLabelText(goalName.node().value);

    }

    this.onChangeGoalType = function(selectionContainer) {
        var selectType = selectionContainer.options[selectionContainer.selectedIndex].value;
        console.log(selectionContainer.selectedIndex+" the goal type is "+selectType);
        that.selectedNode.setType(selectionContainer.selectedIndex, selectType);
        if(selectType === "Criteria") {
            d3.select(criteriaUnit.node().parentNode).classed("hidden", false);
        }
        else {
            d3.select(criteriaUnit.node().parentNode).classed("hidden", true);
        }
    };

    this.onChangeGoalComment = function() {
    that.selectedNode.setHoverText(goalComment.node().value);
    };

    this.onDeleteGoal = function() {
        that.parent.nodeDeletion(that.selectedNode);
        that.selectedNode = null;
        goalsGroup.collapseBody();

    };

    this.onChangeUnit =function() {
        that.selectedNode.setCriteriaUnit(criteriaUnit.node().value);
    };

    this.saveFunction=function(){
        console.log("saving was pressed");
        var action={};
        action.task="ACTION_SAVE_JSON";
        that.parent.requestAction(action);
    };

    this.loadFunction=function(){
        console.log("loading was pressed");
        // create a temporary file loader
        var hidden_solutionInput=document.createElement('input');
        hidden_solutionInput.id="HIDDEN_SOLUTION_JSON_INPUT";
        hidden_solutionInput.type="file";
        //hidden_solutionInput.style.display="none";
        hidden_solutionInput.autocomplete="off";
        hidden_solutionInput.placeholder="load a json File";
        hidden_solutionInput.setAttribute("class", "inputPath");
        // hidden_solutionInput.style.display="none";
        additionalSettings.getBody().node().appendChild(hidden_solutionInput);
        var loaderSolutionPathNode=d3.select("#HIDDEN_SOLUTION_JSON_INPUT");
        var fileElement;
        var fileName;
        var readText;
        // simulate click event;
        console.log("hidden thing is clicked");
        hidden_solutionInput.click();
        loaderSolutionPathNode.remove(loaderSolutionPathNode);
        // tell what to do when clicked
        loaderSolutionPathNode.on("input",function(){
            console.log("hidden thing is clicked");
            var files= loaderSolutionPathNode.property("files");
            if (files.length>0){
                console.log("file?"+files[0].name);
                fileElement=files[0];
                fileName=fileElement.name;
                loaderSolutionPathNode.remove();

                // read this file;
                var reader = new FileReader();
                reader.readAsText(fileElement);
                reader.onload = function () {
                    readText = reader.result;
                    // the the communication module about this
                    var action={};
                    action.task="ACTION_LOAD_JSON";
                    action.data=readText;
                    that.parent.requestAction(action);
                    // kill the action object;
                    action=null;
                };
            }
        });
    };


    that.start()

}
GTControls.prototype = Object.create(BaseControls.prototype);
GTControls.prototype.constructor = GTControls;
