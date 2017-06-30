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
                var libName=solverAddress+"/submit";
                console.log("do we have a lib address:"+libName);

                var formData = new FormData();
                formData.append("", modelText);
                var xhr = new XMLHttpRequest();

                xhr.open("POST", libName, true);
                xhr.onload = function () {
                    console.log("finished the xhr request with post");
                };
                xhr.send(formData);



                //
                // var xhr = new XMLHttpRequest();
                // xhr.open("POST", '{"name":test}', true);
                // xhr.setRequestHeader("Content-type", "application/json");
                //
                // xhr.onreadystatechange = function() {//Call a function when the state changes.
                //     console.log("ready! ");
                //     console.log("readyState: "+xhr.readyState);
                //     console.log("Status: "+xhr.status);
                //     console.log(xhr.responseText);
                //      if(xhr.readyState == 4 && xhr.status == 200) {
                //          console.log("Response" +xhr.responseText);
                //      }
                //  };
                // console.log("sending request "+xhr);
                // xhr.send();
                //
                //
                // //
                //  d3.text(libName)
                //       .header("Content-Type", "application/json")
                //       .post(modelText, function(error, text) { console.log(text); });

                // var xhr = new XMLHttpRequest();
                // xhr.onload = function () {
                //     console.log("executing the docker request")
                //     if (xhr.status === 200) {
                //         console.log("Okay ---------------------------------------------------------");
                //         console.log(xhr.responseText);
                //
                //     }
                //
                // };

                // xhr.open("POST", libName, true);
                // xhr.setRequestHeader('Content-type', 'application/json');
                // xhr.send(modelText);
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