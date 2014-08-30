MemberStatus = {
	IN : 1,
	OUT : 0,
	NONE : 3
}


function addKeyValueListEntry(listId, key, value){
	if(value != ""){
		var listEntry = '<li>' + makeKeyValueListEntry(key, value) + '</li>';
		$("#" + listId).append(listEntry);
	}
}

function addKeyValueWithLinkListEntry(listId, key, value, link){
	if(value != ""){
		var listEntry = '<li><a href="' + link + '" rel="external">' + makeKeyValueListEntry(key, value) + '</a></li>';
		$("#" + listId).append(listEntry);
	}
}

function makeKeyValueListEntry(key, value){
	var listEntry = '<fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += '<strong>' + key +'</strong>';
	listEntry += '</div><div class="ui-block-b text-with-nl">';
	listEntry += value;
	listEntry += '</div></fieldset>';
	return listEntry;	
}

function addLinkListEntry(listId, text, icon, pageName){
	$("#" + listId).append('<li><a href="' + pageName + '" class="ui-btn ui-mini ' + icon + ' ui-btn-icon-left ui-btn-b" rel="external">' + text + '</a></li>');
}

function addButtonListEntry(listId, text, icon, functionName){
	$("#" + listId).append('<li>' + createButtonListEntry(text, icon, functionName) + '</li>');
}

function createButtonListEntry(text, icon, functionName){
	return '<a href="#" onclick="' + functionName + '" class="ui-btn ui-mini ' + icon + ' ui-btn-icon-left ui-btn-b">' + text + '</a>';
}

function addTwoButtonListEntry(listId, text, icon, functionName, text2, icon2, functionName2){
	var listEntry = '<li><fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += createButtonListEntry(text, icon, functionName);
	listEntry += '</div><div class="ui-block-b">';
	listEntry += createButtonListEntry(text2, icon2, functionName2);
	listEntry += '</div></fieldset></li>';
	$("#" + listId).append(listEntry);
}

function addKeyValueWithSubListEntry(listId, key, value, sub){
	if(value != ""){
		var listEntry = '<li><p><strong>' + key +'</strong></p><p class="ui-li-right-side">' + value;
		if(sub != ""){
			listEntry += '<br>' + sub;
		}
		listEntry += '</p></li>';
		$("#" + listId).append(listEntry);
	}
}

function addListListEntry(listId, key, arrayList){
	if(arrayList.length != 0){
		var listEntry = '<li><p><strong>' + key +'</strong></p><p class="text-indent">';
		$.each(arrayList, function(index, value){
			listEntry += value + '<br>';
		});
		listEntry += '</p></li>';
		$("#" + listId).append(listEntry);
	}
}

function createDate(phpFormattedDate){
	var dateRegex = new RegExp("(\\d+)-(\\d+)-(\\d+)\\s+(\\d+):(\\d+):(\\d+)");
	var dateSplits = dateRegex.exec(phpFormattedDate);
	return new Date(dateSplits[1], dateSplits[2], dateSplits[3], dateSplits[4], dateSplits[5], dateSplits[6]);
}

function getTimeStamp(date){
	var hours = date.getHours();
	var minutes = date.getMinutes();
	
	var output = (hours<10 ? '0' : '') + hours + ':' + (minutes<10 ? '0' : '') + minutes;
	return output;
}

function getDateStamp(date){
	var month = date.getMonth()+1;
	var day = date.getDate();
	
	var output = (day<10 ? '0' : '') + day + '.' + (month<10 ? '0' : '') + month + '.' + date.getFullYear();
	return output;
}

function getDateString(date){
	var weekDays = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");
	var months = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");
	var day = date.getDate();
	
	var output = weekDays[date.getDay()] + ', ' + (day<10 ? '0' : '') + day + '. ' + months[date.getMonth()] + ' ' + date.getFullYear();
	return output;
}

function getStartEndDate(startDate, endDate){	
	if(startDate.getFullYear() != endDate.getFullYear() || startDate.getMonth() != endDate.getMonth() || startDate.getDate() != endDate.getDate() ){
		endStamp = getDateStamp(endDate) + ' ' + getTimeStamp(endDate);
	} else {
		endStamp = getTimeStamp(endDate);
	}
	var startStamp = getDateStamp(startDate) + ' ' + getTimeStamp(startDate);
	var output = startStamp + ' - ' + endStamp;
	return output;	
}

function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
	}
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var userIdKey = "TV_APP_userId";
var usernameKey = "TV_APP_username";

function setLogin(userId, username){	
	window.localStorage.setItem(userIdKey, userId);
	window.localStorage.setItem(usernameKey, username);		
}

function removeLogin(){
	localStorage.removeItem(userIdKey);
	localStorage.removeItem(usernameKey);
}

function isLoggedIn(){
	if(getUserId() !== null){
		return true;
	}
	return false;
}

function getUserId(){	
	return window.localStorage.getItem(userIdKey);
}

function getUsername(){	
	return window.localStorage.getItem(usernameKey);
}

var navigationItems = [{name: "", loginRequired: false, items: [{name: "News", link: "index.html", loginRequired: false}, 
																	{name: "Vereine", link: "clubs.html", loginRequired: false}]},
						{name: "Veranstaltungen", loginRequired: false, items: [{name: "Training", link: "trainings.html", loginRequired: false}, 
																					{name: "Anl&auml;sse", link: "events.html", loginRequired: false},
																					{name: "Matches", link: "matches.html", loginRequired: false}]},
						{name: "Sonstiges", loginRequired: false, items: [{name: "Resultate", link: "results.html", loginRequired: true}]}];

function fillInNavigation(){
	var groupItem = "";
	$.each(navigationItems, function(index, groupElement){
		if((groupElement.loginRequired && isLoggedIn()) || !groupElement.loginRequired){
			if(groupElement.name != ""){
				groupItem += '<li data-role="list-divider">' + groupElement.name + '</li>';
			}
			var counter = 0;
			$.each(groupElement.items, function(index, itemElement){
				if((itemElement.loginRequired && isLoggedIn()) || !itemElement.loginRequired){
					groupItem += '<li><a href="./' + itemElement.link + '" rel="external">' + itemElement.name + '</a></li>';
					counter++;
				}
			});
			if(counter > 0){
				$("#navigation").append(groupItem);
			}
			groupItem="";
		}
	});
	$("#navigation").listview('refresh');
}

function initOrRefresh(listId){
	var listView = $('#'+ listId);				
	if (listView.hasClass('ui-listview')) {
	    listView.listview('refresh');
	} else {
	    listView.listview();
	}				
}