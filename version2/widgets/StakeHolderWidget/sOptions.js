function QWControls(parentWidget) {
    // todo: think about a parent widget
    /** variable defs **/

    BaseControls.apply(this,arguments);
    var that = this;
    // tells the graph which widget it talks to
    this.parent=parentWidget;

    var additionalSettings;

    this.loadGlobalLibraries=function(){
        // not used atm
        console.log("request the handler load libs");
        gHandlerObj.requestGlobalLibraryLoading();
    };

    this.generateControls=function(){
        additionalSettings = that.createAccordionGroup(that.divControlsGroupNode, "Model Controls");
        that.addButton(additionalSettings, "LOAD  SURVEY", "gtLOAD", that.loadGlobalFunction, "flat", true, "get_app" );
        that.addButton(additionalSettings, "SAVE", "gtSAVE", that.createModel, "flat", true, "save" );
    };

    this.loadGlobalFunction=function(){
        //  console.log("loading global model function ");
        var hidden_solutionInput=document.createElement('input');
        hidden_solutionInput.id="HIDDEN_SOLUTION_JSON_INPUT";
        hidden_solutionInput.type="file";
        hidden_solutionInput.accept = ".json";
        //hidden_solutionInput.style.display="none";
        hidden_solutionInput.autocomplete="off";
        hidden_solutionInput.placeholder="load a json File";
        hidden_solutionInput.setAttribute("class", "inputPath");
        // hidden_solutionInput.style.display="none";
        additionalSettings.getBody().node().appendChild(hidden_solutionInput);
        var loaderSolutionPathNode=d3.select("#HIDDEN_SOLUTION_JSON_INPUT");
        var fileElement;
        var fileName;
        var readText;
        // simulate click event;
        // console.log("hidden thing is clicked");
        hidden_solutionInput.click();
        loaderSolutionPathNode.remove(loaderSolutionPathNode);
        // tell what to do when clicked

        // chrome fix -.-
        loaderSolutionPathNode.on("change",function (){
            // console.log("hidden thing is clicked");
            var files= loaderSolutionPathNode.property("files");
            if (files.length>0){
                // console.log("file?"+files[0].name);
                fileElement=files[0];
                fileName=fileElement.name;
                loaderSolutionPathNode.remove();

                // read this file;
                var reader = new FileReader();
                reader.readAsText(fileElement);
                reader.onload = function () {
                    readText = reader.result;
                    // the the communication module about this
                    that.parent.loadStakeholderModel(readText);
                };
            }
        });

        // loaderSolutionPathNode.on("input",function(){
        //     // console.log("hidden thing is clicked");
        //     var files= loaderSolutionPathNode.property("files");
        //     if (files.length>0){
        //         // console.log("file?"+files[0].name);
        //         fileElement=files[0];
        //         fileName=fileElement.name;
        //         loaderSolutionPathNode.remove();

        //         // read this file;
        //         var reader = new FileReader();
        //         reader.readAsText(fileElement);
        //         reader.onload = function () {
        //             readText = reader.result;
        //             // the the communication module about this
        //             that.parent.loadStakeholderModel(readText);
        //         };
        //     }
        // });
    };

    this.createModel=function(){
         console.log("loading global model function ");
         // request the model form the graph
        var modelObject=that.parent.graphObject.getModelObject();
        console.log("that model object");
        console.log(modelObject);

        var str_toSave=JSON.stringify(modelObject);

        console.log("text to write: "+str_toSave);

        // create a hidden wrapper for saving files;

        var tempHref=document.createElement('a');
        tempHref.type="submit";
        tempHref.href="#";
        tempHref.download="";
        tempHref.innerHTML="Send Model";
        tempHref.id="temporalHrefId";

        that.divControlsGroupNode.node().appendChild(tempHref);
        tempHref.href="data:text/json;charset=utf-8," + encodeURIComponent(str_toSave);
        var fileName="result.json";
        if (modelObject && modelObject.stakeholderName)
            fileName=modelObject.stakeholderName+"-result.json";
        tempHref.download=fileName;
        tempHref.click();
        tempHref.hidden = true;
        // remove that thing
        d3.select("#TemporalDiv").remove();
        //

    };


    that.start()
}
QWControls.prototype = Object.create(BaseControls.prototype);
QWControls.prototype.constructor = QWControls;
