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
        console.log("requesting controls Area"+d3.select("#controlsArea"));
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

    initializer.initTabMenu=function(){
        // console.log("initalizing the logo");
        // var tabMenu=initializer.getLogDiv();
        // var tabWidgetHolder=tabMenu.node();
        //
        // var listItem = document.createElement('li');
        // tabWidgetHolder.appendChild(listItem);
        //
        // var linkItem=document.createElement('a');
        // listItem.appendChild(linkItem);
        //
        // linkItem.class="navbar-brand";
        // listItem.href="#";
        // var image=document.createElement('image');
        // linkItem.appendChild(image);
        //
        // image.id="log";
        // image.class="img-responsive";
        // image.src="images/logo.svg";
        // image.alt="Graceful Logo";


        
        
        



    };


    initializer.initializeWidgets=function() {

        initializer.initTabMenu();

        var width = document.getElementById('canvasArea').getBoundingClientRect().width;
        var height = document.getElementById('canvasArea').getBoundingClientRect().height;

        console.log("CANVALS AREA "+width+"  "+height);

        // create an example widget;
       //  var example = new ExampleWidget(initializer);
       //  example.setTabTitle("Example A");
       //  example.setupGuiElements(initializer.getNavigationObject(),
       //                           initializer.getTabsObject(),
       //                           initializer.getCanvasArea(),
       //                           initializer.getOptionsArea() );

       //  example.forceGraphCssStyle("exampleA");
       // // example.widgetIsActivated();

       //  var exampleB = new ExampleWidget(initializer);
       //  exampleB.setTabTitle("Example B");
       //  exampleB.setupGuiElements(initializer.getNavigationObject(),
       //      initializer.getTabsObject(),
       //      initializer.getCanvasArea(),
       //      initializer.getOptionsArea() );
       //  exampleB.forceGraphCssStyle("exampleB");
       //  exampleB.widgetIsActivated();


        var exampleC = new GTWidget(initializer);
        exampleC.setTabTitle("GoalTree");
        exampleC.setupGuiElements(initializer.getNavigationObject(),
            initializer.getTabsObject(),
            initializer.getCanvasArea(),
            initializer.getOptionsArea() );
        exampleC.forceGraphCssStyle("exampleC");
        exampleC.widgetIsActivated();

        var exampleD = new CLDWidget(initializer);
        exampleD.setTabTitle("Causal Loop Diagram");
        exampleD.setupGuiElements(initializer.getNavigationObject(),
            initializer.getTabsObject(),
            initializer.getCanvasArea(),
            initializer.getOptionsArea() );
        exampleD.forceGraphCssStyle("exampleD");

        // widgetList.push(example);
        // widgetList.push(exampleB);
        widgetList.push(exampleC);
        widgetList.push(exampleD);

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
