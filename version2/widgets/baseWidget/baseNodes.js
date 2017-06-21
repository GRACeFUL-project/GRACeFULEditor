var nodeId = 0;

function BaseNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
   // this.parentWidget=parentWidget; // tells the graph which widget it talks to

    this.nodeId = nodeId++;
    this.elementType="NodeElement";
    this.label = "empty";
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
    this.labelRenderingElement=undefined;
    var fobj=undefined;
    var drX=50;
    var drY=0;
    var id;
    var type="Node";
    var assosiatedLinks=[];
    var txtNode=undefined;
    this.elementWidth=100; // 2*radius
    this.nodeIsFocused=false;

    this.getElementType=function(){
        return that.elementType;
    };

    this.addLink=function(aLink){
        assosiatedLinks.push(aLink);
        console.log("adding a link to "+that.id());
    };

    this.type=function(){
        return type;
    };


    this.getSelectionStatus=function(){
        return that.nodeIsFocused;
    };
    this.setSelectionStatus=function(val){
        that.nodeIsFocused=val;
        that.nodeElement.classed("focused", val);
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
        this.hoverText=val;
        if (that.rootNodeLayer){
            that.rootNodeLayer.select("title").text(that.hoverText);
        }
    };
    this.setLabelText=function(val){
        this.label=val;
        if (this.labelRenderingElement){
            this.labelRenderingElement.text(that.label);
        }
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
      this.nodeElement= that.rootNodeLayer.append('circle').attr("r", 50)
            .classed("baseRoundNode",true);

        // add hover text if you want
        if (that.hoverTextEnabled===true)
            that.rootNodeLayer.append('title').text(that.hoverText);

        // add title
        this.labelRenderingElement=  that.rootNodeLayer.append("text")
            .attr("text-anchor","middle")
            .text(that.label)
            .style("cursor","default");
    };


    this.updateElement=function(){
        that.rootElement.attr("transform", "translate(" + that.x + "," + that.y + ")");

        for (var i=0;i<assosiatedLinks.length;i++){
            if (assosiatedLinks[i])
                assosiatedLinks[i].updateElement();
        }

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
        that.mouseEnteredFunc(false);
    };
    this.onClicked=function(){
        console.log("single click");
        graph.createDraggerElement(that);


        d3.event.stopPropagation();

        if (that.nodeIsFocused===false) {
            that.nodeIsFocused=true;
            that.nodeElement.classed("focused", true);
            graph.selectNode(that);
            console.log("this node is focused?"+that.nodeIsFocused);
            return;
        }
        if (that.nodeIsFocused===true) {
            that.nodeIsFocused=false;
            that.nodeElement.classed("focused", false);
            graph.selectNode(undefined);
        }



    };
    this.executeUserDblClick=function(){
        // TODO: more things related to the positioning of the elements;
        d3.event.stopPropagation();

        if (fobj!=undefined){
            fobj.remove();
        }
        that.labelRenderingElement.classed("hidden",true);
        fobj= that.rootNodeLayer.append("foreignObject")
            .attr("x",-0.5*that.elementWidth)
            // .attr("y","-30")
            .attr("y","-12")
            .attr("height", 200)
            .attr("width", that.elementWidth);
        var editText=fobj.append("xhtml:p")
            .attr("id", that.id())
            .attr("align","center")
            .attr("contentEditable", "true")
            .text(that.label);

        txtNode=editText.node();
      // add some events that relate to this object
        editText.on("mousedown", function(){d3.event.stopPropagation();})
            .on("keydown", function(){
                d3.event.stopPropagation();
                if (d3.event.keyCode ==13){
                    this.blur();

                 }
             })
        .on("blur", function(){
            that.setLabelText(this.textContent);
            // remove the object and redraw the node;
            fobj.remove();
            that.labelRenderingElement.classed("hidden",false);
            graph.forceRedrawContent();
            editText.remove();
            that.editingTextElement=false;
            graph.selectNode(that);

        });


        setTimeout(function() {
            var range;
            txtNode.focus();
            if ( document.selection ) {
                range = document.body.createTextRange();
                range.moveToElementText( txtNode  );
                range.select();
            } else if ( window.getSelection ) {
                range = document.createRange();
                range.selectNodeContents( txtNode );
                window.getSelection().removeAllRanges();
                window.getSelection().addRange( range );
                that.editingTextElement=true;
            }
        }, 0);

    };

    this.editInitialText=function(){
        if (!txtNode)
            that.executeUserDblClick();


    }

}

BaseNode.prototype.constructor = BaseNode;
