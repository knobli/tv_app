var linkUrls = {
	"Training" : "training.html",
	"Anlass" : "event.html",
	"Match" : "match.html",
	"Hockeymatch" : "match.html"
};

function getSigninObjectFromUrl(url, type) {
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'riegeId' : getSavedRiege(type),
			'memberId' : getUserId()
		}
	}).done(function(data) {
		addSinginObjectMenuEntry(data);
	});
}

function addSinginObjectMenuEntry(data) {
	var oldDateStamp;
	if (data.length != 0) {
		$.each(data, function(key, val) {
			var startDate = createDate(val.object.startDate.date);
			var dateStamp = getDateStamp(startDate);
			if (oldDateStamp != dateStamp) {
				$("#list").append('<li data-role="list-divider">' + getDateString(startDate) + '</li>');
				oldDateStamp = dateStamp;
			}
			$("#list").append(createSinginObjectMenuEntry(val, 'time'));
		});
	} else {
		$("#list").append("<li>Keine Eintr&auml;ge vorhanden</li>");
	}
	$("#list").listview("refresh");
}

function getNextSigninObjectFromUrl(url) {
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'riegeId' : -1,
			'memberId' : getUserId()
		}
	}).done(function(data) {
		$("#list").prepend(createSinginObjectMenuEntry(data[0], 'date'));
		$("#list").listview("refresh");
	});
}

function createSinginObjectMenuEntry(signinObjectAndStatus, dateType) {
	var signinObject = signinObjectAndStatus.object;
	var memberStatus = signinObjectAndStatus.status;
	var startDate = createDate(signinObject.startDate.date);
	var className = '';
	if (isLoggedIn()) {
		if (memberStatus === MemberStatus.IN) {
			className = 'signin';
		} else if (memberStatus === MemberStatus.OUT) {
			className = 'signout';
		}
	}
	var listEntry = '<li><a href="' + linkUrls[signinObject.type] + '?id=' + signinObject.id + '" rel="external" class="' + className + '"><fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += '<h2>' + signinObject.name + '</h2>';
	listEntry += '<p><strong>' + signinObject.location.name + '</strong></p>';
	listEntry += '</div><div class="ui-block-b ui-li-aside">';
	if (dateType == 'date') {
		listEntry += '<p><strong>' + getDateTimeStamp(startDate) + '</strong></p>';
	} else {
		listEntry += '<p><strong>' + getTimeStamp(startDate) + '</strong></p>';
	}
	listEntry += '<p>' + signinObject.responsible.firstname + ' ' + signinObject.responsible.surname + '</p>';
	listEntry += '</div></fieldset></a></li>';
	return listEntry;
}

function loadSigninObject(url, id) {
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'id' : id,
			'memberId' : getUserId()
		}
	}).done(function(data) {
		var signinObject = data.object;
		var memberStatus = data.status;
		var entries = data.entries;
		var countOfCarpools = data.carpoolCount;
		var startDate = createDate(signinObject.startDate.date);
		var endDate = createDate(signinObject.endDate.date);
		var listId = "list";
		$("#pageTitle").text(signinObject.name);
		addKeyValueListEntry(listId, 'Infos', signinObject.description);
		addKeyValueListEntry(listId, 'Ort', signinObject.location.name);
		addKeyValueListEntry(listId, 'Datum', getStartEndDate(startDate, endDate));
		addKeyValueListEntry(listId, 'Verantwortlicher', signinObject.responsible.firstname + ' ' + signinObject.responsible.surname);
		if (isLoggedIn()) {
			if (memberStatus === null || memberStatus == MemberStatus.NONE) {
				addTwoButtonListEntry(listId, 'Anmelden', 'ui-icon-plus', "signin(" + signinObject.id + ")", 'Abmelden', 'ui-icon-minus', "signout(" + signinObject.id + ")");
			} else if (memberStatus == MemberStatus.IN) {
				addButtonListEntry(listId, 'Angemeldet', 'ui-icon-check', "signout(" + signinObject.id + ")");
			} else if (memberStatus == MemberStatus.OUT) {
				addButtonListEntry(listId, 'Abgemeldet', 'ui-icon-delete', "signin(" + signinObject.id + ")");
			}
			addKeyValueWithLinkListEntry(listId, 'Fahrgemeinschaften', '<span class="ui-li-count">' + countOfCarpools + '</span>', 'carpools.html?id=' + signinObject.id);

			addMemberList(listId, entries);
		}
		$("#list").listview("refresh");
	});
}

function addMemberList(listId, entries) {
	memberList = new Array();
	$.each(entries, function(key, entry) {
		memberList.push(entry.member.firstname + ' ' + entry.member.surname);
	});
	addListListEntry(listId, 'Anmeldungen  (Anmeldungen: ' + memberList.length + ')', memberList);
}

function signin(id) {
	changeStatus(id, 1, "Anmeldung");
}

function signout(id) {
	changeStatus(id, 0, "Abmeldung");
}

function changeStatus(id, status, text) {
	$.ajax({
		type : "POST",
		url : getAPIUrl() + '/signinEntries.php',
		data : {
			'signinObjectId' : id,
			'memberId' : getUserId(),
			'status' : status,
			'comment' : 'Von Mobile App angepasst'
		},
		async : true
	}).done(function(data) {
		if (data.success) {
			alert(text + " erfolgreich");
			location.reload();
		} else {
			alert(text + " fehlgeschlagen: " + data.error_message);
		}
	});
}

var stoargeKeys = {
	"eventRiege" : "TV_APP_eventRiege",
	"trainingRiege" : "TV_APP_trainingRiege",
	"matchRiege" : "TV_APP_matchRiege"
};

function getSavedRiege(type) {
	return window.localStorage.getItem(stoargeKeys[type]);
}

function saveRiegeSelection(type, selection) {
	if (selection != null) {
		window.localStorage.setItem(stoargeKeys[type], selection);
	}
}
