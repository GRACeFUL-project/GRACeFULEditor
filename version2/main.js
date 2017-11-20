// GLOBALS
var libObject;
var sfdRef;
var cldRef;
var goalTreeRef;
var visibleLeftBar=true;
var loadedLibName="";

/**
  * Toolbar Type
**/

function clearAllToolbars(){
  document.getElementById('widgetList').style.display = "none";
  document.getElementById('widgetListCLD').style.display = "none";
  document.getElementById('widgetListGT').style.display = "none";
  document.getElementById('widgetListSFD').style.display = "none";
}

function setActiveToolbar(toolBarDiv) {
  document.getElementById(toolBarDiv).style.display = "block";
}

/**
  * Toolbar Toggling functions
**/

function hideToolbar(){

     if (visibleLeftBar===false) return;
     visibleLeftBar=false;
    // console.log("called hide ToolBar");
 $( "#toolbar" ).toggle( "slide" );
 $( "#btn-opentoolBar" ).delay(350).fadeIn();

 //toggle Classes to set the presentation view
 $('#drawingArea').removeClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
 $('#drawingArea').addClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');
 $('#canvasArea').removeClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
 $('#canvasArea').addClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');
 sfdRef.updateSvgSize();
 goalTreeRef.updateSvgSize();
 cldRef.updateSvgSize();

}


function showToolbar(){
     if (visibleLeftBar===true) return;
     visibleLeftBar=true;
    console.log("called show ToolBar");
 $( "#toolbar" ).toggle( "slide" );
 $( "#btn-opentoolBar" ).delay(350).fadeOut();

 // toggle Classes to set the presentation view
 $('#drawingArea').removeClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');
 $('#drawingArea').addClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
 $('#canvasArea').removeClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');
 $('#canvasArea').addClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
 sfdRef.updateSvgSize();
 goalTreeRef.updateSvgSize();
 cldRef.updateSvgSize();
}

/**
  * Toolbar Loading Library functions
**/

function setSFD(sfd){
  sfdRef=sfd;
}

function setReferenceOfSFD(sfd){
  sfdRef=sfd;
  sfdRef.setTabTitle("GRACeFUL Concept Map");
}

function setReferenceOfCLD(cld){
    cldRef = cld;
}



function setReferenceOfGoalTreeDiagram(gtw){
  goalTreeRef = gtw;
}

// Loading of widget Items

function killToolBar(){

    d3.select("#btn-opentoolBar").classed("hidden",true);

    var tb=d3.select("#toolbar");
     tb.classed("hidden",true);

    $('#drawingArea').removeClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
    $('#drawingArea').addClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');
    $('#canvasArea').removeClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
    $('#canvasArea').addClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');
    d3.select("#btn-opentoolBar").classed("hidden",true);


}

function resurectToolBar(){

    d3.select("#toolbar").classed("hidden",false);
    d3.select("#btn-opentoolBar").classed("hidden",false);
    if (visibleLeftBar===true) {
        $('#drawingArea').removeClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');
        $('#drawingArea').addClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
        $('#canvasArea').removeClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');
        $('#canvasArea').addClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');

    }
    else{
        $('#drawingArea').removeClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
        $('#drawingArea').addClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');
        $('#canvasArea').removeClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
        $('#canvasArea').addClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');

    }
    // sfdRef.updateSvgSize();
    // goalTreeRef.updateSvgSize();
    // cldRef.updateSvgSize();

}
function setLoadedLibName(name){
    loadedLibName=name;


}


