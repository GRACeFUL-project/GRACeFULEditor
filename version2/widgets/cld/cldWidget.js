
function CLDWidget(){
    BaseWidget.apply(this,arguments);
    this.setClassName("CLDWidget");
    var that=this;

    this.setupMyGraphAndControls=function(){
        // required overwritten function
        // since each widget generates its own graph,options, etc
        that.setupGraph();

        // next step
        that.setupControls();
    };


    this.setupGraph=function(){
      this.graphObject=new CLDGraph(that);
      that.graphObject.initializeGraph();
    };

    this.setupControls=function(){
        this.controlsObject=new CLDControls(that);
    };

}


CLDWidget.prototype = Object.create(BaseWidget.prototype);
CLDWidget.prototype.constructor = CLDWidget;