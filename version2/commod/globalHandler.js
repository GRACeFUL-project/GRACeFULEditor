// the global handler which contains all the objects which are then filtered by the elements;

// the global handler is a single object which maintains all the data;

!function(){
    // allow to create new Nodes
    var gHandler={};
    var instanceId=0;

    var globalNodeArray=[];


    function new_object() {
        // some variables
        var that = this;
        this.erroLog = "Error Message";
        console.log("Say Hello to the death handler ");


        // add handler elemetmens here;
        this.sayHelloHandler=function(){
            console.log("Hallo Handler");
        } ;


        this.createGlobalNode=function(widgetOrGraphObject){

          // try to create that thing
            var gNode=new GlobalNode();
            gNode.setVisibleInWidget(widgetOrGraphObject,true);
            console.log("aGlobal Node");
            console.log(gNode);
            console.log("-------------------------------");
            return gNode;
        };


        this.addGlobalNode=function(gNode){
            globalNodeArray.push(gNode)
        };

        this.removeGlobalNode=function(gNode){
            // splice that thing;
            console.log("want to remove a global node");
            globalNodeArray.splice(globalNodeArray.indexOf(gNode), 1);

        };


        this.collectNodesForWidget=function(widget){
            var nodesArray=[];
            console.log("The Widget Name is "+widget.graphName);
            for (var i=0;i<globalNodeArray.length;i++){
                console.log("getting filtered INformation"+i);
                var aNode=globalNodeArray[i].filterInformation(widget);
                if (aNode){
                    console.log("adding a node to the widget");
                    nodesArray.push(aNode)
                }
            }

            return nodesArray;



        };
    }








    gHandler.create=function(){
        instanceId++;
        return new new_object();

    };


    this.handler=gHandler;
}();
