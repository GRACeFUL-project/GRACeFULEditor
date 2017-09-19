var pannelControlId=0;
var hrefButtonId=0;
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

    this.generateControls=function(){

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
        textEdit.placeholder = "notes";
        textEdit.disabled=!enabled;
        textEdit.value=defaultText;
        textEditNode.on("change",function(){onChangeFunction();});
        return textEditNode;

    };

    this.addNodeTypeChip=function(parent,label,icon,deleteGoal,id,editStatus,imgUrl,widgetType,widgeturl){
      var thisDiv=document.createElement('span');
      parent.getBody().node().appendChild(thisDiv);

      d3.select(thisDiv).classed("mdl-chip mdl-chip--contact mdl-chip--deletable", true);

      if(label=='rain' || label=='Rain' || label=='pump' || label=='runoff area')
        icon=imgUrl;
      else if(widgetType=="cld" || widgetType=="gt")
        icon=widgeturl;
      else
        icon = "http://www.clker.com/cliparts/p/0/L/e/j/B/red-circle-solid-hi.png";

      var image=document.createElement('img');
      thisDiv.appendChild(image);
      image.setAttribute('src',icon);
      d3.select(image).classed("mdl-chip__contact",true);

      var text=document.createElement('span');
      thisDiv.appendChild(text);
      text.innerHTML=label;
      text.setAttribute('contentEditable',editStatus);
      text.setAttribute('id',id);
      d3.select(text).classed("mdl-chip__text nodeChipField",true);

      if(widgetType!="sfd")
      {
          // bind deleteFunction with delete of Chip
          $("#"+id).bind('click',function() {
            text.setAttribute('contentEditable',true);

            $("#"+id).keydown(function(event){
              if(text.innerHTML=="empty"){
                text.innerHTML="";
              }

              if(event.keyCode==13){
                // change the text of the node here ..
                var checkblankchip=text.innerHTML;
                checkblankchip=(checkblankchip.trim) ? checkblankchip.trim() : checkblankchip.replace(/^\s+/,'');

                if(checkblankchip=="")
                  text.innerHTML="empty";

                that.selectedNode.clearDisplayLabelText();
                that.selectedNode.setDisplayLabelText(text.innerHTML);

                that.selectedNode.clearLabelText();
                that.selectedNode.setLabelText(text.innerHTML);

                this.blur();
                event.preventDefault();
              }
            })

          }).blur(
            function(){
              text.setAttribute('contentEditable',false);
            }
          );

          $("#"+id).on("paste",function(event){
            event.preventDefault();
          });
      };


      var link=document.createElement('a');
      thisDiv.appendChild(link);
      d3.select(link).on("click", function() {
          deleteGoal();
      });
      d3.select(link).classed('mdl-chip__action',true);

      var deleteIcon=document.createElement('i');
      link.appendChild(deleteIcon);
      deleteIcon.innerHTML="cancel";
      d3.select(deleteIcon).classed("material-icons",true);

      parent.getBody().node().appendChild(document.createElement('br'));
      parent.getBody().node().appendChild(document.createElement('br'));

      // If need to stylize spacing customly..
      // var breakElement=document.createElement('br');
      // d3.select(breakElement).classed("separator",true);

      var returnElements = new Array();
        returnElements[0]=text;
        returnElements[1]=image;

      return returnElements;
    }

    this.addSelectType=function(parent, label, options ){
      var thisDiv=document.createElement('div');
      parent.getBody().node().appendChild(thisDiv);

      d3.select(thisDiv).classed("",true);

    };

    this.addLineEdit=function(parent,label,defaultText,enabled,onChangeFunction){
        var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();

        var thisForm=document.createElement('form');
        parent.getBody().node().appendChild(thisForm);

        var thisDiv=document.createElement('div');
        thisForm.appendChild(thisDiv);
        // parent.getBody().node().appendChild(thisDiv);
        // d3.select(thisDiv).classed("mdl-textfield mdl-js-textfield mdl-textfield--floating-label",true);


        //'<input type="text" class="form-control" id="nTitle" disabled>' +
        var lb=document.createElement('label');
        lb.innerHTML=label;
        // lb.setAttribute("for",timeStampInMs);
        // d3.select(lb).classed("mdl-textfield__label", true);
        thisDiv.appendChild(lb);

        var le=document.createElement('input');
        thisDiv.appendChild(le);
        le.setAttribute("type","text");
        le.setAttribute("id", timeStampInMs);
        var leNode=d3.select(le);
        leNode.classed("mdl-textfield__input",true);
        le.disabled=!enabled;
        le.value=defaultText;

        leNode.on("change",function(){onChangeFunction();});
        return leNode;
    };

    this.addButtons = function(parent, label, btnId, onClickFunction) {
        var thisDiv=document.createElement('div');
        parent.getBody().node().appendChild(thisDiv);
        d3.select(thisDiv).classed("form-group",true);

        var button = document.createElement('button');
        button.type = "button";
        button.id = btnId;
        button.class = "mdl-cell mdl-cell--1-col";
        button.innerHTML = label;
        thisDiv.appendChild(button);

        d3.select(button).on("click", function() {
            onClickFunction();
        });
    };