function reloadWidgetItems(jsonOBJ){
    // console.log("--------------------------- JSon Object for widgtet Items ----------------------");
    // console.log(jsonOBJ);
    // console.log("--------------------------------------------------------------------------------");
    var domElement = document.getElementById('widgetList') ;
    // console.log(domElement);
    var htmlCollection = domElement.children;
    var numEntries = htmlCollection.length;
    var i,temp;
    var widgetItemDiv,imgItem,nameDiv;
    for ( i = 0; i < numEntries; i++) {
        htmlCollection[0].remove();
    }
    // create the new elements
    var object= jsonOBJ['library'];
    var label = "sample";
    var srcToImg = "./data/img/test.svg";

    // check for new or old library format;
    var newLibFormat=false;
    for( i=0; i < object.length ; i++ ) {
        if (object[i].graphElement==="NODAL" || object[i].graphElement==="RELATIONAL" )  {
            newLibFormat = true;
            break;
        }
    }

    if (newLibFormat===true){
        // sort the elements
        var nodes=[];
        var relations=[];
        var causals=[];

        for( i=0; i < object.length ; i++ ) {
            temp = object[i];
            label = temp.name ;
            if (label==="Stakeholder")
                continue;
            // if (temp.superClass!=undefined)
            //     continue;
            srcToImg = temp.icon;
            // sanity check
            if (srcToImg===undefined) { // try img url
                srcToImg = temp.imgURL;
            }
            // srcToImg = "./data/svg/test.svg";
            //srcToImg = item.icon ;

            widgetItemDiv = document.createElement("div");
            widgetItemDiv.setAttribute("class","widgetItem");
            widgetItemDiv.setAttribute("id","sfd"+i);
            widgetItemDiv.setAttribute("onclick", "setDivActive("+i+")");

            imgItem = document.createElement("img");
            imgItem.setAttribute("src",srcToImg);
            imgItem.setAttribute("height","96px");
            imgItem.setAttribute("width","96px");
            imgItem.setAttribute("draggable","false"); // remove drag operations of tabs items
            imgItem.setAttribute("ondragstart","return false"); // remove drag operations of tabs items
            // widgetItemDiv.innerHTML = label;
            widgetItemDiv.appendChild(imgItem);
            widgetItemDiv.appendChild(document.createElement("br"));


            nameDiv = document.createElement("div");
            nameDiv.innerHTML= label;
            widgetItemDiv.appendChild(nameDiv);
            if (object[i].layer==="causal" ) {
                causals.push(widgetItemDiv)
            }else if (object[i].graphElement==="NODAL" ) {
                nodes.push(widgetItemDiv)
            } else if (object[i].graphElement==="RELATIONAL") {
                relations.push(widgetItemDiv)
            }
        }
        // add them in the correct order to the dom objects;l
        var causalTag= document.createElement("div");
        causalTag.innerHTML="CAUSAL";
        causalTag.setAttribute("class","tabHighlight");
        domElement.appendChild(causalTag);
        for (i=0;i<causals.length;i++) {
            domElement.appendChild(causals[i]);
        }

        var nodalTag= document.createElement("div");
        nodalTag.innerHTML="NODES";
        nodalTag.setAttribute("class","tabHighlight");
        domElement.appendChild(nodalTag);
        for (i=0;i<nodes.length;i++) {
            domElement.appendChild(nodes[i]);
        }
        // todo: add seperator;
        var relationalTag= document.createElement("div");
        relationalTag.innerHTML="RELATIONS";
        relationalTag.setAttribute("class","tabHighlight");
        domElement.appendChild(relationalTag);
        // adding relational nodes
        for (i=0;i<relations.length;i++) {
            domElement.appendChild(relations[i]);
        }
    }



    if (newLibFormat===false){
        //do the presentation logic here as following ..
        for( i=0; i < object.length ; i++ ){
            temp = object[i];

            label = temp.name ;

            srcToImg = temp.icon;
            // sanity check
            if (srcToImg===undefined) { // try img url
                srcToImg = temp.imgURL;
            }
            // srcToImg = "./data/svg/test.svg";
            //srcToImg = item.icon ;
            console.log(label);
            widgetItemDiv = document.createElement("div");
            widgetItemDiv.setAttribute("class","widgetItem");
            widgetItemDiv.setAttribute("id","sfd"+i);
            widgetItemDiv.setAttribute("onclick", "setDivActive("+i+")");

            imgItem = document.createElement("img");
            imgItem.setAttribute("src",srcToImg);
            imgItem.setAttribute("height","96px");
            imgItem.setAttribute("width","96px");
            // widgetItemDiv.innerHTML = label;
            widgetItemDiv.appendChild(imgItem);
            widgetItemDiv.appendChild(document.createElement("br"));

            nameDiv = document.createElement("div");
            widgetItemDiv.appendChild(nameDiv);
            domElement.appendChild(widgetItemDiv);
        }
    }
    libObject=jsonOBJ;

    setDivActive(0);
    setDivActiveCLD(1);
    setDivActiveGTW(1);
  // sfdRef.setupNode(0);
}

