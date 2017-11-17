function QWControls(parentWidget) {
    // todo: think about a parent widget
    /** variable defs **/

    BaseControls.apply(this,arguments);
    var that = this;
    // tells the graph which widget it talks to
    this.parent=parentWidget;

    var resultIntegration, goalchip, goalimage, goalChipNode, goalsGroup, goalName, goalType, goalComment, delGoal, criteriaUnit, additionalSettings, loadcld, saveCld, clearGT, importSt;


    this.loadGlobalLibraries=function(){
        // not used atm
        console.log("request the handler load libs");
        gHandlerObj.requestGlobalLibraryLoading();
    };

    this.generateControls=function(){

        additionalSettings = that.createAccordionGroup(that.divControlsGroupNode, "Model Controls");
        // loadcld= that.addButton(additionalSettings, "LOAD GRAPH", "gtLOAD", that.loadFunction, "flat", true, "cloud_upload" );
        that.addButton(additionalSettings, "IMPORT MODEL", "gtLOAD", that.importModelFkt, "flat", true, "cloud_upload" );
        // that.addButton(additionalSettings, "LOAD MODEL", "gtLOAD", that.loadGlobalFunction, "flat", true, "get_app" );


        resultIntegration= that.createAccordionGroup(that.divControlsGroupNode, "Survey Results");
        that.addButton(resultIntegration, "LOAD RESULTS ", "gtLOAD", that.loadResults, "flat", true, "cloud_download" );





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
            goalType.node().options[gtId].selected = "selected";

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

    this.importModelFkt=function(){
        //assume you have a generated model in the memory;


        console.log("well import the model");
        if (gHandlerObj.hasModel()===false){
            console.log("corrently no model present" );
            return;
        }

        console.log("Reading data from global handler" );
        that.parent.widgetLoadModel();
        // lets loead it ;

    };

    this.loadResults=function(){
        // MULTIFILE SELECTION!
        var hidden_solutionInput=document.createElement('input');
        hidden_solutionInput.id="HIDDEN_SOLUTION_JSON_INPUT";
        hidden_solutionInput.type="file" ;
        hidden_solutionInput.accept = ".json";
        hidden_solutionInput.multiple=true ;
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

        loaderSolutionPathNode.on("change",function(){
            // console.log("hidden thing is clicked");
            var files= loaderSolutionPathNode.property("files");
            // if (files.length>0){
            //     // console.log("file?"+files[0].name);
            //     for (var i=0;i<files.length;i++){
            //         var i_fileElement=files[i];
            //         var i_fileName=i_fileElement.name;
            //         console.log("reading FileName "+i_fileName);
            //         var i_reader = new FileReader();
            //         i_reader.readAsText(i_fileElement);
            //         i_reader.onload = function () {
            //             console.log("the reader inLoad function "+i_reader);
            //             console.log(i_reader);
            //             var i_text= i_reader.result;

            //             that.parent.graphObject.integrateStakeHolderResults(i_text);
            //         }


            //     }
            //     loaderSolutionPathNode.remove();


            // }
            console.log("No of files is:"+files.length);
            for(var i=0; i<files.length; i++) {
                var eachFile = files[i];
                console.log(eachFile);
                var reader = new FileReader();
                reader.readAsText(eachFile);
                reader.onload = function(event) {
                    var contents = event.target.result;                    
                    console.log("The contents are: "+contents);
                    that.parent.graphObject.integrateStakeHolderResults(contents);
                }
            }
        });

        // tell what to do when clicked
        // loaderSolutionPathNode.on("input",function(){
        //     // console.log("hidden thing is clicked");
        //     var files= loaderSolutionPathNode.property("files");
        //     if (files.length>0){
        //         // console.log("file?"+files[0].name);
        //         for (var i=0;i<files.length;i++){
        //             var i_fileElement=files[i];
        //             var i_fileName=i_fileElement.name;
        //             console.log("reading FileName "+i_fileName);
        //             var i_reader = new FileReader();
        //             i_reader.readAsText(i_fileElement);
        //             i_reader.onload = function () {
        //                 console.log("the reader inLoad function "+i_reader);
        //                 console.log(i_reader);
        //                var i_text= i_reader.result;

        //                 that.parent.graphObject.integrateStakeHolderResults(i_text);
        //             }


        //         }
        //         loaderSolutionPathNode.remove();


        //     }
        // });
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
        // loaderSolutionPathNode.on("input",function(){
        //     // console.log("hidden thing is clicked");
        //     var files= loaderSolutionPathNode.property("files");
        //     if (files.length>0){
        //         // console.log("file?"+files[0].name);
        //         fileElement=files[0];
        //         fileName=fileElement.name;
        //         loaderSolutionPathNode.remove();

        //         // read this file;
        //         var reader = new FileReader();
        //         reader.readAsText(fileElement);
        //         reader.onload = function () {
        //             readText = reader.result;
        //             // the the communication module about this
        //             var action={};
        //             action.task="ACTION_LOAD_GLOBAL_JSON";
        //             action.data=readText;
        //             that.parent.shadow_requestAction(action);
        //             that.importModelFkt();
        //             // kill the action object;
        //             action=null;
        //         };
        //     }
        // });

        loaderSolutionPathNode.on("change",function(){
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
                    that.parent.shadow_requestAction(action);
                    that.importModelFkt();
                    // kill the action object;
                    action=null;
                };
            }
        });

    };






    that.start()

}
QWControls.prototype = Object.create(BaseControls.prototype);
QWControls.prototype.constructor = QWControls;
