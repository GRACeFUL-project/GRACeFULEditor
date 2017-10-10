
function GTLink(graph) {
	var that = this;
    BaseLink.apply(this,arguments);

    var startPoint,endPoint,cpPoint;
    var arrowHead=undefined;


    this.getTypeId=function(){
      return 0;
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
                .attr("id", "arrowHeadGT" + that.id())
                .attr("viewBox", viewBoxString) // temp
                .attr("markerWidth", mw)
                .attr("markerHeight", mh)
                .attr("refX", 0)
                .attr("refY", 0)
                .attr("orient", "auto");
            arrowHead.append("path")
                .attr("d", "M"+sX+","+sY+"L" + m1X + "," + m1Y + "L" + m2X + "," + m2Y +  "Z" )
                .classed("cldArrowHeadStyle",true);
            that.pathElement.attr('marker-end', 'url(#arrowHeadGT' + that.id() + ')');
        }
    }


    function calculateMultiLinkPath(start,end) {
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

        // compute orthogonal offset;



        var qdx=64;
        var qdy=39;
        // change the endpoint on the endline of the boarder
        var aX=Math.abs(nX);
        var aY=Math.abs(nY);
        var wX=1.0;
        var wY=1.0;
        var scale;
        if (aX>=aY){
            wX=1.0;
            scale=1.0/aX;
            wY=scale*aY;
        }else{
            scale=1.0/aY;
            wX=scale*aX;
            wY=1.0;
        }
        var signX;
        if (nX<0) signX=-1;
        if (nX>=0) signX=+1;

        var signY;
        if (nY<0) signY=-1;
        if (nY>=0) signY=+1;


        wX*=-1.0*signX;
        wY*=-1.0*signY;

        var friendX =eX +qdx*wX;
        var friendY =eY +qdy*wY;

        var fixPoint1 = {"x": start.x, "y": start.y},
            fixPoint2 = {"x": friendX,    "y": friendY};

        return [fixPoint1, fixPoint2];
    }


    this.updateElement=function(){
        if (that.pathElement) {
            startPoint={ x:that.sourceNode.x, y:that.sourceNode.y };
            endPoint  ={ x:that.targetNode.x, y:that.targetNode.y };
            var controlPoints = calculateMultiLinkPath(startPoint, endPoint);
            // update the points;
             that.pathElement.attr("x1", controlPoints[0].x)
                 .attr("y1", controlPoints[0].y)
                 .attr("x2", controlPoints[1].x)
                 .attr("y2", controlPoints[1].y);

            that.rootElement.selectAll("image")
                .attr("x",0.5 * ( controlPoints[0].x + controlPoints[1].x ) - 0.5 * 17)
                .attr("y",0.5 * ( controlPoints[0].y +controlPoints[1].y ) - 0.5 * 17);
        }
    };


    this.drawElement = function () {
        that.pathElement = that.rootElement.append('line')
            .classed("baseDragPath", true);

        startPoint={ x:that.sourceNode.x, y:that.sourceNode.y };
        endPoint  ={ x:that.targetNode.x, y:that.targetNode.y };

        var controlPoints = calculateMultiLinkPath(startPoint, endPoint);
        // update the points;
        that.pathElement.attr("x1", controlPoints[0].x)
            .attr("y1", controlPoints[0].y)
            .attr("x2", controlPoints[1].x)
            .attr("y2", controlPoints[1].y);

        addArrowHead();
        that.addMouseEvents();

        //add delete image
        that.rootElement.append("image")
            .attr("id", "linkDeleteIcon")
            .attr("xlink:href", "images/delete.svg")
            .attr("display", "none")
            .attr("width", 17)
            .attr("height", 17)
            .attr("x",0.5 * ( controlPoints[0].x + controlPoints[1].x ) - 0.5 * 17)
            .attr("y",0.5 * ( controlPoints[0].y +controlPoints[1].y ) - 0.5 * 17)
            .on('click', function() {
                d3.event.stopPropagation();
                console.log("This link has to be deleted: "+that.id());
                graph.handleLinkDeletion(that);
            });
    };


    this.onClicked = function () {
        console.log("link click");
        if (that.elementIsFocused===false) {
            that.elementIsFocused=true;
            that.pathElement.classed("LinkFocused", true);
            graph.handleLinkSelection(that);
            if (that.rootElement.selectAll("image")!=null) {
                startPoint={ x:that.sourceNode.x, y:that.sourceNode.y };
                endPoint  ={ x:that.targetNode.x, y:that.targetNode.y };
                var controlPoints = calculateMultiLinkPath(startPoint, endPoint);
                that.rootElement.selectAll("image")
                    .attr("display", null)
                    .attr("x",0.5 * ( controlPoints[0].x + controlPoints[1].x ) - 0.5 * 17)
                    .attr("y",0.5 * ( controlPoints[0].y +controlPoints[1].y ) - 0.5 * 17);
                return;
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

}

GTLink.prototype = Object.create(BaseLink.prototype);
GTLink.prototype.constructor = GTLink;