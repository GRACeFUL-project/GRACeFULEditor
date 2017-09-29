
function GTNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
    this.elementWidth=80;
    this.elementHeight=50;
    this.goalType = undefined;
   // this.parentWidget=parentWidget; // tells the graph which widget it talks to
    BaseNode.apply(this,arguments);
    this.goalTypeId = 1;
    var goalClass="baseRoundNode";
    var allGoalClasses=['undefined','goalOptionA','goalOptionB','goalOptionC', 'goalOptionD'];
    this.allClasss=["Undefined", "Goal", "Sub Goal", "Criteria", "Stakeholder"];
    this.criteriaUnit = "";

    this.getTypeId=function(){
      return that.goalTypeId;
    };

    this.setTypeId=function(id){
      that.goalTypeId=id;
    };

    this.getImageURL=function(){
      if(that.goalTypeId==0)
       return "./images/nodes/undefined.png";
      else if(that.goalTypeId==1)
        return "./images/nodes/goal.png";
      else if(that.goalTypeId==2)
       return "./images/nodes/subgoal.png";
      else if(that.goalTypeId==3)
       return "./images/nodes/criteria.png"
      else if(that.goalTypeId==4)
       return "./images/nodes/stakeholder.png";
    };

    this.setType=function(typeId, typeName){
        that.goalTypeId=typeId;
        goalClass=allGoalClasses[typeId];
        that.goalType = typeName;
        console.log("Goal class is"+goalClass);
        // apply the classes ;
        if (that.nodeElement){
            for (var i=0;i<allGoalClasses.length;i++){
                console.log("disabling :"+allGoalClasses[i]);
                that.nodeElement.classed(allGoalClasses[i],false);
            }
            console.log("Setting final class :"+goalClass);
            that.nodeElement.classed(goalClass,true);
        }
    }

    this.setLabelText=function(val){
        this.label=val;

        if (this.toolTipElement && (this.label.length > that.DISPLAY_LABEL_LENGTH) ){
          this.toolTipElement.text(this.label);
        }
    };

    this.clearLabelText=function(){
        this.toolTipElement.text("");
    }

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
        d3.select("#gtChipField").text(val);
    };

    this.drawNode=function(){

        that.nodeElement= that.rootNodeLayer.append('rect')
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("x", -0.5*that.elementWidth)
            .attr("y", -0.5*that.elementHeight)
            .attr("width", that.elementWidth)
            .attr("height", that.elementHeight)
            .classed("baseRoundNode",true)
            .classed(goalClass, true);

        // add hover text if you want
        if (that.hoverTextEnabled===true)
            that.rootNodeLayer.append('title').text(that.hoverText);

        // add title
        that.labelRenderingElement=  that.rootNodeLayer.append("text")
            .attr("text-anchor","middle")
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
            .attr("x", 0.5*that.elementWidth-10)
            .attr("y", -0.5*that.elementHeight)
            .attr("width", 17)
            .attr("height", 17)
            .attr("cursor", "pointer")
            .on('click', function() {
                d3.event.stopPropagation();
                graph.handleNodeDeletion(that);
            });
    };


    this.onMouseOver=function(){
        if (that.mouseEnteredFunc() || that.editingTextElement===true) {
            return;
        }
        that.nodeElement.classed(goalClass,false);
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
        that.nodeElement.classed(goalClass,true);
        that.mouseEnteredFunc(false);

        d3.select(this).selectAll("image").attr("display", "none");
    };

    this.setCriteriaUnit = function(text) {
        that.criteriaUnit = text;
        console.log("the unit is:"+ text);
    }

}


GTNode.prototype = Object.create(BaseNode.prototype);
GTNode.prototype.constructor = GTNode;
