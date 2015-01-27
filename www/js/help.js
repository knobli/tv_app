MemberStatus = {
	IN : 1,
	OUT : 0,
	SPECIAL : 2,
	NONE : 3
}

MemberStatusCss = {
	1 : "signin",
	0 : "signout",
	2 : "signinSpecial",
}

function getMemberStatusCss(memberStatus){
	var cssClass = MemberStatusCss[memberStatus];
	return (cssClass === undefined) ? "" : cssClass;
}

var loading = 0;
var loadingError = false;
var onlineStatus = navigator.onLine || false;

function onOnline() {
	onlineStatus = true;
	$("div .ui-header").each(function(index, element) {
		$(element).removeClass("offline");
	});
}

function onOffline() {
	onlineStatus = false;
	$("div .ui-header").each(function(index, element) {
		$(element).removeClass("offline");
		$(element).addClass("offline");
	});
}

function isOnline() {
	return onlineStatus;
}

function startLoading() {
	if (!isOnline() && !loadingError) {
		alert("Keine Internetverbindung: Daten können nicht geladen werden");
		loadingError = true;
	}
	if (!isOnline()) {
		loading=0;
		$.mobile.loading('hide');
	} else {
		loadingError = false;
	}
	loading++;
	if ($.mobile !== 'undefined' || $.mobile.loading !== 'undefined') {
		$.mobile.loading('show', {
			theme : "e",
			text : "Please wait...",
			textonly : false,
			textVisible : false
		});
	}
}

function finishLoading() {
	loading--;
	if (loading <= 0) {
		$.mobile.loading('hide');
	}
}

$.ajaxSetup({
	cache : false
});

function getAPIUrl() {
	return 'https://grafstal.ch/controller/json/v0.3';
}

function addInformation(listId, info){
	if (info != "") {
		$("#" + listId).append('<li><a href="" class="ui-btn ui-icon-info ui-btn-icon-left">' + info + '</a></li>');
	}	
}

function addKeyValueListEntry(listId, key, value) {
	if (value != "") {
		var listEntry = '<li>' + makeKeyValueListEntry(key, value) + '</li>';
		$("#" + listId).append(listEntry);
	}
}

function addKeyValueWithLinkListEntry(listId, key, value, link) {
	if (value != "") {
		var listEntry = '<li><a href="' + link + '">' + makeKeyValueListEntry(key, value) + '</a></li>';
		$("#" + listId).append(listEntry);
	}
}

function makeKeyValueListEntry(key, value) {
	var listEntry = '<fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += '<strong>' + key + '</strong>';
	listEntry += '</div><div class="ui-block-b text-with-nl">';
	listEntry += value;
	listEntry += '</div></fieldset>';
	return listEntry;
}

function addPopupListEntry(listId, text, icon, id, status) {
	$("#" + listId).append('<li>' + createSignInPopupListEntry(text, icon, id, status) + '</li>');
}

function addTwoPopupListEntry(listId, text, icon, text2, icon2, id) {
	var listEntry = '<li><fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += createSignInPopupListEntry(text, icon, id, MemberStatus.IN);
	listEntry += '</div><div class="ui-block-b">';
	listEntry += createSignInPopupListEntry(text2, icon2, id, MemberStatus.OUT);
	listEntry += '</div></fieldset></li>';
	$("#" + listId).append(listEntry);
}

function createSignInPopupListEntry(text, icon, id, status){
	return '<a href="#signinFrame" onclick="initSignInPopupListEntry(' + id + ', ' + status + ')" data-rel="popup" data-position-to="window" class="ui-btn ui-mini ' + icon + ' ui-btn-icon-left ui-btn-b">' + text + '</a>';
}

function addLinkListEntry(listId, text, icon, pageName) {
	$("#" + listId).append('<li><a href="' + pageName + '" class="ui-btn ui-mini ' + icon + ' ui-btn-icon-left ui-btn-b">' + text + '</a></li>');
}

function addButtonListEntry(listId, text, icon, functionName) {
	$("#" + listId).append('<li>' + createButtonListEntry(text, icon, functionName) + '</li>');
}

function createButtonListEntry(text, icon, functionName) {
	return '<a href="#" onclick="' + functionName + '" class="ui-btn ui-mini ' + icon + ' ui-btn-icon-left ui-btn-b">' + text + '</a>';
}

function addTwoButtonListEntry(listId, text, icon, functionName, text2, icon2, functionName2) {
	var listEntry = '<li><fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += createButtonListEntry(text, icon, functionName);
	listEntry += '</div><div class="ui-block-b">';
	listEntry += createButtonListEntry(text2, icon2, functionName2);
	listEntry += '</div></fieldset></li>';
	$("#" + listId).append(listEntry);
}

function addKeyValueWithSubListEntry(listId, key, value, sub) {
	if (value != "") {
		var listEntry = '<li><p><strong>' + key + '</strong></p><p class="ui-li-right-side">' + value;
		if (sub != "") {
			listEntry += '<br>' + sub;
		}
		listEntry += '</p></li>';
		$("#" + listId).append(listEntry);
	}
}

function addListListEntry(listId, key, arrayList) {
	if (arrayList.length != 0) {
		var listEntry = '<li><p><strong>' + key + '</strong></p><p class="text-indent">';
		$.each(arrayList, function(index, value) {
			listEntry += value + '<br>';
		});
		listEntry += '</p></li>';
		$("#" + listId).append(listEntry);
	}
}

