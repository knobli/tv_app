function loadRiegenDropdown(ids) {
	$.getJSON(getAPIUrl() + '/riege.php', function(data) {
		var oldClub = "";
		var optgroup = {};
		$.each(data, function(i, riege) {
			if (oldClub != riege.club.name) {
				$.each(ids, function(j, id) {
					if (oldClub != "") {
						$('#' + id).append(optgroup[id]);
						optgroup[id] = "";
					}
					optgroup[id] = '<optgroup label="' + riege.club.name + '">';
				});
				oldClub = riege.club.name;
			}
			$.each(ids, function(j, id) {
				if (getSavedRiege(id) != null && getSavedRiege(id) == riege.id) {
					optgroup[id] += '<option value="' + riege.id + '" selected="selected">' + riege.name + '</option>';
				} else {
					optgroup[id] += '<option value="' + riege.id + '">' + riege.name + '</option>';
				}
			});
		});
		$.each(ids, function(j, id) {
			$('#' + id).append(optgroup[id]);
			$('#' + id).selectmenu('refresh');
		});
	});
}

function login() {
	$("#loginForm").ajaxSubmit({
		url : getAPIUrl() + '/login.php',
		success : function(data) {
			if (data.success) {
				alert("Erfolgreich angemeldet");
				setLogin(data.memberId, data.username);
				checkLoginLogout();
			} else {
				alert("Anmeldung fehlgeschlagen: " + data.error_message);
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}
	});
}

function logout() {
	removeLogin();
	checkLoginLogout();
}

function saveRiege() {
	saveRiegenDropdown(["eventRiege", "trainingRiege", "matchRiege"]);
}

function saveRiegenDropdown(ids) {
	$.each(ids, function(j, id) {
		saveRiegeSelection(id, $("#" + id).val());
	});
	alert('Auswahl gespeichert');
}

function checkLoginLogout() {
	if (isLoggedIn()) {
		$("#logout").show();
		$("#loginName").text(getUsername());
		$("#login").hide();
	} else {
		$("#login").show();
		$("#logout").hide();
	}
}