//
// (parent, label, onClickFunction,ownDiv)
    this.addButton = function(parent, text, btnId, onClickFunction, btnType, btnIcon, btnIconType )
    {
      //by default raised button type
      var buttonClass="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";

      if( btnType == "flat")
        buttonClass="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" ;
      else if( btnType == "fab" )
        buttonClass="mdl-button mdl-js-button mdl-button--fab mdl-button--colored";


      // Create Parent Div with Correct Grid Layout in the GRID
      var buttonMainDiv = document.createElement('div');
        parent.getBody().node().appendChild(buttonMainDiv);
        d3.select(buttonMainDiv).classed("mdl-cell mdl-cell--12-col",true);

      // adding button to the dom element
      var button = document.createElement('button');
      parent.getBody().node().appendChild(button);
      d3.select(button).classed(buttonClass+" mdl-cell mdl-cell--12-col",true);
      button.setAttribute('id',btnId);
      // adding Icon to the button if required
      if(btnIcon==true)
      {
        var icon = document.createElement('i');
        d3.select(icon).classed("material-icons btn-icon-special",true);
        icon.innerHTML=btnIconType;
        button.appendChild(icon);
      }


      // add label text
      var label = document.createElement('span');
      label.innerHTML=text;
      button.appendChild(label);

      buttonMainDiv.appendChild(button);

      d3.select(button).on("click", function() {
          onClickFunction();
      });
      return button;
    }

    this.addHrefButton = function(parent, label, onClickFunction,ownDiv) {
        var thisDiv=undefined;
        if (ownDiv===true){
            thisDiv=document.createElement('div');
            parent.getBody().node().appendChild(thisDiv);
            d3.select(thisDiv).classed("form-group",true);
        }
        var hButton=document.createElement('a');
        hButton.innerHTML=label;
        hButton.id=this.parent.getUniqueId()+"_Controls_hrefButton_"+hrefButtonId;
        hButton.setAttribute("class", "hrefButton");
        hButton.onclick=function(){
            onClickFunction();
        };
        if (ownDiv===true){
        thisDiv.appendChild(hButton);
        }
        else parent.getBody().node().appendChild(hButton);

        hrefButtonId++;
        return hButton;
    };




    this.addCheckBox= function(parent, label, identifier, defaultValue, onClickFunction) {

        // todo: align the text element with the checkbox element...

        // var div_checkbox=  document.createElement("div");
        // div_checkbox.id=identifier;
        // parent.getBody().node().appendChild(div_checkbox);

        var moduleOptionContainer = parent.getBody()
            .append("div").classed("form-horizontal",true)
                .append("div")
                .classed("checkbox-inline", true);

            var moduleCheckbox = moduleOptionContainer.append("input")
              //  .classed("moduleCheckbox", true)

                .attr("id", identifier + "ModuleCheckbox")
                .attr("type", "checkbox")
                .property("checked", defaultValue);

            moduleCheckbox.on("click", function () {
                var isEnabled = moduleCheckbox.property("checked");
                onClickFunction(isEnabled);
            });
            moduleOptionContainer.append("label")
                .attr("for", identifier + "ModuleCheckbox")
                .classed("textStyleForCHeckBox",true)
                .text(label);

        parent.getBody().append("br")

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


    this.addTable=function(parent,tableName,headerArray){
        var thisDiv=document.createElement('div');
        parent.getBody().node().appendChild(thisDiv);
        // d3.select(thisDiv).classed("form-group",true);
        // d3.select(thisDiv).classed("mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--1dp",true);
        var lb=document.createElement('label');
        lb.innerHTML=tableName;
        thisDiv.appendChild(lb);
        // add a label tag;

        var table=document.createElement('table');

        // add table to div
        d3.select(table).classed("mdl-data-table mdl-js-data-table mdl-shadow--1dp", true);
        var percentage=100;

        d3.select(table).style("width",percentage+"%");
        thisDiv.appendChild(table);

        var row = table.insertRow(0);
        var head = table.createTHead();
        var tablerow=head.insertRow(0);
        for (var i=0; i<headerArray.length;i++){
              var cell = tablerow.insertCell(i);
              cell.innerHTML=headerArray[i];

        }

        d3.select(tablerow).classed("headerTable",true);
        // var body = table.appendChild(document.createElement('tbody'));

        thisDiv.appendChild(document.createElement('br'));
        thisDiv.appendChild(document.createElement('br'));

        // var tablerefody=table.getElementsByTagName('tbody')[0];

        return d3.select(table);
    };

    this.addGroup=function(parent,header){
        var thisDiv=document.createElement('div');
        parent.getBody().node().appendChild(thisDiv);
        d3.select(thisDiv).classed("form-group",true);
        var lb=document.createElement('label');

        lb.innerHTML=header;
        thisDiv.appendChild(lb);
        var groupDiv=document.createElement('div');
        d3.select(groupDiv).classed("form-group",true);
        return d3.select(groupDiv);
    };


    this.addLabel=function(parent,prefix,text){
        var thisDiv=document.createElement('div');
        parent.getBody().node().appendChild(thisDiv);
        d3.select(thisDiv).classed("form-group",true);
        var lb=document.createElement('label');

        lb.innerHTML=prefix+": "+text;
        thisDiv.appendChild(lb);
        d3.select(lb).attr("prefix",prefix);
        return d3.select(lb);
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
        // console.log("Calling Start of options -----------------------------------------------------------------------")
        that.initControls();
    };

    this.createAccordionGroup=function(parent,title){
        var accordion=new generateAccordion(parent,title);
       // console.log("generated Accordion group"+accordion );
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
            pDOM.appendChild(age);

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

    this.createModal = function(id, header, content) {
        var html =  '<div id="'+id+'" class="modal fade" tabindex="-1" role="dialog">';
        html += '<div class="modal-dialog">';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<a class="close" data-dismiss="modal">×</a>';
        html += '<h4>'+header+'</h4>'
        html += '</div>';
        html += '<div class="modal-body">';
        html += content;
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
        html += '</div>';  // content
        html += '</div>';  // dialog
        html += '</div>';  // footer
        html += '</div>';  // modalWindow
        $('body').append(html);
        $("#dynamicModal").modal();
        $("#dynamicModal").modal('show');

        $('#dynamicModal').on('hidden.bs.modal', function (e) {
            $(this).remove();
        });

        return html;
    };


    this.handleNodeSelection=function(node){
        // should be overwritten by the real options thing
    };


    this.handleNodeUnSelection=function(node){
        // should be overwritten by the real options thing

    };




}
BaseControls.prototype.constructor = BaseControls;
