function ExampleNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
    BaseNode.apply(this, arguments);
    var exampleTypeId = 0;
    var numTypes = 3;
    var typesArray = ["baseRoundNode", "exampleNodeA", "exampleNodeB"];
    var labelTags=["Undefined", "Example A", "Example B"]; // used for init name of the elements in the hud;
    var superDrawFunction = that.drawNode;
    var superClickFunction= that.onClicked;


    this.getLabelTags=function(){
        return labelTags;
    };


    this.setAllTypes = function (types) {
        // types are array of css styles o
        numTypes = types.length;
        typesArray = types;
    };

    this.getTypeId = function () {
        return exampleTypeId;
    };


    this.setTypeId = function (val) {
        if (val < numTypes)
            exampleTypeId = val;
        else
            exampleTypeId = 0; // << fixing if wong numTypes;
    };

    this.setType=function(typeId) {

        that.setTypeId(typeId);
        that.nodeClass=typesArray[that.getTypeId()];
        if (that.nodeElement) {
            for (var i = 0; i < typesArray.length; i++) {
                console.log("disabling :" + typesArray[i]);
                that.nodeElement.classed(typesArray[i], false);
            }
            that.nodeElement.classed(that.nodeClass, true);
        }
    };

    this.drawNode=function(){
        superDrawFunction(); // calls the base draw function and sets then the proper class to it based on type
        that.nodeElement.classed(that.nodeClass, true);

    };

    // owverwrite the onClick function
    this.onClicked=function(){
        superClickFunction();
        if (that.getNodeObjectType()===that.OVERLAY_OBJECT_NODE) {
            if (that.nodeIsFocused === true) {
                graph.focusThisOverlayNode(that);
            }
            else {
                graph.focusThisOverlayNode(undefined);
            }
        }
        if (that.getNodeObjectType()===that.GRAPH_OBJECT_NODE){
            // nothing to do // the super function should have done thisl
        }
    };
    // disable double click function
    this.executeUserDblClick=function(){

    };





}

ExampleNode.prototype = Object.create(BaseNode.prototype);
ExampleNode.prototype.constructor = ExampleNode;
