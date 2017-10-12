/**
 *
 *  We need some assumptions for this to work properly
 *  so here are these
 *  1) cld link are connected only to cld nodes and these are round nodes with a radius which we require!
 *
 *
 *
 * **/

function CLDLink(graph) {
    var that = this;
    BaseLink.apply(this,arguments);

   // console.log("Generating a link with id "+that.id());
    var cldType="unknown";
    this.className = undefined;
    this.name = undefined;
    this.classId = 0;
    this.cldTypeString=undefined;
    this.cldTypeId = 0;
    this.sign = undefined;
    this.isLoop = false;
    that.hoverText="";
    var linkDir=[]; // normal vector;
    var endPos=[]; // end position for the line
    var dynamicLinkWidth=false;
    var loopImg = undefined;

    this.parameters = [];
    this.interfaces = [];

    var startPoint,endPoint,cpPoint;
    var cpDragged = false;


    this.setControlPoint=function(pos){
        // sets the control point position in the widget and tells it that cpDragged is true;
        cpDragged=true;
        cpPoint=pos;
    };

    this.getControlPointPosition=function(){
        return cpPoint;
    };


    this.getControlPointStatus=function(){
        return cpDragged;
    };


    this.getValueString=function(){
        return that.cldTypeString;
    };

    this.type=function(){
        return cldType;
    };

    this.setSelectionStatus=function(val){
        that.elementIsFocused=val;
        that.pathElement.classed("cldLinkSelected", val);

        if (that.rootElement.selectAll("image")!=null) {
            if (val===true) {
                that.rootElement.selectAll("image").attr("display", null);
                that.rootElement.selectAll("ellipse").attr("display", null);
            }
            else{
                that.rootElement.selectAll("image").attr("display", "none");
                that.rootElement.selectAll("ellipse").attr("display", "none");
            }
        }
    };

    this.getTypeId=function() {
        return that.cldTypeId;
    };

    this.source = function (src) {
        this.sourceNode = src;
      //  console.log("Source Add");
        src.addLink(that);
        src.setPortDetails(that.id());

    };
    this.target = function (target) {
      //  console.log("Target Add");
        this.targetNode = target;
        target.addLink(that);
        target.setPortDetails(that.id());
    };


    this.setCLDLinkTypeFromOutside=function(type,value){
        var temp= [undefined, '+', '-', '?', '0']; // hard coded stuff , yeah! -.-


        if (type>=0) {
            that.classId = type;
          //  that.className = className;
        }

        if (value>=0) {
            that.cldTypeId = value;
            that.cldTypeString = temp[value];
        }



    };


    this.setCLDTypeString=function(typeId, typeName){
        that.cldTypeId = typeId;
        that.cldTypeString = typeName;
        // update textRendering element
        if (textRenderingElement)
            textRenderingElement.text(that.cldTypeString);
        if(that.pathElement!== undefined)
            that.pathElement.classed("cldLinkType0", false);
        if(typeName === undefined) {
            that.sign = null;
            that.name = null;
        }
        else if(typeName === '+') {
            that.sign = 1;
            that.name = "plus arrow";
        }
        else if(typeName === '-') {
            that.sign = -1;
            that.name = "minus arrow";
        }
        else if(typeName === '?') {
            that.sign = 2;
            that.name = "ambiguious arrow";
        }
        else if(typeName === '0') {
            that.sign = 0;
            that.name = "stable arrow";
            if(that.pathElement!== undefined)
                that.pathElement.classed("cldLinkType0", true);
        }
    };

    this.setClassType = function(classId, className) {
        that.classId = classId;
        that.className = className;
    };

    this.getClassType = function() {
        return that.classId;
    };

    this.getFinalData = function() {
        //update link's interface
        // console.log("The link id is: "+that.id()+ " port: "+that.targetNode.getPortDetails(that.id()));
        that.interfaces = [ {"connection": [that.sourceNode.id(), "outSign", null], "name":"fromNode", "type": "Sign"}, 
                                {"connection": [that.targetNode.id(), "influences", that.targetNode.getPortDetails(that.id())], "name":"toNode", "type": "Sign"}];
    };

    var arrowHead=undefined;
    var arrowTail=undefined; // testing
    var textRenderingElement=undefined;
    var controlPoints = undefined;
    var cpEllipse = undefined;

    var lineFunction = d3.svg.line()
        .x(function (d) {
            return d.x;
        })
        .y(function (d) {
            return d.y;
        })
        .interpolate("cardinal");

    function calculateMultiLinkPath(start,end, mid, hovered) {
        // compute orthogonal vector;

        var sX=start.x;
        var sY=start.y;
        var eX=end.x;
        var eY=end.y;

        // compute the distance

        var dx=eX-sX;
        var dy=eY-sY;
        var len=Math.sqrt(dx*dx+dy*dy);

        var nX=dx/len;
        var nY=dy/len;

        // compute center;
        var cX=sX+0.5*len*nX;
        var cY=sY+0.5*len*nY;

        // compute orthogonal offset;

        var minOffset=10;
        var maxOffset=50;

        // use half distance
        var offset=0.10*len;

        if (offset<minOffset) offset=minOffset;
        if (offset>maxOffset) offset=maxOffset;

        if(!mid) {
            var fpX=cX;
            var fpY=cY;
        }
        else {
            var fpX=mid.x;
            var fpY=mid.y;
        }

        // compute the starting point offset;
        var soX=fpX-start.x;
        var soY=fpY-start.y;
        // normalize
        var startOffsetLength=Math.sqrt(soX*soX+soY*soY);

        var soXn=soX/startOffsetLength;
        var soYn=soY/startOffsetLength;

        var eoX=fpX-end.x;
        var eoY=fpY-end.y;
        // normalize
        var endOffsetLength=Math.sqrt(eoX*eoX+eoY*eoY);
        var eoXn=eoX/endOffsetLength;
        var eoYn=eoY/endOffsetLength;

        var arrowOffset=10;
        var sourceRadius=that.sourceNode.getRadius();

        if (hovered===true){
            arrowOffset=20;
        }

        var targetRadius=that.targetNode.getRadius()+arrowOffset;

        var fixPoint1 = {"x": start.x+sourceRadius* soXn, "y": start.y+sourceRadius*soYn},
            fixPoint2 = {"x": fpX,      "y": fpY},
            fixPoint3 = {"x": end.x+targetRadius*eoXn,    "y": end.y+targetRadius*eoYn };

        return [fixPoint1, fixPoint2, fixPoint3];
    }

    this.drawElement=function(){
        that.pathElement = that.rootElement.append('path').classed("cldLink",true);
        addArrowHead();
        // addArrowTail();
        // clds have no arrow tails

        if(that.getTypeId() === 4)
            that.pathElement.classed("cldLinkType0", true);

        that.pathElement.append('title').text(that.hoverText);
        that.addMouseEvents();

        startPoint={ x:that.sourceNode.x, y:that.sourceNode.y };
        endPoint  ={ x:that.targetNode.x, y:that.targetNode.y };
        controlPoints=calculateMultiLinkPath(startPoint, endPoint, cpPoint);
        cpPoint={x:controlPoints[1].x, y:controlPoints[1].y};

        cpEllipse = that.rootElement.append("ellipse")
                                .attr("cx", cpPoint.x)
                                .attr("cy", cpPoint.y)
                                .attr("rx", 15)
                                .attr("ry", 10)
                                .attr("display", "none")
                                .classed("controlPoint", true)
                                .call(that.dragControlPoints);

        that.rootElement.append("image")
                        .attr("id", "linkDeleteIcon")
                        .attr("xlink:href", "images/delete.svg")
                        .attr("display", "none")
                        .attr("width", 17)
                        .attr("height", 17)
                        .attr("x", cpPoint.x - 0.5 * 17 - 15)
                        .attr("y", cpPoint.y - 10)
                        .on('click', function() {
                            d3.event.stopPropagation();
                            console.log("this link has to be deleted: "+that.id());
                            graph.handleLinkDeletion(that);
                        });

        addTypeString();
    };

    this.dragControlPoints = d3.behavior.drag()
                            .on("dragstart", function(d) {
                                d3.event.sourceEvent.stopPropagation();
                            })
                            .on("drag", function (d) {
                                cpDragged = true;
                                cpPoint={x:d3.event.x, y:d3.event.y};
                                cpEllipse.attr("cx", cpPoint.x).attr("cy", cpPoint.y);
                                controlPoints[1].x = cpPoint.x;
                                controlPoints[1].y = cpPoint.y;
                                that.pathElement.attr("d", lineFunction(controlPoints));
                                textRenderingElement.attr("x", cpPoint.x).attr("y", cpPoint.y);
                                that.updateElement(0,0);
                                d3.event.sourceEvent.stopPropagation();
                            })
                            .on("dragend", function(d) {
                                that.updateElement(0,0);
                                console.log("drag end ");
                                console.log(cpPoint);
                                d3.event.sourceEvent.stopPropagation();
                            });

    function addTypeString(){
         textRenderingElement=that.rootElement.append("text")
            .classed("text", true)
            .attr("text-anchor", "middle")
            .attr("style", "fill: black")
            .attr("font-size", "35")
            .text(that.cldTypeString)
            .attr("dy", "0.35em");
    }

    this.updateElement=function(dX,dY){
        if (that.pathElement) {
                startPoint={ x:that.sourceNode.x, y:that.sourceNode.y };
                endPoint  ={ x:that.targetNode.x, y:that.targetNode.y };
                if(cpDragged && dY===0 && dX===0) {
                    // cpPoint.x+=dX;
                    // cpPoint.y+=dY;

                    controlPoints = calculateMultiLinkPath(startPoint, endPoint, cpPoint);
                }
            else if(cpDragged && dY!==undefined && dX!==undefined) {
                 cpPoint.x-=dX;
                 cpPoint.y-=dY;
                controlPoints = calculateMultiLinkPath(startPoint, endPoint, cpPoint);
            }
                else {
                    if (cpDragged===false) {

                        controlPoints = calculateMultiLinkPath(startPoint, endPoint);
                        cpPoint.x = controlPoints[1].x;
                        cpPoint.y = controlPoints[1].y;
                    }
                }
                that.pathElement.attr("d", lineFunction(controlPoints));
                textRenderingElement.attr("x", cpPoint.x).attr("y", cpPoint.y - 20);
                cpEllipse.attr("cx", cpPoint.x)
                        .attr("cy", cpPoint.y);
                that.rootElement.selectAll("image").attr("x", cpPoint.x - 0.5 * 17 - 15).attr("y", cpPoint.y - 10);
        }
    };

    this.onClicked = function () {
        console.log("link click");
        if (that.elementIsFocused===false) {
            that.elementIsFocused=true;
            if (!that.pathElement) return;
            that.pathElement.classed("LinkFocused", true);
            graph.handleLinkSelection(that);
            that.rootElement.selectAll("image")
                        .attr("display", null);
            that.rootElement.selectAll("ellipse").attr("display", null);
            return;
        }
        if (that.elementIsFocused===true) {
            that.elementIsFocused=false;
            that.pathElement.classed("LinkFocused", false);
            graph.handleLinkSelection(undefined);
            that.rootElement.selectAll("image")
                        .attr("display", "none");
            that.rootElement.selectAll("ellipse").attr("display", "none");
        }
        that.mouseEnteredFunc(false);
        that.onMouseOver();
    };

    function addArrowHead(){
        if (that.pathElement) {
            var scale=2.0;
            var vx = -14,
                vy = -10,
                lx = 32,
                ly = 20,
                mw = 6*scale,
                mh = 6*scale;
            var sX = 0;
            var sY = 6;

            var m1X = 6;
            var m1Y = 0;

            var m2X = 0;
            var m2Y = -6;
            var viewBoxString = vx + " " + vy + " " + lx + " " + ly;

            arrowHead = that.rootElement.append("marker")
                .attr("id", "arrowHead" + that.id())
                .attr("viewBox", viewBoxString) // temp
                .attr("markerWidth", mw)
                .attr("markerHeight", mh)
                .attr("refX", 0)
                .attr("refY", 0)
                .attr("orient", "auto");
            arrowHead.append("path")
                .attr("d", "M"+sX+","+sY+"L" + m1X + "," + m1Y + "L" + m2X + "," + m2Y +  "Z" )
                .classed("cldArrowHeadStyle",true);
            that.pathElement.attr('marker-end', 'url(#arrowHead' + that.id() + ')');
        }
    }
    function addArrowTail(){
        if (that.pathElement) {
            var scale =2.0,
                vx = -14,
                vy = -10,
                lx = 32,
                ly = 20,
                mw = 6*scale,
                mh = 6*scale;

            var sX = -6;
            var sY = 0;
            var m1X = 0;
            var m1Y = 6;
            var m2X = 0;
            var m2Y = -6;

            var viewBoxString = "" + vx + " " + vy + " " + lx + " " + ly;

            arrowTail = that.rootElement.append("marker")
                .attr("id", "arrowTail" + that.id())
                .attr("viewBox", viewBoxString) // temp
                .attr("markerWidth", mw)
                .attr("markerHeight", mh)
                .attr("refX", 0)
                .attr("refY", 0)
                .attr("orient", "auto");
            arrowTail.append("path")
                .attr("d", "M"+sX+","+sY+"L" + m1X + "," + m1Y + "L" + m2X + "," + m2Y +  "Z" )
                .classed("cldArrowTailStyle",true);
            that.pathElement.attr('marker-start', 'url(#arrowTail' + that.id() + ')');
        }
    }

    this.onMouseOver = function () {

        if (that.mouseEnteredFunc()) {
            return;
        }
        // pull this element ontop
        var selectedNode = that.rootElement.node(),
            nodeContainer = selectedNode.parentNode;
        nodeContainer.appendChild(selectedNode);
        console.log("Mouse Hover over link , Dynamic Link Width"+dynamicLinkWidth);
        if (dynamicLinkWidth==false) {
            if (that.getSelectionStatus() === true) {
                that.pathElement.classed("cldLinkHovered",          false);
                that.pathElement.classed("cldLinkSelected",         false);
                that.pathElement.classed("cldLinkSelectedHovered",  true);
            } else {
                that.pathElement.classed("cldLinkSelected",         false);
                that.pathElement.classed("cldLinkSelectedHovered",  false);
                that.pathElement.classed("cldLinkHovered",          true);

            }
            controlPoints=calculateMultiLinkPath(startPoint, endPoint, cpPoint, true);
            that.pathElement.attr("d", lineFunction(controlPoints));

        }else { // experimental code;
            // if (that.getSelectionStatus() === true) {
            //     that.pathElement.classed("cldLinkSelected", false);
            //     that.pathElement.classed("cldLinkSelectedHovered", false);
            //     that.pathElement.classed("cldLinkHovered", false);
            //     that.pathElement.classed("cldLinkHoveredDynamic", false);
            //     that.pathElement.classed("cldLinkSelectedHoveredDynamic", true);
            //
            // } else {
            //     that.pathElement.classed("cldLinkSelected", false);
            //     that.pathElement.classed("cldLinkSelectedHovered", false);
            //     that.pathElement.classed("cldLinkSelectedHoveredDynamic", false);
            //     that.pathElement.classed("cldLinkHovered", false);
            //     that.pathElement.classed("cldLinkHoveredDynamic", true);
            // }
            // var defSize = 8;
            // var newX, newY;
            // var gZoom = graph.getZoomFactor();
            // if (gZoom > 1.0){
            //     that.pathElement.style("stroke-width", defSize + "px");
            //     newX = endPos[0] - linkDir[0] * 10;
            //     newY = endPos[1] - linkDir[1] * 10;
            //     that.pathElement.attr("x2", newX).attr("y2", newY);
            // } else{
            //     if (gZoom<0.5) gZoom=0.5;
            //     that.pathElement.style("stroke-width", defSize/gZoom + "px");
            //     newX = endPos[0] - linkDir[0] * 11/gZoom;
            //     newY = endPos[1] - linkDir[1] * 11/gZoom;
            //     that.pathElement.attr("x2", newX).attr("y2", newY);
            // }
        }

        that.mouseEnteredFunc(true);
    };


    this.onMouseOut = function () {
        if (dynamicLinkWidth==false) {
            if (that.getSelectionStatus() === true) {
                that.pathElement.classed("cldLinkSelectedHovered", false);
                that.pathElement.classed("cldLinkHovered", false);
                that.pathElement.classed("cldLinkSelected", true);
            } else {
                that.pathElement.classed("cldLinkSelected", false);
                that.pathElement.classed("cldLinkSelectedHovered", false);
                that.pathElement.classed("cldLinkHovered", false);
            }
            controlPoints=calculateMultiLinkPath(startPoint, endPoint, cpPoint, false);
            that.pathElement.attr("d", lineFunction(controlPoints));
        }
        // }else{
        //     if (that.getSelectionStatus() === true) {
        //         that.pathElement.classed("cldLinkSelectedHovered"       , false);
        //         that.pathElement.classed("cldLinkSelectedHoveredDynamic", false);
        //         that.pathElement.classed("cldLinkHovered"               , false);
        //         that.pathElement.classed("cldLinkHoveredDynamic"        , false);
        //         that.pathElement.classed("cldLinkSelected"              , true);
        //
        //     } else {
        //         that.pathElement.classed("cldLinkSelected"              , false);
        //         that.pathElement.classed("cldLinkSelectedHovered"       , false);
        //         that.pathElement.classed("cldLinkSelectedHoveredDynamic", false);
        //         that.pathElement.classed("cldLinkHovered"               , false);
        //         that.pathElement.classed("cldLinkHoveredDynamic"        , false);
        //     }
        //     that.pathElement.style("stroke-width","4px");
        //     // restore position;
        //
        //
        // }
        that.mouseEnteredFunc(false);
    };

    this.setLoopStyle = function(ret) {
        that.isLoop = true;
        if(ret === "Balancing") {
            that.pathElement.classed("feedbackLoopsNegative", true);
            loopImg = "images/loopBalance.png";
        }
        else if (ret === "Reinforcing") {
            that.pathElement.classed("feedbackLoopsPositive", true);
            loopImg = "images/loopReinforce.png";
        }        
        that.pathElement.on("contextmenu", that.onLoopContextMenu);
    };

    this.onLoopContextMenu = function() {
        console.log("right click on a loop is clicked");

        d3.event.preventDefault();
        that.rootElement.selectAll("image").attr("display", "none");

        var menu = [
            {
                title: 'Feedback Loop Symbol',
                action: function() {

                    that.rootElement.append("image")
                        .attr("id", "loop")
                        .attr("xlink:href", loopImg)
                        .attr("display", null)
                        .attr("width", 50)
                        .attr("height", 50)
                        .attr("x", cpPoint.x - 0.5 * 17)
                        .attr("y", cpPoint.y - 0.5 * 17);
                }
            },
            {
                title: 'Delete Link',
                action: function() {
                    console.log("This link has to be deleted: "+that.id());
                    graph.handleLinkDeletion(that);
                }
            }
        ];

        d3.selectAll(".loopContextMenu").data([1]).enter()
            .append('div')
            .attr('class', 'loopContextMenu');

        d3.selectAll(".loopContextMenu").html('');
        var items = d3.selectAll(".loopContextMenu").append('ul').classed('list-group', true);
        items.selectAll('li').data(menu).enter()
            .append('li')
            .html(function(d) {
                return d.title;
            })
            .classed('list-group-item', true)
            .on('click', function(d) {
                d.action();
                d3.select('.loopContextMenu').style('display', 'none');
            });

        d3.select('.loopContextMenu')
            .style('left', (d3.event.pageX - 2) + 'px')
            .style('top', (d3.event.pageY - 2) + 'px')
            .style('display', 'block');

        d3.select('body').on('click.loopContextMenu', function() {
            d3.select('.loopContextMenu').style('display', 'none');
        });
    };

}

CLDLink.prototype = Object.create(BaseLink.prototype);
CLDLink.prototype.constructor = CLDLink;
