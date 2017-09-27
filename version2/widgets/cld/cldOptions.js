function CLDControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    this.parent=parentWidget;

    var nodesGroup,linksGroup, additionalSettings;

    var selectionNode,lineEditNode,commentNode, checkObserve, nodeTrend;
    var linkClass, causalSelection,commentLink;
    var getClassValues = [undefined];
    var cldChip, cldChipImage, cldChipNode,  delNodeBtn, delLinkBtn, extFactorBtn, loopBtn, loadcld, saveCld, libCld, sendCld;


    this.generateControls=function() {
        // testing stuff,
        nodesGroup = that.createAccordionGroup(that.divControlsGroupNode, "Nodes");

        // lineEditNode = that.addLineEdit(nodesGroup, "Name", "", true, that.onChangeNodeName);
          cldChipNode=that.addNodeTypeChip(nodesGroup,"Enter Node Name","#fafafa",that.deleteNodes,"cldChipField",false,"undefined","cld","./images/nodes/factor.png");
          cldChip = cldChipNode[0];
          cldChipImage=cldChipNode[1];

        selectionNode = that.addSelectionOpts(nodesGroup, "Class type", ["Undefined", "Factor", "Action", "Criteria", "External Factor"], that.onChangeNodeType);
        var hideClass = selectionNode.node().options[selectionNode.node().length - 1];
        hideClass.hidden = true;
        
        checkObserve = that.addCheckBox(nodesGroup, "Decided/Observe", "observeNode", false, that.observeNode);
        nodeTrend = that.addSelectionOpts(nodesGroup, "Trend", ["Undefined", "Ambigous", "Decreasing", "Increasing", "Stable"], that.trendFunc);
        d3.select(nodeTrend.node().parentNode).classed("hidden", true);

        commentNode = that.addTextEdit(nodesGroup, "Comments", "", true, that.onChangeNodeComment);
        // delNodeBtn = that.addButtons(nodesGroup, "Delete", "nodeDelete", that.deleteNodes);
        nodesGroup.collapseBody();
        // delNodeBtn = that.addButtons(nodesGroup, "Delete", "nodeDelete", that.deleteNodes);


        linksGroup = that.createAccordionGroup(that.divControlsGroupNode, "Links");

        // linkNode=that.addNodeTypeChip(linksGroup,"Undefined","#fafafa",that.deleteLinks,"cldLinkChipField",false,"undefined","cld","./images/nodes/factor.png");
        // cldChip = cldChipNode[0];
        // cldChipImage=cldChipNode[1];

        linkClass = that.addSelectionOpts(linksGroup, "Class type", ["Undefined", "Causal Relation"], that.onChangeLinkClass);
        causalSelection = that.addSelectionOpts(linksGroup, "Value", getClassValues, that.onChangeLinkType);
        d3.select(causalSelection.node().parentNode).classed("hidden", true);
        commentLink = that.addTextEdit(linksGroup, "Comments", "", true, that.onChangeLinkComment);
        // delLinkBtn = that.addButtons(linksGroup, "Delete", "linkDelete", that.deleteLinks);

        graphControls = that.createAccordionGroup(that.divControlsGroupNode, "Graph Controls");
        additionalSettings = that.createAccordionGroup(that.divControlsGroupNode, "Model Controls");        

        loadcld= that.addButton(graphControls, "LOAD GRAPH", "cldLoadModel", that.loadFunction, "flat", true, "cloud_upload" );

        // loadcld = that.addHrefButton(additionalSettings,"Load",that.loadFunction,true);
        // loadcld.setAttribute("class", "btn btn-default btn-sm");
        // loadcld.parentNode.setAttribute("id", "basic");
        // loadcld.innerHTML = '<span class="glyphicon glyphicon-floppy-open"></span> Load Model';

        saveCld= that.addButton(graphControls, "SAVE GRAPH", "cldSaveModel", that.saveFunction, "flat", true, "save" );
        // saveCld = that.addHrefButton(additionalSettings,"Save",that.saveFunction,false);
        // document.getElementById("basic").appendChild(saveCld);
        // saveCld.setAttribute("class", "btn btn-default btn-sm pull-right");
        // saveCld.innerHTML = '<span class="glyphicon glyphicon-floppy-save"></span> Save Model';
        
        clearCLD= that.addButton(graphControls, "CLEAR GRAPH", "cldClearGraph", that.clearGraph, "flat", true, "clear_all" );

        libCld = that.addButton(additionalSettings, "GET LIBRARY", "cldGetLibrary", that.getLibrary, "flat", true, "get_app" );
        // libCld = that.addHrefButton(additionalSettings,"Get Library",that.getLibrary,true);
        // libCld.setAttribute("class", "btn btn-default btn-sm");
        // libCld.parentNode.setAttribute("id", "basic1");
        // libCld.innerHTML = '<span class="glyphicon glyphicon-log-in"></span> Get Library';
        //

        sendCld= that.addButton(additionalSettings, "SEND MODEL", "cldSendModel", that.sendModel, "flat", true, "send" );
        // sendCld = that.addHrefButton(additionalSettings,"Send Model",that.sendModel,false);
        // document.getElementById("basic1").appendChild(sendCld);
        // sendCld.setAttribute("class", "btn btn-default btn-sm pull-right");
        // sendCld.innerHTML = '<span class="glyphicon glyphicon-log-out"></span> Send Model';
        //

        importCriteria = that.addButton(additionalSettings, "IMPORT CRITERIA", "cldImportCriteria", that.onCriteriaImport, "flat", true, "import_export" );
        // importCriteria = that.addHrefButton(graphControls, "Import Criteria", that.onCriteriaImport, true);
        // importCriteria.setAttribute("class", "btn btn-default btn-sm btn-block");
        //

        extFactorBtn = that.addButton(additionalSettings, "IDENTIFY EXTERNAL FACTORS", "cldIdentifyExtFactors", that.identifyExtFact, "flat", true, "explicit" );
        // extFactorBtn = that.addHrefButton(graphControls, "Identify External Factors", that.identifyExtFact, true);
        // extFactorBtn.setAttribute("class", "btn btn-default btn-sm btn-block");
        //

        loopBtn = that.addButton(additionalSettings, "IDENTIFY FEEDBACK LOOPS", "cldIdentifyFeedbacks", that.feedbackLoop, "flat", true, "loop" );
        loopBtn.setAttribute("data-toggle", "modal");
        loopBtn.setAttribute("data-target", "#loopModal");        
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
                // lineEditNode.node().value = that.selectedNode.label;
                // lineEditNode.node().disabled = false;
                //
                cldChip.innerHTML=that.selectedNode.label;
                cldChipImage.setAttribute('src',that.selectedNode.getImageURL());

                checkObserve.node().checked = that.selectedNode.getObserve();
                if(that.selectedNode.getObserve()) {
                    d3.select(nodeTrend.node().parentNode).classed("hidden", false);
                    var temp = that.selectedNode.getTrend();
                    nodeTrend.node().options[temp].selected = "selected";
                }
                else
                    d3.select(nodeTrend.node().parentNode).classed("hidden", true);

                console.log("the trend is: "+that.selectedNode.trendName);
                
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
            var selId_1 = that.selectedNode.getClassType();
            linkClass.node().options[selId_1].selected = "selected";
            var selId_2 = that.selectedNode.getTypeId();
            var temp = linkClass.node().options[selId_1].value;
            if(temp !== "Undefined") {
                appendLinkType(temp);
                causalSelection.node().options[selId_2].selected="selected";
                d3.select(causalSelection.node().parentNode).classed("hidden", false);
                console.log("Link type id: "+causalSelection.node().options[selId_2].value);
            }
            else
                d3.select(causalSelection.node().parentNode).classed("hidden", true);

            commentLink .node().disabled = false;
            commentLink .node().value = that.selectedNode.hoverText;

        }

    };

    function appendLinkType(className) {
        d3.select(causalSelection.node()).selectAll("option").remove();
        if(className === "Causal Relation") {
                getClassValues = [undefined, '+', '-', '?', '0'];
                for (var i=0;i<getClassValues.length;i++){
                    d3.select(causalSelection.node()).append("option").text(getClassValues[i]);
                }
            }
        else if(className === "Other Relation") {
            getClassValues = [undefined, 'A', 'B'];
            for(var i=0; i<getClassValues.length; i++) {
                d3.select(causalSelection.node()).append("option").text(getClassValues[i]);
            }
        }
    }

    this.onChangeLinkComment=function(){
        that.selectedNode.setHoverText(commentLink.node().value);
    };

    this.onChangeLinkClass = function(selectionContainer) {
        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        if(strUser !== "Undefined") {
            that.selectedNode.setClassType(selectionContainer.selectedIndex, strUser);
            d3.select(causalSelection.node().parentNode).classed("hidden", false);
            appendLinkType(strUser);
        }
        else
            d3.select(causalSelection.node().parentNode).classed("hidden", true);
    };

    this.onChangeLinkType=function (selectionContainer) {
        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        console.log(selectionContainer.selectedIndex+" the user string is "+strUser);
        that.selectedNode.setCLDTypeString(selectionContainer.selectedIndex, strUser);
    };



    this.onChangeNodeType=function(selectionContainer){

        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        console.log(selectionContainer.selectedIndex+" the user string is "+strUser);
        that.selectedNode.setType(selectionContainer.selectedIndex, strUser);

    };
    this.onChangeNodeName=function(){
      // change the value to be displayed on the node.
      that.selectedNode.clearDisplayLabelText();
      that.selectedNode.setDisplayLabelText(lineEditNode.node().value);
      // change the value of the tooltip.
      that.selectedNode.clearLabelText();
      that.selectedNode.setLabelText(lineEditNode.node().value);

      // Todo: feedback about the node editing...
      // that.selectedNode.clearClass();
      // that.selectedNode.changeClass("onChanged");
      // setTimeout(that.oldClass(), 18000);

    };

    // that.oldClass=function(){
    //   that.selectedNode.clearClass();
    //   that.selectedNode.changeClass("baseRoundNode");
    // };

    this.observeNode = function(val) {
        that.selectedNode.setObserve(val);
        var temp = that.selectedNode.getObserve();
        if(temp)
            d3.select(nodeTrend.node().parentNode).classed("hidden", false);
        else{
            d3.select(nodeTrend.node().parentNode).classed("hidden", true);
            that.selectedNode.setTrend(0, undefined);
        }
    };

    this.trendFunc = function(selectionContainer) {
        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        console.log(selectionContainer.selectedIndex+" the user string is "+strUser);
        that.selectedNode.setTrend(selectionContainer.selectedIndex);
    };

    this.onChangeNodeComment=function(){
        that.selectedNode.setHoverText(commentNode.node().value);
    };

    this.deleteNodes = function() {
        var nodeName=that.selectedNode.label;
        that.parent.nodeDeletion(that.selectedNode);
        that.selectedNode = null;
        nodesGroup.collapseBody();

        var snackbarContainer = document.querySelector('#demo-toast-example');
        var data = {message: 'The node '+ nodeName +' has been deleted'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);

    };

    // this.deleteLinks = function() {
    //     that.parent.linkDeletion(that.selectedNode);
    //     that.selectedNode = null;
    //     linksGroup.collapseBody();
    // };

    this.clearGraph=function(){
        parentWidget.clearGraph();
        var snackbarContainer = document.querySelector('#demo-toast-example');
        var data = {message: 'The graph has been cleared'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.onCriteriaImport = function() {
        console.log("Import criteria nodes from Goal Tree");
        that.parent.getCriteria();
    }

    this.identifyExtFact = function() {
        that.parent.identifyExtFact();
    };

    this.feedbackLoop = function() {
        that.parent.identifyLoops();
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
        loaderSolutionPathNode.on("change",function(){
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

    this.sendModel = function() {
        console.log("Send the model");
        var action = {};
        action.task = "SERVER_REQUEST";
        action.requestType = "SEND_MODEL";
        action.libraryName="cld";
        action.data = that.parent.requestModelDataForSolver();
        that.parent.requestAction(action);
        console.log("DATA: "+action.data);
    };

    this.getLibrary = function() {
        console.log("Get Library");
        var action = {};
        action.task = "SERVER_REQUEST";
        action.requestType = "GET_LIBRARY";
        action.libraryName = "cld";
        that.parent.requestAction(action);
    };

    this.start();

}

CLDControls.prototype = Object.create(BaseControls.prototype);
CLDControls.prototype.constructor = CLDControls;
