function getResultsFromUrl(id, url) {
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'memberId' : getUserId()
		},
		beforeSend : startLoading,
		complete : finishLoading			
	}).done(function(data) {
		addResultEntry(id, data);
	});
}

function addResultEntry(id, data) {
	if (data.length != 0) {
		$.each(data, function(key, val) {
			$("#" + id).append(createResultEntry(val));
		});
	} else {
		$("#" + id).append("<li>Keine Eintr&auml;ge vorhanden</li>");
	}
	$("#" + id).listview("refresh");
}

function createResultEntry(result) {
	var startDate = createDate(result.event.startDate.date);
	var listEntry = '<li><fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += '<h2>' + result.discipline.name + '</h2>';
	listEntry += '<p>' + result.event.name + '</p>';
	listEntry += '</div><div class="ui-block-b ui-li-aside">';
	listEntry += '<p><strong>' + result.value + '</strong></p>';
	listEntry += '<p>' + getDateStamp(startDate) + '</p>';
	listEntry += '</div></fieldset></li>';
	return listEntry;
}