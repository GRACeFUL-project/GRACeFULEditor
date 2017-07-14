
function SimpleSFDWidget(){
    BaseWidget.apply(this,arguments);
    this.setClassName("SimpleSFDWidget");
    var that=this;

    var libraryLoaded=false;

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

    this.setupControls=function(){
        this.controlsObject=new SimpleSFDControls(that);
    };


    this.loadLibrary=function(jsonData){
        // loading library;

        // read the text as json
        console.log("Parsing Json obj"+jsonData);
        var jsonObj=JSON.parse(jsonData);

        var success=that.graphObject.paseLibrary(jsonObj);
        if (success) {
            that.graphObject.libraryLoaded(true);
            // redraw the hud;
            that.graphObject.redrawHUD();
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
        console.log("Parsing Json obj"+jsonObj);
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


    this.requestModelDataForSolver=function(){
        return that.graphObject.requestModelDataAsJson();
    };

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    this.parseResult=function(result){
        console.log("handling result:"+result);
        var textToParse=result;
        if (result===""){

            console.log("server did not respondend");
            console.log("mockup test");
            textToParse='{"result":[{"rainfall4" : 14.0}, {"inflow5" : 15.0}, {"outflow5" : 16.0},{"inflow6" : 17.0}]}';
            // testing invalid text
            textToParse='{"result":"[{\"rainfall4\" : 10.0,\n\"inflow5\" : 10.0,\n\"outflow5\" : 10.0,\n\"inflow6\" : 10.0}\n]"}';
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
            invalidText=invalidText.replaceAll('\\n','');
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