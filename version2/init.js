var example;
var gHandlerObj=handler.create();

!function(){
    var initializer={};

    var previousSelectedWidget=undefined;
    var widgetList=[];
    var gtw, cld,sfd;


    function loadGoalTreeElements(){
        setReferenceOfGoalTreeDiagram(gtw);
        var leftbar = document.getElementById('widgetListGT') ;
        var htmlCollection = leftbar.children;
        var numEntries = htmlCollection.length;

        var i,temp;
        for ( i = 0; i < numEntries; i++) {
            htmlCollection[0].remove();
        }
        var object=[];
        var undef={name:"UDef"};
        var goal={name:"Goal",color:'#65e1c4'};
        var subgoal={name:"Sub-Goal",color:'#65c0e1'};
        var criterion={name:"Criterion",color:'#fdd2b5'};

        object.push(undef);
        object.push(goal);
        object.push(subgoal);
        object.push(criterion);
        var widgetItemDiv,imgItem,nameDiv;
        for( i=0; i < object.length ; i++ ) {
            temp = object[i];
            widgetItemDiv = document.createElement("div");
            leftbar.appendChild(widgetItemDiv);

            widgetItemDiv.setAttribute("id","gt"+i);
            widgetItemDiv.setAttribute("onclick", "setDivActiveGTW("+i+")");
            leftbar.appendChild(widgetItemDiv);
            d3.select(widgetItemDiv).classed("widgetItem",true);
            imgItem=d3.select(widgetItemDiv).append('svg');
            imgItem.attr("width",100);
            imgItem.attr("height",100);
            var rect=imgItem.append('rect');
            rect.attr("x",0)
                .attr("y",15)
                .attr("rx",8)
                .attr("ry",8)
                .attr("width",100)
                .attr("height",80);
            rect.style("fill",temp.color);
            rect.style("stroke",'white');
            rect.style("stroke-width",'2px');
            widgetItemDiv.appendChild(document.createElement("br"));
            nameDiv = document.createElement("div");
            nameDiv.innerHTML= temp.name;
            widgetItemDiv.appendChild(nameDiv);
            if (i===0) d3.select(widgetItemDiv).classed("hidden",true);
        }
    }

    function loadCLD_ElementsFromLib(jsonOBJ){
            setReferenceOfCLD(cld);
            var leftbar = document.getElementById('widgetListCLD') ;
            var htmlCollection = leftbar.children;
            var numEntries = htmlCollection.length;

            var i,temp;
            for ( i = 0; i < numEntries; i++) {
                htmlCollection[0].remove();
            }

            var object=[];
            object.push({name:"undef"}); // hidden element
            for (i=0;i<jsonOBJ.library.length;i++){
                object.push(jsonOBJ.library[i]);
            }
            var widgetItemDiv,imgItem,nameDiv;
            for( i=0; i < object.length ; i++ ) {
                temp = object[i];
                widgetItemDiv = document.createElement("div");
                leftbar.appendChild(widgetItemDiv);

                widgetItemDiv.setAttribute("id","cld"+i);
                widgetItemDiv.setAttribute("onclick", "setDivActiveCLD("+i+")");
                leftbar.appendChild(widgetItemDiv);
                d3.select(widgetItemDiv).classed("widgetItem",true);
                imgItem=d3.select(widgetItemDiv).append('svg');
                imgItem.attr("width",100);
                imgItem.attr("height",100);
                var circ=imgItem.append('circle');
                circ.attr("cx",50)
                    .attr("cy",50)
                    .attr("r",40);
                circ.style("fill",temp.color);
                circ.style("stroke",'white');
                circ.style("stroke-width",'2px');
                widgetItemDiv.appendChild(document.createElement("br"));
                nameDiv = document.createElement("div");
                nameDiv.innerHTML= temp.name;
                widgetItemDiv.appendChild(nameDiv);
                if (i===0) d3.select(widgetItemDiv).classed("hidden",true);
            }


    }

    function prepareFullLibCLD(fullLib){
        console.log(fullLib);
        var jsonIbj=JSON.parse(fullLib);
        var libArray=jsonIbj.library;
        var obj={};
        obj.name="FULL GCM MODEL";
        // here we filter things out;;
        obj.library=[]; // array of objects
        // creating forloop style;
        // skipping the first 2 elements // currently dont know how to add them;
        for (var i=0;i<libArray.length;i++){
            var currentElement=libArray[i];

            // create an object;
            var libElement={};
            libElement.name=currentElement.name;
            libElement.description=currentElement.comment;
            libElement.parameters=[];
            libElement.type="NODAL";

            if (libElement.name==="node" ||
                libElement.name==="action" ||
                libElement.name==="criterion") {
                if (libElement.name === "node") {
                    // has no interface -.-
                    libElement.imgURL = "./images/factorNode.png";
                    libElement.type = "CAUSAL";
                    libElement.name = "factor";
                    libElement.color="#addcc9";
                }
                if (libElement.name === "action") {
                    libElement.imgURL = "./images/adaptation_action.png";
                    libElement.type = "CAUSAL";
                    libElement.color="#f48b94";
                }
                if (libElement.name === "criterion") {
                    libElement.imgURL = "./images/criterion.png";
                    libElement.color="#fdd2b5";
                    libElement.type = "CAUSAL";
                }
                obj.library.push(libElement);
            }
        }
        console.log(obj);
        return obj;


    }

    initializer.loadSideBarElements=function(fullLib){
        console.log("Loading SideBar Elements");

        // load goalTree Elements;


        loadGoalTreeElements();
        loadCLD_ElementsFromLib(prepareFullLibCLD(fullLib));
        // sfd can handle this it self;
        setReferenceOfSFD(sfd);
        sfd.loadLibrary(fullLib,true);

    };

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
        // var width = document.getElementById('canvasArea').getBoundingClientRect().width;
        // var height = document.getElementById('canvasArea').getBoundingClientRect().height;

        // console.log("CANVALS AREA "+width+"  "+height);

        // create communication module;
        var com=commod.create();
                com.setInitPtr(initializer);
        console.log(com);


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
        gtw= new GTWidget(initializer);
        gtw.setTabTitle("Goal Tree");
        gtw.setupGuiElements(initializer.getNavigationObject(),
            initializer.getTabsObject(),
            initializer.getCanvasArea(),
            initializer.getOptionsArea() );
        gtw.forceGraphCssStyle("goalTreeGraphStyle");
        gtw.setCommunicationModule(com);
        gtw.setHandlerModule(gHandlerObj);

        cld= new CLDWidget(initializer);
        cld.setTabTitle("Causal Loop Diagram");
        cld.setupGuiElements(initializer.getNavigationObject(),
            initializer.getTabsObject(),
            initializer.getCanvasArea(),
            initializer.getOptionsArea() );
        cld.forceGraphCssStyle("cldGraphStyle");
        cld.setCommunicationModule(com);
        cld.setHandlerModule(gHandlerObj);

        // create simple sfd widget for testing (copy of example widget


        // create that questioner tool;
        var qWidget=new QuestionerWidget(initializer);
        qWidget.setTabTitle("Stakeholder Survey");
        qWidget.setupGuiElements(initializer.getNavigationObject(),
            initializer.getTabsObject(),
            initializer.getCanvasArea(),
            initializer.getOptionsArea() );
        qWidget.setupControls();
        qWidget.setCommunicationModule(com);
        qWidget.setHandlerModule(gHandlerObj);
        qWidget.setGoalTreePtr(gtw);


        sfd= new SimpleSFDWidget(initializer);
        sfd.setTabTitle("GRACeFUL Concept Map");
        sfd.setupGuiElements(initializer.getNavigationObject(),
            initializer.getTabsObject(),
            initializer.getCanvasArea(),
            initializer.getOptionsArea() );
        sfd.forceGraphCssStyle("sdfGraphStyle");
        //load the node types from backend.
        var action={};
        action.task="SERVER_REQUEST";
        action.requestType="GET_LIBRARY";
        action.libraryName="fullgcm";
        sfd.setCommunicationModule(com);
        sfd.setHandlerModule(gHandlerObj);
        sfd.requestAction(action);


        // adding to widget list
    //    widgetList.push(example);
        widgetList.push(gtw);
        widgetList.push(cld);
        widgetList.push(qWidget);
        widgetList.push(sfd);

        gtw.widgetIsActivated();

        // set the ptrs; // a bit hardCoded stuff for the communication
        cld.setPtrToGoalTreeGraphObject(gtw.getGraphObject());
        cld.setPtrToSFDGraphObject(sfd.getGraphObject());

        gtw.setPtrToCLDGraphObject(cld.getGraphObject());
        gtw.setPtrToSFDGraphObject(sfd.getGraphObject());

        sfd.setPtrToGTWGraphObject(gtw.getGraphObject());
        sfd.setPtrToCLDGraphObject(cld.getGraphObject());


    };

    initializer.initializeWidgets();
    cld.connectGt(gtw);
    console.log("Initializing things");
    console.log(gtw);
    console.log(cld);
    console.log(sfd);
    gHandlerObj.setWidgetList(gtw,cld,sfd);



    // overwrite the window resize function
    window.onresize = function(){
        for (var i=0;i<widgetList.length;i++) {
            if (widgetList[i].updateSvgSize) // check if function is implemented in widget
                widgetList[i].updateSvgSize();
        }
    };

}();
