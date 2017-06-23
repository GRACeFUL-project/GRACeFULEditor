!function(){
    var initializer={};
    var previousSelectedWidget=undefined;
    var widgetList=[];

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
        return d3.select("#canvasArea")
    };

    initializer.getOptionsArea=function(){
        return d3.select("#sidebar")
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

        // create an example widget;
        // keep it for debugging purpose.
         // var example = new ExampleWidget(initializer);
         // example.setTabTitle("Example A");
         // example.setupGuiElements(initializer.getNavigationObject(),
         //                          initializer.getTabsObject(),
         //                          initializer.getCanvasArea(),
         //                          initializer.getOptionsArea() );
         // example.forceGraphCssStyle("exampleA");


        // widget generation
        var gtw= new GTWidget(initializer);
        gtw.setTabTitle("GoalTree");
        gtw.setupGuiElements(initializer.getNavigationObject(),
            initializer.getTabsObject(),
            initializer.getCanvasArea(),
            initializer.getOptionsArea() );
        gtw.forceGraphCssStyle("goalTreeGraphStyle");


        var cld= new CLDWidget(initializer);
        cld.setTabTitle("Causal Loop Diagram");
        cld.setupGuiElements(initializer.getNavigationObject(),
            initializer.getTabsObject(),
            initializer.getCanvasArea(),
            initializer.getOptionsArea() );
        cld.forceGraphCssStyle("cldGraphStyle");

        // adding to widget list
        // widgetList.push(example);
        widgetList.push(gtw);
        widgetList.push(cld);


        // set default tab
        //gtw.widgetIsActivated();
        //example.widgetIsActivated();
        cld.widgetIsActivated();



    };

    initializer.initializeWidgets();


    // overwrite the window resize function
    window.onresize = function(){
        for (var i=0;i<widgetList.length;i++) {
            if (widgetList[i].updateSvgSize) // check if function is implemented in widget
                widgetList[i].updateSvgSize();
        }
    };


}();
