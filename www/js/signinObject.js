var linkUrls = {
	"Training" : "training.html",
	"Anlass" : "event.html",
	"Match" : "match.html",
	"Hockeymatch" : "match.html",
	"Sitzung" : "meeting.html"
};

function getSigninObjectFromUrl(listId, url, type) {
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'riegeId' : getSavedRiege(type),
			'memberId' : getUserId()
		},
		beforeSend : startLoading,
		complete : finishLoading
	}).done(function(data) {
		addSinginObjectMenuEntry(listId, data);
	});
}

function addSinginObjectMenuEntry(listId, data) {
	var oldDateStamp;
	var listSelector = "#" + listId;
	if (data.length !== 0) {
		$.each(data, function(key, val) {
			var startDate = createDate(val.object.startDate.date);
			var dateStamp = getDateStamp(startDate);
			if (oldDateStamp !== dateStamp) {
				$(listSelector).append('<li data-role="list-divider">' + getDateString(startDate) + '</li>');
				oldDateStamp = dateStamp;
			}
			$(listSelector).append(createSinginObjectMenuEntry(val, 'time'));
		});
	} else {
		$(listSelector).append("<li>Keine Eintr&auml;ge vorhanden</li>");
	}
	$(listSelector).listview("refresh");
}

function getNextSigninObjectFromUrl(listId, url) {
	var listSelector = "#" + listId;
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'riegeId' : -1,
			'memberId' : getUserId()
		},
		beforeSend : startLoading,
		complete : finishLoading
	}).done(function(data) {
		$(listSelector).prepend(createSinginObjectMenuEntry(data[0], 'date'));
		$(listSelector).listview("refresh");
	});
}

function createSinginObjectMenuEntry(signinObjectAndStatus, dateType) {
	var signinObject = signinObjectAndStatus.object;
	var memberStatus = signinObjectAndStatus.status;
	var startDate = createDate(signinObject.startDate.date);
	var className = '';
	if (isLoggedIn()) {
		className = getMemberStatusCss(memberStatus);
	}
	var listEntry = '<li><a href="' + linkUrls[signinObject.type] + '?id=' + signinObject.id + '" class="' + className + '"><fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += '<h2>' + signinObject.name + '</h2>';
	listEntry += '<p><strong>' + signinObject.location.name + '</strong></p>';
	listEntry += '</div><div class="ui-block-b ui-li-aside">';
	if (dateType === 'date') {
		listEntry += '<p><strong>' + getDateTimeStamp(startDate) + '</strong></p>';
	} else {
		listEntry += '<p><strong>' + getTimeStamp(startDate) + '</strong></p>';
	}
	listEntry += '<p>' + signinObject.responsible.firstname + ' ' + signinObject.responsible.surname + '</p>';
	listEntry += '</div></fieldset></a></li>';
	return listEntry;
}

function loadSigninObject(viewId, url, id) {
	$("#" + id).empty();
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'id' : id,
			'memberId' : getUserId()
		},
		beforeSend : startLoading,
		complete : finishLoading
	}).done(function(data) {
		var signinObject = data.object;
		var memberStatus = data.status;
		var entries = data.entries;
		var countOfCarpools = data.carpoolCount;
		var startDate = createDate(signinObject.startDate.date);
		var endDate = createDate(signinObject.endDate.date);
		$("#pageTitle").text(signinObject.name);
		addKeyValueListEntry(viewId, 'Infos', signinObject.description);
		addKeyValueListEntry(viewId, 'Ort', signinObject.location.name);
		addKeyValueListEntry(viewId, 'Datum', getStartEndDate(startDate, endDate));
		addKeyValueListEntry(viewId, 'Verantwortlicher', signinObject.responsible.firstname + ' ' + signinObject.responsible.surname);
		if (isLoggedIn()) {
			if (memberStatus === MemberStatus.IN) {
				addPopupListEntry(viewId, 'Angemeldet', 'ui-icon-check', signinObject.id, MemberStatus.OUT);
			} else if (memberStatus === MemberStatus.OUT) {
				addPopupListEntry(viewId, 'Abgemeldet', 'ui-icon-delete', signinObject.id, MemberStatus.IN);
			} else {
				addTwoPopupListEntry(viewId, 'Anmelden', 'ui-icon-plus', 'Abmelden', 'ui-icon-minus', signinObject.id);
			}
			if (memberStatus === MemberStatus.SPECIAL) {
				addInformation(viewId, 'Als Helfer angemeldet!');
			}
			addKeyValueWithLinkListEntry(viewId, 'Fahrgemeinschaften', '<span class="ui-li-count">' + countOfCarpools + '</span>', 'carpools.html?id=' + signinObject.id);

			addMemberList(viewId, entries);
		}
		$("#" + viewId).listview("refresh");
	});
}

function addMemberList(listId, entries) {
	memberList = new Array();
	$.each(entries, function(key, entry) {
		memberList.push(entry.member.firstname + ' ' + entry.member.surname);
	});
	addListListEntry(listId, 'Anmeldungen  (Anmeldungen: ' + memberList.length + ')', memberList);
}

function initSignInPopupListEntry(id, status) {
	$("#signinObjectId").val(id);
	$("#status").val(status);
	if(status === MemberStatus.IN){
		$("#signinFrameTitle").text("Anmelden");
		$("#signinFrameButton").val("Anmelden");
	} else if(status === MemberStatus.OUT){
		$("#signinFrameTitle").text("Abmelden");
		$("#signinFrameButton").val("Abmelden");
	}
	$("#memberId").val(getUserId());
}

function signin() {
	var text = $("#signinFrameTitle").text();
	$("#signinForm").ajaxSubmit({
		url : getAPIUrl() + '/signinEntries.php',
		beforeSend : startLoading,
		complete : finishLoading,		
		success : function(data) {
			if (data.success) {
				alert(text + " erfolgreich");
				refreshPage();
			} else {
				alert(text + " fehlgeschlagen: " + data.error_message);
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}
	});
}

var stoargeKeys = {
	"eventRiege" : "TV_APP_eventRiege",
	"trainingRiege" : "TV_APP_trainingRiege",
	"matchRiege" : "TV_APP_matchRiege"
};

function getSavedRiege(type) {
	var riegeId = window.localStorage.getItem(stoargeKeys[type]);
	if(riegeId === null){
		riegeId = -2
	}
	return parseInt(riegeId);
}

function saveRiegeSelection(type, selection) {
	if (selection !== null) {
		window.localStorage.setItem(stoargeKeys[type], selection);
	}
}
