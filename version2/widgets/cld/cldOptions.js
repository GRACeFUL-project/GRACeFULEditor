function CLDControls(parentWidget) {
    // todo: think about a parent widget
    /** variable defs **/

    var that = this;
    // this.parentWidget=parentWidget; // tells the graph which widget it talks to
    this.parent=parentWidget;

    this.cArea=undefined;
    this.divDrawThing=undefined;
    this.divDrawThingNode=undefined;
    this.parentWidget=function(){
        return this.parent;
    };
    this.initControls=function(){
        this.cArea=that.parent.getOptionsArea();
        this.divDrawThing=document.createElement('div');
        this.divDrawThing.id=that.parent.getUniqueId()+"Opt";
        that.cArea.node().appendChild(that.divDrawThing);

        var idStr=that.parent.getUniqueId()+"Opt";
        this.divDrawThingNode=d3.select("#"+idStr);


        that.divDrawThingNode.classed("hidden",true);
        // crate the place holder <div>
        // generate own controls
        that.generateControls();
    };

    this.sayHello=function(){

        var test=document.createElement("a");
        test.innerHTML="Control Options for CLD";
        that.divDrawThing.appendChild(test);


    };

    this.activateControls=function(val){

        if (that.divDrawThing===undefined){
            console.log("nothing to do");
        }

        that.divDrawThingNode.classed("hidden",!val);

    };

    this.generateControls=function(){
        // add particular control elements

        // eg
        // that.addButton(divDrawThing,"text",style,onClick,updateLevel)




    };

    this.start=function(){
        console.log("Calling Start of options -----------------------------------------------------------------------")
        that.initControls();
        that.sayHello();
    };

    that.start()

}
CLDControls.prototype.constructor = CLDControls;
