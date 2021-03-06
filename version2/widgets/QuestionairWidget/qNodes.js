var nodeId = 0;

function BaseNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
   // this.parentWidget=parentWidget; // tells the graph which widget it talks to

    // some constants;

    this.GRAPH_OBJECT_NODE="GraphObjectNode";
    this.OVERLAY_OBJECT_NODE="OverlayNode";
    this.DISPLAY_LABEL_LENGTH=14;
    this.DISPLAY_LABEL_LIMIT=10;

    this.nodeClass="baseRoundNode";

    this.nodeId = graph.idInNumber++;
    this.elementType="NodeElement";
    this.label = "empty";
    this.displayLabel = "empty";
    this.x = 0;
    this.y = 0;
    this.rootElement=undefined;
    this.rootNodeLayer=undefined;
    this.hoverText="";
    this.hoverTextEnabled=true;
    this.mouseEntered=false;
    this.mouseButtonPressed=false;
    this.editingTextElement=false;
    this.nodeElement=undefined;
    this.toolTipElement=undefined;
    this.labelRenderingElement=undefined;
    var fobj=undefined;
    var drX=50;
    var drY=0;
    var id;
    var type="Node";
    this.assosiatedLinks=[];
    var txtNode=undefined;
    this.elementWidth=100; // 2*radius
    this.nodeIsFocused=false;
    this.nodeObjectType=that.GRAPH_OBJECT_NODE;
    this.globalNodePtr=undefined;

    this.setGlobalNodePtr=function(gptr){

        this.globalNodePtr=gptr;
    };

    this.getGlobalNodePtr=function(){
        return this.globalNodePtr;
    };

    this.getNodeObjectType=function(){
        return that.nodeObjectType;
    };
    this.setNodeObjectTypeToOverlay=function(){
        that.nodeObjectType=that.OVERLAY_OBJECT_NODE;
    };

    this.getElementType=function(){
        return that.elementType;
    };

    this.addLink=function(aLink){
        that.assosiatedLinks.push(aLink);
       // console.log("adding a link to "+that.id());
    };

    this.type=function(){
        return type;
    };


    this.getSelectionStatus=function(){
        return that.nodeIsFocused;
    };
    this.setSelectionStatus=function(val){
        that.nodeIsFocused=val;
        if (that.getNodeObjectType()===that.GRAPH_OBJECT_NODE) {
            that.nodeElement.classed("focused", val);
            if (val === false)
                graph.hideDraggerElement();
        }
        if (that.getNodeObjectType()===that.OVERLAY_OBJECT_NODE){
            that.nodeElement.classed("overlayToggle", val);
        }
    };

/** BASE HANDLING FUNCTIONS ------------------------------------------------- **/
    this.id=function(index) {
        if (!arguments.length) {
            return that.nodeId;
        }
        this.nodeId=index;
    };


    this.svgRoot=function(root){
        if (!arguments.length)
            return that.rootElement;


        that.rootElement=root;
        that.rootNodeLayer=that.rootElement.append('g');
        that.addMouseEvents();
    };

    this.setHoverText=function(val){
      //set the label content based on the length of text content

        this.hoverText=val;
        if (that.rootNodeLayer){
            that.rootNodeLayer.select("title").text(that.hoverText);
        }
    };
    this.setLabelText=function(val){
        this.label= val;

        if (this.getGlobalNodePtr()!=undefined){
            console.log(this.getGlobalNodePtr());
            this.getGlobalNodePtr().setGlobalName(val);
        }

        if (this.toolTipElement && (this.toolTipElement > this.DISPLAY_LABEL_LENGTH)){
            this.toolTipElement.text(that.label);

        }
    };

     this.clearLabelText=function(){
        this.toolTipElement.text("");
     };

    this.setDisplayLabelText=function(val){
        this.displayLabel= val;
        this.displayLabel.slice(0,that.DISPLAY_LABEL_LIMIT).concat("...");
        if (this.labelRenderingElement){
            this.labelRenderingElement.text(that.displayLabel);
        }
    };

    this.clearDisplayLabelText=function(){
      this.labelRenderingElement.text("");
    };

    this.setChipText=function(val) {
        //update the chip text of the node in the controls tab
    };

    this.setPosition=function(x,y){
        that.x=x;
        that.y=y;
    };

    this.enableHoverText=function(){
        this.hoverTextEnabled=true;
        //graph.forceGraphRedraw();
    };
    this.disableHoverText=function(){
        this.hoverTextEnabled=false;
        //graph.forceGraphRedraw();
    };


    this.setTestClass=function(cssName,value){
        if (that.nodeElement){
            that.nodeElement.classed(cssName,value);
        }
    };

    /** DRAWING FUNCTIONS ------------------------------------------------- **/
    this.drawNode=function(){
      //each element on dom that can be manipulated should have a uniqueId
      var uniqueId = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();

      that.nodeElement= that.rootNodeLayer.append('circle').attr("r", 50)
            .attr("id", uniqueId)
            .classed(that.nodeClass,true);

        // add hover text if you want
        if (that.hoverTextEnabled===true)
            that.rootNodeLayer.append('title').text(that.hoverText);

        // add title
        var tempDisplayLabel = that.displayLabel;

        if( that.displayLabel.length > that.DISPLAY_LABEL_LENGTH )
          tempDisplayLabel = tempDisplayLabel.slice(0,that.DISPLAY_LABEL_LIMIT).concat("...");

        that.labelRenderingElement=  that.rootNodeLayer.append("text")
            // .attr("fill","red")
            .attr("text-anchor","middle")
            .text(tempDisplayLabel)
            .style("cursor","default");

        that.toolTipElement = that.nodeElement.append('title');

        //add tooltip
        if( that.label.length > that.DISPLAY_LABEL_LENGTH   )
          that.toolTipElement.text(that.label);

    };


    this.updateElement=function(dX,dY){
        that.rootElement.attr("transform", "translate(" + that.x + "," + that.y + ")");
        // console.log("numbe of assosiadedLinks"+that.assosiatedLinks.length);
        // console.log(that.assosiatedLinks);
        for (var i=0;i<that.assosiatedLinks.length;i++){
            // if (assosiatedLinks[i])
                that.assosiatedLinks[i].updateElement(dX,dY);
        }

    };


    this.updateAssisiatedLinks=function(){
        var remainingLink=[];
        for (var i=0;i<that.assosiatedLinks.length;i++){
            console.log("assosiatedLinks: "+that.assosiatedLinks[i]);
            if (that.assosiatedLinks[i])
                remainingLink.push(that.assosiatedLinks[i]);
        }

        that.assosiatedLinks=remainingLink;

    };

    this.sayHello=function(){
        console.log("Hello Node")
    };

