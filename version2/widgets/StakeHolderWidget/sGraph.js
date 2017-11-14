

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
        var h= drawArea.node().getBoundingClientRect().height;
        // var h= window.innerHeight ;
        console.log("size:"+w+" "+h );
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

    this.loadQuestionnaire = function(theObj) {
        modelObject=theObj;
        that.svgElement.node().innerHTML="";

        //div for the Stakeholder weights
        var weightDiv = document.createElement('div');
        weightDiv.id = "weightDiv";
        that.svgElement.node().appendChild(weightDiv);
        d3.select("#weightDiv").classed("hidden", false);

        var qName = document.createElement('h5');
        qName.innerHTML = "Please weigh the Criteria listed in the table by following the below steps:";
        weightDiv.appendChild(qName);
        var p1 = document.createElement('p');
        p1.innerHTML = "1. Assign the weight 100 for the criterion that is most important to you, ";
        weightDiv.appendChild(p1);
        var p2 = document.createElement('p');
        p2.innerHTML = "2. Assign the weight 0 for the criterion which has no relevance to you, ";
        weightDiv.appendChild(p2);
        var p3 = document.createElement('p');
        p3.innerHTML = "3. The most important criterion (weight of 100) becomes the standard for allocating weights of the remaining criteria. For example, if another criterion is judged to provide 80% as much priority as the standard, it should be given a weight of 80.";
        weightDiv.appendChild(p3);

        weightDiv.appendChild(document.createElement('br'));
        that.createWeightsTable(weightDiv, "wTable");
        weightDiv.appendChild(document.createElement('br'));

        var nextBut = document.createElement('button');
        nextBut.id = "nBut";
        nextBut.innerHTML = "Next";
        d3.select(nextBut).classed("btn btn-default", true);
        weightDiv.appendChild(nextBut);            
        d3.select(nextBut).on("click", function() {
            that.onNextButClick();
        });

        //div for the Stakeholder constraint
        var valDiv = document.createElement('div');
        valDiv.id = "valDiv";
        that.svgElement.node().appendChild(valDiv);
        d3.select("#valDiv").classed("hidden", true);

        var qName1 = document.createElement('h5');
        qName1.innerHTML = "Considering the criterion, please indicate which values are acceptable to you compared to the current situation.";
        valDiv.appendChild(qName1);

        valDiv.appendChild(document.createElement('br'));
        that.createValueTable(valDiv, "vTable");
        valDiv.appendChild(document.createElement('br'));

        var prevBut = document.createElement('button');
        prevBut.id = "pBut";
        prevBut.innerHTML = "Previous";
        d3.select(prevBut).classed("btn btn-default", true);
        valDiv.appendChild(prevBut);
        d3.select(prevBut).on("click", function() {
            that.onPrevButClick();
        });

        var finishBut = document.createElement('button');
        finishBut.id = "finBut";
        finishBut.innerHTML = "Finish";
        d3.select(finishBut).classed("btn btn-default ", true);
        valDiv.appendChild(finishBut);
        d3.select(finishBut).on("click", function() {
            that.onFinishBut();
        });

        //div after the finish is clicked
        var finalDiv = document.createElement('div');
        finalDiv.id = "final";
        that.svgElement.node().appendChild(finalDiv);
        d3.select("#final").classed("hidden", true);
        var finishMsg = document.createElement('h5');
        finishMsg.innerHTML = "End of Questionnaire!!!";
        finalDiv.appendChild(finishMsg);
        var finalP = document.createElement('p');
        finalP.innerHTML = "Please click on the SAVE button on the right side to save the results."
        finalDiv.appendChild(finalP);
    };

    this.onPrevButClick = function(id) {
        console.log("prev button clicked");
        d3.select("#weightDiv").classed("hidden", false);
        d3.select("#valDiv").classed("hidden", true);
    };

    this.onNextButClick = function() {
        console.log("next button clicked");       
        d3.select("#weightDiv").classed("hidden", true);
        d3.select("#valDiv").classed("hidden", false);
    };

    this.onFinishBut = function(id) {
        console.log("finish button clicked");
        d3.select("#weightDiv").classed("hidden", true);
        d3.select("#valDiv").classed("hidden", true);
        d3.select("#final").classed("hidden", false);
    };

    this.createWeightsTable=function(appendToDiv, tableId){
        // craete a table
        var table=document.createElement('table');
        d3.select(table).classed("mdl-data-table mdl-js-data-table mdl-shadow--0dp", true);
        var percentage=50;
        d3.select(table).style("width",percentage+"%");
        d3.select(table).attr("id", tableId);
        // add table to div
        appendToDiv.appendChild(table);

        var row = table.insertRow(0);
        var head = table.createTHead();
        var tablerow=head.insertRow(0);

        // create the header names;
        var header_crit= tablerow.insertCell(0);
        var header_unit = tablerow.insertCell(1);        
        var header_weightNum= tablerow.insertCell(2);

        header_crit.innerHTML="Criteria";
        header_unit.innerHTML = "Unit"
        header_weightNum.innerHTML="Weight";

        d3.select(tablerow).classed("headerTable",true);

        var criteriaNodes=modelObject.criteria;

        for (var i=0; i<criteriaNodes.length;i++){
            // create a new table row;
            var iR=i+1;
            var st_row=table.insertRow(iR);

            var cell_name = st_row.insertCell(0);
            cell_name.innerHTML=criteriaNodes[i].name;
            var cell_unit = st_row.insertCell(1);
            cell_unit.innerHTML = criteriaNodes[i].unit;
            var cell_weight = st_row.insertCell(2);
            that.createLETableEntry(cell_weight,that.onLET_change,criteriaNodes[i].weight,criteriaNodes[i]);
        }
    };

    this.createValueTable = function(appendToDiv, tableId) {
        // craete a table
        var table=document.createElement('table');
        d3.select(table).classed("mdl-data-table mdl-js-data-table mdl-shadow--0dp", true);
        var percentage=50;
        d3.select(table).style("width",percentage+"%");
        d3.select(table).attr("id", tableId);
        // add table to div
        appendToDiv.appendChild(table);

        var row = table.insertRow(0);
        var head = table.createTHead();
        var tablerow=head.insertRow(0);

        // create the header names;
        var header_crit= tablerow.insertCell(0);
        var header_unit = tablerow.insertCell(1);        
        var header_value=tablerow.insertCell(2);


        header_crit.innerHTML="Criteria";
        header_unit.innerHTML = "Unit"
        header_value.innerHTML="Constraint (Please hold ctrl to select more then one option)";

        d3.select(tablerow).classed("headerTable",true);

        var criteriaNodes=modelObject.criteria;

        for (var i=0; i<criteriaNodes.length;i++){
            // create a new table row;
            var iR=i+1;
            var st_row=table.insertRow(iR);


            var cell_name = st_row.insertCell(0);
            cell_name.innerHTML=criteriaNodes[i].name;
            var cell_unit = st_row.insertCell(1);
            cell_unit.innerHTML = criteriaNodes[i].unit;

            var cell_value = st_row.insertCell(2);
            that.createLETableValue(cell_value,that.onLET_changeString,criteriaNodes[i].value,criteriaNodes[i]);
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
        // var h= drawArea.node().getBoundingClientRect().height;
        var h= window.innerHeight ;        
        console.log("HEEEEEEELLLLLOOOOOOOO ---------------------------");
        this.svgElement= parentWidget.getCanvasArea().append("div");
        that.svgElement.node().innerHTML=" ----- Import the Model Please --";
        // classing the graph is a particular graph thing so we dont do this here
        // per default hidden

        that.svgElement.classed("hidden",true);
        that.svgElement.attr("id", "divQues");
    };

    this.createLETableEntry=function(cell,onChange,value,paramObj){
        var le=document.createElement('input');
        cell.appendChild(le);
        var leNode=d3.select(le);
        leNode.classed("form-control",true);
        le.value=value;
        le.type = "number";
        leNode.on("change",function(){onChange(paramObj,cell);});
    };

    this.createLETableValue = function(cell,onChange,value,paramObj) {
        var le=document.createElement('select');
        cell.appendChild(le);
        var leNode=d3.select(le);
        leNode.classed("selectpicker form-control",true);
        le.multiple = true;

        var optsArray = ["much less", "less", "about equal", "more", "much more"];
        var optsVals = [-1, -1, 0, 1, 1];
        for (var i=0;i<optsArray.length;i++){
            var optA=document.createElement('option');
            optA.innerHTML=optsArray[i];
            optA.value = optsVals[i];
            le.appendChild(optA);
        }
        leNode.on("change",function(){onChange(paramObj,cell);});
    };


    this.onLET_change=function(paramObj,cell){
        console.log("something changed"+paramObj);
        console.log(paramObj);
        console.log(cell);
        var newValue=Number(cell.children[0].value);

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
        var res = $(cell.children[0]).val();
        paramObj.value = res;
        console.log("paramObj value: "+paramObj.value);
    };
}

qGraph.prototype.constructor = qGraph;
