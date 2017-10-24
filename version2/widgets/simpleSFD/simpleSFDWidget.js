
function SimpleSFDWidget(){
    BaseWidget.apply(this,arguments);
    this.setClassName("SimpleSFDWidget");
    var that=this;

    var libraryLoaded=true;


    this.cldGraphObj=undefined;
    this.gtwGraphObj=undefined;


    this.setPtrToGTWGraphObject=function(gtwGraphObj){
        this.gtwGraphObj=gtwGraphObj;
    };
    this.setPtrToCLDGraphObject=function(cldGraphObj){
        this.cldGraphObj=cldGraphObj;
    };


    this.setupMyGraphAndControls=function(){
        // required overwritten function
        // since each widget generates its own graph,options, etc
        that.setupGraph();

        // next step
        that.setupControls();
    };


    this.setupGraph=function(){
      this.graphObject=new SimpleSFDGraph(that);
      that.graphObject.initializeGraph();
    };

    this.setupNode=function(id){
      that.graphObject.setSelectedOverlayId(id);
    //  this.graphObject.changeNodeType();
    };

    this.setupControls=function(){
        this.controlsObject=new SimpleSFDControls(that);
    };


    this.loadJSON_Library=function(jsonData){
        var jsonObj=JSON.parse(jsonData);
        // get library name and set it;
        var libName=jsonObj.name;
        this.setTabTitle("GRACeFUL Concept Map: "+libName);
        // clear the graph in the  widgets menu;

        var success=that.graphObject.paseLoadedLibrary(jsonObj);
        if (success) {
            that.clearGraph();
            reloadWidgetItems(jsonObj);// this should be able to call since global function
        }




    };

    this.loadLibrary=function(jsonData){
        // loading library;

        // read the text as json
      console.log("Parsing Json obj"+jsonData);
        var jsonObj=JSON.parse(jsonData);

        var success=that.graphObject.paseLoadedLibrary(jsonObj);
        if (success) {
            that.clearGraph();
            reloadWidgetItems(jsonObj);
            that.graphObject.libraryLoaded(true);
            // redraw the hud;
            // TODO: clean it up
            //that.graphObject.redrawHUD();
        }


    };

    this.loadJSON=function(jsonData){
        // LOAD JSON ACTION
        that.graphObject.emptyGraphStructure(); //<< clears current graph structure
        // we only need this data temporary;
        var jsonObject=JSON.parse(jsonData);
        that.parseJSON(jsonObject);
        that.graphObject.forceRedrawContent(); //<< redraws the new graph structure
    };

    this.parseJSON=function(jsonObj){
      //  console.log("Parsing Json obj"+jsonObj);
        // you need to know the json structure that you are loading
        // for each widget we will have to modify this functions;
        var jsonTyp=jsonObj.type;
        var nodes=jsonObj.nodes;
        var links=jsonObj.links;
        console.log("we have type:"+jsonTyp);

        // usually  they are some how separated like in webvowl
        // so we can here combine the classes and attributes or what ever
        // and then give this to the graph object;
        // for now only nodes are given;
        var i;
        for (i=0;i<nodes.length;i++){
            var jsonNode=nodes[i];
            that.graphObject.addNodeFromJSON(jsonNode);
        }
        // add the links
        for (i=0;i<links.length;i++){
            var jsonLink=links[i];
            that.graphObject.addLinkFromJSON(jsonLink);
        }
    };

    this.clearGraph=function () {
      that.graphObject.emptyGraphStructure();
      that.graphObject.forceRedrawContent();
    };

    this.requestModelDataForSolver=function(){
        return that.graphObject.requestModelDataAsJson();
    };

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };

    this.parseResult=function(result){
        console.log("handling result:"+result);
        var textToParse=result;
        if (result==="localTest"){

            // console.log("server did not respondend");
            console.log("mockup test");
            // textToParse='{"result":[{"rainfall4" : 14.0}, {"inflow5" : 15.0}, {"outflow5" : 16.0},{"inflow6" : 17.0}]}';
            // testing invalid text
            textToParse='{"result":"[{\\"rainfall4\\" : 10.0,\\n\\"inflow5\\" : 10.0,\\n\\"outflow5\\" : 10.0,\\n\\"inflow6\\" : 10.0}\\n]"}';
        }
        //



        console.log("invalid Response: "+textToParse);
        // check if invalidServer result
        var invalid=false;
        if (textToParse.indexOf(':"[')!==-1){
            invalid=true;
        }

        if (invalid){
            console.log("thing is invalid");
            var invalidText=textToParse;
            invalidText=invalidText.replaceAll("\\n",'');
            invalidText=invalidText.replaceAll('\\"','"');
            invalidText=invalidText.replace('"[','[');
            invalidText=invalidText.replace(']"',']');
            invalidText=invalidText.replaceAll(',','},{');
            textToParse=invalidText;

        }

        console.log("trying to parse the server result:"+textToParse);
        var jsonObj=JSON.parse(textToParse);
        console.log(jsonObj);
        if (jsonObj){
            that.graphObject.implementResultIntoGraphData(jsonObj);


        }
    }



}


SimpleSFDWidget.prototype = Object.create(BaseWidget.prototype);
SimpleSFDWidget.prototype.constructor = SimpleSFDWidget;
