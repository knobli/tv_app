CarpoolType = {
	CAR : 1,
	BICYCLE : 2
}

function getCarpoolsFromUrlForMember(listId, url){
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'memberId' : getUserId()
		},
		beforeSend : startLoading,
		complete : finishLoading
	}).done(function(data) {
		addCarpoolMenuEntry(listId, data, signinObjectId, 'time');
	});	
}

function getCarpoolsFromUrl(listId, url, signinObjectId) {
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'memberId' : getUserId(),
			'signinObjectId' : signinObjectId,
		},
		beforeSend : startLoading,
		complete : finishLoading
	}).done(function(data) {
		addCarpoolMenuEntry(listId, data, signinObjectId, null);
		addAddCarpoolEntry(listId, signinObjectId);
	});
}

function addCarpoolMenuEntry(listId, data, signinObjectId, dateType) {
	var oldDateStamp;
	var listSelector = "#" + listId;
	if (data.length !== 0) {
		$.each(data, function(key, val) {
			if(dateType === 'time'){
				var startDate = createDate(val.carpool.signinObject.startDate.date);
				var dateStamp = getDateStamp(startDate);
				if (oldDateStamp !== dateStamp) {
					$(listSelector).append('<li data-role="list-divider">' + getDateString(startDate) + '</li>');
					oldDateStamp = dateStamp;
				}			
			}
			$(listSelector).append(createCarpoolMenuEntry(val, dateType));
		});
	} else {
		$(listSelector).append("<li>Keine Eintr&auml;ge vorhanden</li>");
	}
	$(listSelector).listview("refresh");
}

function addAddCarpoolEntry(listId, signinObjectId){
	var listSelector = "#" + listId;
	addLinkListEntry(listId, 'Neue Fahrgemeinschaft hinzuf&uuml;gen', 'ui-icon-plus', 'add_carpool.html?id=' + signinObjectId);
	$(listSelector).listview("refresh");
}

function createCarpoolMenuEntry(item, dateType) {
	var carpool = item.carpool;
	var memberStatus = item.status;
	var startDate = createDate(carpool.signinObject.startDate.date);
	var listEntry = '<li><a href="carpool.html?id=' + carpool.id + '" class="image-link"><fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += '<div class="img-container"><div class="img-center-outer"><div class="img-center-inner">';
	if (carpool.type === CarpoolType.CAR) {
		listEntry += '<img src="img/glyphicons_005_car.png">';
	} else {
		listEntry += '<img src="img/glyphicons_306_bicycle.png">';
	}
	listEntry += '</div></div></div>';
	listEntry += '<h2>' + carpool.name + '</h2>';
	listEntry += '<p>' + carpool.responsible.firstname + ' ' + carpool.responsible.surname + '</p>';
	if(dateType === 'time'){
		listEntry += '<p>' + getTimeStamp(startDate) + '</p>';
	}
	listEntry += '</div><div class="ui-block-b ui-li-aside">';
	listEntry += '<p>' + carpool.responsible.city + '</p><br>';
	if (isLoggedIn() && getUserId() != carpool.responsible.id) {
		if (memberStatus === MemberStatus.IN) {
			listEntry += 'Angemeldet';
		} else {
			if (carpool.type === CarpoolType.BICYCLE) {
				listEntry += 'Let\'s go';
			} else {
				var freeSeats = getFreeSeats(carpool);
				if (freeSeats > 0) {
					if (freeSeats === 1) {
						listEntry += freeSeats + ' Platz';
					} else {
						listEntry += freeSeats + ' Pl&auml;tze';
					}
				} else {
					listEntry += 'kein Platz';
				}
			}
		}
	}
	listEntry += '</div></fieldset></a></li>';
	return listEntry;
}

function getFreeSeats(carpool) {
	return carpool.size - carpool.signinsCount;
}

function loadCarpool(listId, url, id) {
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
		addCarpoolEntry(listId, data);
	});
}

function addCarpoolEntry(listId, data) {
	var carpool = data.carpool;
	var memberStatus = data.status;
	var startDate = createDate(carpool.signinObject.startDate.date);
	var title = "";
	if (carpool.type === CarpoolType.CAR) {
		title += '<img src="img/glyphicons_005_car.png">';
	} else {
		title += '<img src="img/glyphicons_306_bicycle.png">';
	}
	title += " " + carpool.name;
	$('#carpoolTitle').html(title);
	addKeyValueListEntry(listId, 'Termin', carpool.signinObject.name + ", " + getTimeStamp(startDate));
	var responsibleName = (carpool.type === CarpoolType.CAR) ? 'Fahrer' : 'Organisator';
	addKeyValueListEntry(listId, responsibleName, carpool.responsible.firstname + ' ' + carpool.responsible.surname);
	addKeyValueListEntry(listId, 'Ort', carpool.responsible.city);
	if(carpool.type === CarpoolType.CAR){
		addKeyValueListEntry(listId, 'Anzahl Pl&auml;tze', carpool.size);
	}
	if (isLoggedIn() && getUserId() != carpool.responsible.id) {
		if (memberStatus === MemberStatus.IN) {
			addButtonListEntry(listId, 'Angemeldet', 'ui-icon-check', "signoutCarpool(" + carpool.id + ")");
		} else if (carpool.size - carpool.members.length > 0) {
			addButtonListEntry(listId, 'Anmelden', 'ui-icon-plus', "signinCarpool(" + carpool.id + ")");
		}
	} else if (isLoggedIn && getUserId() == carpool.responsible.id) {
		addButtonListEntry(listId, 'L&ouml;schen', 'ui-icon-delete', "removeCarpool(" + carpool.id + "," + carpool.signinObject.id + ")");
	}
	addMemberListForCarpool(listId, carpool);
	$("#" + listId).listview("refresh");
}

function addMemberListForCarpool(listId, carpool) {
	memberList = new Array();
	$.each(carpool.members, function(key, member) {
		memberList.push(member.firstname + ' ' + member.surname);
	});
	var title = "Anmeldungen:";
	if (carpool.type === CarpoolType.CAR) {
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
		beforeSend : startLoading,
		complete : finishLoading
	}).done(function(data) {
		if (data.success) {
			alert(text + " erfolgreich");
			refreshPage();
		} else {
			alert(text + " fehlgeschlagen: " + data.error_message);
		}
	});
}

function removeCarpool(id, signinObjectId) {
	$.ajax({
		type : "DELETE",
		url : getAPIUrl() + '/carpool.php?' + Math.random() * Math.random(),
		data : {
			'id' : id,
			'memberId' : getUserId()
		},
		beforeSend : startLoading,
		complete : finishLoading
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
	$("#carpoolMemberId").val(getUserId());
	$("#carpoolForm").ajaxSubmit({
		url : getAPIUrl() + '/carpool.php',
		beforeSend : startLoading,
		complete : finishLoading,
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