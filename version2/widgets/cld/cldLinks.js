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
    var cldTypeString="?";
    that.hoverText="";

    this.type=function(){
        return cldType;
    };
    this.setSelectionStatus=function(val){
        that.elementIsFocused=val;
        that.pathElement.classed("cldLinkSelected", val);
    };


    this.getTypeId=function() {
        if (cldTypeString === "?") return 0;
        if (cldTypeString === "+") return 1;
        if (cldTypeString === "-") return 2;
    };

    this.setCLDTypeString=function(val){
        if (val === 0) cldTypeString="?";
        if (val === 1) cldTypeString="+";
        if (val === 2) cldTypeString="-";

        // update textRendering element
        if (textRenderingElement)
            textRenderingElement.text(cldTypeString);
    };



    var arrowHead=undefined;
    var arrowTail=undefined; // testing
    var textRenderingElement=undefined;

    this.drawElement=function(){
        that.pathElement = that.rootElement.append('line').classed("cldLink",true);
        addArrowHead();
        addTypeString();
        // clds have no arrow tails
        // addArrowTail();
        that.pathElement.append('title').text(that.hoverText);
        that.addMouseEvents();
    };

    function addTypeString(){
         textRenderingElement=that.rootElement.append("text")
            .classed("text", true)
            .attr("text-anchor", "middle")
            .attr("style", "fill: black")
            .text(cldTypeString);
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

                var tdx=eX-sX;
                var tdy=eY-sY;
                var tnLen=Math.sqrt(tdx*tdx+tdy*tdy);

                var tnX = tdx / tnLen;
                var tnY = tdy / tnLen;



                var orthX=12* tnY;
                var orthY=12*-tnX;

                var offset=[sX+0.5*tnLen*tnX  + orthX,sY+0.5*tnLen*tnY +   orthY];

                textRenderingElement.attr("transform", "translate(" + offset[0] + "," + offset[1]+ ")");


                that.pathElement.attr("x1", sX)
                    .attr("y1", sY)
                    .attr("x2", eX)
                    .attr("y2", eY);
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

        if (that.getSelectionStatus()===true){
            that.pathElement.classed("cldLinkSelected", true);
        }else{
            that.pathElement.classed("cldLinkSelected", false);
            that.pathElement.classed("cldLinkHovered", true);
        }
        // var selectedNode = that.rootElement.node(),
        //     nodeContainer = selectedNode.parentNode;
        // nodeContainer.appendChild(selectedNode);
        that.mouseEnteredFunc(true);

    };
    this.onMouseOut = function () {
        console.log("mouseOut");
        if (that.elementIsFocused===true){
            that.pathElement.classed("cldLinkSelected", true);
        }else{
            that.pathElement.classed("cldLinkSelected", false);
        }
        that.pathElement.classed("cldLinkHovered", false);
        that.mouseEnteredFunc(false);
    };

}

CLDLink.prototype = Object.create(BaseLink.prototype);
CLDLink.prototype.constructor = CLDLink;


