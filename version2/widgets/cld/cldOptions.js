function CLDControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    this.parent=parentWidget;

    var nodesGroup,linksGroup, additionalSettings;

    var selectionNode,lineEditNode,commentNode;
    var linkClass, causalSelection,commentLink;
    var getClassValues = [undefined];
    var delNodeBtn, delLinkBtn, extFactorBtn, loopBtn, loadcld, saveCld, libCld, sendCld;


    this.generateControls=function() {
        // testing stuff,
        nodesGroup = that.createAccordionGroup(that.divControlsGroupNode, "Nodes");
        lineEditNode = that.addLineEdit(nodesGroup, "Name", "", true, that.onChangeNodeName);
        selectionNode = that.addSelectionOpts(nodesGroup, "Class type", ["Undefined", "Factor", "Action", "Criteria", "External Factor"], that.onChangeNodeType);
        var hideClass = selectionNode.node().options[selectionNode.node().length - 1];
        hideClass.hidden = true;
        commentNode = that.addTextEdit(nodesGroup, "Comments", "", true, that.onChangeNodeComment);
        delNodeBtn = that.addButtons(nodesGroup, "Delete", "nodeDelete", that.deleteNodes);


        linksGroup = that.createAccordionGroup(that.divControlsGroupNode, "Links");
        linkClass = that.addSelectionOpts(linksGroup, "Class type", ["Undefined", "Causal Relation", "Other Relation"], that.onChangeLinkClass);
        causalSelection = that.addSelectionOpts(linksGroup, "Value", getClassValues, that.onChangeLinkType);
        d3.select(causalSelection.node().parentNode).classed("hidden", true);
        commentLink = that.addTextEdit(linksGroup, "Comments", "", true, that.onChangeLinkComment);
        delLinkBtn = that.addButtons(linksGroup, "Delete", "linkDelete", that.deleteLinks);

        additionalSettings = that.createAccordionGroup(that.divControlsGroupNode, "Settings");
        loadcld = that.addHrefButton(additionalSettings,"Load",that.loadFunction,true);
        loadcld.setAttribute("class", "btn btn-default btn-sm");
        loadcld.parentNode.setAttribute("id", "basic");
        loadcld.innerHTML = '<span class="glyphicon glyphicon-floppy-open"></span> Load Model';

        saveCld = that.addHrefButton(additionalSettings,"Save",that.saveFunction,false);
        document.getElementById("basic").appendChild(saveCld);
        saveCld.setAttribute("class", "btn btn-default btn-sm pull-right");
        saveCld.innerHTML = '<span class="glyphicon glyphicon-floppy-save"></span> Save Model';

        libCld = that.addHrefButton(additionalSettings,"Get Library",that.getLibrary,true);
        libCld.setAttribute("class", "btn btn-default btn-sm");
        libCld.parentNode.setAttribute("id", "basic1");
        libCld.innerHTML = '<span class="glyphicon glyphicon-log-in"></span> Get Library';

        sendCld = that.addHrefButton(additionalSettings,"Send Model",that.sendModel,false);
        document.getElementById("basic1").appendChild(sendCld);
        sendCld.setAttribute("class", "btn btn-default btn-sm pull-right");
        sendCld.innerHTML = '<span class="glyphicon glyphicon-log-out"></span> Send Model';

        importCriteria = that.addHrefButton(additionalSettings, "Import Criteria", that.onCriteriaImport, true);
        importCriteria.setAttribute("class", "btn btn-default btn-sm btn-block");

        extFactorBtn = that.addHrefButton(additionalSettings, "Identify External Factors", that.identifyExtFact, true);
        extFactorBtn.setAttribute("class", "btn btn-default btn-sm btn-block");

        loopBtn = that.addHrefButton(additionalSettings, "Identify Feeback Loops", that.feedbackLoop, true);
        loopBtn.setAttribute("class", "btn btn-default btn-sm btn-block");
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
            var selId_1 = that.selectedNode.getClassType();
            linkClass.node().options[selId_1].selected = "selected";
            var selId_2 = that.selectedNode.getTypeId();
            var temp = linkClass.node().options[selId_1].value;
            if(temp !== "Undefined") {
                appendLinkType(temp);
                causalSelection.node().options[selId_2].selected="selected";
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
                getClassValues = [undefined, '+', '-', '?'];
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
        action.task = "SERVER_REQUEST"
        action.requestType = "SEND_MODEL";
        action.data = that.parent.requestModelDataForSolver();
        that.parent.requestAction(action);
    };

    this.getLibrary = function() {
        console.log("Get Library");
        var action = {};
        action.task = "SERVER_REQUEST";
        action.requestType = "GET_LIBRARY";
        that.parent.requestAction(action);
    };

    this.start();

}

CLDControls.prototype = Object.create(BaseControls.prototype);
CLDControls.prototype.constructor = CLDControls;
