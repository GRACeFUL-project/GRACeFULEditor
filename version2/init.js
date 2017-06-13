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

    initializer.getTabsObject=function(){
        return d3.select("#tabsMenu");
    };

    initializer.getCanvasArea=function(){
        return d3.select("#canvasArea")
    };

    initializer.getOptionsArea=function(){
        return d3.select("#controlsArea")
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

        console.log("CANVALS AREA "+width+"  "+height);

        // create an example widget;
        var example = new ExampleWidget(initializer);
        example.setTabTitle("Example A");
        example.setupGuiElements(initializer.getNavigationObject(),
                                 initializer.getTabsObject(),
                                 initializer.getCanvasArea(),
                                 initializer.getOptionsArea() );

        example.forceGraphCssStyle("exampleA");
       // example.widgetIsActivated();

        var exampleB = new ExampleWidget(initializer);
        exampleB.setTabTitle("Example B");
        exampleB.setupGuiElements(initializer.getNavigationObject(),
            initializer.getTabsObject(),
            initializer.getCanvasArea(),
            initializer.getOptionsArea() );
        exampleB.forceGraphCssStyle("exampleB");
        exampleB.widgetIsActivated();
        widgetList.push(example);
        widgetList.push(exampleB);

    };

    initializer.initializeWidgets();

    // overwrite the window resize function
    window.onresize = function(){
        var width = document.getElementById('canvasArea').getBoundingClientRect().width;
        var height = document.getElementById('canvasArea').getBoundingClientRect().height;
        console.log("CANVALS AREA "+width+"  "+height);

        for (var i=0;i<widgetList.length;i++) {
            if (widgetList[i].updateSvgSize) // check if function is implemented in widget
                widgetList[i].updateSvgSize();
        }
    };


}();
