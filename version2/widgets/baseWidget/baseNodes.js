var nodeId = 0;

function BaseNode(graph) {
    // todo: think about a parent widget
    /** variable defs **/
    var that = this;
   // this.parentWidget=parentWidget; // tells the graph which widget it talks to

    this.nodeId = nodeId++;
    this.label = "empty";
    this.x = 0;
    this.y = 0;
    this.rootElement=undefined;
    this.rootNodeLayer=undefined;
    this.hoverText="HoverText of Node";
    this.hoverTextEnabled=true;
    var mouseEntered=false;
    var mouseButtonPressed=false;
    var nodeElement=undefined;
    var labelRenderingElement=undefined;
    var fobj=undefined;
    var drX=50;
    var drY=0;
    var id;
    var type="Node";
    var assosiatedLinks=[];


    this.addLink=function(aLink){
        assosiatedLinks.push(aLink);
        console.log("adding a link to "+that.id());
    };

    this.type=function(){
        return type;
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
    };
    this.setLabelText=function(val){
        this.label=val;
    };
    this.enableHoverText=function(){
        this.hoverTextEnabled=true;
        //graph.forceGraphRedraw();
    };
    this.disableHoverText=function(){
        this.hoverTextEnabled=false;
        //graph.forceGraphRedraw();
    };



    /** DRAWING FUNCTIONS ------------------------------------------------- **/
    this.drawNode=function(){
      nodeElement= that.rootNodeLayer.append('circle').attr("r", 50)
            .classed("baseRoundNode",true);

        // add hover text if you want
        if (that.hoverTextEnabled===true)
            that.rootNodeLayer.append('title').text(that.hoverText);

        // add title
        labelRenderingElement=  that.rootNodeLayer.append("text")
            .attr("text-anchor","middle")
            .text(that.label)
            .on("click",function(){
                console.log("Should pop up edit window");
                 d3.event.stopPropagation();
                 that.executeUserDblClick();
             })
            .on("focuslost",function(){
                console.log("lost focusoO ");
            })

        ;

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
        nodeElement.style("cursor","move");
        nodeElement.classed("baseNodeHovered",true);
        mouseButtonPressed=true;
    };

    this.mouseUp=function(){
        nodeElement.style("cursor","auto");
        mouseButtonPressed=false;
    };


    this.mouseEntered=function(p){
        if (!arguments.length) return mouseEntered;
        mouseEntered = p;
        return this;
    };
    this.onMouseOver=function(){
        if (that.mouseEntered()) {
            return;
        }
        nodeElement.classed("baseNodeHovered",true);
        var selectedNode = that.rootElement.node(),
            nodeContainer = selectedNode.parentNode;
        nodeContainer.appendChild(selectedNode);

        that.mouseEntered(true);

    };
    this.onMouseOut=function(){
        if (mouseButtonPressed===true)
            return;
        nodeElement.classed("baseNodeHovered",false);
        that.mouseEntered(false);
    };
    this.onClicked=function(){
        console.log("single click");
        graph.createDraggerElement(that);
        d3.event.stopPropagation();
        // nodeElement.classed("focused",);
    };
    this.executeUserDblClick=function(){
        // TODO: more things related to the positioning of the elements;
        d3.event.stopPropagation();

        if (fobj!=undefined){
            fobj.remove();
        }
        labelRenderingElement.classed("hidden",true);
        fobj= that.rootNodeLayer.append("foreignObject")
            .attr("x","-50")
            // .attr("y","-30")
            .attr("y","-10")
            .attr("height", 100)
            .attr("width", 100);
        var editText=fobj.append("xhtml:p")
            .attr("id", that.id())
            .attr("align","center")
            .attr("contentEditable", "true")
            .text(that.label);

        var txtNode=editText.node();
        // var range = document.createRange();
        // range.selectNodeContents(txtNode);
        // var sel = window.getSelection();
        // sel.removeAllRanges();
        // sel.addRange(range);
        txtNode.focus();
        txtNode.click();
       //.focus();
        // /fobj.node().click();
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
            labelRenderingElement.classed("hidden",false);
           // graph.forceRedrawContent();


        });



    };

}

BaseNode.prototype.constructor = BaseNode;
