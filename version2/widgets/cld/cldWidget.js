
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

    this.identifyExtFact = function() {
        this.graphObject.identifyExternalFactors();
    };

    this.identifyLoops = function() {
        this.graphObject.identifyFeedbackLoops();
    };

    this.loadJSON=function(jsonData){
        // LOAD JSON ACTION
        that.graphObject.emptyGraphStructure(); //<< clears current graph structure
        // we only need this data temporary;
        var jsonObject=JSON.parse(jsonData);
        that.parseJSON(jsonObject);
        that.graphObject.forceRedrawContent(); //<< redraws the new graph structure
    };

    this.parseJSON=function(jsonObj){
        console.log("Parsing Json obj"+jsonObj);
        // you need to know the json structure that you are loading
        // for each widget we will have to modify this functions;
        var jsonTyp=jsonObj.type;
        var nodes=jsonObj.nodes;
        var links=jsonObj.links;
        console.log("we have type:"+jsonTyp);

        // usually  they are some how separated like in webvowl
        // so we can here combine the classes and attributes or what ever
        // and then give this to the graph object;
        // for now only nodes are given;
        var i;
        for (i=0;i<nodes.length;i++){
            var jsonNode=nodes[i];
            that.graphObject.addNodeFromJSON(jsonNode);
        }
        // add the links
        for (i=0;i<links.length;i++){
            var jsonLink=links[i];
            that.graphObject.addLinkFromJSON(jsonLink);
        }

    }
}


CLDWidget.prototype = Object.create(BaseWidget.prototype);
CLDWidget.prototype.constructor = CLDWidget;