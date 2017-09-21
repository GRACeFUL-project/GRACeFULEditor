

function CLDNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
    var defaultRadius=50;
   // this.parentWidget=parentWidget; // tells the graph which widget it talks to
    BaseNode.apply(this,arguments);
    var nodeClass="baseRoundNode";
    this.selectedTypeId=1;
    this.typeName = undefined;
    var allPossibleClasses=['undefined','nodeOptionA','nodeOptionB','nodeOptionC', 'externalFactors'];
    this.allClasss=["Undefined", "Factor", "Action", "Criteria", "External Factor"];

    this.isObserved = false;
    this.trendId = 0;
    this.trendName = null;
    this.numIn = 0;
    this.interfaces = [];
    this.parameters = [];

    var portId = 0;
    this.ports = [];

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
       return "./images/nodes/criteria.png"
      else if(that.selectedTypeId==4)
       return "./images/nodes/extFactor.png";
    };

    this.setLabelText=function(val){
        this.label=val;
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

    this.setPortDetails = function(id) {
        var obj = {};
        obj.linkId = id;
        obj.value = portId++;
        that.ports.push(obj);  

        // console.log("The node is: "+ that.id()+"The link is: "+obj.linkId+ " value: "+obj.value);
    };

    this.getPortDetails = function(id) {

        // console.log("id is: "+id+"Port details: "+JSON.stringify(that.ports, null, ''));
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
        //updating node's interfaces
        for(var i=0; i<that.assosiatedLinks.length; i++) {
            var t = that.assosiatedLinks[i];

            if(t.sourceNode.id() === that.id()) {
                var p = that.interfaces.find(function(temp) {
                    return temp.name === "outSign";
                });
                console.log("P: "+p);
                if(p === undefined) {
                    var q={};
                    q.name = "outSign";
                    // q.type = [t.sign];
                    q.type = "Sign";
                    that.interfaces.push(q); 
                }
                else {
                    // p.type.push(t.sign);
                }
            }

            if(t.targetNode.id() === that.id()) {
                that.numIn++;

                var p = that.interfaces.find(function(temp) {
                    return temp.name === "influences";
                });
                console.log("P: "+p);
                if(p === undefined) {
                    var q={};
                    q.name = "influences";
                    // q.type = [t.sign];
                    q.type = "[Sign]";
                    that.interfaces.push(q); 
                }
                else {
                    // p.type.push(t.sign);
                }

                var a = that.interfaces.find(function(temp) {
                    return temp.name === "outSign";
                });
                console.log("A: "+a);
                if(a === undefined) {
                    var b={};
                    b.name = "outSign";
                    // q.type = [t.sign];
                    b.type = "Sign";
                    that.interfaces.push(b); 
                }
                else {
                    // p.type.push(t.sign);
                }
            }
        }
        //updating nodes's parameters
        this.parameters = [];
        var param1 = {"name": "obsSign", "value": that.trendName, "type": "Maybe Sign"};
        that.parameters.push(param1);
        var param2 = {"name": "numIn", "value": that.numIn, "type": "Int"};
        that.parameters.push(param2);
    };

    this.setTrend = function(tid) {
        that.trendId = tid;
        // that.trendName = tname;
        if(tid == 0)
            that.trendName = null;
        else if(tid == 1)
            that.trendName = 2;
        else if(tid == 2)
            that.trendName = -1;
        else if(tid == 3)
            that.trendName = 1;
        else if(tid == 4)
            that.trendName = 0;
    };

    this.getTrend = function() {
        return that.trendId;
    };

    this.drawNode=function(){

        that.nodeElement= that.rootNodeLayer.append('circle')
            .attr("r", that.getRadius())
            .classed("baseRoundNode",true)
            .classed(nodeClass,true);

            console.log("THE NODE CLASS IS ::: ****"+nodeClass);
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

        //add delete image
        that.rootNodeLayer.append("image")
            .attr("xlink:href", "images/delete.svg")
            .attr("display", "none")
            .attr("x", that.getRadius()/2)
            .attr("y", -(that.getRadius())+5)
            .attr("width", 17)
            .attr("height", 17)
            .attr("cursor", "pointer")
            .on('click', function() {
                d3.event.stopPropagation();
                graph.handleNodeDeletion(that);
            });
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
        that.nodeElement.classed("baseNodeHovered",true);

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
        that.nodeElement.classed(nodeClass,true);
        that.mouseEnteredFunc(false);

        d3.select(this).selectAll("image").attr("display", "none");
    };


    this.setType=function(typeId, typeName){
        that.selectedTypeId=typeId;
        nodeClass=allPossibleClasses[typeId];
        that.typeName = typeName;
        console.log("Node class is"+nodeClass);
        // apply the classes ;
        if (that.nodeElement){
            for (var i=0;i<allPossibleClasses.length;i++){
                console.log("disabling :"+allPossibleClasses[i]);
                that.nodeElement.classed(allPossibleClasses[i],false);
            }
            console.log("Setting final class :"+nodeClass);
            that.nodeElement.classed(nodeClass,true);
        }
    };

    this.setExternalFactors = function() {
        that.setType(allPossibleClasses.length - 1, "External Factor");
    };
}


CLDNode.prototype = Object.create(BaseNode.prototype);
CLDNode.prototype.constructor = CLDNode;
