function SimpleSFDControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    this.parent=parentWidget;

    var controlsMenu;
    var optionsGroup, nodeGroup;
    var nodeSelGroup;

    this.onChangeEmpty=function(x){
        // empty function does not do anything, used for debuging
        console.log("changing something"+x)
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
        action.data='{"nodes":[{"name":"rain","parameters":[{"name":"amount","type":"Float","value":0}],"identity":0,"interface":[{"name":"rainfall","type":"Flow"}]}]}';
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


    this.generateControls=function() {
        // testing stuff,

        // controls menu;


        controlsMenu= that.createAccordionGroup(that.divControlsGroupNode, "Controls");
        that.addHrefButton(controlsMenu,"Load",that.loadFunction,true);
        that.addHrefButton(controlsMenu,"Save",that.saveFunction,true);
        that.addHrefButton(controlsMenu,"Get Lib",that.serverRequest,true);
        that.addHrefButton(controlsMenu,"Send ",that.testSubmitModel,true);
        that.addCheckBox(controlsMenu,"Show HUD","cb_test1",true,that.enableHUD); // per default enable the hud
        // execute the default value;
        that.enableHUD(true);


        nodeGroup=that.createAccordionGroup(that.divControlsGroupNode,"Node Types");
        nodeSelGroup= that.addSelectionOpts(nodeGroup, "Node type", ["Undefined", "A", "B"], that.onChangeNodeType);

    };

    this.start();



    this.handleNodeSelection=function(node){
        // should be overwritten by the real options thing


        if (node === undefined) {
            nodeGroup.collapseBody();
            return;
        }
        console.log("node type "+ node.getElementType());
        var selId;
        if (node.getElementType()==="NodeElement") {

            // should be overwritten by the real options thing
            // console.log("controls handle node operation" + node);
            this.selectedNode = node;
            nodeGroup.expandBody();

            // should be overwritten by the real options thing

            selId = that.selectedNode.getTypeId();
            nodeSelGroup.node().options[selId].selected = "selected";
        }

    };


}

SimpleSFDControls.prototype = Object.create(BaseControls.prototype);
SimpleSFDControls.prototype.constructor = SimpleSFDControls;

