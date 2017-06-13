var changeId = 0;

function createAccordion(pid, cid) {

	var panel = $('<div class="panel panel-default" id="'+pid+'"">' +
		'</div>');
	$("#accordion").append(panel);

	var panelHeading = $('<div class="panel-heading">' +
			'<h4 class="panel-title">' +
				'<a data-toggle="collapse" data-parent="#accordion" href="#'+cid+'""></a>' +
			'</h4>' +
		'</div>');
	$("#"+pid).append(panelHeading);

	$("#"+pid).append('<div class="panel-collapse collapse in" id="'+cid+'"></div>');

	var panelBody = $('<div class="panel-body">'+
			'<form>'+
			'</form>'+
		'</div>');
	$("#"+cid).append(panelBody);
}

function getID() {
	return changeId++;
}

function nodeOptions() {
	var id = getID();
	var panelId = "panel"+id;
	var collapseId = "collapse"+id;

	createAccordion(panelId, collapseId);

	$("#"+panelId).find("a").append("Nodes");

	var nodeForm = $(
		'<div class="form-group">'+
			'<label for="nType">Class type</label>'+
			'<select id = "nType" class="selectpicker form-control" title="Select">'+
				'<option>Factor</option>'+
				'<option>Action</option>'+
				'<option>Criteria</option>'+
				'</select>'+
		'</div>' +
		'<div class="form-group">' +
		  '<label for="nTitle">Node name</label>' +
		  '<input type="text" class="form-control" id="nTitle" disabled>' +
		'</div>' +
		'<div class="form-group">' +
			'<label for="nComments">Comments</label>' +
		    '<textarea class="form-control" id="nComments" placeholder="notes"></textarea>' +
		'</div>'
		);
	$("#"+collapseId).find("form").append(nodeForm);
}

function linkOptions() {
	var id = getID();
	var panelId = "panel"+id;
	var collapseId = "collapse"+id;

	createAccordion(panelId, collapseId);

	$("#"+panelId).find("a").append("Links");

	var linkForm = $(
		'<div class="form-group">'+
			'<label for="lType">Causal Relation</label>'+
			'<select id = "lType" class="selectpicker form-control" title="Select">'+
				'<option>+</option>'+
				'<option>-</option>'+
				'<option>?</option>'+
				'</select>'+
		'</div>' +
		'<div class="form-group">' +
			'<label for="lComments">Comments</label>' +
		    '<textarea class="form-control" id="lComments" placeholder="notes"></textarea>' +
		'</div>'
		);
	$("#"+collapseId).find("form").append(linkForm);
}

function controlWidget(graph) {
	var newDiv = $('<div class="panel-group" id="accordion"></div>');
	$(".controlsArea").append(newDiv);
	nodeOptions();
	linkOptions();
}

function setNodeDetails(node) {
	$('#nTitle').val(node.title);
	// node.type = $('#nType').find("option:selected").text();
	// $("#nType").val(node.type);
	$("#nType").change(function() {
		node.type = $('#nType').val();
		console.log("After: "+node.type);
	});
}

function linkDetails(link) {
	$("#lType").change(function() {
		link.relation = $('#lType').val();
		link.setRelation();
		console.log("After: "+link.relation);
	});
}
