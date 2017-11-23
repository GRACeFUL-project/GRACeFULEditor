

function CLDNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
    var defaultRadius=50;
   // this.parentWidget=parentWidget; // tells the graph which widget it talks to
    BaseNode.apply(this,arguments);
    var nodeClass="baseRoundNode";
    var nodeObs = "baseRoundNode";
    this.selectedTypeId=1;
    this.typeName = undefined;
    this.typeNameForSolver = undefined;
    var allPossibleClasses=['undefined','nodeOptionA','nodeOptionB','nodeOptionC', 'externalFactors','stakeHolders'];
    var observeClasses = ['undefined', 'strokeAmbigous', 'strokeDecreasing', 'strokeIncreasing', 'strokeStable'];
    this.allClasss=["Undefined", "Factor", "Action", "Criterion", "External Factor","stakeHolder"];
    this.criteriaUnit = "";
    this.libElement = "";

    this.isObserved = false;
    this.trendId = 0;
    this.trendName = null;
    this.numIn = 0;
    this.numOut = 0;
    this.interfaces = [];
    this.parameters = [];

    this.actionPairs = {"plusAction":false, "plusActionCost":undefined, "minusAction":false, "minusActionCost":undefined, "zeroAction":false, "zeroActionCost": undefined};
    this.actionCostSolver = undefined;
    this.stakeholderHappiness = undefined;

    this.incomingPortId = 0;
    this.outgoingPortId = 0;
    this.ports = [];

    this.result = undefined;
    var resultClasses = ['undefined', 'resultAmbigous', 'resultDecreasing', 'resultIncreasing', 'resultStable'];

    this.setCriteriaUnit = function(text) {
        if (this.getGlobalNodePtr()!=undefined){
            this.getGlobalNodePtr().setGlobalUnit(text);
        }
        that.criteriaUnit = text;
        console.log("the unit is:"+ text);
    };

    this.getCriteriaUnit = function() {
        return that.criteriaUnit;
    };

    this.setLibMapping = function(text, textDesc) {
        that.libElement = text;
        that.libElementDesc = textDesc;
        console.log("the element is mapped to lib: "+text);
        // update the element in sfd;
        that.getGlobalNodePtr().getSfdNode().setSubClassTypeFromText(text);

    };

    this.getLibMapping = function() {
        return that.libElement;
    };

    this.setActionCostFromSolver = function(val) {
        this.actionCostSolver = val;
    };

    this.getStakeholderHappiness = function(){
       return that.stakeholderHappiness;
    };

    this.setStakeholderHappiness = function(val) {
        this.stakeholderHappiness = val;
    };

    this.getTypeId=function(){
      return that.selectedTypeId;
    };

    this.setTypeId=function(id){
      that.selectedTypeId=id;
    };

    this.getImageURL=function(){


      if(that.selectedTypeId==1)
        return "./images/nodes/factor.png";
      else if(that.selectedTypeId==2)
       return "./images/nodes/action.png";
      else if(that.selectedTypeId==3)
       return "./images/nodes/criteria.png";
      else if(that.selectedTypeId==4)
       return "./images/nodes/extFactor.png";
      else if(that.selectedTypeId==5)
          return "./images/nodes/stakeholder.png";
    };

    this.setLabelText=function(val){
        this.label=val;

        if (this.getGlobalNodePtr()!=undefined){
            this.getGlobalNodePtr().setGlobalName(val);
        }

        if (this.toolTipElement && (this.label.length > that.DISPLAY_LABEL_LENGTH) ){
          this.toolTipElement.text(this.label);
        }

    };

    this.clearLabelText=function(){
        this.toolTipElement.text("");
    };

    this.setDisplayLabelText=function(val){
        this.displayLabel=val;

        if(this.displayLabel.length > that.DISPLAY_LABEL_LENGTH)
          this.displayLabel=that.displayLabel.slice(0,that.DISPLAY_LABEL_LIMIT).concat("...");

        var words = this.displayLabel.split(/\s+/g);
        nwords = words.length;

        if (this.labelRenderingElement){
            var el = this.labelRenderingElement
                .attr("dy", "-" + (nwords-1)*7.5);
            for (var i = 0; i < words.length; i++) {
                var tspan = el.append('tspan').text(words[i]);
                if (i > 0)
                    tspan.attr('x', 0).attr('dy', '15');
            }
        }
    };

    this.clearDisplayLabelText=function(){
      this.labelRenderingElement.text("");
    };

    this.setChipText=function(val) {
        //update the chip text of the node in the controls tab
        d3.select("#cldChipField").text(val);
    };

    this.changeClass=function(cssClassName){
      that.nodeElement.classed(cssClassName,true);
    };

    this.clearClass=function(){
      that.nodeElement.attr('class', null);
    };

    this.setObserve = function(val) {
        that.isObserved = val;
    };

    this.getObserve = function() {
        return that.isObserved;
    };

    this.setActionValues = function(id, val) {
        if(id === "plusAction")
            that.actionPairs[id] = val;
        else if(id === "minusAction")
            that.actionPairs[id] = val;
        else if(id === "zeroAction")
            that.actionPairs[id] = val;
    };

    this.setActionCost = function(id, val) {
        val = Number(val);
        if(id === "plusActionCost")
            that.actionPairs[id] = val;
        else if(id === "minusActionCost")
            that.actionPairs[id] = val;
        else if(id === "zeroActionCost")
            that.actionPairs[id] = val;  
    };

    this.getAction = function() {
        return that.actionPairs;
    };

    this.setPortDetails = function(type, id) {
        console.log("Setting PortDetail of that Node type"+type + "   id:"+id);
        var obj = {};
        obj.linkId = id;
        if(type === "outgoing") {
            obj.value = that.outgoingPortId++;            
            that.numOut++;
        }
        else if(type === "incoming") {
            obj.value = that.incomingPortId++;  
            that.numIn++;
        }
        that.ports.push(obj);
        // console.log("The node is: "+ that.id()+"The link is: "+obj.linkId+ " value: "+obj.value);
    };

    this.getPortDetails = function(id) {

        console.log("Getting Port Details, for node Id "+id);
        // console.log("id is: "+id+"Port details: "+JSON.stringify(that.ports, null, ''));
        console.log("that Ports");
        console.log(that.ports);
        var w = that.ports.find(function(temp) {
            return temp.linkId == id;
        });

        if(w === undefined) {
            return null;
        }
        else
            return w.value;
    };

    this.getFinalData = function() {        

        //updating nodes's parameters
        this.parameters = [];
        
        if(that.typeNameForSolver === "node") {
            var param1 = {"name": "obsSign", "value": that.trendName, "type": "Maybe Sign"};
            that.parameters.push(param1);    
        }
        else if(that.typeNameForSolver === "action") {
            graph.actionNodes++;
            var aVal = [];
            var aCost = [];
            if(that.actionPairs["plusAction"]) {
                aVal.push(1);
                aCost.push(Number(that.actionPairs["plusActionCost"]));
            }
            if(that.actionPairs["minusAction"]) {
                aVal.push(-1);
                aCost.push(Number(that.actionPairs["minusActionCost"]));
            }
            if(that.actionPairs["zeroAction"]) {
                aVal.push(0);
                aCost.push(Number(that.actionPairs["zeroActionCost"]));
            }
            var paramA1 = {"name": "values", "value": aVal, "type": "[Sign]"};
            that.parameters.push(paramA1);
            var paramA2 = {"name": "costs", "value": aCost, "type": "[Int]"};
            that.parameters.push(paramA2);
        }
        else if(that.typeNameForSolver === "criterion") {
            graph.criteriaNodes++;
        }
        var param2 = {"name": "numIn", "value": that.numIn, "type": "Int"};
        that.parameters.push(param2);
        var param3 = {"name": "numOut", "value": that.numOut, "type": "Int"};
        that.parameters.push(param3);

        //updating node's interfaces
        this.interfaces = [];
        var param4 = {"name": "value", "type": "Sign"};
        that.interfaces.push(param4);
        if(that.numOut > 0) {
            var param5 = {"name": "outgoing",  "type": "[(Sign,Sign)]"};
            that.interfaces.push(param5);
        }
        if(that.numIn > 0) {
            var param6 = {"name": "incoming", "type": "[(Sign,Sign)]"};
            that.interfaces.push(param6);
        }
        if(that.typeNameForSolver === "action") {
            var portBudget = graph.budgetPortIndex++;
            var aConn = {"connection": [graph.budgetId, "costs", portBudget], "name": "cost", "type": "Int"};
            that.interfaces.push(aConn);
        }
    };

    this.getFinalDataStakeholders = function() {
        graph.stakeholderNodes++;
        //obtain weights and values
        var weights = [];
        var values = [];
        for(var k=0; k<graph.pathElementArray.length; k++) {
            var sLink = graph.pathElementArray[k];
            if(sLink.superLinkType === 100 && sLink.sourceNode.id() === that.id()) {
                console.log("sLinkkkk!!! "+sLink.id());
                values.push(sLink.getEvaluationValue());
                weights.push(sLink.getNormalizedWeight());
            }
        }

        //updating stakeholder parameters
        this.parameters = [];
        var param1 = {"name": "preferences", "value": values, "type": "[[Sign]]"};
        that.parameters.push(param1);
        var param2 = {"name": "weights", "value": weights, "type": "[Float]"};
        that.parameters.push(param2);

        //updating stakeholder interfaces
        this.interfaces = [];
        var param3 = {"name": "criteria", "type": "[Sign]"};
        that.interfaces.push(param3);
        var param4 = {"connection": [graph.optimiseId, "benefits", graph.optimisePortIndex++], "name": "happiness", "type": "Float"};
        that.interfaces.push(param4);
    };

    this.setTrend = function(tid) {
        that.trendId = tid;
        
        if(tid == 0)
            that.trendName = null;
        else if(tid == 1) {
            that.trendName = 2;
            // that.nodeElement.classed(nodeObs, true);
        }
        else if(tid == 2) {
            that.trendName = -1;
            // that.nodeElement.classed(nodeObs, true);
        }
        else if(tid == 3) {
            that.trendName = 1;
            // that.nodeElement.classed(nodeObs, true);
        }
        else if(tid == 4) {
            that.trendName = 0;
            // that.nodeElement.classed(nodeObs, true);
        }

        that.setTrendStyle(tid);
    };

    this.getTrend = function() {
        return that.trendId;
    };

    this.setTrendStyle = function(tid) {
        nodeObs=observeClasses[tid];
        // apply the classes ;
        // console.log("The tid is: "+tid+" node observeClasses is: "+nodeObs);
        if (that.nodeElement){
            for (var i=0;i<observeClasses.length;i++){
                // console.log("disabling :"+observeClasses[i]);
                that.nodeElement.classed(observeClasses[i],false);
            }
            that.nodeElement.classed(nodeObs,true);
        }
    };

    this.setResult = function(rid) {
        that.result = rid;
        var rOffset = 0;
        console.log("Result: "+rid);
        if(rid == undefined)
            that.result = null;
        else if(rid == 2 || rid == -2) {
            rOffset = 1;
        }
        else if(rid == -1) {
            rOffset = 2;
        }
        else if(rid == 1) {
            rOffset = 3;
        }
        else if(rid == 0) {
            rOffset = 4;
        }

        that.setresultStyle(rOffset);
    };

    this.setresultStyle = function(rid) {
        nodeRes = resultClasses[rid];
        if (that.nodeElement){
            for (var i=0;i<resultClasses.length;i++){
                that.nodeElement.classed(resultClasses[i],false);
            }
            // that.nodeElement.classed(nodeRes,true);
            var innerCircle = that.rootNodeLayer.append('circle')
                .attr("r", that.getRadius()/2)
                .classed(nodeRes, true);
        }
    };

    this.drawNode=function(){

        // makeing the stakeholder nodes;
        // if (that.selectedTypeId===5){
        //
        //     console.log("oh i have a stackholder");
        //     that.nodeElement= that.rootNodeLayer.append('rect')
        //         .attr("rx", 6)
        //         .attr("ry", 6)
        //         .attr("x", -0.5*100)
        //         .attr("y", -0.5*50)
        //         .attr("width", 100)
        //         .attr("height", 50)
        //         .classed("baseRoundNode",true)
        //         .classed('goalOptionD', true);
        // }else {

            that.nodeElement = that.rootNodeLayer.append('circle')
                .attr("r", that.getRadius())
                .classed("baseRoundNode", true)
                .classed(nodeClass, true)
                .classed(nodeObs, true);
            if (that.selectedTypeId===5){
                that.nodeElement .classed('goalOptionD', true);
            }

            // add a criterion image;
        that.nodeElement

            // console.log("THE NODE CLASS IS ::: ****" + nodeClass);
        // }
        // add hover text if you want
        if (that.hoverTextEnabled===true)
            that.rootNodeLayer.append('title').text(that.hoverText);

            // TODO: Commented for now, but for later the color, size and weight of
            // the node text should be changed. White is not readable.
        // add title
        this.labelRenderingElement=  that.rootNodeLayer.append("text")
            .attr("text-anchor","middle")
            // .attr("fill","#757575")
            // .attr("font-size","16px")
            .classed("nodeText",true)
            // .text(that.label)
            .style("cursor","default");

        that.toolTipElement = that.nodeElement.append('title');

        //add tooltip
        if( that.label.length > that.DISPLAY_LABEL_LENGTH   )
          that.toolTipElement.text(that.label);

        that.setLabelText(that.label);

        //prepare node display label
        that.setDisplayLabelText(that.label);

        if (that.selectedTypeId===5){
            console.log("removed deletation element");
        }else {
            //add delete image
            that.rootNodeLayer.append("image")
                .attr("xlink:href", "images/delete.svg")
                .attr("display", "none")
                .attr("x", that.getRadius() / 2)
                .attr("y", -(that.getRadius()) + 5)
                .attr("width", 17)
                .attr("height", 17)
                .attr("cursor", "pointer")
                .on('click', function () {
                    d3.event.stopPropagation();
                    graph.handleNodeDeletion(that);
                });
        }
    };




    this.onClicked=function(){
        // console.log(d3.event);
        // console.log("single click: prevented by drag?"+d3.event.defaultPrevented);
        if (d3.event.defaultPrevented) return;
        //
        // that.updateAssisiatedLinks();
        // console.log("--------------------------number of assosiated links "+assosiatedLinks.length);


        // d3.event.stopPropagation();
        if(d3.event.ctrlKey) {
            console.log("Controllll");
            graph.hideDraggerElement();
            graph.selectMultiples(that);
            return;
        }
        if (that.getNodeObjectType()===that.GRAPH_OBJECT_NODE) {
            graph.multipleNodes = [];
            if (that.nodeIsFocused === false) {
                that.nodeIsFocused = true;


                graph.selectNode(that);
                if (that.selectedTypeId!==5) {
                    console.log("cld simple Selection"+that.selectedTypeId);
                    that.nodeElement.classed("focused", true);
                    graph.createDraggerElement(that);
                }else{
                    console.log("cld stake selection");
                    that.nodeElement.classed("focusedStakeHolder", true);
                }

                //       console.log("this node is focused?" + that.nodeIsFocused);
                return;
            }
            if (that.nodeIsFocused === true) {
                console.log("removing focused classed");
                that.nodeIsFocused = false;
                that.nodeElement.classed("focused", false);
                that.nodeElement.classed("focusedStakeHolder", false);
                graph.selectNode(undefined);
                graph.hideDraggerElement();
            }
        }
        if (that.getNodeObjectType()===that.OVERLAY_OBJECT_NODE){
            //    console.log("setting overlay Toggle class");
            if (that.nodeIsFocused === false) {
                that.nodeIsFocused = true;
                that.nodeElement.classed("overlayToggle", true);
                return;
            }
            if (that.nodeIsFocused === true) {
                that.nodeIsFocused = false;
                that.nodeElement.classed("overlayToggle", false);
            }
        }

        // test
    };

    this.setMyMetaData=function(metaObject){
        console.log("setting metaData");
        this.setObserve(metaObject.observe);
        this.setTrend(metaObject.trend);

        // if(metaObject.libMapping)
            // this.setLibMapping(metaObject.libMapping);
        that.libElement = metaObject.libMapping;
        if(that.getGlobalNodePtr().getSfdNode() !== undefined) {
            console.log("testing global ptr: "+that.getGlobalNodePtr().getSfdNode());            
            if(metaObject.libMapping === "" && that.selectedTypeId === 3) {
                that.libElement = "criterion"; //hard coded
            }
            if(metaObject.libMapping === "" && that.selectedTypeId === 2) {
                that.libElement = "action"; //hard coded
            }
            that.getGlobalNodePtr().getSfdNode().setSubClassTypeFromText(that.libElement);
        }

        if (metaObject.actions){
            that.setMetaActions(metaObject.actions);
        }

        if(metaObject.criteriaUnit)
            that.setCriteriaUnit(metaObject.criteriaUnit);
    };

    this.setMetaActions=function(actionPairs){
        this.actionPairs=actionPairs;

    };


    // cldNodes are round so they have a radius
    this.getRadius=function(){
        return defaultRadius;
    };
    this.setRadius=function(val){
        defaultRadius=val;
    };

    this.onMouseOver=function(){

        if (that.mouseEnteredFunc() || that.editingTextElement===true) {
            return;
        }
        that.nodeElement.classed(nodeClass,false);

        if (that.selectedTypeId!==5) {
            that.nodeElement.classed("baseNodeHovered", true);
        }else{
            that.nodeElement.classed("baseNodeHoveredStakeHolder",true);
        }

        var selectedNode = that.rootElement.node(),
            nodeContainer = selectedNode.parentNode;
        nodeContainer.appendChild(selectedNode);

        that.mouseEnteredFunc(true);

        d3.select(this).selectAll("image").attr("display", null);

    };
    this.onMouseOut=function(){
        if (that.mouseButtonPressed===true)
            return;
        that.nodeElement.classed("baseNodeHovered",false);
        that.nodeElement.classed("baseNodeHoveredStakeHolder",false);
        that.nodeElement.classed(nodeClass,true);
        that.mouseEnteredFunc(false);

        d3.select(this).selectAll("image").attr("display", "none");
    };


    this.setSelectionStatus=function(val){
        that.nodeIsFocused=val;
        if (that.getNodeObjectType()===that.GRAPH_OBJECT_NODE) {
            if (that.selectedTypeId!==5) {
                that.nodeElement.classed("focused", val);
            }else {
                that.nodeElement.classed("focusedStakeHolder", val);
            }
            if (val === false)
                graph.hideDraggerElement();
        }
        if (that.getNodeObjectType()===that.OVERLAY_OBJECT_NODE){
            that.nodeElement.classed("overlayToggle", val);
        }
    };



    this.setType=function(typeId, typeName){

        that.selectedTypeId=typeId;
        that.typeName = typeName;

        if(that.typeName === "Criterion")
            that.typeNameForSolver = "criterion";
        else if (that.typeName === "Action")
            that.typeNameForSolver = "action";
        else
            that.typeNameForSolver = "node";
        
        if (typeId===100){
            nodeClass = allPossibleClasses[5];
            that.selectedTypeId=5;
            that.typeName = "Stake Holder";
        }else{
            nodeClass =allPossibleClasses[typeId];            
        }
        //nodeClass=allPossibleClasses[typeId];
        
         // console.log("Node class is"+nodeClass);
         // console.log("Node Type Id"+that.selectedTypeId);
        // apply the classes ;
        if (that.nodeElement){
            for (var i=0;i<allPossibleClasses.length;i++){
                //console.log("disabling :"+allPossibleClasses[i]);
                that.nodeElement.classed(allPossibleClasses[i],false);
            }
            console.log("Setting final class :"+nodeClass);
            that.nodeElement.classed(nodeClass,true);
        }
        that.setTrendStyle(that.getTrend());

        // type update in other widgets
        var friendlyWidget=graph.parentWidget.gtGraphObj;
        var sfdWidget=graph.parentWidget.sfdGraphObj;
        var globalNode=that.getGlobalNodePtr();

        if (typeId===3 && that.getGlobalNodePtr()!=undefined){
            // tell the graph object to add the reference into the cld
            globalNode.setVisibleInWidget(friendlyWidget,true);
            globalNode.setVisibleInWidget(sfdWidget,true);
            var friendlyNode=friendlyWidget.createNode(friendlyWidget);
            var sfdNode=sfdWidget.createFriendlyNode();
            globalNode.setNodeType(friendlyWidget,3,friendlyNode);
            globalNode.setNodeType(sfdWidget,2,sfdNode);
            friendlyNode.setGlobalNodePtr(globalNode);
            sfdNode.setGlobalNodePtr(globalNode);
        }
        // remove the constructed element if type was changed
        if (typeId!=3 && that.getGlobalNodePtr()!=undefined){
            var sfdN=globalNode.getSfdNode();
            if (sfdN)
                sfdN.setType(typeId-1);

            globalNode.removeNodeRepresentationInWidget(friendlyWidget);
        }


    };

    this.setExternalFactors = function() {
        that.setType(4, "External Factor");
    };
}


CLDNode.prototype = Object.create(BaseNode.prototype);
CLDNode.prototype.constructor = CLDNode;