function emptyDragFunction(){
    return false;
}


function reloadWidgetItemsCLD(jsonOBJ) {
    // console.log("CLD------------names");
    // console.log(jsonOBJ);
    // var domElement = document.getElementById('widgetList');
    // console.log(domElement);
    // var htmlCollection = domElement.children;
    // var numEntries = htmlCollection.length;
    // var i, temp;
    // var widgetItemDiv, imgItem, nameDiv;
    // for (i = 0; i < numEntries; i++) {
    //     htmlCollection[0].remove();
    // }
    // // create the new elements
    // var object = jsonOBJ['library'];
    // var label = "sample";
    // var srcToImg = "./data/img/test.svg";
    //
    // // check for new or old library format;
    // var newLibFormat = false;
    // for (i = 0; i < object.length; i++) {
    //     if (object[i].type === "NODAL" || object[i].type === "RELATIONAL" || object[i].type === "CAUSAL") {
    //         newLibFormat = true;
    //         break;
    //     }
    // }
    //
    // if (newLibFormat === true) {
    //     // sort the elements
    //     var nodes = [];
    //     var relations = [];
    //     var causals = [];
    //
    //     for (i = 0; i < object.length; i++) {
    //         temp = object[i];
    //         label = temp.name;
    //         if (label === "Stakeholder")
    //             continue;
    //         srcToImg = temp.icon;
    //         // sanity check
    //         if (srcToImg === undefined) { // try img url
    //             srcToImg = temp.imgURL;
    //         }
    //         // srcToImg = "./data/svg/test.svg";
    //         //srcToImg = item.icon ;
    //         console.log(label);
    //         widgetItemDiv = document.createElement("div");
    //         widgetItemDiv.setAttribute("class", "widgetItem");
    //         widgetItemDiv.setAttribute("id", "cld" + i);
    //         widgetItemDiv.setAttribute("onclick", "setDivActiveCLD(" + i + ")");
    //
    //         imgItem = document.createElement("img");
    //         imgItem.setAttribute("src", srcToImg);
    //         imgItem.setAttribute("height", "96px");
    //         imgItem.setAttribute("width", "96px");
    //         // widgetItemDiv.innerHTML = label;
    //         widgetItemDiv.appendChild(imgItem);
    //         widgetItemDiv.appendChild(document.createElement("br"));
    //
    //         nameDiv = document.createElement("div");
    //         nameDiv.innerHTML = label;
    //         widgetItemDiv.appendChild(nameDiv);
    //         if (object[i].type === "CAUSAL") {
    //              causals.push(widgetItemDiv);
    //          }
    //         // if (object[i].type === "NODAL") {
    //         //     nodes.push(widgetItemDiv)
    //         // }
    //         // if (object[i].type === "RELATIONAL") {
    //         //     relations.push(widgetItemDiv)
    //         // }
    //     }
    //     // add them in the correct order to the dom objects;l
    //     var causalTag = document.createElement("div");
    //     causalTag.innerHTML = "CAUSAL";
    //     causalTag.setAttribute("class", "tabHighlight");
    //     domElement.appendChild(causalTag);
    //     for (i = 0; i < causals.length; i++) {
    //         domElement.appendChild(causals[i]);
    //     }
    //
    //     // var nodalTag = document.createElement("div");
    //     // nodalTag.innerHTML = "NODES";
    //     // nodalTag.setAttribute("class", "tabHighlight");
    //     // domElement.appendChild(nodalTag);
    //     // for (i = 0; i < nodes.length; i++) {
    //     //     domElement.appendChild(nodes[i]);
    //     // }
    //     // // todo: add seperator;
    //     // var relationalTag = document.createElement("div");
    //     // relationalTag.innerHTML = "RELATIONS";
    //     // relationalTag.setAttribute("class", "tabHighlight");
    //     // domElement.appendChild(relationalTag);
    //     // // adding relational nodes
    //     // for (i = 0; i < relations.length; i++) {
    //     //     domElement.appendChild(relations[i]);
    //     // }
    // }
    //
    //
    // if (newLibFormat === false) {
    //     //do the presentation logic here as following ..
    //     for (i = 0; i < object.length; i++) {
    //         temp = object[i];
    //
    //         label = temp.name;
    //
    //         srcToImg = temp.icon;
    //         // sanity check
    //         if (srcToImg === undefined) { // try img url
    //             srcToImg = temp.imgURL;
    //         }
    //         // srcToImg = "./data/svg/test.svg";
    //         //srcToImg = item.icon ;
    //         console.log(label);
    //         widgetItemDiv = document.createElement("div");
    //         widgetItemDiv.setAttribute("class", "widgetItem");
    //         widgetItemDiv.setAttribute("id", "cld" + i);
    //         widgetItemDiv.setAttribute("onclick", "setDivActiveCLD(" + i + ")");
    //
    //         imgItem = document.createElement("img");
    //         imgItem.setAttribute("src", srcToImg);
    //         imgItem.setAttribute("height", "96px");
    //         imgItem.setAttribute("width", "96px");
    //         // widgetItemDiv.innerHTML = label;
    //         widgetItemDiv.appendChild(imgItem);
    //         widgetItemDiv.appendChild(document.createElement("br"));
    //
    //         nameDiv = document.createElement("div");
    //         widgetItemDiv.appendChild(nameDiv);
    //         domElement.appendChild(widgetItemDiv);
    //     }
    // }
    // libObject = jsonOBJ;

   // setDivActive(0);
    setDivActiveCLD(1);
    setDivActiveGTW(1);
    // sfdRef.setupNode(0);
}



