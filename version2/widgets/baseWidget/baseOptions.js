var pannelControlId=0;

function BaseControls(parentWidget) {
    // todo: think about a parent widget
    /** variable defs **/

    var that = this;
    // this.parentWidget=parentWidget; // tells the graph which widget it talks to
    this.parent=parentWidget;

    this.cArea=undefined;
    this.divControlsGroup=undefined;
    this.divControlsGroupNode=undefined;
    this.selectedNode=undefined;

    var selectionNode;
    var lineEditNode;
    var commentNode;

    this.parentWidget=function(){
        return this.parent;
    };
    this.initControls=function(){
        this.cArea=that.parent.getOptionsArea();
        this.divControlsGroup=document.createElement('div');
        this.divControlsGroup.id=that.parent.getUniqueId()+"Opt";
        that.cArea.node().appendChild(that.divControlsGroup);

        var idStr=that.parent.getUniqueId()+"Opt";
        this.divControlsGroupNode=d3.select("#"+idStr);
        that.divControlsGroupNode.classed("hidden",true);
        // generate own controls
        that.generateControls();
    };

    this.activateControls=function(val){
        if (that.divControlsGroup===undefined){
            console.log("nothing to do");
        }
        // unhidde this div element
        that.divControlsGroupNode.classed("hidden",!val);

    };


//     this.addAccordionGroupElement=function(parentElement,title,classStyle,classHeader) {
//
//         var pDOM;
//         if (parentElement.node && parentElement.node()) {
//             pDOM=parentElement.node();
//         } else {
//             pDOM=parentElement;
//         }
//
//         var accordionClass="panel panel-default";
//         var headingClass="panel-heading";
//         var titleClass="group-title";
//
//
//
//         var age = document.createElement('div');
//         d3.select(age).classed(accordionClass,true);
//
//         age.id = parentWidget.getUniqueId() + "_AGE_" + pannelControlId;
//         var dataParentStr=parentWidget.getUniqueId() + "_AGE_" + pannelControlId;
//
//         pDOM.appendChild(age);
//         pannelControlId++;
//
//         // add the header
//         var heading=document.createElement('div');
//         d3.select(heading).classed(headingClass,true);
//         age.appendChild(heading);
//         // add h4 for pannel header
//         var titlePlace=document.createElement('div');
//         d3.select(titlePlace).classed(titleClass,true);
//
//         titlePlace.innerHTML=title;
//         heading.appendChild(titlePlace);
//
//         // add the accordion href;
//
//         // collapesd thing;
//
//
//
//         // create a test form group
//
//         var collapsElement=document.createElement('div');
//         d3.select(collapsElement).classed("panel-collapse collapse in",true);
//         collapsElement.id="qwe";
//         age.appendChild(collapsElement);
//
//         // create pannel body;
//         var pannelBody=document.createElement('div');
//         d3.select(pannelBody).classed("panel-body",true);
//         collapsElement.appendChild(pannelBody);
//         var fm=document.createElement('form');
//         pannelBody.appendChild(fm);
//
//
//
//
//
//
//
//
//
//
//
//
//
// };

    this.generateControls=function(){
        // add particular control elements

        // eg
        // that.addButton(divDrawThing,"text",style,onClick,updateLevel)

        // debugging approach
       // that.addAccordionGroupElement(that.divControlsGroupNode,"Hello");


        // // testing stuff,
        // var accordion = that.createAccordionGroup(that.divControlsGroupNode,"Nodes");
        // selectionNode = that.addSelectionOpts(accordion,"Selection",["Option A", "Option B", "Option C"],that.onSelectionTest);
        // lineEditNode  = that.addLineEdit(accordion,"Line Edit","empty",false,that.onLineEditChangeFunc);
        // commentNode   = that.addTextEdit(accordion,"Text Edit","empty Text edit ",false,that.onTextEditChangeFunc);

    };


    this.addTextEdit=function(parent,label,defaultText,enabled,onChangeFunction){
        var thisDiv=document.createElement('div');
        parent.getBody().node().appendChild(thisDiv);
        d3.select(thisDiv).classed("form-group",true);

        var lb=document.createElement('label');
        lb.innerHTML=label;
        thisDiv.appendChild(lb);

        //<textarea class="form-control" id="lComments" placeholder="notes"></textarea>' +
        var textEdit=document.createElement('textarea');
        thisDiv.appendChild(textEdit);
        var textEditNode=d3.select(textEdit);
        textEditNode.classed("form-control",true);
        textEdit.disabled=!enabled;
        textEdit.value=defaultText;
        textEditNode.on("change",function(){onChangeFunction();});
        return textEditNode;

    };

    this.addLineEdit=function(parent,label,defaultText,enabled,onChangeFunction){

        var thisDiv=document.createElement('div');
        parent.getBody().node().appendChild(thisDiv);
        d3.select(thisDiv).classed("form-group",true);


        var lb=document.createElement('label');
        lb.innerHTML=label;
        thisDiv.appendChild(lb);

        //'<input type="text" class="form-control" id="nTitle" disabled>' +
        var le=document.createElement('input');
        thisDiv.appendChild(le);
        var leNode=d3.select(le);
        leNode.classed("form-control",true);
        le.disabled=!enabled;
        le.value=defaultText;

        leNode.on("change",function(){onChangeFunction();});
        return leNode;
    };

    this.onLineEditChangeFunc=function(){
        console.log("Line edit change");
        that.selectedNode.setLabelText(lineEditNode.node().value);


    };
    this.onTextEditChangeFunc=function(){
        console.log("Line edit change");
        that.selectedNode.setHoverText(commentNode.node().value);
    };


    this.addSelectionOpts=function(parent,label,optsArray,onSelectionFunction){
        var thisDiv=document.createElement('div');
        parent.getBody().node().appendChild(thisDiv);
        d3.select(thisDiv).classed("form-group",true);

        var lb=document.createElement('label');
        lb.innerHTML=label;
        thisDiv.appendChild(lb);

        var sel=document.createElement('select');
        sel.id="selectionIdQ";
        d3.select(sel).classed("selectpicker form-control",true);
        thisDiv.appendChild(sel);

        for (var i=0;i<optsArray.length;i++){
            var optA=document.createElement('option');
            optA.innerHTML=optsArray[i];
            sel.appendChild(optA);
        }
        d3.select(sel).on("change",function(){onSelectionFunction(sel)});
        return d3.select(sel);

    };

    this.onSelectionTest=function(els){
        var el=els;
        var strUser = el.options[el.selectedIndex].value;
        console.log(el.selectedIndex+" the user string is "+strUser);
        if (el.selectedIndex==0) {
            that.selectedNode.setTestClass("nodeOptionA",true);
            that.selectedNode.setTestClass("nodeOptionB",false);
            that.selectedNode.setTestClass("nodeOptionC",false);
        }
        if (el.selectedIndex==1){
            that.selectedNode.setTestClass("nodeOptionA",false);
            that.selectedNode.setTestClass("nodeOptionB",true);
            that.selectedNode.setTestClass("nodeOptionC",false);

        }
        if (el.selectedIndex==2){
            that.selectedNode.setTestClass("nodeOptionA",false);
            that.selectedNode.setTestClass("nodeOptionB",false);
            that.selectedNode.setTestClass("nodeOptionC",true);

        }

    };

    this.start=function(){
        console.log("Calling Start of options -----------------------------------------------------------------------")
        that.initControls();
    };

    this.createAccordionGroup=function(parent,title){
        var accordion=new generateAccordion(parent,title);
        console.log("generated Accordion group"+accordion );
        return accordion;
    };


    that.start();

/** generation of the individual control elements as base functions **/





    function generateAccordion(parentElement,title){
        var group={};
        var accordionClass="panel panel-default";
        var headingClass="panel-heading";
        var titleClass="group-title";
        var bodyClass="panel-body";
        var that=this;
        group.generateElements=function(parent){
            var pDOM;
            if (parent.node && parent.node()) {
                pDOM=parent.node();
            } else {
                pDOM=parent;
            }
            // create element for header and body
            var age = document.createElement('div');
            group.ageNode=d3.select(age);
            pDOM.append(age);

            // create header space
            var heading=document.createElement('div');
            age.appendChild(heading);
            group.headerNode=d3.select(heading);

            // create
            var titlePlace=document.createElement('div');
            heading.appendChild(titlePlace);
            group.titleNode=d3.select(titlePlace);
            group.titleNode.on("click",function () {
                var current=group.bodyNode.classed("hidden");
                group.bodyNode.classed("hidden",!current);
            });
            // create body;
            var pannelBody=document.createElement('div');
            age.appendChild(pannelBody);
            group.bodyNode=d3.select(pannelBody);
            group.bodyNode.classed("hidden",false);
        };


        this.collapseBody=function(){
            group.bodyNode.classed("hidden",true);
        };
        this.expandBody=function(){
            group.bodyNode.classed("hidden",false);
        };

        this.setTitle=function(text){
            group.titleNode.node().innerHTML=text;
        };

        this.setGroupClass=function(css){
            group.ageNode.classed(css,true)
        };
        this.setHeadingClass=function(css){
            group.headerNode.classed(css,true)
        };
        this.setTitleClass=function(css){
            group.titleNode.classed(css,true);
        };

        this.setBodyClass=function(css){
            group.bodyNode.classed(css,true);
        };

        this.getBody=function(){
            return group.bodyNode;
        };

        group.generateElements(parentElement);
        that.setTitle(title);
        that.setGroupClass(accordionClass);
        that.setHeadingClass(headingClass);
        that.setTitleClass(titleClass);
        that.setBodyClass(bodyClass);

    }// end of base group funcion


    this.handleNodeSelection=function(node){
        // should be overwritten by the real options thing
    };


    this.handleNodeUnSelection=function(node){
        // should be overwritten by the real options thing

    };




}
BaseControls.prototype.constructor = BaseControls;



