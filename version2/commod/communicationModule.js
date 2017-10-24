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

    function new_object(initializer) {
        // some variables
        var that = this;
        this.erroLog="Error Message";
        //var registeredWidgets;
        //http://localhost:4000/static/index.html
        //var solverAddress="http://localhost:4000";
        var solverAddress="http://vocol.iais.fraunhofer.de/graceful-rat";
        //var solverAddress="http://localhost:3000";
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
                // igore the docker for now;
                var retLib='{';
                retLib+='"library" :[';

                // testing other elements;
                retLib+='{';
                retLib+='"name": "Factor",';
                retLib+='"parameters": [],';
                retLib+='"interface" :[],';
                retLib+='"imgURL"      : "./images/factorNode.png",';
                retLib+='"description" : "Factor Node",';
                retLib+='"type"        : "CAUSAL"';
                retLib+='},';

                retLib+='{';
                retLib+='"name": "Action",';
                retLib+='"parameters": [],';
                retLib+='"interface" :[],';
                retLib+='"imgURL"      : "./images/adaptation_action.png",';
                retLib+='"description" : "Action Node",';
                retLib+='"type"        : "CAUSAL"';
                retLib+='},';

                retLib+='{';
                retLib+='"name": "Criterion",';
                retLib+='"parameters": [],';
                retLib+='"interface" :[],';
                retLib+='"imgURL"      : "./images/criterion.png",';
                retLib+='"description" : "Criterion Node",';
                retLib+='"type"        : "CAUSAL"';
                retLib+='},';

                retLib+='{';
                retLib+='"name": "Stakeholder",';
                retLib+='"parameters": [],';
                retLib+='"interface" :[],';
                retLib+='"imgURL"      : "./images/stakeholder.png",';
                retLib+='"description" : "Stakeholder Node",';
                retLib+='"type"        : "CAUSAL"';
                retLib+='},';

                retLib+='{';
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
                retLib+='{';
                retLib+='"name": "pump",';
                retLib+='"parameters":[';
                retLib+='                {"name":"capacity","type":"Float"}';
                retLib+='],';
                retLib+='"interface":[';
                retLib+='                {';
                retLib+='                    "name": "inflow",';
                retLib+='                    "type": "Port (Float)",';
                retLib+='                    "description": "Incoming Flow",';
                retLib+='                    "imgURL": "./data/interfaces/inflow.png",';
                retLib+='                    "rotation": true,';
                retLib+='                    "outgoingType": "NONE",';
                retLib+='                    "incomingType": "SINGLE"';
                retLib+='                },';
                retLib+='                {';
                retLib+='                    "name": "outflow",';
                retLib+='                    "type": "Port (Float)",';
                retLib+='                    "description": "Outgoing Flow",'
                retLib+='                    "imgURL": "./data/interfaces/outflow.png",';
                retLib+='                    "rotation": true,';
                retLib+='                    "outgoingType": "SINGLE",';
                retLib+='                    "incomingType": "NONE"';
                retLib+='                }';
                retLib+='],';
                retLib+='"imgURL"      : "./data/svg/pump.svg",';
                retLib+='"description" : "This is a pump",';
                retLib+='"type"        : "RELATIONAL"';
                retLib+='},';
                retLib+='';
                retLib+='{ "name": "runoff area",';
                retLib+='';
                retLib+='"parameters":[';
                retLib+='                {"name":"storage capacity","type":"Float"}';
                retLib+='],';
                retLib+='"interface":[';
                retLib+='                {';
                retLib+='                    "name": "inflow",';
                retLib+='                    "type": "Port (Float)",';
                retLib+='                    "description": "Incoming Flow",';
                retLib+='                    "imgURL": "./data/interfaces/inflow.png",';
                retLib+='                    "rotation": true,';
                retLib+='                    "outgoingType": "NONE",';
                retLib+='                    "incomingType": "SINGLE"';
                retLib+='                },';
                retLib+='                {';
                retLib+='                    "name": "outlet",';
                retLib+='                    "type": "Port (Float)",';
                retLib+='                    "description": "Outlet Description",';
                retLib+='                    "imgURL": "./data/interfaces/outlet.png",';
                retLib+='                    "rotation": false,';
                retLib+='                    "outgoingType": "SINGLE",';
                retLib+='                    "incomingType": "NONE"';
                retLib+='                },';
                retLib+='                {';
                retLib+='                    "name": "overflow",';
                retLib+='                    "type": "Port (Float)",';
                retLib+='                    "description": "Overflow Description",';
                retLib+='                    "imgURL": "./data/interfaces/overflow.png",';
                retLib+='                    "rotation": false,';
                retLib+='                    "outgoingType": "SINGLE",';
                retLib+='                    "incomingType": "NONE"';
                retLib+='                }';
                retLib+='],';
                retLib+='"imgURL"      : "./data/img/runOffArea.png",';
                retLib+='"description" : "This is RUN off Area",';
                retLib+='"type"        : "NODAL"';
                retLib+='},';
                retLib+='{ "name": "sink",';
                retLib+='';
                retLib+='"parameters":[';
                retLib+='                {"name":"sink capacity","type":"Float"}';
                retLib+='],';
                retLib+='"interface":[';
                retLib+='                {';
                retLib+='                    "name": "inflow",';
                retLib+='                    "type": "Port (Float)",';
                retLib+='                    "description": "Incoming Flow",';
                retLib+='                    "imgURL": "./data/interfaces/inflow.png",';
                retLib+='                    "rotation": true,';
                retLib+='                    "outgoingType": "NONE",';
                retLib+='                    "incomingType": "ARBITRARY"';
                retLib+='                }';
                retLib+='';
                retLib+='],';
                retLib+='"imgURL"      : "./data/img/sink.png",';
                retLib+='"description" : "This is a Sink",';
                retLib+='"type"        : "NODAL"';
                retLib+='}';
                retLib+='';
                retLib+='';
                retLib+='],';
                retLib+='"name" : "CRUD RAT Example"';
                retLib+='}';

                console.log("loading static library -----> "+retLib);
                widget.loadLibrary(retLib);
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
                       console.log("docker returns data: "+request.responseText);
                       // todo: process the returned data; to the widget
                       widget.loadLibrary(request.responseText);

                   }
                   else{
                   console.log("error!"+error.status);
                       // if no server is running we simply use the current state of the library;

                       var exampleLib='{"library":[{"icon":"./data/img/rain.png","name":"rain","parameters":[{"hoverText":"amount","name":"amount","imgURL":"./data/interfaces/amount.png","type":"Float"}],"interface":[{"hoverText":"rainfall","name":"rainfall","imgURL":"./data/interfaces/rainfall.png","type":"Port (Float)"}],"comment":"Rain"},{"icon":"./data/img/pump.png","name":"pump","parameters":[{"hoverText":"capacity","name":"capacity","imgURL":"./data/interfaces/capacity.png","type":"Float"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Float)"},{"hoverText":"outflow","name":"outflow","imgURL":"./data/interfaces/outflow.png","type":"Port (Float)"}],"comment":"Pump"},{"icon":"./data/img/runOffArea.png","name":"runoff area","parameters":[{"hoverText":"storage capacity","name":"storage capacity","imgURL":"./data/interfaces/storage capacity.png","type":"Float"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Float)"},{"hoverText":"outlet","name":"outlet","imgURL":"./data/interfaces/outlet.png","type":"Port (Float)"},{"hoverText":"overflow","name":"overflow","imgURL":"./data/interfaces/overflow.png","type":"Port (Float)"}],"comment":"Runoff"}]}';
                       console.log("loading static library -----> "+exampleLib);
                       widget.loadLibrary(exampleLib);

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
