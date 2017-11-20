!function(){
    // allow to create new Nodes
    var comMod={};
    var instanceId=0;

    var ACTION_LOAD_JSON="ACTION_LOAD_JSON";
    var ACTION_SAVE_JSON="ACTION_SAVE_JSON";
    var ACTION_LOAD_LIBRARY="ACTION_LOAD_LIBRARY";
    var ACTION_REQUEST_MODEL="ACTION_REQUEST_MODEL";
    var SERVER_REQUEST="SERVER_REQUEST";
    var ACTION_LOAD_STAKEHOLDERS = "ACTION_LOAD_STAKEHOLDERS";
    var ACTION_SAVE_GLOBAL_JSON="ACTION_SAVE_GLOBAL_JSON";
    var ACTION_LOAD_GLOBAL_JSON="ACTION_LOAD_GLOBAL_JSON";
    var GET_LOADED_LIBRARIES="GET_LOADED_LIBRARIES";
    function new_object(initializer) {
        // some variables
        var that = this;

        this.initPtr=undefined;
        this.erroLog="Error Message";
        //var registeredWidgets;
        //http://localhost:4000/static/index.html
        // var solverAddress="http://localhost:4000";
       var solverAddress="http://vocol.iais.fraunhofer.de/graceful-rat";
     //   var solverAddress="http://localhost:4000";
        var localAction;

        // done from the outside
        // this.registerWidget=function(widgets){
        //     registeredWidgets=widgets;
        //
        //     // debug
        //     for (var i=0;i<widgets.length;i++){
        //         console.log("Registered Widget: "+ widgets[i].name());
        //         widgets[i].comMod(that);
        //     }
        // };

        this.setInitPtr=function(initPtr){
            that.initPtr=initPtr;
        };

        this.registerSolver=function(address){
            // tell that thing where we want to send /receive data from
            //e.g address ="http://localhost:4000";
            solverAddress=address;
        };


        this.actionProcessing=function(widget, action){
            // we get a widget that requests an action;
            // make a local copy of the action
            localAction=action;
            if (localAction.task===ACTION_LOAD_JSON){
                // here we have already the data from the action, so we put this directly to the widget
                widget.loadJSON(localAction.data);
            }

            if (localAction.task===ACTION_LOAD_LIBRARY){
                // here we have already the data from the action, so we put this directly to the widget
                widget.loadJSON_Library(localAction.data);
            }

            if(localAction.task === ACTION_LOAD_STAKEHOLDERS) {
                widget.loadStakeholders(localAction.data);
            }

            if (localAction.task===ACTION_SAVE_JSON){
                // here we have already the data from the action, so we put this directly to the widget
                widget.saveAsJSON();
            }

            if (localAction.task===ACTION_SAVE_GLOBAL_JSON){
                // here we have already the data from the action, so we put this directly to the widget
                widget.saveGlobalModelAsJSON();
            }
            if (localAction.task===ACTION_LOAD_GLOBAL_JSON){
                // here we have already the data from the action, so we put this directly to the widget
                console.log("Com Mod Received signal to load data");
                widget.loadGlobalModelAsJSON(localAction.data);
            }


            if (localAction.task===SERVER_REQUEST && localAction.requestType==="GET_LOADED_LIBRARIES") {
                console.log("requesting All Loaded Libraries from docker ");
                // docker image name
                var get_requestAddress=solverAddress + "/libraries";
                console.log("address :"+get_requestAddress);
                d3.xhr(get_requestAddress, "application/json",function (error, request) {
                    if (request){
                        console.log("***********************************************************************************************");
                        console.log("docker returns data: "+request.responseText);
                        console.log("***********************************************************************************************");
                        var jObj=JSON.parse(request.responseText);
                        console.log(jObj);
                        // add the libs to sfd selection
                        // we call this from sfd widget
                        widget.createLoadedLibrariesForm(jObj);


                    }


                    else{
                        console.log("----");
                        console.log("----");
                        console.log("---- Could not load libraries");
                        console.log("----");
                        console.log("----");
                        console.log("docker returns data: "+request.responseText);
                    }
                });


            }

            if (localAction.task===SERVER_REQUEST && localAction.requestType==="SEND_MODEL"){
                console.log("requesting an action that talks with docker ");
                // get the model
                var modelText = localAction.data;
                var send_requestAddress=solverAddress+"/submit";

                if (localAction.libraryName && localAction.libraryName.length>0) {
                    send_requestAddress = solverAddress + "/submit/" + localAction.libraryName;
                }

                console.log("do we have a lib address:"+send_requestAddress);
                var xhr_post = new XMLHttpRequest();   // new HttpRequest instance
                xhr_post.open("POST", send_requestAddress);
                xhr_post.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr_post.send(modelText);


                // console.log("XHR"+xhr_post);
                // console.log(xhr_post);
                // console.log("POST: "+send_requestAddress);
                // console.log("Model: "+modelText);

                xhr_post.onload = function () {
                    console.log("finished the xhr request with post");
                    console.log("result:"+xhr_post.responseText);
                    console.log("response text needs to be transferred into json ");
                    widget.parseResult(xhr_post.responseText);
                };

                xhr_post.onreadystatechange= function(){
                    if (xhr_post.readyState===4) {
                        console.log("Finished sending Operation");
                        console.log(xhr_post);
                        if (xhr_post.responseText===""){
                            console.log("something went wrong");
                            // local test
                       //     widget.parseResult("localTest");
                        }
                    }
                };

                //
                // console.log(xhr_post);
                // if (xhr_post.status===0){
                //     // mockup test
                //     widget.parseResult("");
                // }

            }

            if (localAction.task===SERVER_REQUEST && localAction.requestType==="GET_LIBRARY_STATIC") {
                var fullGCMlib='{"library":[{"relational":false,"icon":"pathToNodeImage","name":"node","parameters":[{"hoverText":"obsSign","name":"obsSign","imgURL":"./data/interfaces/obsSign.png","type":"Int | ()"},{"hoverText":"numIn","name":"numIn","imgURL":"./data/interfaces/numIn.png","type":"Int"},{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"}],"comment":"Generic node"},{"relational":true,"icon":"pathToArrowImage","name":"edge","parameters":[{"hoverText":"sign","name":"sign","imgURL":"./data/interfaces/sign.png","type":"Int"}],"interface":[],"comment":"Causal relation"},{"relational":false,"icon":"/dev/null","name":"budget","parameters":[{"hoverText":"numberOfPorts","name":"numberOfPorts","imgURL":"./data/interfaces/numberOfPorts.png","type":"Int"},{"hoverText":"maximumBudget","name":"maximumBudget","imgURL":"./data/interfaces/maximumBudget.png","type":"Int"}],"interface":[],"comment":"Set a maximum budget"},{"relational":false,"icon":"/dev/null","name":"optimise","parameters":[{"hoverText":"numberOfPorts","name":"numberOfPorts","imgURL":"./data/interfaces/numberOfPorts.png","type":"Int"}],"interface":[],"comment":"Optimise the sum of some ports"},{"relational":false,"icon":"/dev/null","name":"evaluate","parameters":[{"hoverText":"values","name":"values","imgURL":"./data/interfaces/values.png","type":"[Int]"},{"hoverText":"weights","name":"weights","imgURL":"./data/interfaces/weights.png","type":"[Float]"}],"interface":[{"hoverText":"atPort","name":"atPort","imgURL":"./data/interfaces/atPort.png","type":"Port (Int)"},{"hoverText":"benefit","name":"benefit","imgURL":"./data/interfaces/benefit.png","type":"Port (Float)"}],"comment":"Evaluate benefits of possible values"},{"relational":false,"icon":"/dev/null","name":"action","parameters":[{"hoverText":"values","name":"values","imgURL":"./data/interfaces/values.png","type":"[Int]"},{"hoverText":"costs","name":"costs","imgURL":"./data/interfaces/costs.png","type":"[Int]"},{"hoverText":"numIn","name":"numIn","imgURL":"./data/interfaces/numIn.png","type":"Int"},{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"},{"hoverText":"cost","name":"cost","imgURL":"./data/interfaces/cost.png","type":"Port (Int)"}],"comment":"CLD action node"},{"relational":false,"icon":"/dev/null","name":"criterion","parameters":[{"hoverText":"numIn","name":"numIn","imgURL":"./data/interfaces/numIn.png","type":"Int"},{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"}],"comment":"Node for criterion"},{"relational":false,"icon":"./data/img/rain.png","name":"rain","parameters":[{"hoverText":"amount","name":"amount","imgURL":"./data/interfaces/amount.png","type":"Int"}],"interface":[{"hoverText":"rainfall","name":"rainfall","imgURL":"./data/interfaces/rainfall.png","type":"Port (Int)"}],"comment":"Rain"},{"relational":false,"icon":"./data/img/pump.png","name":"pump","parameters":[{"hoverText":"capacity","name":"capacity","imgURL":"./data/interfaces/capacity.png","type":"Int"}],"interface":[{"hoverText":"increase","name":"increase","imgURL":"./data/interfaces/increase.png","type":"Port (Int)"},{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"},{"hoverText":"outflow","name":"outflow","imgURL":"./data/interfaces/outflow.png","type":"Port (Int)"}],"comment":"Pump"},{"relational":false,"icon":"./data/img/runOffArea.png","name":"runoff area","parameters":[{"hoverText":"storage capacity","name":"storage capacity","imgURL":"./data/interfaces/storage capacity.png","type":"Int"}],"interface":[{"hoverText":"increase","name":"increase","imgURL":"./data/interfaces/increase.png","type":"Port (Int)"},{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"},{"hoverText":"outlet","name":"outlet","imgURL":"./data/interfaces/outlet.png","type":"Port (Int)"},{"hoverText":"overflow","name":"overflow","imgURL":"./data/interfaces/overflow.png","type":"Port (Int)"}],"comment":"Runoff"},{"relational":false,"icon":"/dev/null","name":"sink","parameters":[],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"}],"comment":"Sink"},{"relational":false,"icon":"/dev/null","name":"flooding","parameters":[{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"}],"comment":"Flooding of square"},{"relational":false,"icon":"/dev/null","name":"increaseAction","parameters":[{"hoverText":"values","name":"values","imgURL":"./data/interfaces/values.png","type":"[Int]"},{"hoverText":"costs","name":"costs","imgURL":"./data/interfaces/costs.png","type":"[Int]"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"},{"hoverText":"cost","name":"cost","imgURL":"./data/interfaces/cost.png","type":"Port (Int)"}],"comment":"Action to increase a parameter"}]}'
                that.initPtr.loadSideBarElements(fullGCMlib);
            }


            if (localAction.task===SERVER_REQUEST && localAction.requestType==="GET_LIBRARY"){
                console.log("requesting an action that talks with docker ");
                // docker image name
                var get_requestAddress;
                if (localAction.libraryName && localAction.libraryName.length>0) {
                    get_requestAddress = solverAddress + "/library/" + localAction.libraryName;
                }
                else{
                    get_requestAddress = solverAddress + "/library/crud";
                }

                console.log("address :"+get_requestAddress);
                d3.xhr(get_requestAddress, "application/json",function (error, request) {
                   if (request){
                       console.log("***********************************************************************************************")
                       console.log("***********************************************************************************************")
                       console.log("***********************************************************************************************")
                       console.log("***********************************************************************************************")
                       console.log("***********************************************************************************************")
                       console.log("docker returns data: "+request.responseText);
                       // todo: process the returned data; to the widget
                       that.initPtr.loadSideBarElements(request.responseText);
                       widget.loadLibrary(request.responseText);

                   }
                   else{
                   console.log("error!"+error.status);
                       // if no server is running we simply use the current state of the library;
                       // using for testing locally
                       var exampleLib='{"library":[{"icon":"./data/img/rain.png","name":"rain","parameters":[{"hoverText":"amount","name":"amount","imgURL":"./data/interfaces/amount.png","type":"Float"}],"interface":[{"hoverText":"rainfall","name":"rainfall","imgURL":"./data/interfaces/rainfall.png","type":"Port (Float)"}],"comment":"Rain"},{"icon":"./data/img/pump.png","name":"pump","parameters":[{"hoverText":"capacity","name":"capacity","imgURL":"./data/interfaces/capacity.png","type":"Float"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Float)"},{"hoverText":"outflow","name":"outflow","imgURL":"./data/interfaces/outflow.png","type":"Port (Float)"}],"comment":"Pump"},{"icon":"./data/img/runOffArea.png","name":"runoff area","parameters":[{"hoverText":"storage capacity","name":"storage capacity","imgURL":"./data/interfaces/storage capacity.png","type":"Float"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Float)"},{"hoverText":"outlet","name":"outlet","imgURL":"./data/interfaces/outlet.png","type":"Port (Float)"},{"hoverText":"overflow","name":"overflow","imgURL":"./data/interfaces/overflow.png","type":"Port (Float)"}],"comment":"Runoff"}]}';
                       var fullGCMlib='{"library":[{"relational":false,"icon":"pathToNodeImage","name":"node","parameters":[{"hoverText":"obsSign","name":"obsSign","imgURL":"./data/interfaces/obsSign.png","type":"Int | ()"},{"hoverText":"numIn","name":"numIn","imgURL":"./data/interfaces/numIn.png","type":"Int"},{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"}],"comment":"Generic node"},{"relational":true,"icon":"pathToArrowImage","name":"edge","parameters":[{"hoverText":"sign","name":"sign","imgURL":"./data/interfaces/sign.png","type":"Int"}],"interface":[],"comment":"Causal relation"},{"relational":false,"icon":"/dev/null","name":"budget","parameters":[{"hoverText":"numberOfPorts","name":"numberOfPorts","imgURL":"./data/interfaces/numberOfPorts.png","type":"Int"},{"hoverText":"maximumBudget","name":"maximumBudget","imgURL":"./data/interfaces/maximumBudget.png","type":"Int"}],"interface":[],"comment":"Set a maximum budget"},{"relational":false,"icon":"/dev/null","name":"optimise","parameters":[{"hoverText":"numberOfPorts","name":"numberOfPorts","imgURL":"./data/interfaces/numberOfPorts.png","type":"Int"}],"interface":[],"comment":"Optimise the sum of some ports"},{"relational":false,"icon":"/dev/null","name":"evaluate","parameters":[{"hoverText":"values","name":"values","imgURL":"./data/interfaces/values.png","type":"[Int]"},{"hoverText":"weights","name":"weights","imgURL":"./data/interfaces/weights.png","type":"[Float]"}],"interface":[{"hoverText":"atPort","name":"atPort","imgURL":"./data/interfaces/atPort.png","type":"Port (Int)"},{"hoverText":"benefit","name":"benefit","imgURL":"./data/interfaces/benefit.png","type":"Port (Float)"}],"comment":"Evaluate benefits of possible values"},{"relational":false,"icon":"/dev/null","name":"action","parameters":[{"hoverText":"values","name":"values","imgURL":"./data/interfaces/values.png","type":"[Int]"},{"hoverText":"costs","name":"costs","imgURL":"./data/interfaces/costs.png","type":"[Int]"},{"hoverText":"numIn","name":"numIn","imgURL":"./data/interfaces/numIn.png","type":"Int"},{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"},{"hoverText":"cost","name":"cost","imgURL":"./data/interfaces/cost.png","type":"Port (Int)"}],"comment":"CLD action node"},{"relational":false,"icon":"/dev/null","name":"criterion","parameters":[{"hoverText":"numIn","name":"numIn","imgURL":"./data/interfaces/numIn.png","type":"Int"},{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"}],"comment":"Node for criterion"},{"relational":false,"icon":"./data/img/rain.png","name":"rain","parameters":[{"hoverText":"amount","name":"amount","imgURL":"./data/interfaces/amount.png","type":"Int"}],"interface":[{"hoverText":"rainfall","name":"rainfall","imgURL":"./data/interfaces/rainfall.png","type":"Port (Int)"}],"comment":"Rain"},{"relational":false,"icon":"./data/img/pump.png","name":"pump","parameters":[{"hoverText":"capacity","name":"capacity","imgURL":"./data/interfaces/capacity.png","type":"Int"}],"interface":[{"hoverText":"increase","name":"increase","imgURL":"./data/interfaces/increase.png","type":"Port (Int)"},{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"},{"hoverText":"outflow","name":"outflow","imgURL":"./data/interfaces/outflow.png","type":"Port (Int)"}],"comment":"Pump"},{"relational":false,"icon":"./data/img/runOffArea.png","name":"runoff area","parameters":[{"hoverText":"storage capacity","name":"storage capacity","imgURL":"./data/interfaces/storage capacity.png","type":"Int"}],"interface":[{"hoverText":"increase","name":"increase","imgURL":"./data/interfaces/increase.png","type":"Port (Int)"},{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"},{"hoverText":"outlet","name":"outlet","imgURL":"./data/interfaces/outlet.png","type":"Port (Int)"},{"hoverText":"overflow","name":"overflow","imgURL":"./data/interfaces/overflow.png","type":"Port (Int)"}],"comment":"Runoff"},{"relational":false,"icon":"/dev/null","name":"sink","parameters":[],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"}],"comment":"Sink"},{"relational":false,"icon":"/dev/null","name":"flooding","parameters":[{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"}],"comment":"Flooding of square"},{"relational":false,"icon":"/dev/null","name":"increaseAction","parameters":[{"hoverText":"values","name":"values","imgURL":"./data/interfaces/values.png","type":"[Int]"},{"hoverText":"costs","name":"costs","imgURL":"./data/interfaces/costs.png","type":"[Int]"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"},{"hoverText":"cost","name":"cost","imgURL":"./data/interfaces/cost.png","type":"Port (Int)"}],"comment":"Action to increase a parameter"}]}'
                       console.log("loading static library -----> "+fullGCMlib);
                       var invalidLibFormat=true;
                       widget.loadLibrary(fullGCMlib,invalidLibFormat);

                   }
                });
            }


            // now we can delete the data;
            localAction=null;

            widget.updateIfNeeded();

        };
        this.testAction=function(){

        }

    }
    comMod.create=function(initializer){
        instanceId++;
        return new new_object(initializer);

    };




    this.commod=comMod;
}();
