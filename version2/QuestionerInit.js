var example;
var gHandlerObj=handler.create();
!function(){
    var initializer={};
    var previousSelectedWidget=undefined;
    var widgetList=[];
    var qWidget;


    initializer.width=function(){
        return window.innerWidth ;
    };

    initializer.height=function(){
        return window.innerHeight;
    };

    initializer.getNavigationObject=function(){
        return d3.select("#navBar");
    };

    initializer.getLogDiv=function () {
        return d3.select("#logoElement");

    };

    initializer.getTabsObject=function(){
        return d3.select("#tabsMenu");
    };

    initializer.getCanvasArea=function(){
        return d3.select("#canvasArea");
    };

    initializer.getOptionsArea=function(){
        return d3.select("#sidebar");
    };


    initializer.widgetActivated=function(widget){

        if (previousSelectedWidget===undefined){
            previousSelectedWidget=widget;
            return; // << nothing to do
        }
        if (widget===previousSelectedWidget){
            console.log("well you are already there");
            return;
        }
        previousSelectedWidget.deactivateWidget();
        previousSelectedWidget=widget;
    };

    initializer.initializeWidgets=function() {
        var width = document.getElementById('canvasArea').getBoundingClientRect().width;
        var height = document.getElementById('canvasArea').getBoundingClientRect().height;

        // console.log("CANVALS AREA "+width+"  "+height);

        // create communication module;
        var com=commod.create();



        // create an example widget;
        // keep it for debugging purpose.
        //   example = new ExampleWidget(initializer);
        //  example.setTabTitle("Example B");
        //  example.setupGuiElements(initializer.getNavigationObject(),
        //                           initializer.getTabsObject(),
        //                           initializer.getCanvasArea(),
        //                           initializer.getOptionsArea() );
        //  example.forceGraphCssStyle("exampleA");
        //  example.setCommunicationModule(com);
        //

        // widget generation


        // create simple sfd widget for testing (copy of example widget


        // create that questioner tool;
        qWidget=new StakeHolderWidget(initializer);
        qWidget.setTabTitle("Questionnaire");
        qWidget.setupGuiElements(initializer.getNavigationObject(),
            initializer.getTabsObject(),
            initializer.getCanvasArea(),
            initializer.getOptionsArea() );
        qWidget.setupControls();
        qWidget.setCommunicationModule(com);
        qWidget.setHandlerModule(gHandlerObj);



       qWidget.widgetIsActivated();


    };

    initializer.initializeWidgets();

    // overwrite the window resize function
    window.onresize = function(){
        qWidget.updateSvgSize();
        // for (var i=0;i<widgetList.length;i++) {
        //     if (widgetList[i].updateSvgSize) // check if function is implemented in widget
        //         widgetList[i].updateSvgSize();
        // }
    };

}();