function createDate(phpFormattedDate) {
	var dateRegex = new RegExp("(\\d+)-(\\d+)-(\\d+)\\s+(\\d+):(\\d+):(\\d+)");
	var dateSplits = dateRegex.exec(phpFormattedDate);
	return new Date(dateSplits[1], dateSplits[2] - 1, dateSplits[3], dateSplits[4], dateSplits[5], dateSplits[6]);
}

function getTimeStamp(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();

	var output = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
	return output;
}

function getDateStamp(date) {
	var month = date.getMonth() + 1;
	var day = date.getDate();

	var output = (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + date.getFullYear();
	return output;
}

function getDateTimeStamp(date) {
	return getDateStamp(date) + ' ' + getTimeStamp(date);
}

function getDateString(date) {
	var weekDays = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");
	var months = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");
	var day = date.getDate();

	var output = weekDays[date.getDay()] + ', ' + (day < 10 ? '0' : '') + day + '. ' + months[date.getMonth()] + ' ' + date.getFullYear();
	return output;
}

function getStartEndDate(startDate, endDate) {
	if (startDate.getFullYear() != endDate.getFullYear() || startDate.getMonth() != endDate.getMonth() || startDate.getDate() != endDate.getDate()) {
		endStamp = getDateStamp(endDate) + ' ' + getTimeStamp(endDate);
	} else {
		endStamp = getTimeStamp(endDate);
	}
	var startStamp = getDateStamp(startDate) + ' ' + getTimeStamp(startDate);
	var output = startStamp + ' - ' + endStamp;
	return output;
}

function getUrlParameter(url, sParam) {
	var sPageURL = url.split("?")[1];
	if(sPageURL !== undefined){
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return sParameterName[1];
			}
		}
	}
	return null;
}

function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function roundTwoDecimalPlaces(number){
	return parseFloat(Math.round(number * 100) / 100).toFixed(2);
}

var userIdKey = "TV_APP_userId";
var usernameKey = "TV_APP_username";

function setLogin(userId, username) {
	window.localStorage.setItem(userIdKey, userId);
	window.localStorage.setItem(usernameKey, username);
}

function removeLogin() {
	localStorage.removeItem(userIdKey);
	localStorage.removeItem(usernameKey);
}

function isLoggedIn() {
	if (getUserId() !== null) {
		return true;
	}
	return false;
}

function getUserId() {
	return window.localStorage.getItem(userIdKey);
}

function getUsername() {
	return window.localStorage.getItem(usernameKey);
}

var navigationItems = [{
	name : "",
	loginRequired : false,
	items : [{
		name : "News",
		link : "index.html",
		loginRequired : false,
		ajax: false
	}, {
		name : "Vereine",
		link : "clubs.html",
		loginRequired : false,
		ajax: true
	}]
}, {
	name : "Veranstaltungen",
	loginRequired : false,
	items : [{
		name : "Training",
		link : "trainings.html",
		loginRequired : false,
		ajax: true
	}, {
		name : "Anl&auml;sse",
		link : "events.html",
		loginRequired : false,
		ajax: true
	}, {
		name : "Matches",
		link : "matches.html",
		loginRequired : false,
		ajax: true
	}, {
		name : "Sitzungen",
		link : "meetings.html",
		loginRequired : true,
		ajax: true
	}, {
		name : "Fahrgemeinschaften",
		link : "carpools.html",
		loginRequired : true,
		ajax: true
	}]
}, {
	name : "Sonstiges",
	loginRequired : false,
	items : [{
		name : "Resultate",
		link : "results.html",
		loginRequired : true,
		ajax: true
	}, {
		name : "Kontostand",
		link : "billItems.html",
		loginRequired : true,
		ajax: true
	}]
}];

function fillInNavigation() {
	var groupItem = "";
	$.each(navigationItems, function(index, groupElement) {
		if ((groupElement.loginRequired && isLoggedIn()) || !groupElement.loginRequired) {
			if (groupElement.name != "") {
				groupItem += '<li data-role="list-divider">' + groupElement.name + '</li>';
			}
			var counter = 0;
			$.each(groupElement.items, function(index, itemElement) {
				if ((itemElement.loginRequired && isLoggedIn()) || !itemElement.loginRequired) {
					groupItem += '<li><a href="' + itemElement.link + '"';
					groupItem += (!itemElement.ajax) ? ' data-ajax="false"' : '';
					groupItem += '>' + itemElement.name + '</a></li>';
					counter++;
				}
			});
			if (counter > 0) {
				$("#navigation").append(groupItem);
			}
			groupItem = "";
		}
	});
	initOrRefresh('navigation');
}

function refreshPage() {
	$.mobile.changePage($.mobile.activePage.data('url'), {
		allowSamePageTransition : true,
		changeHash : false,
		transition : 'none',
		showLoadMsg : false,
		reloadPage : true
	});
}

function initOrRefresh(listId) {
	var listView = $('#' + listId);
	if (listView.hasClass('ui-listview')) {
		listView.listview('refresh');
	} else {
		listView.listview();
	}
}

function isNearBottom(){
	var heightOffset = 100;
	return ($(window).scrollTop()+heightOffset >= $(document).height() - $(window).height());
}