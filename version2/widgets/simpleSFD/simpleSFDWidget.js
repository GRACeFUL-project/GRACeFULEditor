
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

    this.loadLibrary=function(jsonData, invalidLibFormat){
        // loading library;
        console.log("HALLOOOOO000000000000000000000000000000000000000000000000000")
        // read the text as json
     // console.log("Parsing Json obj"+jsonData);
        var jsonObj=JSON.parse(jsonData);


/** how it should look like
 *
 *  retLib+='{';
                retLib+='"name": "rain",';
                retLib+='"parameters": [';
                retLib+='                { "name": "amount", "type" : "Float"}';
                retLib+='],';
                retLib+='"interface" :[';
                retLib+='                {';
                retLib+='                    "name" : "rainfall",';
                retLib+='                    "type" : "Port (Float)",';
                retLib+='                    "description": "Amount Of Rain",';
                retLib+='                    "imgURL": "./data/interfaces/rainfall.png",';
                retLib+='                    "rotation" : false,';
                retLib+='                    "outgoingType" :"MULTIPLE",';
                retLib+='                    "incomingType" :"NONE"';
                retLib+='                }';
                retLib+='],';
                retLib+='"imgURL"      : "./data/svg/rain.svg",';
                retLib+='"description" : "This is Rain",';
                retLib+='"type"        : "NODAL"';
                retLib+='},';
 retLib+='';
 *
 * [{"relational":false,"icon":"./data/img/rain.png","name":"rain","parameters":[{"hoverText":"amount","name":"amount","imgURL":"./data/interfaces/amount.png","type":"Float"}],"interface":[{"hoverText":"rainfall","name":"rainfall","imgURL":"./data/interfaces/rainfall.png","type":"Port (Float)"}],"comment":"Rain"},{"relational":false,"icon":"./data/img/pump.png","name":"pump","parameters":[{"hoverText":"capacity","name":"capacity","imgURL":"./data/interfaces/capacity.png","type":"Float"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Float)"},{"hoverText":"outflow","name":"outflow","imgURL":"./data/interfaces/outflow.png","type":"Port (Float)"}],"comment":"Pump"},{"relational":false,"icon":"./data/img/runOffArea.png","name":"runoff area","parameters":[{"hoverText":"storage capacity","name":"storage capacity","imgURL":"./data/interfaces/storage capacity.png","type":"Float"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Float)"},{"hoverText":"outlet","name":"outlet","imgURL":"./data/interfaces/outlet.png","type":"Port (Float)"},{"hoverText":"overflow","name":"overflow","imgURL":"./data/interfaces/overflow.png","type":"Port (Float)"}],"comment":"Runoff"}]}>Exit code: 0

 *
 *
 * **/
        if (invalidLibFormat===true){
            // add a name to the library;
            jsonObj.name="Full GCM MODEL";
            var libArray=jsonObj.library;

            // we dont care about the relational thing;

            var obj={};
            obj.name="FULL GCM MODEL";
            obj.library=[]; // array of objects


            // creating forloop style;
            // skipping the first 2 elements // currently dont know how to add them;
            console.log("---------------------------------------------");
            for (var i=0;i<libArray.length;i++){
                var currentElement=libArray[i];
                console.log(" Index "+i+"---------------------------------------------");
                console.log(currentElement);
                console.log("++++++++++++++++++++++++++++++++++++++++++++");

                // create an object;
                var libElement={};
                libElement.name=currentElement.name;
                libElement.description=currentElement.comment;
                libElement.parameters=[];
                libElement.type="NODAL";
                if (libElement.name ==="budget"){
                    // has no interface -.-
                    libElement.imgURL="./images/budget.png";
                    libElement.type="NODAL";
                    continue;
                }
                if (libElement.name ==="node"){
                    // has no interface -.-
                    libElement.imgURL="./images/factorNode.png";
                    libElement.type="CAUSAL";
                    libElement.name="Factor";
                }

                if (libElement.name ==="edge"){
                    // has no interface -.-
                    libElement.imgURL="./images/edgeElement.png";
                    libElement.type="RELATIONAL";
                    libElement.name="relation";
                }


                if (libElement.name ==="optimise"){
                    // has no interface -.-
                    libElement.imgURL="./images/optimize.png";
                    libElement.type="NODAL";
                    continue;
                }


                if (libElement.name==="evaluate"){
                    libElement.imgURL="./images/evaluate.png";
                    libElement.type="NODAL";
                    continue;
                }

                if (libElement.name==="action"){
                    libElement.imgURL="./images/adaptation_action.png";
                    libElement.type="CAUSAL"
                }


                if (libElement.name==="increaseAction"){
                    libElement.imgURL="./images/increaseAction.png";
                    libElement.type="NODAL"
                }
                if (libElement.name==="flooding"){
                    libElement.imgURL="./images/flooding.png";
                    libElement.type="NODAL"
                }

                if (libElement.name==="sink"){
                    libElement.imgURL="./images/sink.png";
                    libElement.type="NODAL"
                }
                if (libElement.name==="runoff area"){
                    libElement.imgURL="./data/img/runOffArea.png";
                    libElement.type="NODAL"
                }

                if (libElement.name==="criterion"){
                    libElement.imgURL="./images/criterion.png";
                    libElement.type="CAUSAL"
                }

                if (libElement.name==="rain"){
                    libElement.imgURL="./data/svg/rain.svg";
                }

                if (libElement.name==="pump"){
                    libElement.imgURL="./data/svg/pump.svg";
                    libElement.type="RELATIONAL"
                }



                // clean up params;
                for (var p=0;p<currentElement.parameters.length;p++){
                    var aParam=currentElement.parameters[p];
                    var pObj={};
                    pObj.name=aParam.name;
                    pObj.type=aParam.type;
                    libElement.parameters.push(pObj);
                }
                // add interfaces;
                var currInterfaces=currentElement.interface;

                if (currInterfaces.length===0){
                    libElement.interface=currInterfaces;
                }else{
                    libElement.interface=[];
                    console.log(currInterfaces);

                    for (var iA=0;iA<currInterfaces.length;iA++){
                        if (libElement.name==="criterion") continue;
                        if (libElement.name==="Factor") continue;

                        // cleaning up the interfaces;
                        var anInterface=currInterfaces[iA];
                        var iObj={};

                        // expecting;
                        // retLib+='                    "name" : "rainfall",';
                        // retLib+='                    "type" : "Port (Float)",';
                        // retLib+='                    "description": "Amount Of Rain",';
                        // retLib+='                    "imgURL": "./data/interfaces/rainfall.png",';
                        // retLib+='                    "rotation" : false,';
                        // retLib+='                    "outgoingType" :"MULTIPLE",';
                        // retLib+='                    "incomingType" :"NONE"';

                        // default MULTIPLE CONNECTIONS
                        iObj.outgoingType="MULTIPLE";
                        iObj.incomingType="MULTIPLE";
                        iObj.description=anInterface.hoverText;
                        // lets make the incoming fully;
                        iObj.name=anInterface.name;
                        iObj.type=anInterface.type;
                        iObj.imgURL=anInterface.imgURL;
                        if(iObj.name==="atPort"){
                            iObj.rotation=true;
                            iObj.outgoingType="MULTIPLE";
                            iObj.incomingType="MULTIPLE";
                        }
                        if(iObj.name==="benefit"){
                            iObj.rotation=false;
                            iObj.outgoingType="MULTIPLE";
                            iObj.incomingType="MULTIPLE";
                        }

                        if(iObj.name==="cost"){
                            iObj.rotation=false;
                            iObj.outgoingType="MULTIPLE";
                            iObj.incomingType="NONE";
                        }

                        if(iObj.name==="value") {
                            iObj.rotation = false;
                        }


                        //if (libElement.name==="pump")
                        if (iObj.name==="inflow"){
                            iObj.rotation=true;
                            iObj.outgoingType="NONE";
                            iObj.incomingType="SINGLE";
                            if (libElement.name==="sink"){iObj.incomingType="ARBITRARY";}
                        }

                        if (iObj.name==="outflow"){
                            iObj.rotation=true;
                            iObj.outgoingType="SINGLE";
                            iObj.incomingType="NONE";
                        }


                        if(iObj.name==="increase"){
                                iObj.rotation=false;
                                iObj.outgoingType="NONE";
                                iObj.incomingType="SINGLE";
                        }



                        // add this port element;
                        console.log("inteface obj");
                        console.log(iObj);
                        libElement.interface.push(iObj);
                        console.log("hello this hould be thre now'");

                    }
                }


                console.log(libElement);
                obj.library.push(libElement);
            }


            // var firstElement=jsonObj.library[0]; // is scipped;
            // var secondElement=jsonObj.library[1]; // is scipped;
            // var Element2=jsonObj.library[2];
            // console.log(Element2);
            // console.log();
            //
            // var el2Obj={};
            // el2Obj.name="budget";
            // el2Obj.imgURL="./images/budget.png";
            // el2Obj.type="NODAL";
            // el2Obj.description= "Set a maximum budget";
            // var p1={name:"numberOfPorts", type:"Int"};
            // var p2={name:"maximumBudget", type:"Int"};
            //
            // el2Obj.parameters=[p1,p2];
            // el2Obj.interface = [];
            //
            // obj.library.push(el2Obj);



            // first element
            /*
            "relational":false,
                "icon":"pathToNodeImage",
                "name":"node",
                "parameters":[
                {
                    "hoverText":"obsSign",
                    "name":"obsSign",
                    "imgURL":"./data/interfaces/obsSign.png",
                    "type":"Int | ()"
                },
                {
                    "hoverText":"numIn",
                    "name":"numIn",
                    "imgURL":"./data/interfaces/numIn.png",
                    "type":"Int"
                },
                {
                    "hoverText":"numOut",
                    "name":"numOut",
                    "imgURL":"./data/interfaces/numOut.png",
                    "type":"Int"
                }
            ],
                "interface":[
                {
                    "hoverText":"value",
                    "name":"value",
                    "imgURL":"./data/interfaces/value.png",
                    "type":"Port (Int)"
                }
            ],
                "comment":"Generic node"
            */




            // console.log(libArray);
            // console.log(jsonObj);

            var success=that.graphObject.paseLoadedLibrary(obj);
            if (success) {

                that.clearGraph();
                reloadWidgetItems(obj);
                that.graphObject.allowAllClicks=true;
                that.graphObject.libraryLoaded(true);
                // redraw the hud;
                // TODO: clean it up
                //that.graphObject.redrawHUD();
            }


        }


        else{
        var success=that.graphObject.paseLoadedLibrary(jsonObj);
        if (success) {
            that.clearGraph();
            reloadWidgetItems(jsonObj);
            that.graphObject.libraryLoaded(true);
            // redraw the hud;
            // TODO: clean it up
            //that.graphObject.redrawHUD();
        }
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
