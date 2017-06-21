
function ExampleWidget(){
    BaseWidget.apply(this,arguments);
    this.setClassName("ExampleWidget");
    var that=this;

    this.setupMyGraphAndControls=function(){
        // required overwritten function
        // since each widget generates its own graph,options, etc
        that.setupGraph();

        // next step
        that.setupControls();
    };


    this.setupGraph=function(){
      this.graphObject=new ExampleGraph(that);
      that.graphObject.initializeGraph();
    };

    this.setupControls=function(){
        this.controlsObject=new ExampleControls(that);
    };


}


ExampleWidget.prototype = Object.create(BaseWidget.prototype);
ExampleWidget.prototype.constructor = ExampleWidget;