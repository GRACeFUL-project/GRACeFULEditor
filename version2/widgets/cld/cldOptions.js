function CLDControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    this.parent=parentWidget;
    this.optionsId=2;
    var nodesGroup,linksGroup, additionalSettings;

    var selectionNode,lineEditNode,commentNode, checkObserve, nodeTrend, actionDiv, actionTable, valApplied, criteriaUnit, mapsToLib;
    var linkClass, causalSelection,commentLink;
    var getClassValues = [undefined];
    var cldChip, cldChipImage, cldChipNode,  delNodeBtn, delLinkBtn, extFactorBtn, loopBtn, loadcld, saveCld, libCld, sendCld;
    var budgetBtn;
    var units = ["euro", "euro/year", "euro/event", "number", "number/year (events/year)", "number/event", "category", "mm/hour", "mm/day", "m\u00B2", "m\u00B2 affected"];
    //fetch the elements name from the library
    // var libElementsName = ["", "costcriterion", "flooddamagecriterion", "floodnuisancecriterion", "greenbluecriterion", "centralparkingcriterion", "parkingcriterion", "roadaccesscriterion", "trafficcriterion", "bioswaleStreetAction", "bioswaleParkingAction", "bioswaleGreenSpaceAction", "makeParkingFloodableAction", "floodableParkingOnGreenSpaceAction", "publicGreenRoofAction", "privateGreenRoofAction"];


    this.saveGlobalFunction=function(){
        var action={};
        action.task="ACTION_SAVE_GLOBAL_JSON";
        that.parent.requestAction(action);
    };

    this.loadGlobalFunction=function()    {

        console.log("Load GLOBAL WAS PRESSED");

        var hidden_solutionInput=document.createElement('input');
        hidden_solutionInput.id="HIDDEN_SOLUTION_JSON_INPUT";
        hidden_solutionInput.type="file";
        hidden_solutionInput.accept = ".json";
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
        hidden_solutionInput.click();
        loaderSolutionPathNode.remove(loaderSolutionPathNode);
        // tell what to do when clicked
        // chrome fix -.-
        loaderSolutionPathNode.on("change",function (){
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



        // loaderSolutionPathNode.on("input",function(){
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
        //             that.parent.requestAction(action);
        //             // kill the action object;
        //             action=null;
        //         };
        //     }
        // });

    };

    this.generateControls=function() {
        // testing stuff,
        nodesGroup = that.createAccordionGroup(that.divControlsGroupNode, "Node");

        // lineEditNode = that.addLineEdit(nodesGroup, "Name", "", true, that.onChangeNodeName);
          cldChipNode=that.addNodeTypeChip(nodesGroup,"empty","#fafafa",that.deleteNodes,"cldChipField",false,"undefined","cld","./images/nodes/factor.png");
          cldChip = cldChipNode[0];
          cldChipImage=cldChipNode[1];

        mapsToLib = that.addSelectionOpts(nodesGroup, "Library Mapping", ["a1","a2"], that.onChangeMapLib,"libMapLabel");

        selectionNode = that.addSelectionOpts(nodesGroup, "Node type", ["Factor", "Factor", "Action", "Criterion", "External Factor","Stake Holder"], that.onChangeNodeType);
        // hiding options
        selectionNode.node().options[0].hidden = true;
        selectionNode.node().options[selectionNode.node().length - 1].hidden = true;
        selectionNode.node().options[selectionNode.node().length - 2].hidden = true;

        
        checkObserve = that.addCheckBox(nodesGroup, "Decided/Observed", "observeNode", false, that.observeNode);
        nodeTrend = that.addSelectionOpts(nodesGroup, "Trend", ["Undefined", "Ambigous", "Decreasing", "Increasing", "Stable"], that.trendFunc);
        d3.select(nodeTrend.node().parentNode).classed("hidden", true);

        //Action related fields        
        actionTable=that.addTable(nodesGroup,"Action Pairs",["Value", "Can be applied","Cost"]);
        actionDiv = actionTable.node().parentNode;        
        d3.select(actionDiv).classed("hidden",true);
        var value = ["+", "-", "0"];
        valApplied = ["plusAction", "minusAction", "zeroAction"];
        for(var i=0; i<value.length; i++) {
            addRowsAction(i+1, value[i], valApplied[i], that.onValueChange, that.onCostChange);
        }

        commentNode = that.addTextEdit(nodesGroup, "Comments", "", true, that.onChangeNodeComment);

        // criteriaUnit = that.addLineEdit(nodesGroup, "Unit", "", true, that.onChangeUnit);
        criteriaUnit = that.addSelectionOpts(nodesGroup, "Unit", units, that.onChangeUnit);
        d3.select(criteriaUnit.node().parentNode).classed("hidden", true);
        // delNodeBtn = that.addButtons(nodesGroup, "Delete", "nodeDelete", that.deleteNodes);
        nodesGroup.collapseBody();
        // delNodeBtn = that.addButtons(nodesGroup, "Delete", "nodeDelete", that.deleteNodes);


        linksGroup = that.createAccordionGroup(that.divControlsGroupNode, "Link");
        linksGroup.collapseBody();

        nodesGroup.collapseBody();
        linksGroup.collapseBody();

        linksGroup.overWriteAccordionClickToNodeLinkElement();
        nodesGroup.overWriteAccordionClickToNodeLinkElement();

        // linkNode=that.addNodeTypeChip(linksGroup,"Undefined","#fafafa",that.deleteLinks,"cldLinkChipField",false,"undefined","cld","./images/nodes/factor.png");
        // cldChip = cldChipNode[0];
        // cldChipImage=cldChipNode[1];

        linkClass = that.addSelectionOpts(linksGroup, "Link type", ["Undefined", "Causal Relation"], that.onChangeLinkClass);
        linkClass.node().options[0].hidden = true;
        linkClass.node().options[1].selected=true;

        causalSelection = that.addSelectionOpts(linksGroup, "Influence", getClassValues, that.onChangeLinkType);
        d3.select(causalSelection.node().parentNode).classed("hidden", true);
        commentLink = that.addTextEdit(linksGroup, "Comments", "", true, that.onChangeLinkComment);
        // delLinkBtn = that.addButtons(linksGroup, "Delete", "linkDelete", that.deleteLinks);

        additionalSettings = that.createAccordionGroup(that.divControlsGroupNode, "Model Controls");
        graphControls = that.createAccordionGroup(that.divControlsGroupNode, "Server Controls");

        // adding load global and save global graph things;
        that.addButton(additionalSettings, "LOAD MODEL", "cldGetLibrary", that.loadGlobalFunction, "flat", true, "cloud_upload" );
        that.addButton(additionalSettings, "SAVE MODEL", "cldGetLibrary", that.saveGlobalFunction, "flat", true, "save" );
        that.addButton(additionalSettings, "CLEAR MODEL", "gtClearGraph", that.clearGraph, "flat", true, "clear_all" );
        that.addButton(additionalSettings, "CLEAR SOLUTION", "cldClearSolution", that.clearSolution, "flat", true, "clear_all" );

        libCld = that.addButton(graphControls, "GET LIBRARY", "cldGetLibrary", that.getLibrary, "flat", true, "get_app" );
        libCld.disabled=true;

        sendCld= that.addButton(graphControls, "SEND MODEL", "cldSendModel", that.sendModel, "flat", true, "send" );

        extFactorBtn = that.addButton(additionalSettings, "MARK EXTERNAL FACTORS", "cldIdentifyExtFactors", that.identifyExtFact, "flat", true, "explicit" );

        loopBtn = that.addButton(additionalSettings, "DETECT FEEDBACK LOOPS", "cldIdentifyFeedbacks", that.feedbackLoop, "flat", true, "loop" );
        loopBtn.setAttribute("data-toggle", "modal");
        loopBtn.setAttribute("data-target", "#loopModal");    

        budgetBtn = that.addButton(additionalSettings, "ENTER BUDGET", "budget", that.enterBudget, "flat", true, "input");
        budgetBtn.setAttribute("data-toggle", "modal");
        budgetBtn.setAttribute("data-target", "#budgetModal");

        var bud = "<input type=\"number\" id=\"budgetVal\">";        
        that.createModal("budgetModal", "Enter Budget", bud);
    };

    this.handleSelectionForOptions=function(node){
        var i;
        // kill libraryMapping
        mapsToLib.classed("hidden", true);
        d3.select("#libMapLabel").classed("hidden", true);

        // check if node has subClass;
        if (node.getGlobalNodePtr().getSfdNode().getSubClasses) {
            var sC = node.getGlobalNodePtr().getSfdNode().getSubClasses();
            var sCDesc = node.getGlobalNodePtr().getSfdNode().getSubClassesDescriptions();
            // console.log("testing subClasses"+sC);
            if (sC.length > 0) {
                mapsToLib.classed("hidden", false);
                d3.select("#libMapLabel").classed("hidden", false);
            } else {
                sC = node.getGlobalNodePtr().getSfdNode().getSuperClassChildren();
                sCDesc = node.getGlobalNodePtr().getSfdNode().getSuperClassChildrenDesc();
                // console.log("testing superClasses"+sC);
                if (sC.length > 0) {
                    mapsToLib.classed("hidden", false);
                    d3.select("#libMapLabel").classed("hidden", false);
                }
            }

            // assume it has some subClasses

            // clear options menu

            // clear possible pre searched entries
            var htmlCollection = mapsToLib.node().children;
            var numEntries = htmlCollection.length;
            // console.log("numEntries" + numEntries);
            for (i = 0; i < numEntries; i++)
                htmlCollection[0].remove();


            for (i = 0; i < sC.length; i++) {
                var optA = document.createElement('option');
                optA.value = sC[i];
                optA.innerHTML=sCDesc[i];
                mapsToLib.node().appendChild(optA);
            }
        }
        mapsToLib.node().value = node.libElement;
    };

    this.handleNodeSelection=function(node){

        // what type is given?



        if (node === undefined) {
            console.log("undefined thing >> collapse a;ll");
            linksGroup.collapseBody();
            nodesGroup.collapseBody();

            that.evilNodeElement(undefined);
            return;
        }

        // console.log("node type "+ node.getElementType());

        if (node.getElementType()==="NodeElement") {

            // should be overwritten by the real options thing
            // console.log("controls handle node operation" + node);
            this.selectedNode = node;
            that.evilNodeElement(node);
            // kill libraryMapping
            mapsToLib.classed("hidden",true);
            d3.select("#libMapLabel").classed("hidden",true);

            // check if node has subClass;
            if (node.getGlobalNodePtr().getSfdNode().getSubClasses) {
                var sC = node.getGlobalNodePtr().getSfdNode().getSubClasses();
                var sCDesc = node.getGlobalNodePtr().getSfdNode().getSubClassesDescriptions();
                if (sC.length>0) {
                    mapsToLib.classed("hidden", false);
                    d3.select("#libMapLabel").classed("hidden", false);
                } else{
                        sC = node.getGlobalNodePtr().getSfdNode().getSuperClassChildren();
                        sCDesc = node.getGlobalNodePtr().getSfdNode().getSuperClassChildrenDesc();
                        if (sC.length > 0) {
                            mapsToLib.classed("hidden", false);
                            d3.select("#libMapLabel").classed("hidden", false);
                        }
                }

                // assume it has some subClasses

                // clear options menu

                // clear possible pre searched entries
                var htmlCollection = mapsToLib.node().children;
                var numEntries = htmlCollection.length;
                for ( i = 0; i < numEntries; i++)
                    htmlCollection[0].remove();


                for (i=0;i<sC.length;i++) {
                    var optA=document.createElement('option');
                    optA.value=sC[i];
                    optA.innerHTML=sCDesc[i];
                    mapsToLib.node().appendChild(optA);
                }
                if (that.selectedNode.libElement.length===0 && sC.length>0) {
                    mapsToLib.node().options[0].selected="selected";
                    that.selectedNode.setLibMapping(mapsToLib.node().value);
                }
                mapsToLib.node().value = that.selectedNode.libElement;
            }


                nodesGroup.expandBody();
                linksGroup.collapseBody();
                // should be overwritten by the real options thing
                // lineEditNode.node().value = that.selectedNode.label;
                // lineEditNode.node().disabled = false;
                //
                cldChip.innerHTML=that.selectedNode.label;
                cldChipImage.setAttribute('src',that.selectedNode.getImageURL());


                d3.select(checkObserve.node().parentNode).classed("hidden", false);                
                d3.select(actionDiv).classed("hidden",true);

                checkObserve.node().checked = that.selectedNode.getObserve();
                if(that.selectedNode.getObserve()) {
                    d3.select(nodeTrend.node().parentNode).classed("hidden", false);
                    var temp = that.selectedNode.getTrend();
                    nodeTrend.node().options[temp].selected = "selected";
                }
                else
                    d3.select(nodeTrend.node().parentNode).classed("hidden", true);

                // console.log("the trend is: "+that.selectedNode.trendName);

                commentNode.node().disabled = false;
                commentNode.node().value = that.selectedNode.hoverText;
                criteriaUnit.node().value = that.selectedNode.criteriaUnit;

                var selId = that.selectedNode.getTypeId();
                selectionNode.node().disabled=false;
                selectionNode.node().options[selId].selected = "selected";
                // console.log("The Selection Id is "+selId);
                if(selId === 5) {
                    commentNode.node().innerHTML = that.selectedNode.hoverText;
                    selectionNode.node().disabled=true;
                    commentNode.node().disabled = true;
                    d3.select(checkObserve.node().parentNode).classed("hidden", true);
                    d3.select(nodeTrend.node().parentNode).classed("hidden", true);
            }

               // check for stakeholder node in cld;
                d3.select('#chipElementId2').classed('hidden',false);
                if (node.getTypeId()===5){
                    console.log("exisits"+d3.select('#chipElementId2'));
                    d3.select('#chipElementId2').classed('hidden',true);
                    console.log(d3.select('#chipElementId2'));
                }


                var selectType = selectionNode.node().options[selId].value;
                if(selectType === "Action") {
                    that.selectedNode.setObserve(false);
                    that.selectedNode.setTrend(0);
                    d3.select(checkObserve.node().parentNode).classed("hidden", true);
                    d3.select(nodeTrend.node().parentNode).classed("hidden", true);
                    d3.select(actionDiv).classed("hidden",false);

                    console.log("ACTION: "+JSON.stringify(that.selectedNode.actionPairs));
                    for(var i=0; i<valApplied.length; i++) {
                        var aTypes = valApplied[i];
                        var val = document.getElementById(aTypes);
                        var cost = document.getElementById(aTypes+"Cost");

                        var actionPairs = that.selectedNode.getAction();
                        val.checked = actionPairs[aTypes];
                        cost.value = actionPairs[aTypes+"Cost"];
                        if(cost.value === "")
                            cost.disabled = true;
                        else
                            cost.disabled = false;
                    }
                }
                if(selectType === "Criterion") {
                    that.selectedNode.setObserve(false);
                    that.selectedNode.setTrend(0);
                    d3.select(criteriaUnit.node().parentNode).classed("hidden", false);
                    d3.select(checkObserve.node().parentNode).classed("hidden", true);
                    d3.select(nodeTrend.node().parentNode).classed("hidden", true);
                }
                if(selectType !== "Criterion") {
                    d3.select(criteriaUnit.node().parentNode).classed("hidden", true);
                }

        }

        if (node.getElementType()==="LinkElement") {
            // should be overwritten by the real options thing


            // friendly widgets;
            that.parent.sfdGraphObj.selectNode(node.getGlobalLinkPtr().getsfdLINK());

            this.selectedNode = node;
            nodesGroup.collapseBody();
            linksGroup.expandBody();

            if(that.selectedNode.superLinkType === 100)
                linksGroup.collapseBody();

            // todo overwrite the values;
            var selId_1 = that.selectedNode.getClassType();
            selId_1=1;
            console.log("SelId"+selId_1);
            if (selId_1===-1){
                // nothing to do; this is a goal tree link without any information!
                linksGroup.collapseBody();
                return;

            }

            linkClass.node().options[1].selected = "selected";
            linkClass.node().options[0].hidden= true;
            var selId_2 = that.selectedNode.getTypeId();
            var temp = linkClass.node().options[selId_1].value;            
            if(temp !== "Undefined") {
                appendLinkType(temp, node);
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

    function appendLinkType(className, selNode) {
        d3.select(causalSelection.node()).selectAll("option").remove();
        if(className === "Causal Relation") {
            if(selNode.sourceNode.typeName === "Action")
                getClassValues = [undefined, '+', '-', '0'];
            else
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

    function addRowsAction(rowId, val, valId, onValueChange, onCostChange) {
        var row=actionTable.node().insertRow(rowId);
        row.align = "center";
        var r11 = row.insertCell(0);
        r11.innerHTML = val;

        var r12 = row.insertCell(1);
        var p1 = document.createElement('input');
        r12.appendChild(p1);
        var aValue = d3.select(p1);
        aValue.attr("id", valId).attr("type", "checkbox").property("checked", false);
        aValue.on("click", function() {
            that.onValueChange(aValue.attr("id"), aValue.property("checked"));
        });
        
        var r13 = row.insertCell(2);
        var aCost = document.createElement('input');
        aCost.type = "number";
        aCost.id = valId+"Cost";
        aCost.disabled = true;
        d3.select(aCost).on("change", function() {
            that.onCostChange(d3.select(aCost).attr("id"));
        });
        r13.appendChild(aCost);
    }

    this.onValueChange = function(id, val) {
        gHandlerObj.saveModelResult(undefined);
        that.parentWidget().graphObject.forceRedrawContent();

        console.log("Value change. ID:"+id+" boolean: "+val);
        that.selectedNode.setActionValues(id, val);
        var c1 = document.getElementById(id+"Cost");
        if(val === true) {
            c1.disabled = false;
        }
        else {
            c1.value = "";
            c1.disabled = true;
            that.selectedNode.setActionCost(c1.id, c1.value);
        }        
    };

    this.onCostChange = function(id) {
        gHandlerObj.saveModelResult(undefined);
        that.parentWidget().graphObject.forceRedrawContent();

        console.log("Cost change:"+id);
        var c1 = document.getElementById(id);
        that.selectedNode.setActionCost(id, c1.value);
    };

    this.onChangeLinkComment=function(){
        that.selectedNode.setHoverText(commentLink.node().value);
    };

    this.onChangeLinkClass = function(selectionContainer) {
        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        if(strUser !== "Undefined") {
            that.selectedNode.setClassType(selectionContainer.selectedIndex, strUser);
            d3.select(causalSelection.node().parentNode).classed("hidden", false);
            appendLinkType(strUser, that.selectedNode);
        }
        else
            d3.select(causalSelection.node().parentNode).classed("hidden", true);
    };

    this.onChangeLinkType=function (selectionContainer) {
        gHandlerObj.saveModelResult(undefined);
        that.parentWidget().graphObject.forceRedrawContent();

        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        console.log(selectionContainer.selectedIndex+" the user string is "+strUser);
        that.selectedNode.setCLDTypeString(selectionContainer.selectedIndex, strUser);
        var sfdLink=that.selectedNode.getGlobalLinkPtr().getsfdLINK();
        // console.log("Setting that thing to "+strUser);
        sfdLink.setCLDLinkTypeFromOutside(selectionContainer.selectedIndex,selectionContainer.selectedIndex);
        that.selectedNode.getGlobalLinkPtr().filterInformation();

    };



    this.onChangeNodeType=function(selectionContainer){
        gHandlerObj.saveModelResult(undefined);
        that.parentWidget().graphObject.redeliverResultToWidget();
        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        // console.log(selectionContainer.selectedIndex+" the user string is "+strUser);
        that.selectedNode.setType(selectionContainer.selectedIndex, strUser);
        // if(strUser === "Criterion") {
        //     d3.select(criteriaUnit.node().parentNode).classed("hidden", false);
        // }
        // else {
        //     d3.select(criteriaUnit.node().parentNode).classed("hidden", true);
        // }
        that.selectedNode.libElement="";
        that.handleNodeSelection(that.selectedNode);

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

    this.onChangeMapLib = function() {
        gHandlerObj.saveModelResult(undefined);
        that.parentWidget().graphObject.forceRedrawContent();


        that.selectedNode.setLibMapping(mapsToLib.node().value);        
    };

    // that.oldClass=function(){
    //   that.selectedNode.clearClass();
    //   that.selectedNode.changeClass("baseRoundNode");
    // };

    this.observeNode = function(val) {
        gHandlerObj.saveModelResult(undefined);
        that.parentWidget().graphObject.forceRedrawContent();


        that.selectedNode.setObserve(val);
        var temp = that.selectedNode.getObserve();
        if(temp) {
            d3.select(nodeTrend.node().parentNode).classed("hidden", false);
            var temp = that.selectedNode.getTrend();
            nodeTrend.node().options[temp].selected = "selected";
        }
        else{
            d3.select(nodeTrend.node().parentNode).classed("hidden", true);
            that.selectedNode.setTrend(0);
        }
    };

    this.trendFunc = function(selectionContainer) {
        gHandlerObj.saveModelResult(undefined);
        that.parentWidget().graphObject.forceRedrawContent();

        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        // console.log(selectionContainer.selectedIndex+" the user string is "+strUser);
        that.selectedNode.setTrend(selectionContainer.selectedIndex);
    };

    this.onChangeNodeComment=function(){
        that.selectedNode.setHoverText(commentNode.node().value);
    };

    this.onChangeUnit =function() {
        gHandlerObj.saveModelResult(undefined);
        that.parentWidget().graphObject.forceRedrawContent();

        that.selectedNode.setCriteriaUnit(criteriaUnit.node().value);
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
        var data = {message: 'The model has been cleared'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.clearSolution=function(){
        gHandlerObj.saveModelResult(undefined);
        that.parentWidget().graphObject.forceRedrawContent();

    };

    this.onCriteriaImport = function() {
        console.log("Import criteria nodes from Goal Tree");
        that.parent.getCriteria();
    };

    this.identifyExtFact = function() {
        that.parent.identifyExtFact();
    };

    this.feedbackLoop = function() {
        that.parent.identifyLoops();
    };

    this.enterBudget = function() {
        
        d3.select("#budgetVal").on("change", function() {
            gHandlerObj.saveModelResult(undefined);
            that.parentWidget().graphObject.forceRedrawContent();

            var c1 = document.getElementById("budgetVal");
            that.parent.cldBudget(c1.value);
        });
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
        // console.log("hidden thing is clicked");
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
        action.libraryName=loadedLibName;
        action.data = that.parent.requestModelDataForSolver();
        that.parent.requestAction(action);
        console.log(action.data);
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
