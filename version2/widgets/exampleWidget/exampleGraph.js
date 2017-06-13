
function ExampleGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    // call the baseGraph init function
    that.initializeGraph();


    this.initializeGraph=function(){

        // modify to you needs
        this.specialLayer= this.svgElement.append("g");
        console.log("a graph has"+this.nodeLayer);
        console.log("a graph has"+this.pathLayer);
        console.log("a graph has"+this.specialLayer);

        // setting the extent default(0.1,3)
        that.setZoomExtent(0.5,2);
        // det a double click event if needed
        //that.setDoubleClickEvent(that.dblClick);
    };

    this.dblClick=function(){
        console.log("Hello From Example graph");
    }

}

ExampleGraph.prototype = Object.create(BaseGraph.prototype);
ExampleGraph.prototype.constructor = ExampleGraph;
