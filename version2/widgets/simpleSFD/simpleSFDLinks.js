var linkId= 0;

function SimpleSFDLink(graph) {
    var that = this;
    BaseLink.apply(this,arguments);
    var typesArray = ["positiveLink", "positiveLink", "negativeLink"];
    var labelTags=["Undefined", "+", "-"]; // used for init name of the elements in the hud;
    var linkTypeId=0;
    var isMultiLink=false;
    var pathElements=[];
    var sourcePort;
    var targetPort;



    var subLinks=[];
    this.getAllClasses=function(){
        return typesArray;
    };

    this.getLabelTags=function(){
        return labelTags;
    };

    this.getTypeId=function() {
        return linkTypeId;
    };

    this.setMultiLinkType=function(val){
        isMultiLink=val;
    };

    this.addPortConnection=function(sourcePort,targetPort){
        var subLink={src:sourcePort,tar:targetPort};
        subLinks.push(subLink);
        sourcePort.addPortLinks(sourcePort,targetPort);
        targetPort.addPortLinks(sourcePort,targetPort);
    };


    this.validateConnection=function(source,target){
        // get all connections of the sourceNode

        var allLinks=source.getAssociatedLinks();
        var linkPresent=false;
        for (var i=0;i<allLinks.length;i++){
            var aLink=allLinks[i];
            if (aLink.sourceNode===target || aLink.targetNode===target){
                // link is present
                linkPresent=true;
                return aLink;
            }
        }
        return linkPresent;


    };
    // overwritting the source and target node functions of baseLink
    this.source = function (srcNode) {
        srcNode.addLink(that);
        that.sourceNode=srcNode;
    };
    this.target = function (tarNode) {
        tarNode.addLink(that);
        that.targetNode=tarNode;
    };

    this.drawElement=function(){
        // clear all path Rendering elements;
        pathElements=[];
        var pathEl;
        if (isMultiLink===false) {
            pathEl= that.rootElement.append('path')
                .classed("sfdLink", true);

            var startPoint={x:that.sourceNode.x, y:that.sourceNode.y};
            var endPoint={x:that.targetNode.x, y:that.targetNode.y};

            pathEl.attr("d", lineFunction(calculateSingleLinkPath(startPoint, endPoint)));
            pathElements.push(pathEl);
        }
        else{
            for (var i=0;i<subLinks.length;i++) {
                pathEl = that.rootElement.append('path')
                    .classed("sfdLink", true);
                pathElements.push(pathEl);
            }
        }
    };
    this.updateElement = function () {
        var startPoint={x:that.sourceNode.x, y:that.sourceNode.y};
        var endPoint={x:that.targetNode.x, y:that.targetNode.y};
        var srcPort;
        var tarPort;
        var controlPoints;

        if  (isMultiLink===false && pathElements.length===1){
            var pathEl=pathElements[0];
            controlPoints=calculateSingleLinkPath(startPoint, endPoint);
            pathEl.attr("d", lineFunction(controlPoints));
            srcPort=subLinks[0].src;
            tarPort=subLinks[0].tar;

            // update their positions
            srcPort.setLinkPosition(controlPoints[0].x,controlPoints[0].y);
            tarPort.setLinkPosition(controlPoints[1].x,controlPoints[1].y);


        }else {
            var numberOfLinks=pathElements.length;
            //compute center point and the direction for the offset
            var centerPoint={x:0.5*(startPoint.x+endPoint.x),y:0.5*(startPoint.y+endPoint.y)};
            var oX=endPoint.x-startPoint.x;
            var oY=endPoint.y-startPoint.y;
            var oLen=Math.sqrt(oX*oX+oY*oY);
            var orthoNormed={x:oY/oLen, y:-oX/oLen};
            var offset=20; // todo: dynamic offset for the links?
            var oddNumber=numberOfLinks%2;

            for (var i = 0; i < pathElements.length; i++) {
                controlPoints=calculateMultiLinkPath(startPoint, centerPoint, endPoint, orthoNormed, offset, oddNumber,i);
                pathElements[i].attr("d", lineFunction(controlPoints));
                // use the control points for setting the the ports positions
                srcPort=subLinks[i].src;
                tarPort=subLinks[i].tar;

                // update their positions
                srcPort.setLinkPosition(controlPoints[0].x,controlPoints[0].y);
                tarPort.setLinkPosition(controlPoints[2].x,controlPoints[2].y);
            }
        }
    };

    function calculateMultiLinkPath(start,center,end,vec,offset,odd, id){
        // compute the position of the center fixPoint;
        var fpX=center.x;
        var fpY=center.y;

        var direction=1;
        if (id%2===0)
            direction=-1;
        fpX+=vec.x*direction*2*offset;
        fpY+=vec.y*direction*2*offset;

        if (odd===1 && id===0){
            fpX=center.x;
            fpY=center.y;
        }
        // todo : angular deficits in order to prevent occlusion of port elements on the node
        // reduce the distances
        var oX=fpX-start.x;
        var oY=fpY-start.y;
        var oLen=Math.sqrt(oX*oX+oY*oY);
        var nX=oX/oLen;
        var nY=oY/oLen;

        var oX2=fpX-end.x;
        var oY2=fpY-end.y;
        var oLen2=Math.sqrt(oX2*oX2+oY2*oY2);
        var nX2=oX2/oLen2;
        var nY2=oY2/oLen2;

        var fixPoint1 = {"x": start.x+nX*50, "y": start.y+nY*50},
            fixPoint2 = {"x": fpX,      "y": fpY},
            fixPoint3 = {"x": end.x+nX2*50,    "y": end.y+nY2*50};

        return [fixPoint1, fixPoint2, fixPoint3];
    }

    function calculateSingleLinkPath(start,end) {
        // make the link shorter;
        var oX=end.x-start.x;
        var oY=end.y-start.y;
        var oLen=Math.sqrt(oX*oX+oY*oY);
        var nX=oX/oLen;
        var nY=oY/oLen;

        // todo: dynamic radius
        var fixPoint1 = {"x": start.x+nX*50 , "y": start.y+nY*50},
            fixPoint2 = {"x": end.x-nX*50,    "y": end.y-nY*50 };
        return [fixPoint1, fixPoint2];
    }



    var lineFunction = d3.svg.line()
        .x(function (d) {
            return d.x;
        })
        .y(function (d) {
            return d.y;
        })
        .interpolate("cardinal");



}


SimpleSFDLink.prototype = Object.create(BaseLink.prototype);
SimpleSFDLink.prototype.constructor = SimpleSFDLink;
