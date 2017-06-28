function ExampleNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
    BaseNode.apply(this,arguments);
    var exampleTypeId=0;
    var numTypes=1;
    var typesArray=[];

    this.setAllTypes=function(types){
        // types are array of css styles o
        numTypes=types.length;
        typesArray=types;
    };

    this.getTypeId=function(){
        return exampleTypeId;
    };

    this.setTypeId=function(val){
        if (val<numTypes)
            exampleTypeId=val;
        else
            exampleTypeId=0; // << fixing if wong numTypes;
    };

}
ExampleNode.prototype = Object.create(BaseNode.prototype);
ExampleNode.prototype.constructor = ExampleNode;
