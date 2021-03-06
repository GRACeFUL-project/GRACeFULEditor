
function GTWidget(){
    BaseWidget.apply(this,arguments);

    this.setClassName("GoalTreeWidget");

    var that=this;

    this.cldGraphObj=undefined;
    this.sfdGraphObj=undefined;


    this.setPtrToSFDGraphObject=function(sfdGraphObj){
        this.sfdGraphObj=sfdGraphObj;
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

    this.clearGraph=function () {
      that.graphObject.emptyGraphStructure();
      that.graphObject.forceRedrawContent();
    };


    this.setupGraph=function(){
      this.graphObject=new GTGraph(that);
      that.graphObject.initializeGraph();
    };

    this.setupControls=function(){
        this.controlsObject=new GTControls(that);
    };


    this.setNodeType=function(typeId)    {
      that.graphObject.changeNodeType(typeId);
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

    this.loadStakeholders = function(csvdata) {
        var data = csvdata.data;
        console.log("CSV stakeholder data: "+JSON.stringify(data));
        var stakeholdersObj = {};
        var stakeholderEmail=[];
        if(data) {            
            for(var i=0; i<data.length; i++) {
                var stakeholders= data[i].Stakeholder;
                var participants = data[i].Participants;
                var email = data[i].Email;

                if(stakeholders !== "" && !stakeholdersObj.hasOwnProperty(stakeholders)) {
                    stakeholdersObj[stakeholders] = [];

                    stakeholderEmail.push( email);
                    console.log("reading Email addres"+email);
                  //  stakeholderEmail[stakeholders] = [];
                    stakeholdersObj[stakeholders].push(participants);


                }
                else if(stakeholders !== "" && stakeholdersObj.hasOwnProperty(stakeholders)){
                    stakeholdersObj[stakeholders].push(participants);
                }

            }            
        }
        console.log(stakeholdersObj);


        console.log("Stakeholder Object: "+JSON.stringify(stakeholdersObj));
        console.log("Stakeholder Email Object: "+JSON.stringify(stakeholderEmail));
        if(stakeholdersObj)
            that.graphObject.addStakeholders(stakeholdersObj,stakeholderEmail);
    };
}


GTWidget.prototype = Object.create(BaseWidget.prototype);
GTWidget.prototype.constructor = GTWidget;
