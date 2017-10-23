

function qGraph(parentWidget) {
    /** variable defs **/
    var that = this;
    var transformAnimation=false;
    this.parentWidget=parentWidget; // tells the graph which widget it talks to
    var modelObject;

    this.getModelObject=function(){return modelObject;};

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

    this.createModelObjects=function(obj){
        // craete a table
        modelObject=obj;
        that.svgElement.node().innerHTML="";

        // craetea fancy table;
        var table=document.createElement('table');

        // add table to div
        d3.select(table).classed("mdl-data-table mdl-js-data-table mdl-shadow--0dp", true);
        var percentage=50;

        d3.select(table).style("width",percentage+"%");
        that.svgElement.node().appendChild(table);

        var row = table.insertRow(0);
        var head = table.createTHead();
        var tablerow=head.insertRow(0);

        // create the header names;
        var header_crit= tablerow.insertCell(0);
        var header_unit = tablerow.insertCell(1);
        var header_weight= tablerow.insertCell(2);
        var header_value=tablerow.insertCell(3);


        header_crit.innerHTML="Criteria";
        header_unit.innerHTML = "Unit"
        header_weight.innerHTML="Weight";
        header_value.innerHTML="Constraint";

        d3.select(tablerow).classed("headerTable",true);

        var criteriaNodes=obj.criteria;

        for (var i=0; i<criteriaNodes.length;i++){
            // create a new table row;
            var iR=i+1;
            var st_row=table.insertRow(iR);


            var cell_name = st_row.insertCell(0);
            cell_name.innerHTML=criteriaNodes[i].name;
            var cell_unit = st_row.insertCell(1);
            cell_unit.innerHTML = criteriaNodes[i].unit;
            // this should be a line edit
            var cell_weight = st_row.insertCell(2);
            that.createLETableEntry(cell_weight,that.onLET_change,criteriaNodes[i].weight,criteriaNodes[i], "weight");

            var cell_value = st_row.insertCell(3);
            // that.createLETableEntry(cell_value,that.onLET_changeString,criteriaNodes[i].value,criteriaNodes[i], "value");
            that.createLETableValue(cell_value,that.onLET_changeString,criteriaNodes[i].value,criteriaNodes[i], "value");
        }

    };


    this.simulateClickOnGraph=function(){
        console.log("simulating click");
      // todo : fix the operation when we are in an edit state of a node text, so we cant drag other nodes or
      // todo : at least their position is than at the proper position

    };
    // needs to be called by the derived graph itself!
    this.initializeGraph=function(){
        // generatges the svg element and adds this to the drawArea;
        var drawArea=parentWidget.getCanvasArea();
        // console.log("the draw area is "+drawArea);
        // todo: figure out why hight is not properly detected
        var w = drawArea.node().getBoundingClientRect().width;
        //var h= drawArea.node().getBoundingClientRect().height;
        var h= window.innerHeight ;
        console.log("HEEEEEEELLLLLOOOOOOOO ---------------------------");
        this.svgElement= parentWidget.getCanvasArea().append("div");
        that.svgElement.node().innerHTML=" ----- Import the Model Please --";
        // classing the graph is a particular graph thing so we dont do this here
        // per default hidden
        that.svgElement.classed("hidden",true);

    };

    this.integrateTheModel=function(){
        that.svgElement.node().innerHTML="";


        var stakeHolders=gHandlerObj.requestDataForQuestionair();

        // craetea fancy table;
        var table=document.createElement('table');

        // add table to div
        d3.select(table).classed("mdl-data-table mdl-js-data-table mdl-shadow--0dp", true);
        var percentage=50;

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

        header_name.innerHTML="Stake Holder";
        header_email.innerHTML="Email";
        header_createElement.innerHTML="Create Element";
        header_sendElement.innerHTML="Send Element";

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


        }

        //
        // for (var i=0;i<stakeHolders.length;i++) {
        //     var elements = that.svgElement.append("div");
        //     var str=stakeHolders[i].getNodeName();
        //     console.log("name"+str);
        //     elements.node().innerHTML=str;
        //
        // }
    };

    this.createLETableEntry=function(cell,onChange,value,paramObj, type){
        var le=document.createElement('input');
        cell.appendChild(le);
        var leNode=d3.select(le);
        leNode.classed("form-control",true);
        le.value=value;
        if(type === "weight") {
            le.type = "number";
        }
        leNode.on("change",function(){onChange(paramObj,cell);});

    };

    this.createLETableValue = function(cell,onChange,value,paramObj, type) {
        var le=document.createElement('select');
        cell.appendChild(le);
        var leNode=d3.select(le);
        leNode.classed("selectpicker form-control",true);
        // le.value=value;cell_value,that.onLET_changeString,criteriaNodes[i].value,criteriaNodes[i], "value"
        var optsArray = ["0", "+", "-"];
        for (var i=0;i<optsArray.length;i++){
            var optA=document.createElement('option');
            optA.innerHTML=optsArray[i];
            le.appendChild(optA);
        }
        leNode.on("change",function(){onChange(paramObj,cell);});
    };


    this.onLET_change=function(paramObj,cell){
        console.log("something changed"+paramObj);
        console.log(paramObj);
        console.log(cell);
        var newValue=Number(cell.children[0].value);
        // newValue = Math.min(100,Math.max(0,newValue));
        if(newValue < 0) {
            alert("Weight cannot be less then 0");
            newValue = cell.children[0].value = 0;            
        }
        else if(newValue > 100) {
            alert("Weight cannot be more then 100");
            newValue = cell.children[0].value = 100;
        }
        console.log("new Value To Set "+ newValue);
        console.log("new Value To Set Type "+ typeof newValue);
        paramObj.weight=newValue;
    };

    this.onLET_changeString=function(paramObj,cell){
        console.log("something changed"+paramObj);
        console.log(paramObj);
        console.log(cell);
        var newValue=cell.children[0].value;
        if(newValue === "0") 
            paramObj.value = 0;
        else if(newValue === "+")
            paramObj.value = 1;
        else if(newValue === "-")
            paramObj.value = -1;
        console.log("new Value To Set "+ newValue);
        console.log("new Value To Set Type Solver "+ paramObj.value);
        // paramObj.value=newValue;
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

        var jsonModelStr=JSON.stringify(modelData);
        console.log(jsonModelStr);

        // download this to your default path;
        console.log("Downloading things;")

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
