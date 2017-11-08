function actionControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    // tells the graph which widget it talks to
    this.parent=parentWidget;

    this.loadGlobalLibraries=function(){
        // not used atm
        console.log("request the handler load libs");
        gHandlerObj.requestGlobalLibraryLoading();
    };

    this.generateControls=function(){
        additionalSettings = that.createAccordionGroup(that.divControlsGroupNode, "Model Controls");
        that.addButton(additionalSettings, "LOAD", "actLOAD", that.assessActions, "flat", true, "cloud_upload" );
    };

    this.assessActions = function() {
        console.log("Load the action assessment table");
        that.parent.widgetLoadAssessment();
    };

    that.start();
}
actionControls.prototype = Object.create(BaseControls.prototype);
actionControls.prototype.constructor = actionControls;
