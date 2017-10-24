// GLOBALS
var libObject;
var sfdRef;
var cldRef;
var goalTreeRef;
var visibleLeftBar=true;

/**
  * Toolbar Type
**/

function clearAllToolbars(){
  document.getElementById('widgetList').style.display = "none";
  document.getElementById('widgetListCLD').style.display = "none";
  document.getElementById('widgetListGT').style.display = "none";
  document.getElementById('widgetListExampleB').style.display = "none";
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

function loadGracefulConceptMapToolbar(sfd){
  var gracefulLib=getGracefulConceptMapToolbar();
  console.log("It contains data for sure now:"+gracefulLib);
  sfdRef=sfd;
  // adding the TAB name here
  sfdRef.setTabTitle("GRACeFUL Concept Map");

}

function loadCausalLoopDiagramToolbar(cld){
  cldRef = cld;
}

function loadGoalTreeDiagram(gtw){
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
    sfdRef.updateSvgSize();
    goalTreeRef.updateSvgSize();
    cldRef.updateSvgSize();

}


function reloadWidgetItems(jsonOBJ){
    console.log("hey you, kill all the perv elements please");
    console.log(jsonOBJ);
    var domElement = document.getElementById('widgetList') ;

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
        if (object[i].type==="NODAL" || object[i].type==="RELATIONAL") {
            newLibFormat = true;
            break;
        }
    }

    if (newLibFormat===true){
        // sort the elements
        var nodes=[];
        var relations=[];

        for( i=0; i < object.length ; i++ ) {
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
            nameDiv.innerHTML= label;
            widgetItemDiv.appendChild(nameDiv);
            if (object[i].type==="NODAL" ) {
                nodes.push(widgetItemDiv)
            }
            if (object[i].type==="RELATIONAL" ) {
                relations.push(widgetItemDiv)
            }
        }
        // add them in the correct order to the dom objects;l
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
    setDivActiveGTW(0);
  // sfdRef.setupNode(0);
}

function loadWidgetItems(gracefulLib){
  //get the response here and parse the json obj
  var libraryObject = JSON.parse(gracefulLib);
  console.log("Loading Widget Items "+libraryObject);
  libObject = libraryObject;

  var iterator;
  var label = "sample";
  var srcToImg = "./data/img/test.svg";

  var domElement = document.getElementById('widgetList') ;
  var object= libraryObject['library'];

  //do the presentation logic here as following ..
  for( iterator=0; iterator < object.length ; iterator++ ){
    var temp = object[iterator];

    label = temp.comment ;
    srcToImg = temp.icon;
    // srcToImg = "./data/svg/test.svg";
    //srcToImg = item.icon ;
    console.log(label);
    var widgetItemDiv = document.createElement("div");
    widgetItemDiv.setAttribute("class","widgetItem");
    widgetItemDiv.setAttribute("id","sfd"+iterator);
    widgetItemDiv.setAttribute("onclick", "setDivActive("+iterator+")");
    var imgItem = document.createElement("img");
    imgItem.setAttribute("src",srcToImg);
    imgItem.setAttribute("height","96px");
    imgItem.setAttribute("width","96px");
    // widgetItemDiv.innerHTML = label;
    widgetItemDiv.appendChild(imgItem);
    widgetItemDiv.appendChild(document.createElement("br"));
    var nameDiv = document.createElement("div");
    nameDiv.innerHTML=label;
    widgetItemDiv.appendChild(nameDiv);
    domElement.appendChild(widgetItemDiv);
  }

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
    document.getElementById("sfd"+id).style.backgroundColor="yellow";
    console.log("Active SFD Node TYPE "+id);
    sfdRef.setupNode(id);
}

function clearAllDivCLD() {
    var numElements = 4;
    for (var i = 1; i < numElements; i++) {
        document.getElementById("cld" + i).style.backgroundColor = "white";
    }
}

function setDivActiveCLD(id){
    clearAllDivCLD();
    document.getElementById("cld"+id).style.backgroundColor="yellow";
    cldRef.setNodeType(id);
}

function clearAllDivGTW() {
    var numElements = 4;
    for (var i = 0; i < numElements; i++) {
        document.getElementById("gt" + i).style.backgroundColor = "white";
    }
}

function setDivActiveGTW(id){
    clearAllDivGTW();
    document.getElementById("gt"+id).style.backgroundColor="yellow";
    goalTreeRef.setNodeType(id);
}

/**
  * Toolbar GET Library functions
**/

function getGracefulConceptMapToolbar(){
    var solverAddress="http://vocol.iais.fraunhofer.de/graceful-rat";
    var response="";
    console.log("requesting an action that talks with docker ");
    // docker image name
    var get_requestAddress=solverAddress+"/library/crud";
    console.log("address :"+get_requestAddress);

    d3.xhr(get_requestAddress, "application/json",function (error, request) {
        if (request){
            console.log("docker returns the data: "+request.responseText);
            // todo: process the returned data; to the widget
            response=request.responseText;
         //   loadWidgetItems(request.responseText);
        //    setDivActive(0);
         //   sfdRef.setupNode(0);
        }else{
            console.log("error!"+error.status);
            // if no server is running we simply use the current state of the library;
            var exampleLib='{"library":[{"icon":"./data/img/rain.png","name":"rain","parameters":[{"hoverText":"amount","name":"amount","imgURL":"./data/interfaces/amount.png","type":"Float"}],"interface":[{"hoverText":"rainfall","name":"rainfall","imgURL":"./data/interfaces/rainfall.png","type":"Port (Float)"}],"comment":"Rain"},{"icon":"./data/img/pump.png","name":"pump","parameters":[{"hoverText":"capacity","name":"capacity","imgURL":"./data/interfaces/capacity.png","type":"Float"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Float)"},{"hoverText":"outflow","name":"outflow","imgURL":"./data/interfaces/outflow.png","type":"Port (Float)"}],"comment":"Pump"},{"icon":"./data/img/runOffArea.png","name":"runoff area","parameters":[{"hoverText":"storage capacity","name":"storage capacity","imgURL":"./data/interfaces/storage capacity.png","type":"Float"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Float)"},{"hoverText":"outlet","name":"outlet","imgURL":"./data/interfaces/outlet.png","type":"Port (Float)"},{"hoverText":"overflow","name":"overflow","imgURL":"./data/interfaces/overflow.png","type":"Port (Float)"}],"comment":"Runoff"}]}';
            console.log("loading static library -----> "+exampleLib);
            response=exampleLib;
        }// end else
    }// end xhr request function
    ); // end d3.xhr call
    return response;

}
