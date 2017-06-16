
function GTGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    // call the baseGraph init function
    that.initializeGraph();


    this.initializeGraph=function(){

        // modify to you needs
        this.specialLayer= this.svgElement.append("g");
        // setting the extent default(0.1,3)
        //that.setZoomExtent(0.5,2);


        // det a double click event if needed
        //that.setDoubleClickEvent(that.dblClick);
    };

    this.dblClick=function(){
        console.log("Hello From Example graph");
    };

    this.createNode=function(parent){
        return new GTNode(parent);
    };

}

GTGraph.prototype = Object.create(BaseGraph.prototype);
GTGraph.prototype.constructor = GTGraph;
