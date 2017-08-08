var linkId= 0;

function ExampleLink(graph) {
    var that = this;
    BaseLink.apply(this,arguments);
    var typesArray = ["undefinedLink", "positiveLink", "negativeLink"];
    var labelTags=["Undefined", "+", "-"]; // used for init name of the elements in the hud;
    var linkTypeId=0;

    var superDrawFunction=this.drawElement;

    this.getAllClasses=function(){
        return typesArray;
    };

    this.getLabelTags=function(){
        return labelTags;
    };

    this.getTypeId=function() {
        return linkTypeId;
    };


    this.drawElement=function(){
        superDrawFunction();
        // overwriting the things
        that.pathElement .classed(typesArray[linkTypeId], true);
    }




}


ExampleLink.prototype = Object.create(BaseLink.prototype);
ExampleLink.prototype.constructor = ExampleLink;
