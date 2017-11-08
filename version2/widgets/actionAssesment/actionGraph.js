

function actionGraph(parentWidget) {
    /** variable defs **/
    var that = this;
    var transformAnimation=false;
    this.parentWidget=parentWidget; // tells the graph which widget it talks to

    //both standardActions and standardCriteria should come from the library
    this.standardActions = undefined;
    // ["bioswaleStreetAction", "bioswaleParkingAction", "bioswaleGreenSpaceAction", "makeParkingFloodableAction", "floodableParkingOnGreenSpaceAction", "publicGreenRoofAction", "privateGreenRoofAction"];
    this.standardCriteria = undefined;
    // ["costcriterion", "flooddamagecriterion", "floodnuisancecriterion", "greenbluecriterion", "centralparkingcriterion", "parkingcriterion", "roadaccesscriterion", "trafficcriterion"];
    
    this.optsArray = ["much better", "better", "none/unknown", "worse", "much worse"];

    this.updateSvgSize=function(){
        var drawArea=this.parentWidget.getCanvasArea();
        var w = drawArea.node().getBoundingClientRect().width;
        var h= window.innerHeight ;
        if (that.svgElement)
            that.svgElement.attr("width", w).attr("height", h);
    };

    this.activateGraph=function(val){
        if (val===true){
            that.svgElement.classed("hidden",false);
        }
        else {
            that.svgElement.classed("hidden", true);
        }
    };

    // needs to be called by the derived graph itself!
    this.initializeGraph=function(){
        // generatges the svg element and adds this to the drawArea;
        var drawArea=parentWidget.getCanvasArea();
        // todo: figure out why hight is not properly detected
        var w = drawArea.node().getBoundingClientRect().width;
        //var h= drawArea.node().getBoundingClientRect().height;
        var h= window.innerHeight ;
        this.svgElement= parentWidget.getCanvasArea().append("div");
        that.svgElement.node().innerHTML=" ----- Load the table for Action Assessment --";
        that.svgElement.classed("hidden",true);
        that.svgElement.attr("id", "divActionsAssess");
        d3.select("#divActionsAssess").style("overflow", "auto");
    };

    this.tableActions=function(actions, criterias){
        that.standardActions = actions;
        that.standardCriteria = criterias;
        console.log("obtained data");
        console.log(that.standardActions);
        console.log(that.standardCriteria);

        that.svgElement.node().innerHTML="";

        // create a fancy table;
        var table=document.createElement('table');
        // add table to div
        d3.select(table).classed("mdl-data-table mdl-js-data-table mdl-shadow--0dp", true);
        var percentage=100;
        d3.select(table).style("width",percentage+"%");
        d3.select(table).style("table-layout", "overflow");
        that.svgElement.node().appendChild(table);

        var row = table.insertRow(0);
        var head = table.createTHead();
        var tablerow=head.insertRow(0);

        // create the header names;
        var header_blank= tablerow.insertCell(0);
        header_blank.innerHTML="Acts On";
        d3.select(header_blank).style("font-weight", "900");
        d3.select(header_blank).style("background-color", "#959595");

        for(var i=0; i<that.standardCriteria.length; i++) {
            var iC = i+1;
            var sc_cell = tablerow.insertCell(iC);
            sc_cell.innerHTML = that.standardCriteria[i];
            d3.select(sc_cell).style("font-weight", "bold");
            d3.select(sc_cell).style("background-color", "#E7E6E6");
        }        

        for(var j=0; j<that.standardActions.length; j++) {
            var iR = j+1;
            var sa_row = table.insertRow(iR);            
            var cell_name = sa_row.insertCell(0);
            cell_name.innerHTML = that.standardActions[j].actionName;
            d3.select(cell_name).style("font-weight", "bold");
            d3.select(cell_name).style("background-color", "#E7E6E6");

            for(var k=0; k<that.standardCriteria.length; k++) {
                var iC = k+1;
                var entries = sa_row.insertCell(iC);
                var definedValue = that.standardActions[j].actionCrit;
                that.addEntries(entries, that.onEntryChange, definedValue[k]);
            }
        }
    };

    this.addEntries = function(cell,onChange, defValue) {
        var le=document.createElement('select');
        cell.appendChild(le);
        var leNode=d3.select(le);
        leNode.classed("selectpicker form-control",true);

        for (var i=0;i<that.optsArray.length;i++){
            var optA=document.createElement('option');
            optA.innerHTML=that.optsArray[i];
            le.appendChild(optA);
        }
        var temp = that.optsSelection(defValue);
        leNode.node().value = temp;

        leNode.on("change",function(){
            onChange(cell);
        });
        leNode.style("width", "120px");
    };    

    this.onEntryChange = function(cell){
        console.log("Entry changed");
    };

    this.optsSelection = function(val) {
        if(val === 2) 
            return that.optsArray[0];
        else if(val === 1)
            return that.optsArray[1];
        else if(val === -1)
            return that.optsArray[3];
        else if(val === -2)
            return that.optsArray[4];
        else
            return that.optsArray[2];
    }
}

actionGraph.prototype.constructor = actionGraph;