// setting the DOM ELEMENTS
function clearAllDiv(){
    var object= libObject['library'];
    for(var i=0 ; i < object.length ; i++ ) {
        if (document.getElementById("sfd" + i)){
            document.getElementById("sfd" + i).style.backgroundColor = "white";
        }
    }
}



function setDivActive(id){
    clearAllDiv();
    if (document.getElementById("sfd"+id)) {
        document.getElementById("sfd" + id).style.backgroundColor = "yellow";
        // console.log("Active SFD Node TYPE " + id);
        sfdRef.setupNode(id);
    }
}

function clearAllDivCLD() {
    var numElements = 4;
    for (var i = 1; i < numElements; i++) {
        if (document.getElementById("cld" + i))
            document.getElementById("cld" + i).style.backgroundColor = "white";
    }
}

function setDivActiveCLD(id){
    clearAllDivCLD();
    if (document.getElementById("cld"+id)) {
        document.getElementById("cld" + id).style.backgroundColor = "yellow";
        cldRef.setNodeType(id);
    }
}

function clearAllDivGTW() {
    var numElements = 4;
    for (var i = 0; i < numElements; i++) {
        if (document.getElementById("gt" + i))
        document.getElementById("gt" + i).style.backgroundColor = "white";
    }
}

function setDivActiveGTW(id){
    clearAllDivGTW();
    if (document.getElementById("gt"+id)) {
        document.getElementById("gt" + id).style.backgroundColor = "yellow";
        goalTreeRef.setNodeType(id);
    }
}

/**
  * Toolbar GET Library functions
**/

