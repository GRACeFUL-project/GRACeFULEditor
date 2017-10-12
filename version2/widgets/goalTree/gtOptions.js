function GTControls(parentWidget) {
    // todo: think about a parent widget
    /** variable defs **/

    BaseControls.apply(this,arguments);
    var that = this;
    // tells the graph which widget it talks to
    this.parent=parentWidget;
    this.optionsId=1;
    var goalchip, goalimage, goalChipNode, goalsGroup, goalName, goalType, goalComment, delGoal, criteriaUnit, additionalSettings, loadcld, saveCld, clearGT, importSt;


    this.loadGlobalLibraries=function(){
        // not used atm
        console.log("request the handler load libs");
        gHandlerObj.requestGlobalLibraryLoading();
    };

    this.generateControls=function(){
        goalsGroup = that.createAccordionGroup(that.divControlsGroupNode, "Goal");
        // goal Chip for the goalNames
        goalchipNode=that.addNodeTypeChip(goalsGroup,"Enter Node Name","#fafafa",that.onDeleteGoal,"gtChipField",false,"undefined","gt","./images/nodes/goal.png");
        goalchip = goalchipNode[0];
        goalimage= goalchipNode[1];

        // goalName = that.addLineEdit(goalsGroup, "Name", "", true, that.onChangeGoalName);
        // d3.select(goalName.node()).attr("placeholder" , "Enter Node name");
        goalType = that.addSelectionOpts(goalsGroup, "Type", ["Undefined", "Goal", "Sub Goal", "Criteria", "Stakeholder"], that.onChangeGoalType);
        var hideClass = goalType.node().options[goalType.node().length - 1];
        hideClass.hidden = true;
        
        goalComment = that.addTextEdit(goalsGroup, "Comments", "", true, that.onChangeGoalComment);
        //TODO: form fields when the goal type = criteria
        criteriaUnit = that.addLineEdit(goalsGroup, "Unit", "", true, that.onChangeUnit);
        d3.select(criteriaUnit.node().parentNode).classed("hidden", true);
        goalsGroup.collapseBody();
        // delGoal = that.addButtons(goalsGroup, "Delete", "goalDelete", that.onDeleteGoal);

        additionalSettings = that.createAccordionGroup(that.divControlsGroupNode, "Model Controls");


       // loadcld= that.addButton(additionalSettings, "LOAD GRAPH", "gtLOAD", that.loadFunction, "flat", true, "cloud_upload" );
        loadGlobalModel= that.addButton(additionalSettings, "LOAD GLOBAL MODEL", "gtLOAD", that.loadGlobalFunction, "flat", true, "cloud_upload" );
        // loadcld = that.addHrefButton(additionalSettings,"Load",that.loadFunction,true);
        // loadcld.setAttribute("class", "btn btn-default btn-sm");
        // loadcld.parentNode.setAttribute("id", "goalBasic");
        // loadcld.innerHTML = '<span class="glyphicon glyphicon-floppy-open"></span> Load Goal Tree';
        //
       // saveCld= that.addButton(additionalSettings, "SAVE GRAPH", "gtSAVE", that.saveFunction, "flat", true, "save" );
        saveGlobalModel= that.addButton(additionalSettings, "SAVE GLOBAL MODEL", "gtSAVE", that.saveGlobalFunction, "flat", true, "save" );
        // saveCld = that.addHrefButton(additionalSettings,"Save",that.saveFunction,false);
        // document.getElementById("goalBasic").appendChild(saveCld);
        // saveCld.setAttribute("class", "btn btn-default btn-sm pull-right");
        // saveCld.innerHTML = '<span class="glyphicon glyphicon-floppy-save"></span> Save Goal Tree';

        clearGT= that.addButton(additionalSettings, "CLEAR GRAPH", "gtClearGraph", that.clearGraph, "flat", true, "clear_all" );

        importSt= that.addButton(additionalSettings, "IMPORT STAKEHOLDERS", "buttonStake", that.importStakeholders, "flat", true, "get_app" );
        //loadLIbs= that.addButton(additionalSettings, "LOAD GLOBAL LIBRARIES", "buttonStake", that.loadGlobalLibraries, "flat", true, "file_upload" );

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

            goalType.node().disabled = false;
            goalComment.node().disabled = false;
            goalComment.node().value = that.selectedNode.hoverText;
            criteriaUnit.node().value = that.selectedNode.criteriaUnit;
            var gtId = that.selectedNode.getTypeId();
            d3.select('#chipElementId1').classed('hidden',false);
            if (gtId===100){
                gtId=4; // map in options to stakeholders
                d3.select('#chipElementId1').classed('hidden',true);

            }
            goalType.node().options[gtId].selected = "selected";

            // todo: @ rohan  fix the comments label thing;
            if (that.selectedNode.hoverText.length>0){
                d3.select("#labelIdForCLD").node().innerHTML='';

            }else {
                console.log("setting the comments tag");
                d3.select("#labelIdForCLD").node().innerHTML='Comments';
            }

            var selectType = goalType.node().options[gtId].value;
            if(selectType === "Criteria") {
                d3.select(criteriaUnit.node().parentNode).classed("hidden", false);
            }
            if(selectType !== "Criteria") {
                d3.select(criteriaUnit.node().parentNode).classed("hidden", true);
            }
            if(selectType === "Stakeholder") {
                goalType.node().disabled = true;
                goalComment.node().disabled = true;


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
    };

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
        var nameNode=that.selectedNode.label;
        that.parent.nodeDeletion(that.selectedNode);
        that.selectedNode = null;
        goalsGroup.collapseBody();


        var snackbarContainer = document.querySelector('#demo-toast-example');
        var data = {message: 'The node '+ nameNode +' has been deleted'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);

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

    this.saveGlobalFunction=function(){
        var action={};
        action.task="ACTION_SAVE_GLOBAL_JSON";
        that.parent.requestAction(action);
    };

    this.loadGlobalFunction=function(){
      //  console.log("loading global model function ");

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
       // console.log("hidden thing is clicked");
        hidden_solutionInput.click();
        loaderSolutionPathNode.remove(loaderSolutionPathNode);
        // tell what to do when clicked
        loaderSolutionPathNode.on("input",function(){
           // console.log("hidden thing is clicked");
            var files= loaderSolutionPathNode.property("files");
            if (files.length>0){
               // console.log("file?"+files[0].name);
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
                    action.task="ACTION_LOAD_GLOBAL_JSON";
                    action.data=readText;
                    that.parent.requestAction(action);
                    // kill the action object;
                    action=null;
                };
            }
        });
    };

    this.clearGraph=function(){
        parentWidget.clearGraph();
        var snackbarContainer = document.querySelector('#demo-toast-example');
        var data = {message: 'The graph has been cleared'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
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

    this.importStakeholders = function() {
        console.log("loading stakeholders");

        var hidden_solutionInput=document.createElement('input');
        hidden_solutionInput.id="IMPORT_STAKEHOLDERS";
        hidden_solutionInput.type="file";
        hidden_solutionInput.autocomplete="off";
        hidden_solutionInput.placeholder="load a csv File";
        hidden_solutionInput.setAttribute("class", "inputPath");
        // hidden_solutionInput.style.display="none";
        additionalSettings.getBody().node().appendChild(hidden_solutionInput);
        var loaderSolutionPathNode=d3.select("#IMPORT_STAKEHOLDERS");
        var fileElement;
        var fileName;
        // simulate click event;
        hidden_solutionInput.click();
        loaderSolutionPathNode.remove(loaderSolutionPathNode);
        // tell what to do when clicked
        loaderSolutionPathNode.on("change",function(){
            var files= loaderSolutionPathNode.property("files");
            if (files.length>0){
                console.log("file?"+files[0].name);
                fileElement=files[0];
                fileName=fileElement.name;
                loaderSolutionPathNode.remove();

                var results = Papa.parse(fileElement, {
                    header: true,
                    complete: function(results) {
                        console.log("CSV results: "+JSON.stringify(results));
                        // the the communication module about this
                        var action={};
                        action.task="ACTION_LOAD_STAKEHOLDERS";
                        action.data=results;
                        that.parent.requestAction(action);
                        // kill the action object;
                        action=null;
                    }
                });
            }
        });
    };


    that.start()

}
GTControls.prototype = Object.create(BaseControls.prototype);
GTControls.prototype.constructor = GTControls;
