function BaseControls(parentWidget) {
    // todo: think about a parent widget
    /** variable defs **/

    var that = this;
    // this.parentWidget=parentWidget; // tells the graph which widget it talks to
    this.parent=parentWidget;

    this.cArea=undefined;
    this.parentWidget=function(){
        return this.parent;
    };
    this.initControls=function(){
        this.cArea=that.parent.getOptionsArea();
        // crate the place holder <div>

        // generate own controls
        that.generateControls();
    };

    this.sayHello=function(){
        var test=document.createElement("a");
        test.innerHTML="Hello world from baseContors";
        that.cArea.node().appendChild(test);


    };

    this.generateControls=function(){
        // add particular control elements

        // eg
        // that.addButton("text",style,onClick,updateLevel)


    };

    this.start=function(){
        console.log("Calling Start of options -----------------------------------------------------------------------")
        that.initControls();
        that.sayHello();
    };

    that.start()

}
BaseControls.prototype.constructor = BaseControls;