/** MOUSE HANDLING FUNCTIONS ------------------------------------------------- **/

    this.addMouseEvents=function(){
        // console.log("adding mouse events");
        that.rootNodeLayer.on("mouseover", that.onMouseOver)
                    .on("mouseout", that.onMouseOut)
                    .on("click", that.onClicked)
                    .on("dblclick",that.executeUserDblClick)
                    .on("mousedown",that.mouseDown)
                     .on("mouseup",that.mouseUp);


    };

    this.mouseDown=function(){
        that.nodeElement.style("cursor","move");
        that.nodeElement.classed("baseNodeHovered",true);
        that.mouseButtonPressed=true;
    };

    this.mouseUp=function(){
        that.nodeElement.style("cursor","auto");
        that.mouseButtonPressed=false;
    };


    this.mouseEnteredFunc=function(p){
        if (!arguments.length) return that.mouseEntered;
        that.mouseEntered = p;
        return this;
    };
    this.onMouseOver=function(){

        if (that.mouseEnteredFunc() || that.editingTextElement===true) {
            return;
        }
        that.nodeElement.classed(that.nodeClass,false);
        that.nodeElement.classed("baseNodeHovered",true);
        var selectedNode = that.rootElement.node(),
            nodeContainer = selectedNode.parentNode;
        nodeContainer.appendChild(selectedNode);

        that.mouseEnteredFunc(true);

    };
    this.onMouseOut=function(){
        if (that.mouseButtonPressed===true)
            return;
        that.nodeElement.classed("baseNodeHovered",false);
        that.nodeElement.classed(that.nodeClass,true);
        that.mouseEnteredFunc(false);
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
                that.nodeElement.classed("focused", true);
                graph.selectNode(that);
                graph.createDraggerElement(that);
         //       console.log("this node is focused?" + that.nodeIsFocused);
                return;
            }
            if (that.nodeIsFocused === true) {
                that.nodeIsFocused = false;
                that.nodeElement.classed("focused", false);
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
    this.executeUserDblClick=function(){
        // TODO: more things related to the positioning of the elements;
        d3.event.stopPropagation();
        graph.hideDraggerElement();
        graph.selectNode(undefined);
        graph.selectNode(that);
        that.nodeElement.classed("focused", true);
        if (fobj!=undefined){
            that.rootNodeLayer.selectAll(".foreignelements").remove();
        }
        that.editingTextElement=true;
        that.labelRenderingElement.classed("hidden",true);
        fobj= that.rootNodeLayer.append("foreignObject")
            .attr("x",-0.5*that.elementWidth)
            // .attr("y","-30")
            .attr("y","-12")
            .attr("height", 200)
            .attr("class","foreignelements")
            .on("dragstart",function(){return false;}) // remove drag operations of text element)
            .attr("width", that.elementWidth);

        var editText=fobj.append("xhtml:body")
            .attr("class","bodyNode")
            .append('span')
            .attr("id", that.id())
            .attr("align","center")
            .attr("contentEditable", "true")
            .attr("class","editingxhtml")
            .on("dragstart",function(){return false;}) // remove drag operations of text element)
            .text(that.label);

        txtNode=editText.node();
      // add some events that relate to this object
        editText.on("mousedown", function(){
            d3.event.stopPropagation();})
            .on("keydown", function(){
                d3.event.stopPropagation();
                if (d3.event.keyCode ==13){
                    this.blur();
                    that.nodeElement.classed("focused", true);
                    that.nodeIsFocused=true;
                 }

             })
        .on("blur", function(){
       //     console.log("CALLING BLUR FUNCTION ----------------------"+d3.event);
            txtNode.layerX=that.x;
            txtNode.layerY=that.y;
            that.setLabelText(this.textContent);
            that.setDisplayLabelText(this.textContent);
            // remove the object and redraw the node;

            that.rootNodeLayer.selectAll(".foreignelements").remove();
            that.labelRenderingElement.classed("hidden",false);


            graph.forceRedrawContent();
            that.editingTextElement=false;

            // pseude cklick on the graph
            graph.simulateClickOnGraph();
            console.log(d3.event);
            that.setChipText(this.textContent);
        });


        setTimeout(function() {
            var range;
            txtNode.focus();
            that.editingTextElement=true;
            txtNode.ondragstart=function(){return false;};
            if ( document.selection ) {
                range = document.body.createTextRange();
                range.moveToElementText( txtNode  );
                range.select();
            } else if ( window.getSelection ) {
                range = document.createRange();
                range.selectNodeContents( txtNode );
                window.getSelection().removeAllRanges();
                window.getSelection().addRange( range );
            }
        }, 0);

    };

    this.editInitialText=function(){
        if (!txtNode)
            that.executeUserDblClick();
    }

}

BaseNode.prototype.constructor = BaseNode;
