
function CLDWidget(){
    BaseWidget.apply(this,arguments);
    this.setClassName("CLDWidget");
    var that=this;
    this.gtInstance = undefined;
    this.NodeType = undefined;

    this.setupMyGraphAndControls=function(){
        // required overwritten function
        // since each widget generates its own graph,options, etc
        that.setupGraph();

        // next step
        that.setupControls();
    };

    this.setNodeType=function(typeId)
    {
      that.graphObject.changeNodeType(typeId);
    }

    this.setupGraph=function(){
      this.graphObject=new CLDGraph(that);
      that.graphObject.initializeGraph();
    };

    this.setupControls=function(){
        this.controlsObject=new CLDControls(that);
    };

    this.connectGt = function(gt) {
        this.gtInstance = gt;
      //  console.log("Is Goal Tree?"+this.gtInstance.className);
    };

    this.clearGraph=function () {
      that.graphObject.emptyGraphStructure();
      that.graphObject.forceRedrawContent();
    };

    this.getCriteria = function() {
        var gtGraph = this.gtInstance.graphObject;
        console.log("number of nodes are: "+ gtGraph.nodeElementArray.length);
        var gtNodes = gtGraph.nodeElementArray;
        var gtCriteria = [];
        for(var i=0; i<gtNodes.length; i++) {
            if(gtNodes[i].goalType === "Criteria") {
                var temp = {};
                // temp.id = gtNodes[i].id();
                temp.name = gtNodes[i].label;
                temp.nodeType = "Criteria"; //hard coded value
                temp.nodeTypeId = 3; //hard coded value
                temp.pos = [gtNodes[i].y, gtNodes[i].x];
                gtCriteria.push(temp);
            }
        }
        console.log("Number of criteria nodes are: "+gtCriteria.length);
        console.log("The criteria nodes are: "+JSON.stringify(gtCriteria));
        if(gtCriteria.length === 0) {
            console.log("No criteria nodes in Goal Tree");
        }
        else {
            that.graphObject.clearCriteria();
            for(var i=0; i<gtCriteria.length; i++) {
                var criteriaNode = gtCriteria[i];
                that.graphObject.addCriteriaFromGT(criteriaNode);
            }
            that.graphObject.forceRedrawContent();
        }
    };

    this.identifyExtFact = function() {
        this.graphObject.identifyExternalFactors();
    };

    this.identifyLoops = function() {
        this.graphObject.identifyFeedbackLoops();
    };

    this.merger = function() {
        this.graphObject.mergeTheNodes();
    }

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

    };

    this.requestModelDataForSolver = function() {
        return that.graphObject.requestModelDataAsJson();
    };

    this.loadLibrary = function(jsonData) {
        console.log("Library Obtained for CLD");
        //TODO: populate the respective attributes for nodes and links
    };

    this.parseResult = function(result) {
        //TODO        
        var parsedResult = JSON.parse(result);
        console.log("CLDWidget result: "+JSON.stringify(parsedResult, null, ""));
        that.graphObject.deliverResultsForNodes(parsedResult);
    };

    this.createLoopModal = function(id, header, content) {
        that.controlsObject.createModal(id, header, content);
    };
}


CLDWidget.prototype = Object.create(BaseWidget.prototype);
CLDWidget.prototype.constructor = CLDWidget;
