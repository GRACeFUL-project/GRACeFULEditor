// GLOBALS
var libObject;
var sfdRef;
var cldRef;
var goalTreeRef;

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

}

function loadCausalLoopDiagramToolbar(cld)
{
  cldRef = cld;
}

function loadGoalTreeDiagram(gtw)
{
  goalTreeRef = gtw;
}

// Loading of widget Items

function loadWidgetItems(gracefulLib)
{
  //get the response here and parse the json obj
  var libraryObject = JSON.parse(gracefulLib);
  console.log(libraryObject);
  libObject = libraryObject;

  var iterator=0;
  var label = "sample";
  var srcToImg = "./data/img/rain.png";

  var domElement = document.getElementById('widgetList') ;
  var object= libraryObject['library'];

  //do the presentation logic here as following ..
  for( iterator=0; iterator < object.length ; iterator++ ){
    var temp = object[iterator];

    label = temp.comment  ;
    srcToImg = temp.icon ;
    // srcToImg = item.icon ;
    console.log(label);
    var widgetItemDiv = document.createElement("div");
    widgetItemDiv.setAttribute("class","widgetItem");
    widgetItemDiv.setAttribute("id","sfd"+iterator);
    widgetItemDiv.setAttribute("onclick", "setDivActive("+iterator+")")
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

function clearAllDiv()
{
  var object= libObject['library'];

  for(i=0 ; i < object.length ; i++ )
    document.getElementById("sfd"+i).style.backgroundColor="white";

}

function setDivActive(id){
  clearAllDiv();
  document.getElementById("sfd"+id).style.backgroundColor="yellow";
  sfdRef.setupNode(id);
}

function clearAllDivCLD()
{
  document.getElementById("cld"+0).style.backgroundColor="white";
  document.getElementById("cld"+1).style.backgroundColor="white";
  document.getElementById("cld"+2).style.backgroundColor="white";
  document.getElementById("cld"+3).style.backgroundColor="white";


}

function setDivActiveCLD(id){
  clearAllDivCLD();
  document.getElementById("cld"+id).style.backgroundColor="yellow";
  cldRef.setNodeType(id);
}

function clearAllDivGTW()
{
  document.getElementById("gt"+0).style.backgroundColor="white";
  document.getElementById("gt"+1).style.backgroundColor="white";
  document.getElementById("gt"+2).style.backgroundColor="white";
  document.getElementById("gt"+3).style.backgroundColor="white";
}

function setDivActiveGTW(id)
{
 clearAllDivGTW();
 document.getElementById("gt"+id).style.backgroundColor="yellow";
 goalTreeRef.setNodeType(id);
}

/**
  * Toolbar GET Library functions
**/

function getGracefulConceptMapToolbar(){

    var solverAddress="http://vocol.iais.fraunhofer.de/graceful-rat";
    var response;

        console.log("requesting an action that talks with docker ");
        // docker image name
        var get_requestAddress=solverAddress+"/library/crud";
        console.log("address :"+get_requestAddress);
        d3.xhr(get_requestAddress, "application/json",function (error, request) {
           if (request){
               console.log("docker returns data: "+request.responseText);
               // todo: process the returned data; to the widget
               response=request.responseText;
               loadWidgetItems(request.responseText);
               setDivActive(0);
               sfdRef.setupNode(0);

           }
           else{
           console.log("error!"+error.status);
               // if no server is running we simply use the current state of the library;

               var exampleLib='{"library":[{"icon":"./data/img/rain.png","name":"rain","parameters":[{"hoverText":"amount","name":"amount","imgURL":"./data/interfaces/amount.png","type":"Float"}],"interface":[{"hoverText":"rainfall","name":"rainfall","imgURL":"./data/interfaces/rainfall.png","type":"Port (Float)"}],"comment":"Rain"},{"icon":"./data/img/pump.png","name":"pump","parameters":[{"hoverText":"capacity","name":"capacity","imgURL":"./data/interfaces/capacity.png","type":"Float"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Float)"},{"hoverText":"outflow","name":"outflow","imgURL":"./data/interfaces/outflow.png","type":"Port (Float)"}],"comment":"Pump"},{"icon":"./data/img/runOffArea.png","name":"runoff area","parameters":[{"hoverText":"storage capacity","name":"storage capacity","imgURL":"./data/interfaces/storage capacity.png","type":"Float"}],"interface":[{"hoverText":"inflow","name":"inflow","imgURL":"./data/interfaces/inflow.png","type":"Port (Float)"},{"hoverText":"outlet","name":"outlet","imgURL":"./data/interfaces/outlet.png","type":"Port (Float)"},{"hoverText":"overflow","name":"overflow","imgURL":"./data/interfaces/overflow.png","type":"Port (Float)"}],"comment":"Runoff"}]}';
               console.log("loading static library -----> "+exampleLib);
               response=exampleLib;
           }
        });
        return response;
}