function getGracefulConceptMapToolbar(){
    var fullGCMlib='{"library":[{"relational":false,"icon":"pathToNodeImage","name":"node","parameters":[{"hoverText":"obsSign","name":"obsSign","imgURL":"./data/interfaces/obsSign.png","type":"Int | ()"},{"hoverText":"numIn","name":"numIn","imgURL":"./data/interfaces/numIn.png","type":"Int"},{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"}],"comment":"Generic node"},{"relational":true,"icon":"pathToArrowImage","name":"edge","parameters":[{"hoverText":"sign","name":"sign","imgURL":"./data/interfaces/sign.png","type":"Int"}],"interface":[],"comment":"Causal relation"},{"relational":false,"icon":"/dev/null","name":"budget","parameters":[{"hoverText":"numberOfPorts","name":"numberOfPorts","imgURL":"./data/interfaces/numberOfPorts.png","type":"Int"},{"hoverText":"maximumBudget","name":"maximumBudget","imgURL":"./data/interfaces/maximumBudget.png","type":"Int"}],"interface":[],"comment":"Set a maximum budget"},{"relational":false,"icon":"/dev/null","name":"optimise","parameters":[{"hoverText":"numberOfPorts","name":"numberOfPorts","imgURL":"./data/interfaces/numberOfPorts.png","type":"Int"}],"interface":[],"comment":"Optimise the sum of some ports"},{"relational":false,"icon":"/dev/null","name":"evaluate","parameters":[{"hoverText":"values","name":"values","imgURL":"./data/interfaces/values.png","type":"[Int]"},{"hoverText":"weights","name":"weights","imgURL":"./data/interfaces/weights.png","type":"[Float]"}],"interface":[{"hoverText":"atPort","name":"atPort","imgURL":"./data/interfaces/atPort.png","type":"Port (Int)"},{"hoverText":"benefit","name":"benefit","imgURL":"./data/interfaces/benefit.png","type":"Port (Float)"}],"comment":"Evaluate benefits of possible values"},{"relational":false,"icon":"/dev/null","name":"action","parameters":[{"hoverText":"values","name":"values","imgURL":"./data/interfaces/values.png","type":"[Int]"},{"hoverText":"costs","name":"costs","imgURL":"./data/interfaces/costs.png","type":"[Int]"},{"hoverText":"numIn","name":"numIn","imgURL":"./data/interfaces/numIn.png","type":"Int"},{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"},{"hoverText":"cost","name":"cost","imgURL":"./data/interfaces/cost.png","type":"Port (Int)"}],"comment":"CLD action node"},{"relational":false,"icon":"/dev/null","name":"criterion","parameters":[{"hoverText":"numIn","name":"numIn","imgURL":"./data/interfaces/numIn.png","type":"Int"},{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"}],"comment":"Node for criterion"},{"relational":false,"icon":"./data/img/rain.png","name":"rain","parameters":[{"hoverText":"amount","name":"amount","imgURL":"./data/interfaces/amount.png","type":"Int"}],"interface":[{"hoverText":"rainfall","name":"rainfall","imgURL":"./data/interfaces/rainfall.png","type":"Port (Int)"}],"comment":"Rain"},{"relational":false,"icon":"./data/img/pump.png","name":"pump","parameters":[{"hoverText":"capacity","name":"capacity","imgURL":"./data/interfaces/capacity.png","type":"Int"}],"interface":[{"hoverText":"increase","name":"increase","imgURL":"./data/interfaces/increase.png","type":"Port (Int)"},{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"},{"hoverText":"outflow","name":"outflow","imgURL":"./data/interfaces/outflow.png","type":"Port (Int)"}],"comment":"Pump"},{"relational":false,"icon":"./data/img/runOffArea.png","name":"runoff area","parameters":[{"hoverText":"storage capacity","name":"storage capacity","imgURL":"./data/interfaces/storage capacity.png","type":"Int"}],"interface":[{"hoverText":"increase","name":"increase","imgURL":"./data/interfaces/increase.png","type":"Port (Int)"},{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"},{"hoverText":"outlet","name":"outlet","imgURL":"./data/interfaces/outlet.png","type":"Port (Int)"},{"hoverText":"overflow","name":"overflow","imgURL":"./data/interfaces/overflow.png","type":"Port (Int)"}],"comment":"Runoff"},{"relational":false,"icon":"/dev/null","name":"sink","parameters":[],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"}],"comment":"Sink"},{"relational":false,"icon":"/dev/null","name":"flooding","parameters":[{"hoverText":"numOut","name":"numOut","imgURL":"./data/interfaces/numOut.png","type":"Int"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Int)"}],"comment":"Flooding of square"},{"relational":false,"icon":"/dev/null","name":"increaseAction","parameters":[{"hoverText":"values","name":"values","imgURL":"./data/interfaces/values.png","type":"[Int]"},{"hoverText":"costs","name":"costs","imgURL":"./data/interfaces/costs.png","type":"[Int]"}],"interface":[{"hoverText":"value","name":"value","imgURL":"./data/interfaces/value.png","type":"Port (Int)"},{"hoverText":"cost","name":"cost","imgURL":"./data/interfaces/cost.png","type":"Port (Int)"}],"comment":"Action to increase a parameter"}]}'
    return fullGCMlib;

}
