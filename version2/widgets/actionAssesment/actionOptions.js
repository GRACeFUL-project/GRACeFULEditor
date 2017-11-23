function actionControls(parentWidget) {
    BaseControls.apply(this,arguments);
    var that = this;
    // tells the graph which widget it talks to
    this.parent=parentWidget;
    this.actionLibrary = undefined;
    this.criteriaLibrary = undefined;
    this.actionsList = [];
    this.criteriaList = [];


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
        that.serverRequest();        
    };

    this.serverRequest=function(){
        console.log("requesting actions and criteria data from server");
        // var action={};
        // action.task="SERVER_REQUEST";
        // action.requestType="GET_LIBRARY"; 
        // action.libraryName="actions";
        // that.parent.requestAction(action);
        
        //actions library
        d3.xhr("http://vocol.iais.fraunhofer.de/graceful-rat/library/actions", "application/json",function (error, request) {
            if(request) {
                console.log("action library");
                that.actionLibrary = request.responseText;
                console.log(that.actionLibrary);
                that.parseActions();
                that.parent.widgetLoadAssessment(that.actionsList, that.criteriaList);
            }
            else {
                console.log("error");
            }
        });
        //criteria library
        d3.xhr("http://vocol.iais.fraunhofer.de/graceful-rat/library/criteria", "application/json",function (error, request) {
            if(request) {
                console.log("criteria library");
                that.criteriaLibrary = request.responseText;
                console.log(that.criteriaLibrary);
                that.parseCriteria();
                that.parent.widgetLoadAssessment(that.actionsList, that.criteriaList);
            }
            else {
                console.log("error");
            }
        });        
    };

    this.parseActions = function() {
        console.log("preparing actions");
        var aElem = JSON.parse(that.actionLibrary);
        aElem = aElem.library;
        
        for(var i=0; i<aElem.length; i++) {
            var actionName = aElem[i].description;
            var actionCrit = aElem[i].crit.split(",").map(Number);
            var c = {actionName, actionCrit};
            that.actionsList.push(c);
        }
        console.log(JSON.stringify(that.actionsList));
    };

    this.parseCriteria = function() {
        console.log("preparing criteria");
        var cElem = JSON.parse(that.criteriaLibrary);
        cElem = cElem.library;

        for(var i=0; i<cElem.length; i++) {
            var c = Number(cElem[i].nr);
            that.criteriaList[c-1] = cElem[i].description;
        }
        console.log(that.criteriaList);
    };

    that.start();
}
actionControls.prototype = Object.create(BaseControls.prototype);
actionControls.prototype.constructor = actionControls;
