
function GTWidget(){
    BaseWidget.apply(this,arguments);

    this.setClassName("GoalTreeWidget");

    var that=this;




    this.setupMyGraphAndControls=function(){
        // required overwritten function
        // since each widget generates its own graph,options, etc
        that.setupGraph();

        // next step
        that.setupControls();
    };


    this.setupGraph=function(){
      console.log("Setting up my own graph");
      this.graphObject=new GTGraph(that);
      that.graphObject.initializeGraph();
    };

    this.setupControls=function(){
        console.log("test oA");
        console.log("oA:"+that.getOptionsArea());

        this.controlsObject=new GTControls(that);
    };


    this.sayHello=function(){
        console.log("muahaha overwritten base class say hello function!"+this.tempVar);
        console.log("Unique Identifyer "+this.getUniqueId());

    }
}


GTWidget.prototype = Object.create(BaseWidget.prototype);
GTWidget.prototype.constructor = GTWidget;