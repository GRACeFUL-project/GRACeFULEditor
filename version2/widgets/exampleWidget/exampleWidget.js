
function ExampleWidget(){
    BaseWidget.apply(this,arguments);

    this.setClassName("ExampleWidget"); // << needs to be unique for all widgets

    var that=this;
    var magic=23;



    this.setupMyGraphAndControls=function(){
        // required overwritten function
        // since each widget generates its own graph,options, etc
        that.setupGraph();
    };


    this.setupGraph=function(){
      console.log("Setting up my own graph");
      this.graphObject=new ExampleGraph(that);
      that.graphObject.initializeGraph();

    };


    this.sayHello=function(){
        console.log("muahaha overwritten base class say hello function!"+this.tempVar);
        console.log("Unique Identifyer "+this.getUniqueId());

    }
}


ExampleWidget.prototype = Object.create(BaseWidget.prototype);
ExampleWidget.prototype.constructor = ExampleWidget;