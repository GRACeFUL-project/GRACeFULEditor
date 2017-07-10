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

    console.log("Generating a link with id "+that.id());
    var cldType="unknown";
    this.cldTypeString="?";
    that.hoverText="";
    var linkDir=[]; // normal vector;
    var endPos=[]; // end position for the line
    var dynamicLinkWidth=false;

    this.type=function(){
        return cldType;
    };
    this.setSelectionStatus=function(val){
        that.elementIsFocused=val;
        that.pathElement.classed("cldLinkSelected", val);
    };


    this.getTypeId=function() {
        if (that.cldTypeString === "?") return 0;
        if (that.cldTypeString === "+") return 1;
        if (that.cldTypeString === "-") return 2;
    };

    this.setCLDTypeString=function(val){
        if (val === 0) that.cldTypeString="?";
        if (val === 1) that.cldTypeString="+";
        if (val === 2) that.cldTypeString="-";

        // update textRendering element
        if (textRenderingElement)
            textRenderingElement.text(that.cldTypeString);
    };



    var arrowHead=undefined;
    var arrowTail=undefined; // testing
    var textRenderingElement=undefined;

    this.drawElement=function(){
        that.pathElement = that.rootElement.append('line').classed("cldLink",true);
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



                var orthX=12* tnY;
                var orthY=12*-tnX;

                var offset=[that.sourceNode.x+0.5*tnLen*tnX  + orthX,that.sourceNode.y+0.5*tnLen*tnY +   orthY];

                textRenderingElement.attr("transform", "translate(" + offset[0] + "," + offset[1]+ ")");


                that.pathElement.attr("x1", sX)
                    .attr("y1", sY)
                    .attr("x2", eX)
                    .attr("y2", eY);

                endPos=[eX,eY];
                linkDir=[nX,nY];

                that.rootElement.selectAll("image")
                    .attr("x", that.sourceNode.x + 0.5*(dx)-0.5*17)
                    .attr("y", that.sourceNode.y + 0.5*(dy)-0.5*17);
            }else{
                // this should not happen because than we have no path between two nodes;
                console.log("well error !");
            }

        }

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
            that.pathElement.attr("x2", newX).attr("y2", newY);
        }else { // experimental code;
            if (that.getSelectionStatus() === true) {
                that.pathElement.classed("cldLinkSelected", false);
                that.pathElement.classed("cldLinkSelectedHovered", false);
                that.pathElement.classed("cldLinkHovered", false);
                that.pathElement.classed("cldLinkHoveredDynamic", false);
                that.pathElement.classed("cldLinkSelectedHoveredDynamic", true);

            } else {
                that.pathElement.classed("cldLinkSelected", false);
                that.pathElement.classed("cldLinkSelectedHovered", false);
                that.pathElement.classed("cldLinkSelectedHoveredDynamic", false);
                that.pathElement.classed("cldLinkHovered", false);
                that.pathElement.classed("cldLinkHoveredDynamic", true);
            }
            var defSize = 8;
            var newX, newY;
            var gZoom = graph.getZoomFactor();
            if (gZoom > 1.0){
                that.pathElement.style("stroke-width", defSize + "px");
                newX = endPos[0] - linkDir[0] * 10;
                newY = endPos[1] - linkDir[1] * 10;
                that.pathElement.attr("x2", newX).attr("y2", newY);
            } else{
                if (gZoom<0.5) gZoom=0.5;
                that.pathElement.style("stroke-width", defSize/gZoom + "px");
                newX = endPos[0] - linkDir[0] * 11/gZoom;
                newY = endPos[1] - linkDir[1] * 11/gZoom;
                that.pathElement.attr("x2", newX).attr("y2", newY);
            }
        }

        that.mouseEnteredFunc(true);
    };


    this.onMouseOut = function () {
        if (dynamicLinkWidth==false) {
            if (that.getSelectionStatus() === true) {
                that.pathElement.classed("cldLinkSelectedHovered", false);
                that.pathElement.classed("cldLinkHovered",          false);
                that.pathElement.classed("cldLinkSelected", true);
            } else {
                that.pathElement.classed("cldLinkSelected",         false);
                that.pathElement.classed("cldLinkSelectedHovered",  false);
                that.pathElement.classed("cldLinkHovered",          false);
            }


            // restor old positions;
            that.pathElement.attr("x2", endPos[0]).attr("y2", endPos[1]);
        }else{
            if (that.getSelectionStatus() === true) {
                that.pathElement.classed("cldLinkSelectedHovered"       , false);
                that.pathElement.classed("cldLinkSelectedHoveredDynamic", false);
                that.pathElement.classed("cldLinkHovered"               , false);
                that.pathElement.classed("cldLinkHoveredDynamic"        , false);
                that.pathElement.classed("cldLinkSelected"              , true);

            } else {
                that.pathElement.classed("cldLinkSelected"              , false);
                that.pathElement.classed("cldLinkSelectedHovered"       , false);
                that.pathElement.classed("cldLinkSelectedHoveredDynamic", false);
                that.pathElement.classed("cldLinkHovered"               , false);
                that.pathElement.classed("cldLinkHoveredDynamic"        , false);
            }
            that.pathElement.style("stroke-width","4px");
            that.pathElement.attr("x2", endPos[0]).attr("y2", endPos[1]);
        }
        that.mouseEnteredFunc(false);
    };

    this.setLoopStyle = function() {
        that.pathElement.classed("feedbackLoops", true);
    };

}

CLDLink.prototype = Object.create(BaseLink.prototype);
CLDLink.prototype.constructor = CLDLink;


