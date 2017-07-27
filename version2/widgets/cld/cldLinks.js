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

    // constants
    var SINGLE_LINK=0;
    var MULTI_LINK=1;

    console.log("Generating a link with id "+that.id());
    var cldType="unknown";
    this.className = undefined;
    this.classId = 0;
    this.cldTypeString=undefined;
    this.cldTypeId = 0;
    that.hoverText="";
    var linkDir=[]; // normal vector;
    var endPos=[]; // end position for the line
    var dynamicLinkWidth=false;
    var linkType=SINGLE_LINK;

    var startPoint,endPoint;

    this.getLinkType=function () {
        return linkType;
    };
    this.setLinkType=function(multilink){
      linkType=multilink;
    };


    this.type=function(){
        return cldType;
    };
    this.setSelectionStatus=function(val){
        that.elementIsFocused=val;
        that.pathElement.classed("cldLinkSelected", val);

        // remove the image element
        if (that.rootElement.selectAll("image")!=null) {
            if (val===true)
                that.rootElement.selectAll("image").attr("display", null);
            else{
                that.rootElement.selectAll("image").attr("display", "none");
            }
        }

    };


    this.getTypeId=function() {
        // if (that.cldTypeString === "?") return 0;
        // if (that.cldTypeString === "+") return 1;
        // if (that.cldTypeString === "-") return 2;
        return that.cldTypeId;
    };

    this.setCLDTypeString=function(typeId, typeName){
        that.cldTypeId = typeId;
        that.cldTypeString = typeName;
        // if (val === 0) that.cldTypeString="?";
        // if (val === 1) that.cldTypeString="+";
        // if (val === 2) that.cldTypeString="-";

        // update textRendering element
        if (textRenderingElement)
            textRenderingElement.text(that.cldTypeString);
    };

    this.setClassType = function(classId, className) {
        that.classId = classId;
        that.className = className;
    };

    this.getClassType = function() {
        return that.className;
    };



    var arrowHead=undefined;
    var arrowTail=undefined; // testing
    var textRenderingElement=undefined;


    var lineFunction = d3.svg.line()
        .x(function (d) {
            return d.x;
        })
        .y(function (d) {
            return d.y;
        })
        .interpolate("cardinal");


    function calculateMultiLinkPath(start,end,hovered) {
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

        var fpX=cX+offset*nY;
        var fpY=cY-offset*nX;

        // console.log("fp1:" +start.x +" "+start.y );
        // console.log("fp2:" +fpX +" "+fpY );
        // console.log("fp3:" +end.x +" "+end.y );

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


    function calculateSingleLinkPath(start,end) {
        var fixPoint1 = {"x": start.x , "y": start.y},
            fixPoint2 = {"x": end.x,    "y": end.y };
        return [fixPoint1, fixPoint2];
    }


    this.drawElement=function(){
        that.pathElement = that.rootElement.append('path').classed("cldLink",true);
        addArrowHead();
        // addArrowTail();
        addTypeString();
        // clds have no arrow tails
        // addArrowTail();
        that.pathElement.append('title').text(that.hoverText);
        that.addMouseEvents();
        //add delete image

        var dx=that.targetNode.x-that.sourceNode.x;
        var dy=that.targetNode.y-that.sourceNode.y;

        that.rootElement.append("image")
            .attr("id", "linkDeleteIcon")
            .attr("xlink:href", "images/delete.png")
            .attr("display", "none")
            .attr("width", 17)
            .attr("height", 17)
            .attr("x", that.sourceNode.x + 0.5*(dx)-0.5*17)
            .attr("y", that.sourceNode.y + 0.5*(dy)-0.5*17)
            .on('click', function() {
                d3.event.stopPropagation();
                console.log("This link has to be deleted: "+that.id());
                graph.handleLinkDeletion(that);
            });
    };

    function addTypeString(){
         textRenderingElement=that.rootElement.append("text")
            .classed("text", true)
            .attr("text-anchor", "middle")
            .attr("style", "fill: black")
            .text(that.cldTypeString);
    }

    this.updateElement=function(){
        if (that.pathElement) {
            // console.log("updating element");
            var radiusOfSource=that.sourceNode.getRadius();
            var radiusOfTarget=that.targetNode.getRadius();

            // compute normal distance vector form source to target;
            var dx=that.targetNode.x-that.sourceNode.x;
            var dy=that.targetNode.y-that.sourceNode.y;
            var nLen=Math.sqrt(dx*dx+dy*dy);
            if(nLen) {
                // get normalized offset vector;
                var nX = dx / nLen;
                var nY = dy / nLen;
                var tailOffset = 0;
                var headOffset = 0;
                var scale=0;
                if (arrowTail!=undefined) {
                    scale = arrowTail.attr("markerHeight") / 6;
                    tailOffset = parseInt(arrowTail.attr("markerHeight")) - scale;
                }
                if (arrowHead) {
                    scale = arrowHead.attr("markerHeight") / 6;
                    headOffset = parseInt(arrowHead.attr("markerHeight"))-scale;
                }

                var sX=that.sourceNode.x+nX*(radiusOfSource+tailOffset);
                var sY=that.sourceNode.y+nY*(radiusOfSource+tailOffset);

                var eX=that.sourceNode.x+nX*(nLen-radiusOfTarget-headOffset);
                var eY=that.sourceNode.y+nY*(nLen-radiusOfTarget-headOffset);


                // find center position of the element
                var tdx=that.targetNode.x-that.sourceNode.x;
                var tdy=that.targetNode.y-that.sourceNode.y;
                var tnLen=Math.sqrt(tdx*tdx+tdy*tdy);

                var tnX = tdx / tnLen;
                var tnY = tdy / tnLen;



                var orthX=15* tnY;
                var orthY=15*-tnX;

                var offset=[that.sourceNode.x+0.5*tnLen*tnX  + orthX,that.sourceNode.y+0.5*tnLen*tnY +   orthY];

                textRenderingElement.attr("transform", "translate(" + offset[0] + "," + offset[1]+ ")");
                // use path calculations



                // that.pathElement.attr("x1", sX)
                //     .attr("y1", sY)
                //     .attr("x2", eX)
                //     .attr("y2", eY);

                startPoint={ x:sX, y:sY };
                endPoint  ={ x:eX, y:eY };

                if (that.getLinkType()===SINGLE_LINK) {
                    that.pathElement.attr("d", lineFunction(calculateSingleLinkPath(startPoint, endPoint)));
                    endPos = [eX, eY];
                    linkDir = [nX, nY];

                    that.rootElement.selectAll("image")
                        .attr("x", that.sourceNode.x + 0.5 * (dx) - 0.5 * 17)
                        .attr("y", that.sourceNode.y + 0.5 * (dy) - 0.5 * 17);
                }
                if (that.getLinkType()===MULTI_LINK){
                    console.log("computing the multilink path");
                    startPoint={ x:that.sourceNode.x, y:that.sourceNode.y };
                    endPoint  ={ x:that.targetNode.x, y:that.targetNode.y };

                    var controlPoints=calculateMultiLinkPath(startPoint, endPoint);
                    console.log(controlPoints);

                    that.pathElement.attr("d", lineFunction(controlPoints));
                    endPos = [eX, eY];
                    linkDir = [nX, nY];

                    var orthX=15* tnY;
                    var orthY=15*-tnX;
                    var offset=[controlPoints[1].x+orthX,controlPoints[1].y+orthY];
                    textRenderingElement.attr("transform", "translate(" + offset[0] + "," + offset[1]+ ")");



                    that.rootElement.selectAll("image")
                        .attr("x", controlPoints[1].x - 0.5 * 17)
                        .attr("y", controlPoints[1].y - 0.5 * 17);

                }
            }else{
                // this should not happen because than we have no path between two nodes;
                console.log("well error !");
            }

        }

    };



    this.onClicked = function () {
        console.log("link click");
        if (that.elementIsFocused===false) {
            that.elementIsFocused=true;
            that.pathElement.classed("LinkFocused", true);
            graph.handleLinkSelection(that);
            if (that.rootElement.selectAll("image")!=null) {
                var iW = parseInt(that.rootElement.selectAll("image").attr("width"));
                var iH = parseInt(that.rootElement.selectAll("image").attr("height"));
                if (that.getLinkType()===SINGLE_LINK) {
                    that.rootElement.selectAll("image")
                        .attr("display", null)
                        .attr("x", that.sourceNode.x + 0.5 * (that.targetNode.x - that.sourceNode.x) - 0.5 * iW)
                        .attr("y", that.sourceNode.y + 0.5 * (that.targetNode.y - that.sourceNode.y) - 0.5 * iH);
                    return;
                }
                if (that.getLinkType()===MULTI_LINK){

                    var startPoint={ x:that.sourceNode.x, y:that.sourceNode.y };
                    var endPoint  ={ x:that.targetNode.x, y:that.targetNode.y };

                    var controlPoints=calculateMultiLinkPath(startPoint, endPoint);
                    that.rootElement.selectAll("image")
                        .attr("display", null)
                        .attr("x", controlPoints[1].x - 0.5 * iW)
                        .attr("y", controlPoints[1].y - 0.5 * iH);
                    return;


                    }
            }
        }
        if (that.elementIsFocused===true) {
            that.elementIsFocused=false;
            that.pathElement.classed("LinkFocused", false);
            graph.handleLinkSelection(undefined);
            that.rootElement.selectAll("image")
                .attr("display", "none");
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
            var newX = endPos[0] - linkDir[0] * 10;
            var newY = endPos[1] - linkDir[1] * 10;

            // need to fix this;
            // check if path is a single one;
            if (that.getLinkType()===SINGLE_LINK){
                var controlPoints=calculateSingleLinkPath(startPoint, endPoint);
                controlPoints[1].x=newX;
                controlPoints[1].y=newY;
                that.pathElement.attr("d", lineFunction(controlPoints));
            }
            if (that.getLinkType()===MULTI_LINK){
                var controlPoints=calculateMultiLinkPath(startPoint, endPoint,true);
                that.pathElement.attr("d", lineFunction(controlPoints));
            }


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
            if (that.getLinkType() === SINGLE_LINK) {
                that.pathElement.attr("d", lineFunction(calculateSingleLinkPath(startPoint, endPoint)));
            }
            if (that.getLinkType() === MULTI_LINK) {
                that.pathElement.attr("d", lineFunction(calculateMultiLinkPath(startPoint, endPoint)));
            }

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

    this.setLoopStyle = function() {
        that.pathElement.classed("feedbackLoops", true);
    };

}

CLDLink.prototype = Object.create(BaseLink.prototype);
CLDLink.prototype.constructor = CLDLink;


