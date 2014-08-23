function getSigninObjectFromUrl(url, linkUrl){
	$.getJSON(url, function(data) {
	  var oldDateStamp;
	
	  $.each(data, function(key, val) {
	  	var startDate = new Date(val.startDate.date);
	  	var dateStamp = getDateStamp(startDate);
	  	if(oldDateStamp != dateStamp){
	  		$("#list").append('<li data-role="list-divider">' + getDateString(startDate) + '</li>');
	  		oldDateStamp = dateStamp;
	  	}
	    $("#list").append('<li><a href="' + linkUrl + '?id=' + val.id + '" rel="external"><h2>' + val.name + '</h2><p><strong>' + val.location.name +'</strong></p><div class="ui-li-aside"><p><strong>' + getTimeStamp(startDate) + '</strong></p><p>' + val.responsible.firstname + ' ' + val.responsible.surname + '</p></div></a></li>');
	    //$("#" + val.id).click(function (){ $.mobile.changePage(linkUrl, { dataUrl : linkUrl + '?id=' + val.id, data: { 'id': val.id }, reloadPage : true, changeHash : true })});
	  });
	
	  $( "#list" ).listview( "refresh" );
	});		
}	

function loadSigninObject(url, id){
	
	$.ajax({
	  type: "POST",
	  url: url,
	  data: { 'id': id }
	})
		.done(function( signinObject ) {
			var startDate = new Date(signinObject.startDate.date);
	  		var endDate = new Date(signinObject.endDate.date);
			var listId = "list";
			$("#pageTitle").text(signinObject.name);
			addKeyValueListEntry(listId, 'Infos', signinObject.description);
			addKeyValueListEntry(listId, 'Ort', signinObject.location.name);
			addKeyValueListEntry(listId, 'Datum', getStartEndDate(startDate, endDate));
			addKeyValueListEntry(listId, 'Verantwortlicher', signinObject.responsible.firstname + ' ' + signinObject.responsible.surname);
			$( "#list" ).listview( "refresh" );
		});
}

function addKeyValueListEntry(listId, key, value){
	if(value != ""){
		$("#" + listId).append('<li><p><strong>' + key +'</strong></p><p class="ui-li-right-side">' + value + '</p></li>');
	}
}

function addKeyValueWithSubListEntry(listId, key, value, sub){
	if(value != ""){
		var listEntry = '<li><p><strong>' + key +'</strong></p><p class="ui-li-right-side">' + value;
		if(sub != ""){
			listEntry += '<br>' + sub
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