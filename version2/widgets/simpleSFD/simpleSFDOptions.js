function SimpleSFDControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    this.parent=parentWidget;

    var controlsMenu;
    var optionsGroup, nodeGroup;
    var nodeSelGroup;
    var parametersGroup;
    var parameterTable;
    var portTable;
    var solverLineEdit;
    var nodeClass,nodeLabel;

    this.onChangeEmpty=function(x){
        // empty function does not do anything, used for debuging
        console.log("changing something"+x)
    };

    this.clearGraph=function(){
        parentWidget.clearGraph();
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
        optionsGroup.getBody().node().appendChild(hidden_solutionInput);
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

    this.saveFunction=function(){
        console.log("saving was pressed");
        var action={};
        action.task="ACTION_SAVE_JSON";
        that.parent.requestAction(action);
    };


    this.serverRequest=function(){
        // the action defines a request type which is send to com mod and that one does the work
        console.log("requesting data from server : this example is library crud");
        var action={};
        action.task="SERVER_REQUEST";
        action.requestType="GET_LIBRARY"; // testing purpose
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

        action.data=that.parent.requestModelDataForSolver();
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


    this.generateControls=function() {
        // testing stuff,

        // controls menu;


        controlsMenu= that.createAccordionGroup(that.divControlsGroupNode, "Controls");
        solverLineEdit=that.addLineEdit(controlsMenu,"SolverAddress","http://localhost:4000",true,that.changeSolverAddress);
        that.addHrefButton(controlsMenu,"Clear",that.clearGraph,true);
        that.addHrefButton(controlsMenu,"Load",that.loadFunction,true);
        that.addHrefButton(controlsMenu,"Save",that.saveFunction,true);
        that.addHrefButton(controlsMenu,"Get Lib",that.serverRequest,true);
        that.addHrefButton(controlsMenu,"Send ",that.testSubmitModel,true);
        that.addCheckBox(controlsMenu,"Show HUD","cb_test1",true,that.enableHUD); // per default enable the hud
        // execute the default value;
        that.enableHUD(true);


        nodeGroup=that.createAccordionGroup(that.divControlsGroupNode,"Node Types");
     //   nodeSelGroup= that.addSelectionOpts(nodeGroup, "Node type", ["Undefined", "A", "B"], that.onChangeNodeType);
        nodeClass=that.addLabel(nodeGroup,"Class","nodesClass");
        nodeLabel=that.addLineEdit(nodeGroup,"Name","nodesName",false, that.changeNodesName);

        parameterTable=that.addTable(nodeGroup,"Parameters",["name","type","value"]);
        // that.addParameterRow(parameterTable,["a","b","c"]);
        // that.addParameterRow(parameterTable,["d","e","f"]);

        portTable=that.addTable(nodeGroup,"Ports",["name","type","value"]);
        // that.addParameterRow(portTable,["d","e","f"]);
        // that.addParameterRow(portTable,["d","e","f"]);

    };

    this.start();





    this.handleNodeSelection=function(node){
        // should be overwritten by the real options thing


        if (node === undefined || node === null) {
            nodeGroup.collapseBody();
            return;
        }
        console.log("node type "+ node.getElementType());
        var selId;
        var i,items;
        if (node.getElementType()==="NodeElement") {

            // should be overwritten by the real options thing
            // console.log("controls handle node operation" + node);
            this.selectedNode = node;
            nodeGroup.expandBody();

            // set the proper parameters
            var pref=nodeClass.attr("prefix");
            nodeClass.node().innerHTML=pref+": "+node.getNodeName();
            nodeLabel.node().value = that.selectedNode.label;
            nodeLabel.node().disabled = false;


            // parameter table createtion
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
            for (i=0;i<nodeParams.length;i++){
                var name=nodeParams[i].name;
                var type=nodeParams[i].type;
                var value=nodeParams[i].value;

                that.addParameterRow(parameterTable,[name,type,value],[false,false,true],nodeParams[i]);

            }


            var portsParameters=node.getPortElements();
            for (var j=0;j<portsParameters.length;j++){
                var p_name=portsParameters[j].getPortName();
                var p_type=portsParameters[j].getPortType();
                var p_value=portsParameters[j].getPortValue();

                that.addParameterRow(portTable,[p_name,p_type,p_value],[false,false,false],portsParameters[j]);

            }

        }

    };


}

SimpleSFDControls.prototype = Object.create(BaseControls.prototype);
SimpleSFDControls.prototype.constructor = SimpleSFDControls;

