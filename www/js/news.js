function getNewsFromUrl(url, linkUrl){
	$.getJSON(url, function(data) { addNewsMenuEntry(data, linkUrl); });		
}	

function addNewsMenuEntry(data, linkUrl){
  $.each(data, function(key, val) {
  	var createDate;
  	if(val.createDate != null){
  		createDate = new Date(val.createDate.date);
  	} else {
  		createDate = new Date();
  	}
    $("#list").append('<li><a href="' + linkUrl + '?id=' + val.id + '" rel="external"><h2>' + $('<textarea />').html(val.title).text() + '</h2><p>' + getDateStamp(createDate) + '</p><p id="introText' + val.id + '"></p></a></li>');
    $("#introText" + val.id).html($('<textarea />').html(val.introText).text());
  });
  
  $( "#list" ).listview( "refresh" );   	
}

function loadNews(url, id){
	
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