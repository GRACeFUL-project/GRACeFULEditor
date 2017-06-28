
function ExampleGraph(){
    BaseGraph.apply(this,arguments);
    var that=this;
    // call the baseGraph init function
    that.initializeGraph();


    this.initializeGraph=function(){

        // modify to you needs
        this.specialLayer= this.svgElement.append("g");
        // console.log("a graph has"+this.nodeLayer);
        // console.log("a graph has"+this.pathLayer);
        // console.log("a graph has"+this.specialLayer);

        // setting the extent default(0.1,3)
        that.setZoomExtent(0.5,2);
        // det a double click event if needed
        //that.setDoubleClickEvent(that.dblClick);
    };

    this.createLink=function(parent){
        return new ExampleLink(parent);
    };

    this.createNode=function(parent){
        return new ExampleNode(parent);
    };


    this.dblClick=function(){
        console.log("Hello From Example graph");
    };
    this.requestSaveDataAsJson=function(){
        // THIS SHOULD BE OVERWRITTEN BY ALL GRAPHS!
        var retObj={};
        retObj.type=that.className;
        retObj.graphSchema=that.graphSchema;
        retObj.nodes=[];

        for (var i=0;i<that.nodeElementArray.length;i++){
            var node=that.nodeElementArray[i];
            var obj={};
            obj.id=node.id();
            obj.name=node.label;
            obj.nodeIdType="test";
            obj.pos=[node.x,node.y];
            retObj.nodes.push(obj);
        }


        return  JSON.stringify(retObj, null, '  ');

    };
}

ExampleGraph.prototype = Object.create(BaseGraph.prototype);
ExampleGraph.prototype.constructor = ExampleGraph;
