
function qGraph(parentWidget) {
    /** variable defs **/
    var that = this;
    var transformAnimation=false;
    this.parentWidget=parentWidget; // tells the graph which widget it talks to
    var cellResults=[];

 this.updateSvgSize=function(){
        var drawArea=this.parentWidget.getCanvasArea();
        var w = drawArea.node().getBoundingClientRect().width;
        var h= window.innerHeight ;
        // console.log("size:"+w+" "+h );
        if (that.svgElement)
            that.svgElement.attr("width", w).attr("height", h);
    };

    this.activateGraph=function(val){
         console.log("A QGraph wants to be rendered "+ val);
        if (val===true){
            that.svgElement.classed("hidden",false);
            console.log("activated draw are for qWidget");
            console.log(that.svgElement);
        }
        else {
            that.svgElement.classed("hidden", true);

        }
    };


    this.simulateClickOnGraph=function(){
        console.log("simulating click");
      // todo : fix the operation when we are in an edit state of a node text, so we cant drag other nodes or
      // todo : at least their position is than at the proper position

    };
    // needs to be called by the derived graph itself!
    this.initializeGraph=function(){
        this.completeQuestionnaire = [];
        // generatges the svg element and adds this to the drawArea;
        var drawArea=parentWidget.getCanvasArea();
        // console.log("the draw area is "+drawArea);
        // todo: figure out why hight is not properly detected
        var w = drawArea.node().getBoundingClientRect().width;
        //var h= drawArea.node().getBoundingClientRect().height;
        var h= window.innerHeight ;
        this.svgElement= parentWidget.getCanvasArea().append("div");
        that.svgElement.node().innerHTML=" ----- Import the Model Please --";
        // classing the graph is a particular graph thing so we dont do this here
        // per default hidden
        that.svgElement.classed("hidden",true);
        that.svgElement.attr("id", "mainQuestionnaire");
    };

    this.integrateTheModel=function(){
        that.svgElement.node().innerHTML="";

        var labelTable = document.createElement('h5');
        labelTable.innerHTML = "Stakeholder List";
        that.svgElement.node().appendChild(labelTable);

        var stakeHolders=gHandlerObj.requestDataForQuestionair();

        // console.log("Stakeholders");
        // console.log(stakeHolders);

        // craetea fancy table;
        var table=document.createElement('table');

        // add table to div
        d3.select(table).classed("mdl-data-table mdl-js-data-table mdl-shadow--0dp", true);
        var percentage=100;

        d3.select(table).style("width",percentage+"%");
        that.svgElement.node().appendChild(table);

        var row = table.insertRow(0);
        var head = table.createTHead();
        var tablerow=head.insertRow(0);

        // create the header names;
        var header_name= tablerow.insertCell(0);
        var header_email= tablerow.insertCell(1);
        var header_createElement=tablerow.insertCell(2);
        var header_sendElement= tablerow.insertCell(3);
        var header_result= tablerow.insertCell(4);

        header_name.innerHTML="Stake Holder";
        header_email.innerHTML="Email";
        header_createElement.innerHTML="Create Element";
        header_sendElement.innerHTML="Send Element";
        header_result.innerHTML="Result?";

        d3.select(tablerow).classed("headerTable",true);
        tablerow.align = "center";

        for (var i=0; i<stakeHolders.length;i++){
            // create a new table row;
            var iR=i+1;
            var st_row=table.insertRow(iR);


            var cell_name = st_row.insertCell(0);
            cell_name.innerHTML=stakeHolders[i].objectName;
            // this should be a line edit
            var cell_email = st_row.insertCell(1);
            that.createLETableEntry(cell_email,that.onLET_change,stakeHolders[i].email,stakeHolders[i]);

            var cell_create = st_row.insertCell(2);
            var cell_send = st_row.insertCell(3);
            var sendBT=that.createCellSendEntry(cell_send,that.onSEND,"Mail TO",stakeHolders[i]);
          //  sendBT.disabled=true;
            that.createCellCreateEntry(cell_create,that.onCreate,"Create",stakeHolders[i],sendBT);
            var cell_result = st_row.insertCell(4);
            cell_result.innerHTML="PENDING";
            cellResults.push(cell_result);
        }

        // prepare the model
        for(var i=0; i<stakeHolders.length; i++) {
            var modelData=gHandlerObj.requestModelDataForQuestioner();
            modelData.stakeholderEmail=stakeHolders[i].email;
            modelData.stakeholderName=stakeHolders[i].objectName;
            that.completeQuestionnaire.push(modelData);
        }

        that.createWeightEditingTable();
        that.createValueEditingTable();

        var updateButton = document.createElement('button');
        updateButton.id = "updateButton";
        d3.select(updateButton).classed("mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent mdl-cell mdl-cell--4-col",true);
        var updateLabel = document.createElement('span');
        updateLabel.innerHTML="Update";
        updateButton.appendChild(updateLabel);
        that.svgElement.node().appendChild(updateButton);

        d3.select(updateButton).on("click", function() {
            that.callStakeholderResults();
        });
    };

    this.createWeightEditingTable = function() {
        that.svgElement.node().appendChild(document.createElement('br'));
        var editingDiv = document.createElement('div');
        editingDiv.id = "editingDivWeights";
        that.svgElement.node().appendChild(editingDiv);
        d3.select("#editingDivWeights").classed("hidden", false);

        var tableName = document.createElement('h5');
        tableName.innerHTML = "Summary - Stakeholder Weights";
        editingDiv.appendChild(tableName);

        var table=document.createElement('table');
        d3.select(table).classed("mdl-data-table mdl-js-data-table mdl-shadow--0dp", true);
        var percentage=100;
        d3.select(table).style("width",percentage+"%");
        d3.select(table).attr("id", "weightsTable");
        editingDiv.appendChild(table);        

        var row = table.insertRow(0);
        var head = table.createTHead();
        var tablerow=head.insertRow(0);

        // create the header names;
        var header_crit= tablerow.insertCell(0);
        var header_unit = tablerow.insertCell(1);        
        var totalStakeholders = that.completeQuestionnaire.length;

        header_crit.innerHTML="Criteria";
        header_unit.innerHTML = "Unit"

        for(var i=0; i<totalStakeholders; i++) {
            var header_sh = tablerow.insertCell(i+2);
            header_sh.innerHTML = that.completeQuestionnaire[i].stakeholderName;
        }

        d3.select(tablerow).classed("headerTable",true);

        var criteriaNodes=gHandlerObj.requestModelDataForQuestioner();
        criteriaNodes = criteriaNodes.criteria;

        for (var i=0; i<criteriaNodes.length;i++){
            // create a new table row;
            var iR=i+1;
            var st_row=table.insertRow(iR);

            var cell_name = st_row.insertCell(0);
            cell_name.innerHTML=criteriaNodes[i].name;
            var cell_unit = st_row.insertCell(1);
            cell_unit.innerHTML = criteriaNodes[i].unit;
            for(var j=0; j<totalStakeholders; j++) {
                var cell_weight = st_row.insertCell(j+2);
                var criteriaStakeholders = that.completeQuestionnaire[j].criteria;
                that.createWeightEntry(cell_weight,that.onWeightchange,criteriaStakeholders[i].weight,criteriaStakeholders[i]);
            }            
        }
    };

    this.createWeightEntry = function(cell,onChange,value,paramObj) {
        var le=document.createElement('input');
        cell.appendChild(le);
        var leNode=d3.select(le);
        leNode.classed("form-control",true);
        le.value=value;
        le.type = "number";
        leNode.on("change",function(){onChange(paramObj,cell);});
    };

    this.onWeightchange = function(paramObj,cell) {
        console.log("something changed"+paramObj);
        console.log(paramObj);
        var newValue=Number(cell.children[0].value);

        if(newValue < 0) {
            alert("Weight cannot be less then 0");
            newValue = cell.children[0].value = 0;            
        }
        else if(newValue > 100) {
            alert("Weight cannot be more then 100");
            newValue = cell.children[0].value = 100;
        }
        // console.log("new Value To Set "+ newValue);
        paramObj.weight=newValue;
        // console.log("please show the full data");
        // console.log(JSON.stringify(that.completeQuestionnaire));
    };

    this.createValueEditingTable = function() {
        that.svgElement.node().appendChild(document.createElement('br'));
        var editingDiv = document.createElement('div');
        editingDiv.id = "editingDivVals";
        that.svgElement.node().appendChild(editingDiv);
        d3.select("#editingDivVals").classed("hidden", false);

        var tableName = document.createElement('h5');
        tableName.innerHTML = "Summary - Stakeholder Values/Constraints";
        editingDiv.appendChild(tableName);

        var table=document.createElement('table');
        d3.select(table).classed("mdl-data-table mdl-js-data-table mdl-shadow--0dp", true);
        var percentage=100;
        d3.select(table).style("width",percentage+"%");
        d3.select(table).attr("id", "valsTable");
        editingDiv.appendChild(table);        

        var row = table.insertRow(0);
        var head = table.createTHead();
        var tablerow=head.insertRow(0);

        // create the header names;
        var header_crit= tablerow.insertCell(0);
        var header_unit = tablerow.insertCell(1);        
        var totalStakeholders = that.completeQuestionnaire.length;

        header_crit.innerHTML="Criteria";
        header_unit.innerHTML = "Unit"

        for(var i=0; i<totalStakeholders; i++) {
            var header_sh = tablerow.insertCell(i+2);
            header_sh.innerHTML = that.completeQuestionnaire[i].stakeholderName;
        }

        d3.select(tablerow).classed("headerTable",true);

        var criteriaNodes=gHandlerObj.requestModelDataForQuestioner();
        criteriaNodes = criteriaNodes.criteria;

        for (var i=0; i<criteriaNodes.length;i++){
            // create a new table row;
            var iR=i+1;
            var st_row=table.insertRow(iR);

            var cell_name = st_row.insertCell(0);
            cell_name.innerHTML=criteriaNodes[i].name;
            var cell_unit = st_row.insertCell(1);
            cell_unit.innerHTML = criteriaNodes[i].unit;
            for(var j=0; j<totalStakeholders; j++) {
                var cell_vals = st_row.insertCell(j+2);
                var criteriaStakeholders = that.completeQuestionnaire[j].criteria;
                that.createValsEntry(cell_vals,that.onValschange,criteriaStakeholders[i].value,criteriaStakeholders[i]);
            }            
        }
    };

    this.createValsEntry = function(cell,onChange,value,paramObj) {
        var le=document.createElement('select');
        cell.appendChild(le);
        var leNode=d3.select(le);
        leNode.classed("selectpicker form-control",true);
        le.multiple = true;

        var optsArray = ["much less", "less", "about equal", "more", "much more"];
        var optsVals = [-2, -1, 0, 1, 2];
        for (var i=0;i<optsArray.length;i++){
            var optA=document.createElement('option');
            optA.innerHTML=optsArray[i];
            optA.value = optsVals[i];
            le.appendChild(optA);
        }
        leNode.on("change",function(){onChange(paramObj,cell);});
    };

    this.onValschange = function(paramObj,cell) {
        var res = $(cell.children[0]).val();
        paramObj.value = res.map(Number);
        console.log("paramObj value: "+paramObj.value);
        console.log(JSON.stringify(that.completeQuestionnaire));
    };

    this.integrateStakeHolderResults=function(string){
        // console.log("intigrating a String "+string);

        // MAKE A json OBJ

        var jOb=JSON.parse(string);
        that.updateQuestionnaire(jOb);

        // get a name of the stakeHolder
        var name=jOb.stakeholderName;
        var globalNodeId=undefined;
        // console.log("stakeHolder Name"+name);


        var globalNodes=gHandlerObj.getAllGlobalNodes();
        // get the stakeHolders;
        var stakeHolders=gHandlerObj.requestDataForQuestionair();
        // find the id of that thing;
        var st_node;
        for (var i=0;i<stakeHolders.length;i++){
            if (stakeHolders[i].objectName===name){
                cellResults[i].innerHTML='RECEIVED';
                if (globalNodeId===undefined) {
                    // find the corresponding node;
                    // console.log("searching for corresponding stakeholder node");
                    for (var g=0;g<globalNodes.length;g++){
                        if (globalNodes[g].getNodeName()===name){
                            st_node=globalNodes[g];
                            break;
                        }
                    }
                }
            }
        }
        // craete the links for that thing;

        if (st_node){
            console.log("Found stakeholder node "+st_node.getNodeName());


            var normalizedWeights=[];
            var values_str=[];
            // normlizing;
            var sumOfWeights=0;


            // get the criteria elements
            var critElements=jOb.criteria;
            // console.log("crit elements are");
            // console.log(critElements);

            // compute normalization factor;
            for (var w=0;w<critElements.length;w++){
                var w_no = Number(critElements[w].weight);
                normalizedWeights.push(w_no);
                values_str.push(critElements[w].value);
                sumOfWeights+=w_no;
            }

            // normlize;
            for ( w=0;w<critElements.length;w++){
                normalizedWeights[w]/=sumOfWeights;
                normalizedWeights[w] = normalizedWeights[w].toFixed(3);
            }

            for (i=0;i<critElements.length;i++){
                var targetNodeId=critElements[i].id;
                var tarNode=gHandlerObj.getNodeById(targetNodeId);
                // console.log("Getting tarNode: "+tarNode.id());
                if (tarNode){
                    // console.log("found target Node");

                    var w_no = Number(critElements[i].weight);

                    if(normalizedWeights[i] !== "0.000" && w_no>0.5) {
                        gHandlerObj.createStakeholderLink(st_node,tarNode,normalizedWeights[i],values_str[i], i);
                    }
                }
            }

        }
    };

    this.updateQuestionnaire = function(resultsData) {
        var getWeighTable = document.getElementById("weightsTable");
        var getValTable = document.getElementById("valsTable");

        for(var i=0; i<that.completeQuestionnaire.length; i++) {
            var eachStake = that.completeQuestionnaire[i];
            if(eachStake.stakeholderName === resultsData.stakeholderName) {
                var crits = eachStake.criteria;
                for(var j=0; j<crits.length; j++) {                    
                    //update weights
                    crits[j].weight = resultsData.criteria[j].weight;
                    var this_cell = getWeighTable.rows[j+1].cells[i+2];
                    console.log("WEIGHTS:"+crits[j].weight);
                    this_cell.childNodes[0].value = crits[j].weight;

                    //update values
                    crits[j].value = resultsData.criteria[j].value;
                    var val_cell = getValTable.rows[j+1].cells[i+2];
                    console.log("VALS:"+crits[j].value);
                    $(val_cell.childNodes[0]).val(crits[j].value);
                }
            }
        }
    };

    this.callStakeholderResults = function() {
        //clear all the stakeholder links first
        var widgetHandler = gHandlerObj.getGraphObjects();
        var cldG = widgetHandler[1];
        var cldLinks = widgetHandler[1].pathElementArray;        
        for(var i=0;i<cldLinks.length; i++) {
            // console.log("CLD Links List: "+cldLinks[i].id()+ " superlink type:"+cldLinks[i].superLinkType);
            if(cldLinks[i].superLinkType === 100) {
                // console.log("yes its a stakeholder link. Delete it!!");
                cldG.handleLinkDeletion(cldLinks[i]);
            }
        }
        //now redraw stakeholder links
        for(var i=0; i<that.completeQuestionnaire.length; i++) {
            var stakeObject = that.completeQuestionnaire[i];
            that.integrateStakeHolderResults(JSON.stringify(stakeObject));
        }
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
        // console.log("something changed"+paramObj);
        // console.log(paramObj);
        // console.log(cell);
        var newValue=cell.children[0].value;
        // console.log("new Value To Set "+ newValue);
        // console.log("new Value To Set Type "+ typeof newValue);
        paramObj.email=newValue;

    };


    this.createCellCreateEntry=function(cell,onChange,value,paramObj,sendBT){
        var buttonClass="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";
        var btnType="flat";
        var btnIcon=true;
        var btnIconType="save";
        var btnId="someBTN";
        if( btnType == "flat")
            buttonClass="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" ;
        else if( btnType == "fab" )
            buttonClass="mdl-button mdl-js-button mdl-button--fab mdl-button--colored";


        // Create Parent Div with Correct Grid Layout in the GRID
        var buttonMainDiv = document.createElement('div');
        cell.appendChild(buttonMainDiv);
        d3.select(buttonMainDiv).classed("mdl-cell mdl-cell--12-col",true);

        // adding button to the dom element
        var button = document.createElement('button');
        cell.appendChild(button);
        d3.select(button).classed(buttonClass+" mdl-cell mdl-cell--12-col",true);
        button.setAttribute('id',btnId);
        // adding Icon to the button if required
        if(btnIcon==true)
        {
            var icon = document.createElement('i');
            d3.select(icon).classed("material-icons btn-icon-special",true);
            icon.innerHTML=btnIconType;
            button.appendChild(icon);
        }


        // add label text
        var label = document.createElement('span');
        label.innerHTML=value;
        button.appendChild(label);

        buttonMainDiv.appendChild(button);

        d3.select(button).on("click", function() {
            onChange(paramObj,cell,sendBT);
        });
        return button;
    };


    this.createCellSendEntry=function(cell,onChange,value,paramObj){
        var buttonClass="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";
        var btnType="flat";
        var btnIcon=true;
        var btnIconType="send";
        var btnId="someBTN";
        if( btnType == "flat")
            buttonClass="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" ;
        else if( btnType == "fab" )
            buttonClass="mdl-button mdl-js-button mdl-button--fab mdl-button--colored";


        // Create Parent Div with Correct Grid Layout in the GRID
        var buttonMainDiv = document.createElement('div');
        cell.appendChild(buttonMainDiv);
        d3.select(buttonMainDiv).classed("mdl-cell mdl-cell--12-col",true);

        // adding button to the dom element
        var button = document.createElement('button');
        cell.appendChild(button);
        d3.select(button).classed(buttonClass+" mdl-cell mdl-cell--12-col",true);
        button.setAttribute('id',btnId);
        // adding Icon to the button if required
        if(btnIcon==true)
        {
            var icon = document.createElement('i');
            d3.select(icon).classed("material-icons btn-icon-special",true);
            icon.innerHTML=btnIconType;
            button.appendChild(icon);
        }


        // add label text
        var label = document.createElement('span');
        label.innerHTML=value;
        button.appendChild(label);

        buttonMainDiv.appendChild(button);

        d3.select(button).on("click", function() {
            onChange(paramObj,cell);
        });
        return button;
    };

    this.onSEND=function(paramObj,cell){
        console.log("we need to mail this ");
        console.log("stackeholder is");
        console.log(paramObj);

        // create a json object containing the creteria of the model;


        var modelData=gHandlerObj.requestModelDataForQuestioner();
        console.log("That model data");
        modelData.stakeholderEmail=paramObj.email; // /stores the email inside the json obj;
        modelData.stakeholderName=paramObj.objectName;
        var jsonModelStr=JSON.stringify(modelData);
        console.log(jsonModelStr);


        // creating an email thingy;



            var subject= "GRACeFUL model";
            var body = jsonModelStr;
            var uri = "mailto:"+paramObj.email+"?subject=";
            uri += encodeURIComponent(subject);
            uri += "&body=";
            uri += encodeURIComponent(body);

            console.log(uri);

            var newTab=window.open(uri);
            newTab.close();

/*
            // create a hidden button;
        var tempHref=document.createElement('a');
        tempHref.href=uri;
        tempHref.innerHTML="hello world";
        cell.appendChild(tempHref);

       console.log("simulating click");
        //tempHref.click();

        //tempHref.hidden = true;
        // remove that thing
        d3.select("#TemporalDiv").remove();
*/




    };

    this.onCreate=function(paramObj,cell,sendBt){
        console.log("we need to mail this ");
        console.log("stackeholder is");
        console.log(paramObj);

        // create a json object containing the creteria of the model;
        var modelData=gHandlerObj.requestModelDataForQuestioner();
        console.log("That model data");
        modelData.stakeholderEmail=paramObj.email; // /stores the email inside the json obj;
        modelData.stakeholderName=paramObj.objectName;

        var jsonModelStr=JSON.stringify(modelData);

        // create a hidden wrapper for saving files;
        var tempHref=document.createElement('a');
        tempHref.type="submit";
        tempHref.href="#";
        tempHref.download="";
        tempHref.innerHTML="Save Global Model";
        tempHref.id="temporalHrefId";

        cell.appendChild(tempHref);
        tempHref.href="data:text/json;charset=utf-8," + encodeURIComponent(jsonModelStr);
        var namedJson=paramObj.objectName+".json";
        console.log("namedJSON: "+namedJson);
        tempHref.download=namedJson;
        tempHref.click();
        tempHref.hidden = true;
        // remove that thing
        d3.select("#TemporalDiv").remove();

        sendBt.disabled=false;

    };



}

qGraph.prototype.constructor = qGraph;
