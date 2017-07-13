!function(){
    // allow to create new Nodes
    var comMod={};
    var instanceId=0;

    var ACTION_LOAD_JSON="ACTION_LOAD_JSON";
    var ACTION_SAVE_JSON="ACTION_SAVE_JSON";
    var ACTION_REQUEST_MODEL="ACTION_REQUEST_MODEL";
    var SERVER_REQUEST="SERVER_REQUEST";

    function new_object(initializer) {
        // some variables
        var that = this;

        //var registeredWidgets;
        //http://localhost:4000/static/index.html
        var solverAddress="http://localhost:4000";
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

            if (localAction.task===ACTION_SAVE_JSON){
                // here we have already the data from the action, so we put this directly to the widget
                widget.saveAsJSON();
            }

            if (localAction.task===SERVER_REQUEST && localAction.requestType==="SEND_MODEL"){
                console.log("requesting an action that talks with docker ");
                console.log("The data " +localAction.data);
                // docker image name
                // get the model
                var modelText = localAction.data;
                var send_requestAddress=solverAddress+"/submit";
                console.log("do we have a lib address:"+send_requestAddress);

                var xhr_post = new XMLHttpRequest();   // new HttpRequest instance
                xhr_post .open("POST", send_requestAddress);
                xhr_post .setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr_post .send(modelText);
                xhr_post .onload = function () {
                    console.log("finished the xhr request with post");
                    console.log("result:"+xhr_post.responseText);
                    console.log("response text needs to be transferred into json ");
                    // todo: process the returned data; to the widget
                };
            }


            if (localAction.task===SERVER_REQUEST && localAction.requestType==="GET_LIBRARY"){
                console.log("requesting an action that talks with docker ");
                // docker image name
                var get_requestAddress=solverAddress+"/library/crud";
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