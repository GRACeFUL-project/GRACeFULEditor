function SimpleSFDControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    this.parent=parentWidget;

    var controlsMenu;
    var optionsGroup, nodeGroup,linksGroup,linkClass,causalSelection,commentLink;
    var nodeSelGroup;
    var parametersGroup;
    var parameterTable;
    var getClassValues = [undefined];
    var portTable;
    var solverLineEdit,librarySelection;
    var nodeClass,nodeLabel;
    var mapsToLib;
    var selectedLibraryName;
    var sfdChip ,sfdChipNode, sfdChipImage, clearSFD, loadSFD, saveSFD, reqSFD, submitSFD, reqLoadLib;



    this.onChangeEmpty=function(x){
        // empty function does not do anything, used for debuging
        console.log("changing something"+x)
    };

    this.clearGraph=function(){
        parentWidget.clearGraph();
        var snackbarContainer = document.querySelector('#demo-toast-example');
        var data = {message: 'The model has been cleared'};
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
        // optionsGroup.getBody().node().appendChild(hidden_solutionInput);
        controlsMenu.getBody().node().appendChild(hidden_solutionInput);

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


    this.loadGlobalFunction=function(){
        //  console.log("loading global model function ");

        var hidden_solutionInput=document.createElement('input');
        hidden_solutionInput.id="HIDDEN_SOLUTION_JSON_INPUT";
        hidden_solutionInput.type="file";
        hidden_solutionInput.accept = ".json";
        //hidden_solutionInput.style.display="none";
        hidden_solutionInput.autocomplete="off";
        hidden_solutionInput.placeholder="load a json File";
        hidden_solutionInput.setAttribute("class", "inputPath");
        // hidden_solutionInput.style.display="none";
        controlsMenu.getBody().node().appendChild(hidden_solutionInput);
        var loaderSolutionPathNode=d3.select("#HIDDEN_SOLUTION_JSON_INPUT");
        var fileElement;
        var fileName;
        var readText;
        // simulate click event;
        // console.log("hidden thing is clicked");
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

    };

    this. loadLibraryFromJSON=function(){
      // console.log("Button Requesting a load function");
      //   console.log("loading was pressed");
        // create a temporary file loader
        var hidden_solutionInput=document.createElement('input');
        hidden_solutionInput.id="HIDDEN_SOLUTION_JSON_INPUT";
        hidden_solutionInput.type="file";
        //hidden_solutionInput.style.display="none";
        hidden_solutionInput.autocomplete="off";
        hidden_solutionInput.placeholder="load a json File";
        hidden_solutionInput.setAttribute("class", "inputPath");
        // hidden_solutionInput.style.display="none";
        controlsMenu.getBody().node().appendChild(hidden_solutionInput);
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
           // console.log("hidden thing is clicked");
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
                    action.task="ACTION_LOAD_LIBRARY";
                    action.data=readText;
                    that.parent.requestAction(action);
                    // kill the action object;
                    action=null;
                };
            }
        });
    };


    this.saveFunction=function(){
        var action={};
        action.task="ACTION_SAVE_GLOBAL_JSON";
        that.parent.requestAction(action);
    };

    this.onChangeLinkType=function (selectionContainer) {
        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        console.log(selectionContainer.selectedIndex+" the user string is "+strUser);
        var cldLink=that.selectedNode.getGlobalLinkPtr().getCLDLINK();
        if (cldLink) {
            cldLink.setCLDLinkTypeFromOutside(selectionContainer.selectedIndex, selectionContainer.selectedIndex);
        }
        that.selectedNode.setCLDLinkTypeFromOutside(selectionContainer.selectedIndex, selectionContainer.selectedIndex);

    };

    this.onSelectLibrary=function(librarySelection){
        var strUser = librarySelection.options[librarySelection.selectedIndex].value;
        console.log(librarySelection.selectedIndex+" the user string is "+strUser);
        if (librarySelection.selectedIndex>0){
            // enable load lib button;
            reqSFD.disabled=false;
            selectedLibraryName=strUser;
            loadedLibName=selectedLibraryName;

        }

    };

    function appendLinkType(className, selNode) {
        d3.select(causalSelection.node()).selectAll("option").remove();
        if(className === "Causal Relation") {
            if(selNode && selNode.sourceNode.typeName === "Action")
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

    this.onChangeLinkComment=function(){
        that.selectedNode.setHoverText(commentLink.node().value);
    };


    this.onChangeMapLib = function() {
        that.selectedNode.setSubClassTypeFromText(mapsToLib.node().value);
    };

    this.serverRequest=function(){
        // the action defines a request type which is send to com mod and that one does the work
        console.log("requesting data from server : this example is library crud");
        var action={};
        action.task="SERVER_REQUEST";
        action.requestType="GET_LIBRARY"; // testing purpose
        // get the string from the selected lib;
        action.libraryName=selectedLibraryName;
        that.parent.requestAction(action);
    };

    this.testSubmitModel=function(){
        console.log("testing submit function of docker thingy");
        var action={};
        action.task="SERVER_REQUEST";
        action.requestType="SEND_MODEL"; // testing purpose
        // dummy data that should throw an exception .. dont know why exactly
        // but shows the communication capacity of the new widget system
        //action.data='{"nodes": [{"name": "pump","parameters": [{"name": "capacity","type": "Float","value": 0}],"identity": 0,"interface": [{"name": "inflow","type": "Flow"},{"name": "outflow","type": "Flow","connection": [3,"inflow"]}]},{"name": "pump","parameters": [{"name": "capacity","type": "Float","value": 0}],"identity": 1,"interface": [{"name": "inflow","type": "Flow"},{"name": "outflow","type": "Flow"}]},{"name": "rain","parameters": [{"name": "amount","type": "Float","value": 0}],"identity": 2,"interface": [{"name": "rainfall","type": "Flow","connection": [0,"inflow"]}]},{"name": "runoffArea","parameters": [{"name": "storage capacity","type": "Float","value": 0}],"identity": 3,"interface": [{"name": "inflow","type": "Flow"},{"name": "outlet","type": "Flow","connection": [1,"outflow"]},{"name": "overflow","type": "Flow"}]}]}';

        //requestData from widget

        // request data form sfd widget
        action.libraryName=loadedLibName;
        action.data=that.parent.requestModelDataForSolver();
        console.log(action.data);
        console.log('------------------------------------------');
        that.parent.requestAction(action);
    };


    this.enableHUD=function(val){
        that.parentWidget().enableHUD(val);
    };


    this.onChangeNodeType=function(selectionContainer){
        var strUser = selectionContainer.options[selectionContainer.selectedIndex].value;
        console.log(selectionContainer.selectedIndex+" the user string is "+strUser);
        that.selectedNode.setType(selectionContainer.selectedIndex, strUser);


    };


    this.changeNodesName=function(){
        that.selectedNode.setLabelText(nodeLabel.node().value);
    };

    this.createLETableEntry=function(cell,onChange,value,paramObj){
        var le=document.createElement('input');
        cell.appendChild(le);
        var leNode=d3.select(le);
        leNode.classed("form-control",true);
        le.value=value;
        leNode.on("change",function(){onChange(paramObj,cell);});

    };

    this.onLET_change=function(paramObj,cell){
      console.log("something changed"+paramObj);
      console.log(paramObj);
      console.log(cell);
      var newValue=cell.children[0].value;
      console.log("new Value To Set "+ newValue);
      console.log("new Value To Set Type "+ typeof newValue);
      paramObj.value=parseFloat(newValue);

    };

    this.addParameterRow=function(table,values,editable,paramObj){
        var rowId=table.node().rows.length;
        var row=table.node().insertRow(rowId);

        for (var i=0; i<values.length;i++){
            var cell = row.insertCell(i);
            if (editable && editable[i]===true){
                // create a lineEdit element;
                that.createLETableEntry(cell,that.onLET_change,values[i],paramObj);

            }else{
                cell.innerHTML=values[i];
            }
        }
    };

    this.changeSolverAddress=function(){
        var newSolverAddr=solverLineEdit.node().value;
        parentWidget.updateCommunicationSolverAddres(newSolverAddr);

    };




    this.onSFDNodeDelete=function(){
        console.log("delete sfd node");
        that.parent.nodeDeletion(that.selectedNode);
        that.selectedNode = null;
        nodeGroup.collapseBody();
    };

    this.addLoadedLibNames=function(array) {
        var optsArray = ["Select Library"];
        optsArray = optsArray.concat(array);
        // go to options and add them ;
        // console.log(librarySelection.node().children);
        // clear them ;
        // clear possible pre searched entries
        var htmlCollection = librarySelection.node().children;
        var numEntries = htmlCollection.length;
        var i;
        for (i = 0; i < numEntries; i++){
            htmlCollection[0].remove();
        }
        var fullgcmIndex=-1;
        for ( i=0;i<optsArray.length;i++){
            var optA=document.createElement('option');
            optA.innerHTML=optsArray[i];
            if (optsArray[i]==="fullgcm")
                fullgcmIndex=i;
            librarySelection.node().appendChild(optA);
        }
        librarySelection.node().options[0].hidden = true;
        // hardCoded;
        if (fullgcmIndex>=0) {
            librarySelection.node().options[fullgcmIndex].selected="selected";
            selectedLibraryName="fullgcm";
            loadedLibName=selectedLibraryName;
        }


    };


    this.generateControls=function() {
        nodeGroup=that.createAccordionGroup(that.divControlsGroupNode,"Concept");
        mapsToLib = that.addSelectionOpts(nodeGroup, "Library Mapping", ["a1","a2"], that.onChangeMapLib,"libMapLabelSFD");
        linksGroup = that.createAccordionGroup(that.divControlsGroupNode, "Links");
        nodeGroup.collapseBody();
        linksGroup.collapseBody();

        linksGroup.overWriteAccordionClickToNodeLinkElement();
        nodeGroup.overWriteAccordionClickToNodeLinkElement();
        linkClass = that.addSelectionOpts(linksGroup, "Link type", ["Undefined", "Causal Relation"], that.onChangeLinkClass);
           linkClass.node().options[0].hidden = true;
        linkClass.node().options[1].selected=true;



        causalSelection = that.addSelectionOpts(linksGroup, "Influence", getClassValues, that.onChangeLinkType);
        d3.select(causalSelection.node().parentNode).classed("hidden", false);
        commentLink = that.addTextEdit(linksGroup, "Comments", "", true, that.onChangeLinkComment);
          sfdChipNode=that.addNodeTypeChip(nodeGroup,"Rain","#fafafa",that.onSFDNodeDelete,"sfdChipField",true,"./data/img/rain.png","sfd","1");
          sfdChip=sfdChipNode[0];
          sfdChipImage=sfdChipNode[1];

          parameterTable=that.addTable(nodeGroup,"Parameters",["Name","Value"]);

          portTable=that.addTable(nodeGroup,"Ports",["Name","Type","Value"],true);

          // var tempIcon = document.createElement('i');
          nodeGroup.collapseBody();

          controlsMenuLibrary=that.createAccordionGroup(that.divControlsGroupNode, "Model Controls");
          controlsMenu= that.createAccordionGroup(that.divControlsGroupNode, "Server Controls");
         // solverLineEdit=that.addLineEdit(controlsMenu,"Server Address","http://localhost:4000",true,that.changeSolverAddress);
       solverLineEdit=that.addLineEdit(controlsMenu,"Server Address","http://vocol.iais.fraunhofer.de/graceful-rat",true,that.changeSolverAddress);


          librarySelection=that.addSelectionOpts(controlsMenu, "Library", ["Select Library"], that.onSelectLibrary);
          librarySelection.node().options[0].hidden = true;

        loadSFD= that.addButton(controlsMenuLibrary, "LOAD MODEL", "sfdLoadModel", that.loadGlobalFunction, "flat", true, "cloud_upload" );
        saveSFD= that.addButton(controlsMenuLibrary, "SAVE MODEL", "sfdSaveModel", that.saveFunction, "flat", true, "save" );
        clearSFD= that.addButton(controlsMenuLibrary, "CLEAR MODEL", "sfdClearGraph", that.clearGraph, "flat", true, "clear_all" );
        
        reqSFD= that.addButton(controlsMenu, "GET LIBRARY", "sfdGetLibrary", that.serverRequest, "flat", true, "get_app" );
        reqSFD.disabled=true;
        submitSFDs= that.addButton(controlsMenu, "SEND MODEL", "sfdSendModel", that.testSubmitModel, "flat", true, "send" );
        that.enableHUD(false);


    };

    this.start();

    this.handleSelectionForOptions=function(node){
        var i;

            // kill libraryMapping
            mapsToLib.classed("hidden", true);
            d3.select("#libMapLabel").classed("hidden", true);

            // check if node has subClass;
            if (node.getGlobalNodePtr().getSfdNode().getSubClasses) {
                var sC = node.getGlobalNodePtr().getSfdNode().getSubClasses();
                // console.log("testing subClasses"+sC);
                if (sC.length > 0) {
                    mapsToLib.classed("hidden", false);
                    d3.select("#libMapLabel").classed("hidden", false);
                } else {
                    sC = node.getGlobalNodePtr().getSfdNode().getSuperClassChildren();
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
                for (i = 0; i < numEntries; i++) {
                    htmlCollection[0].remove();
                }

                for (i = 0; i < sC.length; i++) {
                    var optA = document.createElement('option');
                    optA.innerHTML = sC[i];
                    mapsToLib.node().appendChild(optA);
                }
            }
            mapsToLib.node().value = node.libElement;


    };

    this.handleNodeSelection=function(node){
        // should be overwritten by the real options thing
        // console.log("hello node Selection");
        // console.log(node);
        if (node === undefined || node === null) {
            nodeGroup.collapseBody();
            that.evilNodeElement(undefined);
            return;
        }
        var selId;
        var i,items;
        if (node.getElementType()==="NodeElement"|| node.getElementType()==="sfdNode") {

            // should be overwritten by the real options thing
            // console.log("controls handle node operation" + node);
            this.selectedNode = node;
            that.evilNodeElement(node);

            nodeGroup.expandBody();
            mapsToLib.classed("hidden",true);
            d3.select("#libMapLabel").classed("hidden",true);

            // check if node has subClass;
            if (node.getGlobalNodePtr().getSfdNode().getSubClasses) {
                var sC = node.getGlobalNodePtr().getSfdNode().getSubClasses();
                // console.log("testing subClasses"+sC);
                if (sC.length > 0) {
                    mapsToLib.classed("hidden", false);
                    d3.select("#libMapLabel").classed("hidden", false);
                } else {
                    sC = node.getGlobalNodePtr().getSfdNode().getSuperClassChildren();
                    // console.log("testing superClasses"+sC);
                    if (sC.length > 0) {
                        mapsToLib.classed("hidden", false);
                        d3.select("#libMapLabel").classed("hidden", false);
                    }
                }
                var htmlCollection = mapsToLib.node().children;
                var numEntries = htmlCollection.length;
                for ( i = 0; i < numEntries; i++)
                    htmlCollection[0].remove();


                for (i=0;i<sC.length;i++) {
                    var optA=document.createElement('option');
                    optA.innerHTML=sC[i];
                    mapsToLib.node().appendChild(optA);
                }


                if (that.selectedNode.libElement.length===0 && sC.length>0) {
                    mapsToLib.node().options[0].selected="selected";
                    that.selectedNode.getGlobalNodePtr().getSfdNode().setSubClassTypeFromText(mapsToLib.node().value);
                }
                mapsToLib.node().value=that.selectedNode.libElement;

            }
            sfdChip.innerHTML=that.selectedNode.label;
            sfdChipImage.setAttribute('src',that.selectedNode.getImageURL());

            var rows=parameterTable.node().rows;
            if (rows.length>1){
                // clear the rows;
                items=rows.length;
                for (i=1;i<items;i++){
                    rows[1].remove();
                }
            }

            var rowsPort=portTable.node().rows;
            if (rowsPort.length>1){
                // clear the rows;
                items=rowsPort.length;
                for (i=1;i<items;i++){
                    rowsPort[1].remove();
                }
            }


            // get node parameters
            var nodeParams=node.getParameterElements();
            // console.log("nodeParams");
            // console.log(nodeParams);
            for (i=0;i<nodeParams.length;i++){
                var name=nodeParams[i].name;
                //var type=nodeParams[i].type;
                var value=nodeParams[i].value;

                that.addParameterRow(parameterTable,[name,value],[false,true],nodeParams[i]);

            }


            var portsParameters=node.getPortElements();
            for (var j=0;j<portsParameters.length;j++){
                var p_name=portsParameters[j].getPortName();
                var p_type=portsParameters[j].getPortType();
                var p_value=portsParameters[j].getPortValue();

                that.addParameterRow(portTable,[p_name,p_type,p_value],[false,false,false],portsParameters[j]);

            }

        }
        if (node.getElementType()==="LinkElement") {

            // should be overwritten by the real options thing
            // console.log("controls handle zort zort node operation" + node);
            this.selectedNode = node;
            nodeGroup.collapseBody();
            linksGroup.expandBody();

            // todo overwrite the values;
            var selId_1 = that.selectedNode.getClassType();
            selId_1=1;
            if (selId_1===-1){
                // nothing to do; this is a goal tree link without any information!
                linksGroup.collapseBody();
                return;

            }
            linkClass.node().options[selId_1].selected = "selected";
            console.log(that.selectedNode);
            if (that.selectedNode.getGlobalLinkPtr().getCLDLINK()) {

                var selId_2 = that.selectedNode.getGlobalLinkPtr().getCLDLINK().getTypeId();
                console.log("TypeId " + selId_2);
                var temp = linkClass.node().options[selId_1].value;
                if (temp !== "Undefined") {
                    appendLinkType(temp, node);
                    causalSelection.node().options[selId_2].selected = "selected";
                    d3.select(causalSelection.node().parentNode).classed("hidden", false);
                    console.log("Link type id: " + causalSelection.node().options[selId_2].value);
                }
                else
                    d3.select(causalSelection.node().parentNode).classed("hidden", true);
            }
            else{
                var selId_2 = that.selectedNode.getGlobalLinkPtr().getsfdLINK().getTypeId();
                console.log("TypeId " + selId_2);
                var temp = linkClass.node().options[selId_1].value;
                if (temp !== "Undefined") {
                    appendLinkType(temp, node);
                    causalSelection.node().options[selId_2].selected = "selected";
                    d3.select(causalSelection.node().parentNode).classed("hidden", false);
                    console.log("Link type id: " + causalSelection.node().options[selId_2].value);
                }
                else
                    d3.select(causalSelection.node().parentNode).classed("hidden", true);
            }
            commentLink .node().disabled = false;
            commentLink .node().value = that.selectedNode.hoverText;


        }

    };


}

SimpleSFDControls.prototype = Object.create(BaseControls.prototype);
SimpleSFDControls.prototype.constructor = SimpleSFDControls;
