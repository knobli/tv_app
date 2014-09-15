CarpoolType = {
	CAR : 1,
	BICYCLE : 2
}

function getCarpoolsFromUrl(url) {
	$.getJSON(url, function(data) {
		addCarpoolMenuEntry(data);
	});
}

function addCarpoolMenuEntry(data) {
	if (data.length != 0) {
		$.each(data, function(key, val) {
			$("#list").append(createCarpoolMenuEntry(val));
		});
	} else {
		$("#list").append("<li>Keine Eintr&auml;ge vorhanden</li>");
	}

	addLinkListEntry('list', 'Neue Fahrgemeinschaft hinzuf&uuml;gen', 'ui-icon-plus', 'add_carpool.html?id=' + id);
	$("#list").listview("refresh");
}

function createCarpoolMenuEntry(carpool) {
	var listEntry = '<li><a href="carpool.html?id=' + carpool.id + '" class="image-link" rel="external"><fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += '<div class="img-container"><div class="img-center-outer"><div class="img-center-inner">';
	if (carpool.type == CarpoolType.CAR) {
		listEntry += '<img src="img/glyphicons_005_car.png">';
	} else {
		listEntry += '<img src="img/glyphicons_306_bicycle.png">';
	}
	listEntry += '</div></div></div>';
	listEntry += '<h2>' + carpool.name + '</h2>';
	listEntry += '<p>' + carpool.responsible.firstname + ' ' + carpool.responsible.surname + '</p>';
	listEntry += '</div><div class="ui-block-b ui-li-aside">';
	listEntry += '<p>' + carpool.responsible.city + '</p><br>';
	if (isLoggedIn && getUserId() != carpool.responsible.id) {
		if (getMemberStatusForCarpool(carpool) == MemberStatus.IN) {
			listEntry += 'Angemeldet';
		} else {
			if (carpool.type == CarpoolType.BICYCLE) {
				listEntry += 'Let\'s go';
			} else {
				var freeSeats = getFreeSeats(carpool);
				if (freeSeats > 0) {
					if (freeSeats == 1) {
						listEntry += 'Noch ' + freeSeats + ' Platz';
					} else {
						listEntry += 'Noch ' + freeSeats + ' Pl&auml;tze';
					}
				} else {
					listEntry += 'kein Platz mehr';
				}
			}
		}
	}
	listEntry += '</div></fieldset></a></li>';
	return listEntry;
}

function getFreeSeats(carpool) {
	var size = carpool.size;
	var signins = 0;
	$.ajax({
		type : "GET",
		url : getAPIUrl() + '/carpoolEntry.php',
		data : {
			'carpoolId' : carpool.id,
			'countOnly' : true
		},
		async : false
	}).done(function(data) {
		signins = data;
	});
	return size - signins;
}

function loadCarpool(url) {
	$.getJSON(url, function(carpool) {
		var listId = "list";
		var startDate = createDate(carpool.signinObject.startDate.date);
		var title = "";
		if (carpool.type == CarpoolType.CAR) {
			title += '<img src="img/glyphicons_005_car.png">';
		} else {
			title += '<img src="img/glyphicons_306_bicycle.png">';
		}
		title += " " + carpool.name;
		$('#carpoolTitle').html(title);
		addKeyValueListEntry(listId, 'Termin', carpool.signinObject.name + ", " + getTimeStamp(startDate));
		addKeyValueListEntry(listId, 'Fahrer', carpool.responsible.firstname + ' ' + carpool.responsible.surname);
		addKeyValueListEntry(listId, 'Ort', carpool.responsible.city);
		if (isLoggedIn && getUserId() != carpool.responsible.id) {
			if (getMemberStatusForCarpool(carpool) == MemberStatus.IN) {
				addButtonListEntry(listId, 'Angemeldet', 'ui-icon-check', "signoutCarpool(" + carpool.id + ")");
			} else {
				addButtonListEntry(listId, 'Anmelden', 'ui-icon-plus', "signinCarpool(" + carpool.id + ")");
			}
		} else if (isLoggedIn && getUserId() == carpool.responsible.id) {
			addButtonListEntry(listId, 'L&ouml;schen', 'ui-icon-delete', "removeCarpool(" + carpool.id + "," + carpool.signinObject.id + ")");
		}
		addMemberListForCarpool(listId, carpool);
		$("#list").listview("refresh");
	});
}

function getMemberStatusForCarpool(carpool) {
	var memberStatus = null;
	$.ajax({
		type : "GET",
		url : getAPIUrl() + '/carpoolEntry.php',
		data : {
			'carpoolId' : carpool.id,
			'memberId' : getUserId()
		},
		async : false
	}).done(function(entry) {
		memberStatus = (entry == null) ? MemberStatus.OUT : MemberStatus.IN;
	});
	return memberStatus;
}

function addMemberListForCarpool(listId, carpool) {
	memberList = new Array();
	$.ajax({
		type : "GET",
		url : getAPIUrl() + '/carpoolEntry.php',
		data : {
			'carpoolId' : carpool.id,
		},
		async : false
	}).done(function(entries) {
		$.each(entries, function(key, entry) {
			memberList.push(entry.member.firstname + ' ' + entry.member.surname);
		});
	});
	var title = "Anmeldungen:";
	if (carpool.type == CarpoolType.CAR) {
		title = 'Anmeldungen  (Freie Pl&auml;tze: ' + (carpool.size - memberList.length) + ')';
	}
	addListListEntry(listId, title, memberList);
}

function signinCarpool(id) {
	changeStatusCarpool(id, 1, "Anmeldung");
}

function signoutCarpool(id) {
	changeStatusCarpool(id, 0, "Abmeldung");
}

function changeStatusCarpool(id, status, text) {
	$.ajax({
		type : "POST",
		url : getAPIUrl() + '/carpoolEntry.php',
		data : {
			'carpoolId' : id,
			'memberId' : getUserId(),
			'status' : status
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

function removeCarpool(id, signinObjectId) {
	$.ajax({
		type : "DELETE",
		url : getAPIUrl() + '/carpool.php',
		data : {
			'id' : id,
			'memberId' : getUserId()
		},
		async : true
	}).done(function(data) {
		if (data.success) {
			alert("Erfolgreich geloescht");
			window.history.back();
		} else {
			alert("Loeschen fehlgeschlagen: " + data.error_message);
		}
	});
}

function addCarpool() {
	$("#signinObjectId").val(getUrlParameter('id'));
	$("#memberId").val(getUserId());
	$("#carpoolForm").ajaxSubmit({
		url : getAPIUrl() + '/carpool.php',
		success : function(data) {
			if (data.success) {
				alert("Fahrgemeinschaft eingetragen");
				window.history.back();
			} else {
				alert("Speichern fehlgeschlagen: " + data.error_message);
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}
	});
}