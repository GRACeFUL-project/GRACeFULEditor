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

        var registeredWidgets;
        //http://localhost:4000/static/index.html
        var solverAddress="http://localhost:4000";
        var localAction;
        this.registerWidget=function(widgets){
            registeredWidgets=widgets;

            // debug
            for (var i=0;i<widgets.length;i++){
                console.log("Registered Widget: "+ widgets[i].name());
                widgets[i].comMod(that);
            }
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

            if (localAction.task===ACTION_SAVE_JSON){
                // here we have already the data from the action, so we put this directly to the widget
                widget.saveAsJSON();
            }

            if (localAction.task===ACTION_REQUEST_MODEL){
                console.log("requestion an action that talks with docker ");


                // docker image name
                var libName=solverAddress+"/library/crud";
                var xhr = new XMLHttpRequest();
                // xhr.overrideMimeType("application/json");
                // xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
                // xhr.open("GET", libName, true);
                // xhr.send();
                d3.xhr(libName, "application/json",function (error, request) {
                    if (request){
                        console.log("docker returns data: "+request.responseText);
                    }
                    else{
                        console.log("error!"+xhr.status);
                        console.log("error!"+error.status);
                    }
                });

            }

            if (localAction.task===SERVER_REQUEST && localAction.requestType==="SEND_MODEL"){
                console.log("requesting an action that talks with docker ");
                console.log("The data " +localAction.data);
                // docker image name
                // get the model
                var modelText = localAction.data;

                var solverAddress="http://localhost:4000";
                var serverRequest=solverAddress+"/submit";
                console.log("do we have a lib address:"+serverRequest);

                var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
                xmlhttp.open("POST", serverRequest);
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlhttp.send(modelText);
                xmlhttp.onload = function () {
                    console.log("finished the xhr request with post");
                    console.log("result:"+xmlhttp.responseText);
                    console.log("response text needs to be transferred into json ")
                };

            }


            if (localAction.task===SERVER_REQUEST && localAction.requestType==="GET_LIBRARY"){
                console.log("requesting an action that talks with docker ");
                // docker image name
                var libName=solverAddress+"/library/crud";
                var xhr = new XMLHttpRequest();
                // xhr.overrideMimeType("application/json");
                // xhr.setRequestHeader("Access-Control-Allow-Methods", "GET");
                // xhr.open("GET", libName, true);
                // xhr.send();
                d3.xhr(libName, "application/json",function (error, request) {
                    if (request){
                        console.log("docker returns data: "+request.responseText);
                    }
                    else{
                        console.log("error!"+xhr.status);
                        console.log("error!"+error.status);
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